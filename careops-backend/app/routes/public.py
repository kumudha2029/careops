from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.booking import Booking
from app.models.workspace import Workspace
from pydantic import BaseModel, EmailStr
from datetime import date
import uuid
import os
import smtplib
from email.message import EmailMessage

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


# =========================
# GET PUBLIC CLINIC INFO
# =========================

@router.get("/clinic/{workspace_id}")
def get_public_clinic(workspace_id: int, db: Session = Depends(get_db)):

    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Clinic not found")

    return {
        "clinic_name": workspace.name
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

    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Clinic not found")

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

    # =========================
    # SEND EMAIL VIA GMAIL SMTP
    # =========================

    try:
        verify_link = f"{os.getenv('FRONTEND_URL')}/verify/{token}"

        msg = EmailMessage()
        msg["Subject"] = "Appointment Confirmation - CareOps Clinic"
        msg["From"] = os.getenv("EMAIL_USER")
        msg["To"] = booking.email

        msg.set_content(f"""
Appointment Confirmation

Dear {booking.patient_name},

Your appointment has been scheduled with the following details:

Date: {booking.appointment_date}
Time: {booking.appointment_time}
Address: 123 Health Street, Chennai
Contact: 12345677

Please confirm your booking:
{verify_link}

Please bring:
- Valid ID proof
- Previous medical records
- Insurance documents (if applicable)

Please arrive 15 minutes early.

Regards,
CareOps Clinic
""")

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(
                os.getenv("EMAIL_USER"),
                os.getenv("EMAIL_PASS")
            )
            server.send_message(msg)

        print("Email sent successfully")

    except Exception as e:
        print("Email failed:", str(e))

    return {
        "message": "Booking created. Please check your email to verify."
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
