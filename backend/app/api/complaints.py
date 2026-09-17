import os
import uuid
import shutil
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.core.deps import get_current_user
from app.models.user import User
from app.models.department import Department
from app.models.complaint import Complaint, ComplaintStatusHistory, ResolutionNote, generate_complaint_code
from app.schemas.complaint import (
    ComplaintResponse,
    ComplaintStatusHistoryResponse,
    ResolutionNoteResponse
)

router = APIRouter()

def build_complaint_response(complaint: Complaint) -> ComplaintResponse:
    history = [
        ComplaintStatusHistoryResponse(
            id=h.id,
            complaint_id=h.complaint_id,
            old_status=h.old_status,
            new_status=h.new_status,
            changed_by_id=h.changed_by_id,
            changed_by_name=h.changed_by.name if h.changed_by else None,
            remarks=h.remarks,
            created_at=h.created_at
        )
        for h in complaint.status_history
    ]

    notes = [
        ResolutionNoteResponse(
            id=n.id,
            complaint_id=n.complaint_id,
            staff_id=n.staff_id,
            staff_name=n.staff.name if n.staff else None,
            note=n.note,
            is_internal=n.is_internal,
            created_at=n.created_at
        )
        for n in complaint.resolution_notes
    ]

    return ComplaintResponse(
        id=complaint.id,
        complaint_code=complaint.complaint_code,
        citizen_id=complaint.citizen_id,
        citizen_name=complaint.citizen.name if complaint.citizen else None,
        citizen_email=complaint.citizen.email if complaint.citizen else None,
        citizen_phone=complaint.citizen.phone if complaint.citizen else None,
        title=complaint.title,
        description=complaint.description,
        category=complaint.category,
        address=complaint.address,
        latitude=complaint.latitude,
        longitude=complaint.longitude,
        image_url=complaint.image_url,
        priority=complaint.priority,
        is_emergency=complaint.is_emergency,
        status=complaint.status,
        assigned_department_id=complaint.assigned_department_id,
        department_name=complaint.department.name if complaint.department else None,
        assigned_staff_id=complaint.assigned_staff_id,
        staff_name=complaint.assigned_staff.name if complaint.assigned_staff else None,
        created_at=complaint.created_at,
        updated_at=complaint.updated_at,
        status_history=history,
        resolution_notes=notes
    )

@router.post("/upload-image")
def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Security: validate extension
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed formats: {', '.join(allowed_extensions)}"
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_url": f"/uploads/{unique_filename}", "filename": unique_filename}

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    address: str = Form(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    priority: Optional[str] = Form("Medium"),
    is_emergency: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    image_url = None
    if image and image.filename:
        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        ext = os.path.splitext(image.filename)[1].lower()
        if ext in allowed_extensions:
            unique_filename = f"{uuid.uuid4().hex}{ext}"
            file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"/uploads/{unique_filename}"

    # If flagged as emergency, ensure priority reflects Emergency or High
    resolved_priority = "Emergency" if is_emergency else (priority or "Medium")

    complaint = Complaint(
        complaint_code=generate_complaint_code(),
        citizen_id=current_user.id,
        title=title.strip(),
        description=description.strip(),
        category=category.strip(),
        address=address.strip(),
        latitude=latitude,
        longitude=longitude,
        image_url=image_url,
        priority=resolved_priority,
        is_emergency=is_emergency,
        status="Submitted"
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    # Record initial history
    history_entry = ComplaintStatusHistory(
        complaint_id=complaint.id,
        old_status=None,
        new_status="Submitted",
        changed_by_id=current_user.id,
        remarks="Complaint filed by citizen"
    )
    db.add(history_entry)
    db.commit()
    db.refresh(complaint)

    return build_complaint_response(complaint)

@router.get("", response_model=List[ComplaintResponse])
def get_complaints(
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    is_emergency: Optional[bool] = None,
    department_id: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(Complaint)

    # Role filter: staff only sees their department unless admin
    if current_user.role == "staff":
        if current_user.department_id:
            query = query.filter(Complaint.assigned_department_id == current_user.department_id)
        else:
            return []
    elif current_user.role == "citizen":
        # Citizens only see their own complaints in general endpoint
        query = query.filter(Complaint.citizen_id == current_user.id)

    # Query parameters
    if status:
        query = query.filter(Complaint.status == status)
    if category:
        query = query.filter(Complaint.category == category)
    if priority:
        query = query.filter(Complaint.priority == priority)
    if is_emergency is not None:
        query = query.filter(Complaint.is_emergency == is_emergency)
    if department_id and current_user.role == "admin":
        query = query.filter(Complaint.assigned_department_id == department_id)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Complaint.title.ilike(search_pattern)) |
            (Complaint.complaint_code.ilike(search_pattern)) |
            (Complaint.address.ilike(search_pattern)) |
            (Complaint.description.ilike(search_pattern))
        )

    complaints = query.order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()
    return [build_complaint_response(c) for c in complaints]

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )

    # Check permission
    if current_user.role == "citizen" and complaint.citizen_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to view this complaint"
        )
    if current_user.role == "staff" and complaint.assigned_department_id != current_user.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Complaint is not assigned to your department"
        )

    return build_complaint_response(complaint)
