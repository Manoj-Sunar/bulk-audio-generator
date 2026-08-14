# src/audio/route.py
from fastapi import APIRouter, Depends, Query, Request, HTTPException   # <-- add Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from src.utils.db import get_db
from src.utils.auth import get_current_user, require_csrf_token
from src.audio import controllers
from src.audio.dtos import GenerateAudioRequest
from src.user.model import User

audio_routes = APIRouter(prefix="/audio", tags=["Audio"])
limiter = Limiter(key_func=get_remote_address)

@audio_routes.post("/generate-play")
@limiter.limit("5/minute")
def generate_and_play(
    request: Request,              # <-- added
    req: GenerateAudioRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    csrf_valid: bool = Depends(require_csrf_token)
):
    return controllers.generate_and_play_audio(req, user, db)

@audio_routes.get("/generations")
@limiter.limit("10/minute")
def list_generations(
    request: Request,              # <-- added
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    include_audio: bool = Query(False),
    max_audio_previews: int = Query(3, ge=0, le=10),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return controllers.list_generations(user, db, skip, limit, include_audio, max_audio_previews)

@audio_routes.get("/generation/{generation_id}/download")
@limiter.limit("10/minute")
def download_generation(
    request: Request,              # <-- added
    generation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return controllers.download_generation_zip(generation_id, user, db)

@audio_routes.delete("/generation/{generation_id}")
@limiter.limit("5/minute")
def delete_generation(
    request: Request,              # <-- added
    generation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    csrf_valid: bool = Depends(require_csrf_token)
):
    return controllers.delete_generation(generation_id, user, db)