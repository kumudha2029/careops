from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.db.deps import get_db
from app.models.booking import Booking
from app.schemas.booking import (
    BookingOut,
    BookingUpdate,
    BookingCreatePublic
)

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ================= CREATE PUBLIC BOOKING =================
@router.post("/public", response_model=BookingOut)
def create_public_booking(
    booking: BookingCreatePublic,
    db: Session = Depends(get_db)
):

    new_booking = Booking(
        workspace_id=booking.workspace_id,
        patient_name=booking.patient_name,
        phone=booking.phone,
        email=booking.email,
        status="SCHEDULED",
        appointment_date=booking.appointment_date,
        appointment_time=booking.appointment_time,
        lead_id=None  # Important since this is not from lead
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


# ================= GET BOOKINGS =================
@router.get("/{workspace_id}", response_model=List[BookingOut])
def get_bookings(workspace_id: int, db: Session = Depends(get_db)):

    return db.query(Booking).filter(
        Booking.workspace_id == workspace_id
    ).all()


# ================= UPDATE STATUS =================
@router.put("/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    update: BookingUpdate,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if update.status:
        booking.status = update.status

    db.commit()
    db.refresh(booking)

    return {"message": "Status updated successfully"}


# ================= RESCHEDULE =================
@router.put("/{booking_id}/reschedule")
def reschedule_booking(
    booking_id: int,
    update: BookingUpdate,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if update.appointment_date:
        booking.appointment_date = update.appointment_date

    if update.appointment_time:
        booking.appointment_time = update.appointment_time

    db.commit()
    db.refresh(booking)

    return {"message": "Booking rescheduled successfully"}

@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted"}
