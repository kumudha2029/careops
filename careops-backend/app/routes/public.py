from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.booking import Booking
from app.models.workspace import Workspace
from pydantic import BaseModel, EmailStr
from datetime import date
from email.message import EmailMessage
import smtplib
import uuid
import os

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
def get_public_clinic(workspace_id: int):
    return {"clinic_name": "Test Clinic"}

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

    # =========================
    # SEND VERIFICATION EMAIL
    # =========================

    try:
        FRONTEND_URL = os.getenv("FRONTEND_URL")
        EMAIL_USER = os.getenv("EMAIL_USER")
        EMAIL_PASS = os.getenv("EMAIL_PASS")

        verify_link = f"{FRONTEND_URL}/verify/{token}"

        msg = EmailMessage()
        msg["Subject"] = "Confirm Your Appointment - CareOps Clinic"
        msg["From"] = EMAIL_USER
        msg["To"] = booking.email

        msg.set_content(f"""
Dear {booking.patient_name},

Your appointment request has been received.

Date: {booking.appointment_date}
Time: {booking.appointment_time}

Please confirm your appointment using this link:
{verify_link}

Thank you,
CareOps Clinic
""")

        msg.add_alternative(f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color:#2563eb;">Confirm Your Appointment</h2>

            <p>Dear <b>{booking.patient_name}</b>,</p>

            <p>Your appointment details:</p>

            <ul>
                <li><b>Date:</b> {booking.appointment_date}</li>
                <li><b>Time:</b> {booking.appointment_time}</li>
            </ul>

            <p>Please confirm your booking:</p>

            <p>
                <a href="{verify_link}"
                   style="background-color:#2563eb;
                          color:white;
                          padding:12px 20px;
                          text-decoration:none;
                          border-radius:6px;">
                    Confirm Appointment
                </a>
            </p>

            <p>If you did not request this booking, ignore this email.</p>

            <p>Regards,<br/>CareOps Clinic</p>
        </body>
        </html>
        """, subtype="html")

        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_USER, EMAIL_PASS)
            smtp.send_message(msg)

        print("Verification email sent successfully")

    except Exception as e:
        print("Email sending failed:", e)

    return {"message": "Booking created. Please check your email to verify."}


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
