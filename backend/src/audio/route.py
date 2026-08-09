# src/audio/route.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from src.utils.db import getDb
from src.utils.auth import get_current_user, require_csrf_token
from src.audio import controllers
from src.audio.dtos import GenerateAudioRequest
from src.user.model import User

audio_routes = APIRouter(prefix="/audio", tags=["Audio"])

@audio_routes.post("/generate")
def generate(
    req: GenerateAudioRequest,
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user),
    csrf_valid: bool = Depends(require_csrf_token)
):
    return controllers.generate_audio_for_user(req, user, db)

@audio_routes.post("/generate-play")
def generate_and_play(
    req: GenerateAudioRequest,
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user),
    csrf_valid: bool = Depends(require_csrf_token)
):
    return controllers.generate_and_play_audio(req, user, db)

@audio_routes.get("/generations")
def list_generations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user)
):
    return controllers.list_generations(user, db, skip, limit)

@audio_routes.get("/generation/{generation_id}")
def get_generation(
    generation_id: int,
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user)
):
    return controllers.get_generation(generation_id, user, db)

@audio_routes.get("/generation/{generation_id}/download")
def download_generation(
    generation_id: int,
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user)
):
    return controllers.download_generation_zip(generation_id, user, db)

@audio_routes.delete("/generation/{generation_id}")
def delete_generation(
    generation_id: int,
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user),
    csrf_valid: bool = Depends(require_csrf_token)
):
    return controllers.delete_generation(generation_id, user, db)