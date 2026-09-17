from typing import Any, List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.core.deps import require_admin
from app.models.user import User
from app.models.department import Department
from app.models.complaint import Complaint, ComplaintStatusHistory
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.schemas.complaint import ComplaintAssign, ComplaintResponse
from app.schemas.analytics import AdminAnalytics, DashboardStats, DistributionItem
from app.api.auth import build_user_response
from app.api.complaints import build_complaint_response

router = APIRouter()

@router.get("/dashboard", response_model=AdminAnalytics)
def get_admin_dashboard(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    total_users = db.query(User).count()
    total_depts = db.query(Department).count()
    total_complaints = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status.in_(["Submitted", "Under Review"])).count()
    in_progress = db.query(Complaint).filter(Complaint.status.in_(["Assigned", "In Progress"])).count()
    resolved = db.query(Complaint).filter(Complaint.status == "Resolved").count()
    emergency = db.query(Complaint).filter(Complaint.is_emergency == True).count()

    stats = DashboardStats(
        total_complaints=total_complaints,
        pending_complaints=pending,
        in_progress_complaints=in_progress,
        resolved_complaints=resolved,
        emergency_complaints=emergency,
        total_users=total_users,
        total_departments=total_depts
    )

    # Complaints by Category
    cat_counts = (
        db.query(Complaint.category, func.count(Complaint.id))
        .group_by(Complaint.category)
        .all()
    )
    by_category = [DistributionItem(name=cat or "Uncategorized", count=cnt) for cat, cnt in cat_counts]

    # Complaints by Status
    status_counts = (
        db.query(Complaint.status, func.count(Complaint.id))
        .group_by(Complaint.status)
        .all()
    )
    by_status = [DistributionItem(name=st, count=cnt) for st, cnt in status_counts]

    # Complaints by Department
    depts = db.query(Department).all()
    by_department = []
    for dept in depts:
        cnt = db.query(Complaint).filter(Complaint.assigned_department_id == dept.id).count()
        by_department.append(DistributionItem(name=dept.name, count=cnt))
    unassigned_count = db.query(Complaint).filter(Complaint.assigned_department_id == None).count()
    if unassigned_count > 0:
        by_department.append(DistributionItem(name="Unassigned", count=unassigned_count))

    # Monthly Trend (Past 6 Months or demo grouped by month)
    monthly_trend = [
        {"month": "May", "submitted": 12, "resolved": 10},
        {"month": "Jun", "submitted": 19, "resolved": 15},
        {"month": "Jul", "submitted": 25, "resolved": 22},
        {"month": "Aug", "submitted": 31, "resolved": 28},
        {"month": "Sep", "submitted": total_complaints, "resolved": resolved},
    ]

    return AdminAnalytics(
        stats=stats,
        by_category=by_category,
        by_status=by_status,
        by_department=by_department,
        monthly_trend=monthly_trend
    )

@router.get("/users", response_model=List[UserResponse])
def get_users(
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter((User.name.ilike(pattern)) | (User.email.ilike(pattern)))

    users = query.order_by(User.created_at.desc()).all()
    return [build_user_response(u, db) for u in users]

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user_in.name is not None:
        user.name = user_in.name
    if user_in.phone is not None:
        user.phone = user_in.phone
    if user_in.role is not None:
        if user_in.role in ["citizen", "staff", "admin"]:
            user.role = user_in.role
    if user_in.department_id is not None:
        user.department_id = user_in.department_id
    if user_in.is_active is not None:
        user.is_active = user_in.is_active

    db.commit()
    db.refresh(user)
    return build_user_response(user, db)

@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    departments = db.query(Department).order_by(Department.name.asc()).all()
    result = []
    for d in departments:
        staff_cnt = db.query(User).filter(User.department_id == d.id).count()
        complaint_cnt = db.query(Complaint).filter(
            Complaint.assigned_department_id == d.id,
            Complaint.status.notin_(["Resolved", "Rejected"])
        ).count()
        resp = DepartmentResponse(
            id=d.id,
            name=d.name,
            description=d.description,
            contact_email=d.contact_email,
            contact_phone=d.contact_phone,
            is_active=d.is_active,
            created_at=d.created_at,
            staff_count=staff_cnt,
            active_complaints_count=complaint_cnt
        )
        result.append(resp)
    return result

@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(
    dept_in: DepartmentCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    existing = db.query(Department).filter(Department.name == dept_in.name.strip()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department name already exists")

    dept = Department(
        name=dept_in.name.strip(),
        description=dept_in.description,
        contact_email=dept_in.contact_email,
        contact_phone=dept_in.contact_phone,
        is_active=dept_in.is_active
    )
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        description=dept.description,
        contact_email=dept.contact_email,
        contact_phone=dept.contact_phone,
        is_active=dept.is_active,
        created_at=dept.created_at,
        staff_count=0,
        active_complaints_count=0
    )

@router.put("/departments/{dept_id}", response_model=DepartmentResponse)
def update_department(
    dept_id: int,
    dept_in: DepartmentUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")

    if dept_in.name is not None:
        dept.name = dept_in.name.strip()
    if dept_in.description is not None:
        dept.description = dept_in.description
    if dept_in.contact_email is not None:
        dept.contact_email = dept_in.contact_email
    if dept_in.contact_phone is not None:
        dept.contact_phone = dept_in.contact_phone
    if dept_in.is_active is not None:
        dept.is_active = dept_in.is_active

    db.commit()
    db.refresh(dept)
    staff_cnt = db.query(User).filter(User.department_id == dept.id).count()
    complaint_cnt = db.query(Complaint).filter(
        Complaint.assigned_department_id == dept.id,
        Complaint.status.notin_(["Resolved", "Rejected"])
    ).count()
    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        description=dept.description,
        contact_email=dept.contact_email,
        contact_phone=dept.contact_phone,
        is_active=dept.is_active,
        created_at=dept.created_at,
        staff_count=staff_cnt,
        active_complaints_count=complaint_cnt
    )

@router.put("/complaints/{complaint_id}/assign", response_model=ComplaintResponse)
def assign_complaint(
    complaint_id: int,
    assign_in: ComplaintAssign,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
) -> Any:
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    dept = db.query(Department).filter(Department.id == assign_in.department_id).first()
    if not dept:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department not found")

    old_status = complaint.status
    complaint.assigned_department_id = dept.id
    if assign_in.staff_id:
        complaint.assigned_staff_id = assign_in.staff_id

    # If was submitted, advance to Assigned
    if complaint.status in ["Submitted", "Under Review"]:
        complaint.status = "Assigned"

    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        old_status=old_status,
        new_status=complaint.status,
        changed_by_id=current_user.id,
        remarks=assign_in.remarks or f"Assigned to {dept.name} department by Administrator"
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)

    return build_complaint_response(complaint)
