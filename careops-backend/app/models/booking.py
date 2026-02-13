from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from app.db.session import Base
import uuid


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)

    patient_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)

    status = Column(String, default="SCHEDULED")

    appointment_date = Column(Date, nullable=True)
    appointment_time = Column(String, nullable=True)

    # 🔥 EMAIL VERIFICATION
    is_verified = Column(Boolean, default=False)
    verification_token = Column(
        String,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )
