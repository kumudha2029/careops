from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)   # ✅ ADD THIS
    source = Column(String, nullable=True)

    status = Column(String, default="NEW")

    workspace_id = Column(Integer, ForeignKey("workspaces.id"))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
