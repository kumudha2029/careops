from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.schemas.user import UserCreate
from app.db.deps import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # For prototype, just return user with fake id
    return {
        "id": 1,
        "email": user.email,
        "role": "OWNER"
    }
