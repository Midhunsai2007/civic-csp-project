from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="citizen", nullable=False)  # 'citizen', 'staff', 'admin'
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    department = relationship("Department", back_populates="staff_members", foreign_keys=[department_id])
    complaints = relationship("Complaint", back_populates="citizen", foreign_keys="Complaint.citizen_id")
    status_updates = relationship("ComplaintStatusHistory", back_populates="changed_by", foreign_keys="ComplaintStatusHistory.changed_by_id")
    resolution_notes = relationship("ResolutionNote", back_populates="staff", foreign_keys="ResolutionNote.staff_id")
