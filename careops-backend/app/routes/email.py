from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.email import EmailConfigCreate
from app.models.email_config import EmailConfig
from app.db.deps import get_db

router = APIRouter(prefix="/email", tags=["Email"])

@router.post("/setup")
def setup_email(data: EmailConfigCreate, db: Session = Depends(get_db)):
    config = EmailConfig(
        workspace_id=data.workspace_id,
        sender_email=data.sender_email,
        is_connected=True
    )

    db.add(config)
    db.commit()
    db.refresh(config)

    return config
