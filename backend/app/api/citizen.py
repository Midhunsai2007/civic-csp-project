from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintResponse
from app.schemas.analytics import DashboardStats
from app.api.complaints import build_complaint_response

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_citizen_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    base_query = db.query(Complaint).filter(Complaint.citizen_id == current_user.id)
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
def get_citizen_complaints(
    status: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(Complaint).filter(Complaint.citizen_id == current_user.id)

    if status:
        query = query.filter(Complaint.status == status)
    if category:
        query = query.filter(Complaint.category == category)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Complaint.title.ilike(search_pattern)) |
            (Complaint.complaint_code.ilike(search_pattern)) |
            (Complaint.address.ilike(search_pattern))
        )

    complaints = query.order_by(Complaint.created_at.desc()).all()
    return [build_complaint_response(c) for c in complaints]
