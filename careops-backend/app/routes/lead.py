from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.db.deps import get_db
from app.models.lead import Lead
from app.models.booking import Booking
from app.schemas.lead import LeadCreate, LeadOut

router = APIRouter(prefix="/leads", tags=["Leads"])


# ================= CREATE LEAD =================
@router.post("/", response_model=LeadOut)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):

    new_lead = Lead(
    name=lead.name,
    phone=lead.phone,
    email=lead.email,
    source=lead.source,
    workspace_id=lead.workspace_id,
    status="NEW"
)

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    return new_lead


# ================= GET LEADS BY WORKSPACE =================
@router.get("/workspace/{workspace_id}", response_model=List[LeadOut])
def get_leads(workspace_id: int, db: Session = Depends(get_db)):

    return db.query(Lead).filter(
        Lead.workspace_id == workspace_id
    ).all()


# ================= CONVERT LEAD =================
@router.put("/{lead_id}/convert")
def convert_lead(lead_id: int, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.status == "CONVERTED":
        raise HTTPException(status_code=400, detail="Already converted")

    lead.status = "CONVERTED"

    booking = Booking(
        lead_id=lead.id,
        workspace_id=lead.workspace_id,
        patient_name=lead.name,
        phone=lead.phone,
        email=lead.email,   # ✅ NOW SAFE
        status="SCHEDULED",
        appointment_date=date.today(),
        appointment_time=None
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Lead converted successfully",
        "booking_id": booking.id
    }


@router.delete("/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # 🔥 Delete related bookings first
    db.query(Booking).filter(Booking.lead_id == lead_id).delete()

    db.delete(lead)
    db.commit()

    return {"message": "Lead deleted successfully"}
