from pydantic import BaseModel

class EmailConfigCreate(BaseModel):
    workspace_id: int
    sender_email: str
