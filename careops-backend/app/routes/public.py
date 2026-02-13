from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.booking import Booking
from app.models.workspace import Workspace
from pydantic import BaseModel, EmailStr
from datetime import date
import uuid

router = APIRouter(prefix="/public", tags=["Public"])

# =========================
# SCHEMA
# =========================

class PublicBookingCreate(BaseModel):
    patient_name: str
    phone: str
    email: EmailStr
    appointment_date: date
    appointment_time: str


@router.get("/clinic/{workspace_id}")
def get_public_clinic(workspace_id: int, db: Session = Depends(get_db)):

    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Clinic not found")

    return {
        "clinic_name": workspace.name   # 🔥 FIXED
    }

# =========================
# CREATE PUBLIC BOOKING
# =========================

@router.post("/book/{workspace_id}")
def public_booking(
    workspace_id: int,
    data: PublicBookingCreate,
    db: Session = Depends(get_db)
):

    # Check if workspace exists
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Clinic not found")

    # Generate verification token
    token = str(uuid.uuid4())

    booking = Booking(
        workspace_id=workspace_id,
        patient_name=data.patient_name,
        phone=data.phone,
        email=data.email,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        status="PENDING",
        verification_token=token,
        is_verified=False
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    print("Booking created successfully (email disabled)")

    return {
        "message": "Booking created successfully.",
        "verification_token": token  # for testing only
    }


# =========================
# VERIFY BOOKING
# =========================

@router.get("/verify/{token}")
def verify_booking(token: str, db: Session = Depends(get_db)):

    booking = db.query(Booking).filter(
        Booking.verification_token == token
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Invalid verification link")

    if booking.is_verified:
        return {"message": "Booking already confirmed"}

    booking.is_verified = True
    booking.status = "SCHEDULED"

    db.commit()

    return {"message": "Booking confirmed successfully"}
