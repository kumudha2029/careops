from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.booking import Booking
from pydantic import BaseModel, EmailStr
from datetime import date
import smtplib
from email.message import EmailMessage

router = APIRouter(prefix="/public", tags=["Public"])


class PublicBookingCreate(BaseModel):
    patient_name: str
    phone: str
    email: EmailStr
    appointment_date: date
    appointment_time: str


@router.post("/book/{workspace_id}")
def public_booking(
    workspace_id: int,
    data: PublicBookingCreate,
    db: Session = Depends(get_db)
):

    booking = Booking(
        workspace_id=workspace_id,
        patient_name=data.patient_name,
        phone=data.phone,
        email=data.email,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        status="PENDING"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    try:
        verify_link = f"http://localhost:5173/verify/{booking.verification_token}"

        clinic_address = "123 Health Street, Chennai"
        clinic_phone = "+91 98765 43210"

        msg = EmailMessage()
        msg["Subject"] = "Confirm Your Appointment - CareOps Clinic"
        msg["From"] = "kumudha2920@gmail.com"
        msg["To"] = booking.email

        # Plain text fallback
        msg.set_content(f"""
Dear {booking.patient_name},

Your appointment has been scheduled.

Date: {booking.appointment_date}
Time: {booking.appointment_time}
Address: {clinic_address}
Contact: {clinic_phone}

Please confirm your appointment:
{verify_link}

Bring ID proof and previous medical records.

CareOps Clinic
""")

        # HTML Version
        msg.add_alternative(f"""
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2 style="color:#10b981;">Appointment Confirmation</h2>

            <p>Dear <b>{booking.patient_name}</b>,</p>

            <p>Your appointment has been scheduled with the following details:</p>

            <ul>
              <li><b>Date:</b> {booking.appointment_date}</li>
              <li><b>Time:</b> {booking.appointment_time}</li>
              <li><b>Address:</b> {clinic_address}</li>
              <li><b>Contact:</b> 12345677 </li>
            </ul>

            <p>Please confirm your booking:</p>

            <p>
              <a href="{verify_link}"
                 style="background-color:#10b981;
                        color:white;
                        padding:10px 20px;
                        text-decoration:none;
                        border-radius:5px;">
                 Confirm Appointment
              </a>
            </p>

            <p><b>Please bring:</b></p>
            <ul>
              <li>Valid ID proof</li>
              <li>Previous medical records</li>
              <li>Insurance documents (if applicable)</li>
            </ul>

            <p>Please arrive 15 minutes early.</p>

            <p>Regards,<br/>CareOps Clinic</p>
          </body>
        </html>
        """, subtype="html")

        # Gmail SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login(
                "kumudha2920@gmail.com",
                "gbwipcjjdqscrvgx"  # your app password
            )
            smtp.send_message(msg)

        print("Email sent successfully")

    except Exception as e:
        print("Email failed:", e)

    return {"message": "Booking created. Please verify your email."}


@router.get("/verify/{token}")
def verify_booking(token: str, db: Session = Depends(get_db)):

    booking = db.query(Booking).filter(
        Booking.verification_token == token
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Invalid token")

    booking.is_verified = True
    booking.status = "CONFIRMED"

    db.commit()

    return {"message": "Booking confirmed successfully"}
