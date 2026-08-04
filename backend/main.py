from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- Import this
from src.utils.db import Base, engine
from src.user.routes import user_routes
from src.audio.route import audio_routes

Base.metadata.create_all(engine)
app = FastAPI()

# ✅ FIX: Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    # Allow BOTH localhost and 127.0.0.1 because you are using them interchangeably
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,  # Critical for cookies (withCredentials: true)
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes)
app.include_router(audio_routes)