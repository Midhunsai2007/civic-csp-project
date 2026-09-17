from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class ResolutionNoteCreate(BaseModel):
    note: str
    is_internal: bool = False

class ResolutionNoteResponse(BaseModel):
    id: int
    complaint_id: int
    staff_id: int
    staff_name: Optional[str] = None
    note: str
    is_internal: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintStatusHistoryResponse(BaseModel):
    id: int
    complaint_id: int
    old_status: Optional[str] = None
    new_status: str
    changed_by_id: int
    changed_by_name: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority: Optional[str] = "Medium"
    is_emergency: bool = False

class ComplaintCreate(ComplaintBase):
    image_url: Optional[str] = None

class ComplaintStatusUpdate(BaseModel):
    status: str  # "Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Rejected"
    remarks: Optional[str] = None

class ComplaintAssign(BaseModel):
    department_id: int
    staff_id: Optional[int] = None
    remarks: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    complaint_code: str
    citizen_id: int
    citizen_name: Optional[str] = None
    citizen_email: Optional[str] = None
    citizen_phone: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    assigned_department_id: Optional[int] = None
    department_name: Optional[str] = None
    assigned_staff_id: Optional[int] = None
    staff_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    status_history: List[ComplaintStatusHistoryResponse] = []
    resolution_notes: List[ResolutionNoteResponse] = []

    class Config:
        from_attributes = True
