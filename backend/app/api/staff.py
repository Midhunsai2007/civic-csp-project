from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user, require_staff
from app.models.user import User
from app.models.complaint import Complaint, ComplaintStatusHistory, ResolutionNote
from app.schemas.complaint import (
    ComplaintResponse,
    ComplaintStatusUpdate,
    ResolutionNoteCreate,
    ResolutionNoteResponse
)
from app.schemas.analytics import DashboardStats
from app.api.complaints import build_complaint_response

router = APIRouter()

VALID_STATUSES = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Rejected"]

@router.get("/dashboard", response_model=DashboardStats)
def get_staff_dashboard(
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
) -> Any:
    dept_id = current_user.department_id
    if not dept_id and current_user.role != "admin":
        return DashboardStats(
            total_complaints=0,
            pending_complaints=0,
            in_progress_complaints=0,
            resolved_complaints=0,
            emergency_complaints=0
        )

    base_query = db.query(Complaint)
    if current_user.role == "staff":
        base_query = base_query.filter(Complaint.assigned_department_id == dept_id)

    total = base_query.count()
    pending = base_query.filter(Complaint.status.in_(["Submitted", "Under Review"])).count()
    in_progress = base_query.filter(Complaint.status.in_(["Assigned", "In Progress"])).count()
    resolved = base_query.filter(Complaint.status == "Resolved").count()
    emergency = base_query.filter(Complaint.is_emergency == True).count()

    return DashboardStats(
        total_complaints=total,
        pending_complaints=pending,
        in_progress_complaints=in_progress,
        resolved_complaints=resolved,
        emergency_complaints=emergency
    )

@router.get("/complaints", response_model=List[ComplaintResponse])
def get_staff_complaints(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    is_emergency: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
) -> Any:
    dept_id = current_user.department_id
    if not dept_id and current_user.role != "admin":
        return []

    query = db.query(Complaint)
    if current_user.role == "staff":
        query = query.filter(Complaint.assigned_department_id == dept_id)

    if status:
        query = query.filter(Complaint.status == status)
    if priority:
        query = query.filter(Complaint.priority == priority)
    if is_emergency is not None:
        query = query.filter(Complaint.is_emergency == is_emergency)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Complaint.title.ilike(search_pattern)) |
            (Complaint.complaint_code.ilike(search_pattern)) |
            (Complaint.address.ilike(search_pattern))
        )

    complaints = query.order_by(Complaint.created_at.desc()).all()
    return [build_complaint_response(c) for c in complaints]

@router.put("/complaints/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: int,
    status_update: ComplaintStatusUpdate,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
) -> Any:
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    # Authorization check
    if current_user.role == "staff" and complaint.assigned_department_id != current_user.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Complaint is not assigned to your department"
        )

    if status_update.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{status_update.status}'. Allowed: {', '.join(VALID_STATUSES)}"
        )

    old_status = complaint.status
    complaint.status = status_update.status

    # Record history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        old_status=old_status,
        new_status=status_update.status,
        changed_by_id=current_user.id,
        remarks=status_update.remarks or f"Status updated from {old_status} to {status_update.status} by {current_user.name}"
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)

    return build_complaint_response(complaint)

@router.post("/complaints/{complaint_id}/notes", response_model=ResolutionNoteResponse)
def add_resolution_note(
    complaint_id: int,
    note_in: ResolutionNoteCreate,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
) -> Any:
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    if current_user.role == "staff" and complaint.assigned_department_id != current_user.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Complaint is not assigned to your department"
        )

    note = ResolutionNote(
        complaint_id=complaint.id,
        staff_id=current_user.id,
        note=note_in.note.strip(),
        is_internal=note_in.is_internal
    )
    db.add(note)
    db.commit()
    db.refresh(note)

    return ResolutionNoteResponse(
        id=note.id,
        complaint_id=note.complaint_id,
        staff_id=note.staff_id,
        staff_name=current_user.name,
        note=note.note,
        is_internal=note.is_internal,
        created_at=note.created_at
    )
