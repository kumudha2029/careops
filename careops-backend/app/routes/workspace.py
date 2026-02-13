from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.workspace import WorkspaceCreate
from app.models.workspace import Workspace
from app.models.email_config import EmailConfig
from app.db.deps import get_db

router = APIRouter(prefix="/workspace", tags=["Workspace"])


@router.post("/")
def create_workspace(data: WorkspaceCreate, db: Session = Depends(get_db)):

    workspace = Workspace(
        name=data.name,
        address=data.address,
        timezone=data.timezone,
        is_active=False
    )

    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    return workspace


@router.post("/{workspace_id}/activate")
def activate_workspace(workspace_id: int, db: Session = Depends(get_db)):

    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    email_config = db.query(EmailConfig).filter(
        EmailConfig.workspace_id == workspace_id
    ).first()

    if not email_config:
        raise HTTPException(
            status_code=400,
            detail="Email not configured"
        )

    workspace.is_active = True
    db.commit()
    db.refresh(workspace)

    return {
        "status": "activated",
        "workspace_id": workspace.id
    }
