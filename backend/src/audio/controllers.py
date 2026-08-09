# src/audio/controllers.py
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
import zipfile
import base64
import logging
from typing import List, Tuple

from src.audio.model import AudioGeneration, AudioSegment, GenerationStatus
from src.audio.dtos import GenerateAudioRequest
from src.audio.elevenlabs_service import split_script_into_chunks, generate_audio_for_chunks
from src.utils.encryption import encrypt_api_keys
from src.user.model import User
from src.utils.security import sanitize_script_input, sanitize_filename

logger = logging.getLogger(__name__)

def generate_audio_for_user(req: GenerateAudioRequest, user: User, db: Session):
    """Generate audio and store in database"""
    try:
        # Sanitize input
        sanitized_script = sanitize_script_input(req.script)
        
        # Encrypt API keys
        encrypted_keys = encrypt_api_keys(req.api_keys)
        
        # Split script
        chunks = split_script_into_chunks(sanitized_script)
        if not chunks:
            raise HTTPException(400, "Script is empty or contains no paragraphs.")
        
        # Create generation record
        generation = AudioGeneration(
            user_id=user.id,
            encrypted_api_keys=encrypted_keys,
            script_chunks=chunks,
            voice_id=req.voice_id,
            model_id=req.model_id,
            status=GenerationStatus.PROCESSING
        )
        db.add(generation)
        db.commit()
        db.refresh(generation)
        
        # Generate audio with retry logic
        api_key = req.api_keys[0]
        results = generate_audio_for_chunks_with_retry(chunks, api_key, req.voice_id, req.model_id)
        
        # Create segments
        segments = []
        for idx, (title, audio_bytes) in enumerate(results, 1):
            sanitized_title = sanitize_filename(title)
            segment = AudioSegment(
                generation_id=generation.id,
                index=idx,
                title=sanitized_title,
                audio_data=audio_bytes
            )
            db.add(segment)
            segments.append(segment)
        
        generation.status = GenerationStatus.COMPLETED
        db.commit()
        
        return {
            "generation_id": generation.id,
            "status": "completed",
            "segments": len(segments)
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Audio generation failed for user {user.id}: {str(e)}")
        raise HTTPException(500, f"Audio generation failed: {str(e)}")

def generate_and_play_audio(req: GenerateAudioRequest, user: User, db: Session):
    """Generate audio and return base64 encoded segments for immediate playback"""
    try:
        # Sanitize input
        sanitized_script = sanitize_script_input(req.script)
        
        # Encrypt API keys
        encrypted_keys = encrypt_api_keys(req.api_keys)
        
        # Split script
        chunks = split_script_into_chunks(sanitized_script)
        if not chunks:
            raise HTTPException(400, "Script is empty or contains no paragraphs.")
        
        # Create generation record
        generation = AudioGeneration(
            user_id=user.id,
            encrypted_api_keys=encrypted_keys,
            script_chunks=chunks,
            voice_id=req.voice_id,
            model_id=req.model_id,
            status=GenerationStatus.PROCESSING
        )
        db.add(generation)
        db.commit()
        db.refresh(generation)
        
        # Generate audio
        api_key = req.api_keys[0]
        results = generate_audio_for_chunks_with_retry(chunks, api_key, req.voice_id, req.model_id)
        
        # Create segments
        segments = []
        for idx, (title, audio_bytes) in enumerate(results, 1):
            sanitized_title = sanitize_filename(title)
            segment = AudioSegment(
                generation_id=generation.id,
                index=idx,
                title=sanitized_title,
                audio_data=audio_bytes
            )
            db.add(segment)
            segments.append(segment)
        
        generation.status = GenerationStatus.COMPLETED
        db.commit()
        
        # Return base64 encoded audio
        response_data = []
        for seg in segments:
            audio_base64 = base64.b64encode(seg.audio_data).decode('utf-8')
            response_data.append({
                "id": seg.id,
                "generation_id": seg.generation_id,
                "index": seg.index,
                "title": seg.title,
                "audio_data": audio_base64,
                "created_at": seg.created_at.isoformat() if seg.created_at else None
            })
        
        return {
            "generation_id": generation.id,
            "segments": response_data
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Audio generation failed for user {user.id}: {str(e)}")
        raise HTTPException(500, f"Audio generation failed: {str(e)}")




def generate_audio_for_chunks_with_retry(
    chunks: List[str],
    api_key: str,
    voice_id: str,
    model_id: str,
    max_retries: int = 3
) -> List[Tuple[str, bytes]]:
    """Generate audio with retry logic"""
    from src.audio.elevenlabs_service import generate_audio_for_chunks
    
    for attempt in range(max_retries):
        try:
            return generate_audio_for_chunks(chunks, api_key, voice_id, model_id)
        except HTTPException as e:
            if attempt == max_retries - 1:
                raise
            logger.warning(f"Generation attempt {attempt + 1} failed, retrying...")
            continue
    raise HTTPException(500, "Maximum retries exceeded")

def list_generations(user: User, db: Session, skip: int = 0, limit: int = 50):
    """List generations with pagination"""
    query = db.query(AudioGeneration).filter(AudioGeneration.user_id == user.id)
    total = query.count()
    gens = query.order_by(AudioGeneration.created_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "data": [
            {
                "id": g.id,
                "status": g.status,
                "chunk_count": len(g.script_chunks),
                "segment_count": len(g.segments),
                "created_at": g.created_at.isoformat() if g.created_at else None,
                "voice_id": g.voice_id,
                "model_id": g.model_id,
            }
            for g in gens
        ],
        "pagination": {
            "total": total,
            "skip": skip,
            "limit": limit,
            "has_more": skip + limit < total
        }
    }

def get_generation(generation_id: int, user: User, db: Session):
    """Get generation details"""
    gen = db.query(AudioGeneration).filter(
        AudioGeneration.id == generation_id,
        AudioGeneration.user_id == user.id
    ).first()
    if not gen:
        raise HTTPException(404, "Generation not found or not yours")
    
    return {
        "id": gen.id,
        "status": gen.status,
        "script_chunks": gen.script_chunks,
        "segments": [
            {"index": s.index, "title": s.title, "id": s.id, "created_at": s.created_at}
            for s in gen.segments
        ],
        "voice_id": gen.voice_id,
        "model_id": gen.model_id,
        "created_at": gen.created_at.isoformat() if gen.created_at else None,
    }

def download_generation_zip(generation_id: int, user: User, db: Session):
    """Download generation as ZIP"""
    gen = db.query(AudioGeneration).filter(
        AudioGeneration.id == generation_id,
        AudioGeneration.user_id == user.id
    ).first()
    if not gen:
        raise HTTPException(404, "Generation not found or not yours")
    if not gen.segments:
        raise HTTPException(404, "No audio segments found")
    
    # Create ZIP in memory
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for seg in gen.segments:
            safe_filename = f"{seg.index:03d}_{sanitize_filename(seg.title)}.mp3"
            zip_file.writestr(safe_filename, seg.audio_data)
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename=generation_{generation_id}.zip",
            "Cache-Control": "private, max-age=3600",
        }
    )

def delete_generation(generation_id: int, user: User, db: Session):
    """Delete a generation and its segments"""
    gen = db.query(AudioGeneration).filter(
        AudioGeneration.id == generation_id,
        AudioGeneration.user_id == user.id
    ).first()
    if not gen:
        raise HTTPException(404, "Generation not found or not yours")
    
    db.delete(gen)
    db.commit()
    return {"success": True, "message": "Generation deleted successfully"}