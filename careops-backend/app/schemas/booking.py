from pydantic import BaseModel
from typing import Optional
from datetime import date, time


# ================= CREATE PUBLIC BOOKING =================
class BookingCreatePublic(BaseModel):
    workspace_id: int
    patient_name: str
    phone: str
    email: str
    appointment_date: date
    appointment_time: str


# ================= UPDATE =================
class BookingUpdate(BaseModel):
    status: Optional[str] = None
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None


# ================= OUTPUT =================
class BookingOut(BaseModel):
    id: int
    lead_id: Optional[int] = None
    workspace_id: int
    patient_name: str
    phone: str
    email: str
    status: str
    appointment_date: Optional[date]
    appointment_time: Optional[time]

    class Config:
        from_attributes = True
