from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base

# 🔥 Load models BEFORE create_all
import app.models

from app.routes import auth
from app.routes import workspace as workspace_route
from app.routes import email
from app.routes import lead
from app.routes import booking
from app.routes import dashboard
from app.routes import public

app = FastAPI()

origins = [
    # Local development
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",

    # Netlify Admin (ADD THIS)
    "https://careops-admin.netlify.app",

    # Optional: keep Vercel if still used
    "https://care-ops-admin.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(workspace_route.router)
app.include_router(email.router)
app.include_router(lead.router)
app.include_router(booking.router)
app.include_router(dashboard.router)
app.include_router(public.router)

# 🔥 Create tables once
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"status": "CareOps backend running"}
