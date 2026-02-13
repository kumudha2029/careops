from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    address = Column(String)
    timezone = Column(String)
    is_active = Column(Boolean, default=False)

