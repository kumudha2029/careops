from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class EmailConfig(Base):
    __tablename__ = "email_configs"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer)
    sender_email = Column(String)
    is_connected = Column(Boolean, default=False)
