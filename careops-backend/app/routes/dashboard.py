from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.models.lead import Lead
from app.models.booking import Booking

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{workspace_id}")
def dashboard_stats(workspace_id: int, db: Session = Depends(get_db)):

    # LEADS
    total_leads = db.query(Lead).filter(
        Lead.workspace_id == workspace_id
    ).count()

    converted_leads = db.query(Lead).filter(
        Lead.workspace_id == workspace_id,
        Lead.status == "CONVERTED"
    ).count()

    # BOOKINGS
    total_bookings = db.query(Booking).filter(
        Booking.workspace_id == workspace_id
    ).count()

    completed_bookings = db.query(Booking).filter(
        Booking.workspace_id == workspace_id,
        Booking.status == "COMPLETED"
    ).count()

    cancelled_bookings = db.query(Booking).filter(
        Booking.workspace_id == workspace_id,
        Booking.status == "CANCELLED"
    ).count()

    conversion_rate = (
        (converted_leads / total_leads) * 100
        if total_leads > 0 else 0
    )

    return {
        "total_leads": total_leads,
        "converted_leads": converted_leads,
        "conversion_rate": round(conversion_rate, 2),
        "total_bookings": total_bookings,
        "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings
    }
