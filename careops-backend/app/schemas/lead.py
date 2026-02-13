from pydantic import BaseModel
from datetime import datetime


class LeadCreate(BaseModel):
    name: str
    phone: str
    email: str   # ← now required
    source: str | None = None
    workspace_id: int


class LeadOut(BaseModel):
    id: int
    name: str
    phone: str
    email: str | None = None   # ✅ ADD THIS
    source: str | None
    workspace_id: int
    status: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True
