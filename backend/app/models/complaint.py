from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_complaint_code():
    return f"CMP-{datetime.now().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_code = Column(String(30), unique=True, default=generate_complaint_code, index=True, nullable=False)
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(80), nullable=False, index=True)  # Roads & Potholes, Streetlights, etc.
    address = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    image_url = Column(String(255), nullable=True)
    priority = Column(String(20), default="Medium", nullable=False)  # Low, Medium, High, Emergency
    is_emergency = Column(Boolean, default=False, nullable=False, index=True)
    status = Column(String(30), default="Submitted", nullable=False, index=True)
    # Status values: 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'
    assigned_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    citizen = relationship("User", back_populates="complaints", foreign_keys=[citizen_id])
    department = relationship("Department", back_populates="complaints", foreign_keys=[assigned_department_id])
    assigned_staff = relationship("User", foreign_keys=[assigned_staff_id])
    status_history = relationship("ComplaintStatusHistory", back_populates="complaint", cascade="all, delete-orphan", order_by="ComplaintStatusHistory.created_at.asc()")
    resolution_notes = relationship("ResolutionNote", back_populates="complaint", cascade="all, delete-orphan", order_by="ResolutionNote.created_at.asc()")

class ComplaintStatusHistory(Base):
    __tablename__ = "complaint_status_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    old_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=False)
    changed_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    complaint = relationship("Complaint", back_populates="status_history")
    changed_by = relationship("User", back_populates="status_updates")

class ResolutionNote(Base):
    __tablename__ = "resolution_notes"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    staff_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    complaint = relationship("Complaint", back_populates="resolution_notes")
    staff = relationship("User", back_populates="resolution_notes")
