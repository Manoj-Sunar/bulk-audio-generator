# src/audio/controllers.py
from ast import Dict
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
import zipfile
import base64
import logging
import time
import json
from typing import Any, List, Tuple, Generator

from src.utils.constants import VOICE_INSIGHTS
from src.audio.model import AudioGeneration, AudioSegment, GenerationStatus
from src.audio.dtos import GenerateAudioRequest
from src.audio.elevenlabs_service import split_script_into_chunks, generate_audio_for_single_chunk
from src.utils.encryption import encrypt_api_keys
from src.user.model import User
from src.utils.security import sanitize_script_input, sanitize_filename
from src.audio.dtos import ProviderType
from src.audio import gemini_service

logger = logging.getLogger(__name__)

def generate_and_stream_audio(req: GenerateAudioRequest, user: User, db: Session):
    """
    Stream audio generation progress and results via SSE.
    Each chunk is sent to the client as soon as it's generated.
    """
    try:
        sanitized_script = sanitize_script_input(req.script)
        encrypted_keys = encrypt_api_keys(req.api_keys)
        
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

        api_key = req.api_keys[0]
        
        # Determine provider
        provider_name = "gemini" if req.provider == ProviderType.GEMINI else "elevenlabs"

        # --- Streaming generator ---
        def event_generator() -> Generator[str, None, None]:
            try:
                total_chunks = len(chunks)
                total_chars = 0
                results = []
                
                # Send initial status
                yield f"data: {json.dumps({'type': 'start', 'generation_id': generation.id, 'total': total_chunks, 'provider': provider_name})}\n\n"

                for idx, chunk in enumerate(chunks, 1):
                    # Generate audio for this chunk
                    try:
                        if req.provider == ProviderType.GEMINI:
                            chunk_result, chars_used = gemini_service.generate_audio_for_single_chunk(
                                chunk, api_key, req.voice_id
                            )
                        else:
                            chunk_result, chars_used = generate_audio_for_single_chunk(
                                chunk, api_key, req.voice_id, req.model_id
                            )
                        
                        title, audio_bytes = chunk_result
                        total_chars += chars_used
                        
                        # Store in database
                        sanitized_title = sanitize_filename(title)
                        segment = AudioSegment(
                            generation_id=generation.id,
                            index=idx,
                            title=sanitized_title,
                            audio_data=audio_bytes
                        )
                        db.add(segment)
                        db.commit()
                        
                        # Prepare response
                        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
                        segment_data = {
                            "id": str(segment.id),
                            "index": idx,
                            "title": sanitized_title,
                            "audio_data": audio_base64,
                            "created_at": segment.created_at.isoformat() if segment.created_at else None,
                            "chars_used": chars_used
                        }
                        
                        # Send progress update with the file
                        yield f"data: {json.dumps({'type': 'progress', 'current': idx, 'total': total_chunks, 'segment': segment_data})}\n\n"
                        
                        results.append(segment_data)
                        
                    except Exception as e:
                        # Send error for this chunk
                        yield f"data: {json.dumps({'type': 'error', 'index': idx, 'message': str(e)})}\n\n"
                        logger.error(f"Failed to generate chunk {idx}: {str(e)}")
                
                # Update generation status
                generation.status = GenerationStatus.COMPLETED
                db.commit()
                
                # Send completion event
                yield f"data: {json.dumps({'type': 'complete', 'generation_id': generation.id, 'total': len(results), 'total_chars': total_chars})}\n\n"
                
            except Exception as e:
                db.rollback()
                logger.error(f"Stream generation failed: {str(e)}")
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
            finally:
                db.close()

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",  # Disable Nginx buffering
            }
        )

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Audio generation failed: {str(e)}")
        raise HTTPException(500, f"Audio generation failed: {str(e)}")


def generate_and_play_audio(req: GenerateAudioRequest, user: User, db: Session):
    """Legacy batch generation - kept for backward compatibility"""
    try:
        sanitized_script = sanitize_script_input(req.script)
        encrypted_keys = encrypt_api_keys(req.api_keys)
        
        chunks = split_script_into_chunks(sanitized_script)
        if not chunks:
            raise HTTPException(400, "Script is empty or contains no paragraphs.")

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

        api_key = req.api_keys[0]

        if req.provider == ProviderType.GEMINI:
            results, usage = gemini_service.generate_audio_for_chunks(
                chunks, api_key, req.voice_id
            )
        else:
            from src.audio.elevenlabs_service import generate_audio_for_chunks as eleven_generate
            results, usage = eleven_generate(
                chunks, api_key, req.voice_id, req.model_id
            )

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
            "segments": response_data,
            "usage": usage
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Audio generation failed: {str(e)}")
        raise HTTPException(500, f"Audio generation failed: {str(e)}")


def get_voice_insights(voice_id: str) -> Dict[str, Any]:
    if voice_id in VOICE_INSIGHTS:
        return {"voice_id": voice_id, **VOICE_INSIGHTS[voice_id]}
    return {
        "voice_id": voice_id,
        "name": "Unknown Voice",
        "gender": "Unknown",
        "description": "Voice details not available",
        "accent": "Unknown",
        "age": "Unknown",
        "use_case": "Unknown"
    }

def list_generations(
    user: User,
    db: Session,
    skip: int = 0,
    limit: int = 50,
    include_audio: bool = False,
    max_audio_previews: int = 3
):
    query = db.query(AudioGeneration).filter(AudioGeneration.user_id == user.id)
    total = query.count()
    gens = query.order_by(AudioGeneration.created_at.desc()).offset(skip).limit(limit).all()

    generations_data = []
    for g in gens:
        segments_list = g.segments
        segments_data = []
        for idx, seg in enumerate(segments_list):
            segment_data = {
                "id": seg.id,
                "index": seg.index,
                "title": seg.title,
                "created_at": seg.created_at.isoformat() if seg.created_at else None,
            }
            if include_audio and (max_audio_previews == 0 or idx < max_audio_previews):
                if seg.audio_data:
                    segment_data["audio_data"] = base64.b64encode(seg.audio_data).decode('utf-8')
                else:
                    segment_data["audio_data"] = None
            segments_data.append(segment_data)

        generation_data = {
            "id": g.id,
            "status": g.status,
            "chunk_count": len(g.script_chunks) if g.script_chunks else 0,
            "segment_count": len(segments_list),
            "created_at": g.created_at.isoformat() if g.created_at else None,
            "voice_id": g.voice_id,
            "model_id": g.model_id,
            "voice_insights": get_voice_insights(g.voice_id),
            "segments": segments_data,
        }
        if include_audio and max_audio_previews > 0 and len(segments_list) > max_audio_previews:
            generation_data["total_segments"] = len(segments_list)
            generation_data["has_more_segments"] = True
        generations_data.append(generation_data)

    return {
        "data": generations_data,
        "pagination": {
            "total": total,
            "skip": skip,
            "limit": limit,
            "has_more": skip + limit < total
        }
    }

def get_generation(generation_id: int, user: User, db: Session):
    gen = db.query(AudioGeneration).filter(
        AudioGeneration.id == generation_id,
        AudioGeneration.user_id == user.id
    ).first()
    if not gen:
        raise HTTPException(404, "Generation not found or not yours")

    segments_with_audio = []
    for seg in gen.segments:
        audio_base64 = base64.b64encode(seg.audio_data).decode('utf-8') if seg.audio_data else None
        segments_with_audio.append({
            "id": seg.id,
            "index": seg.index,
            "title": seg.title,
            "audio_data": audio_base64,
            "created_at": seg.created_at.isoformat() if seg.created_at else None
        })

    return {
        "id": gen.id,
        "status": gen.status,
        "script_chunks": gen.script_chunks,
        "segments": segments_with_audio,
        "voice_id": gen.voice_id,
        "model_id": gen.model_id,
        "voice_insights": get_voice_insights(gen.voice_id),
        "created_at": gen.created_at.isoformat() if gen.created_at else None,
        "updated_at": gen.updated_at.isoformat() if gen.updated_at else None,
        "chunk_count": len(gen.script_chunks) if gen.script_chunks else 0,
        "segment_count": len(gen.segments),
    }

def download_generation_zip(generation_id: int, user: User, db: Session):
    gen = db.query(AudioGeneration).filter(
        AudioGeneration.id == generation_id,
        AudioGeneration.user_id == user.id
    ).first()
    if not gen:
        raise HTTPException(404, "Generation not found or not yours")
    if not gen.segments:
        raise HTTPException(404, "No audio segments found")

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
    gen = db.query(AudioGeneration).filter(
        AudioGeneration.id == generation_id,
        AudioGeneration.user_id == user.id
    ).first()
    if not gen:
        raise HTTPException(404, "Generation not found or not yours")
    db.delete(gen)
    db.commit()
    return {"success": True, "message": "Generation deleted successfully"}