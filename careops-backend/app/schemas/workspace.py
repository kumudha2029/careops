from pydantic import BaseModel

class WorkspaceCreate(BaseModel):
    name: str
    address: str
    timezone: str
