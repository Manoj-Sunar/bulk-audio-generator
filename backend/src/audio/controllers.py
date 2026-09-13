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
from src.utils.errors import AppException, ErrorCode

logger = logging.getLogger(__name__)

def generate_and_stream_audio(req: GenerateAudioRequest, user: User, db: Session):
    """
    Stream audio generation progress and results via SSE.
    Each chunk is sent to the client as soon as it's generated.
    """
    try:
        # Validate script
        if not req.script or not req.script.strip():
            raise AppException(400, "The script is empty. Please provide some text.", ErrorCode.EMPTY_SCRIPT)
        
        sanitized_script = sanitize_script_input(req.script)
        encrypted_keys = encrypt_api_keys(req.api_keys)
        
        chunks = split_script_into_chunks(sanitized_script)
        if not chunks:
            raise AppException(400, "The script contains no paragraphs. Please add content.", ErrorCode.EMPTY_SCRIPT)
        
        if len(chunks) > 1000:
            raise AppException(400, f"Script has {len(chunks)} chunks, exceeding maximum of 1000.", ErrorCode.SCRIPT_TOO_LONG)

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
        provider_name = "gemini" if req.provider == ProviderType.GEMINI else "elevenlabs"

        def event_generator() -> Generator[str, None, None]:
            try:
                total_chunks = len(chunks)
                total_chars = 0
                results = []
                
                yield f"data: {json.dumps({'type': 'start', 'generation_id': generation.id, 'total': total_chunks, 'provider': provider_name})}\n\n"

                for idx, chunk in enumerate(chunks, 1):
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
                        
                        sanitized_title = sanitize_filename(title)
                        segment = AudioSegment(
                            generation_id=generation.id,
                            index=idx,
                            title=sanitized_title,
                            audio_data=audio_bytes
                        )
                        db.add(segment)
                        db.commit()
                        
                        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
                        segment_data = {
                            "id": str(segment.id),
                            "index": idx,
                            "title": sanitized_title,
                            "audio_data": audio_base64,
                            "created_at": segment.created_at.isoformat() if segment.created_at else None,
                            "chars_used": chars_used
                        }
                        
                        yield f"data: {json.dumps({'type': 'progress', 'current': idx, 'total': total_chunks, 'segment': segment_data})}\n\n"
                        results.append(segment_data)
                        
                    except AppException as e:
                        # Send structured error event
                        error_event = {
                            "type": "error",
                            "index": idx,
                            "message": e.message,
                            "error_code": e.error_code.value if e.error_code else None,
                            "details": e.details
                        }
                        yield f"data: {json.dumps(error_event)}\n\n"
                        logger.error(f"Chunk {idx} failed: {e.message}")
                        # Continue to next chunk
                    except Exception as e:
                        # Unexpected error
                        error_event = {
                            "type": "error",
                            "index": idx,
                            "message": "An unexpected error occurred on this chunk.",
                            "error_code": ErrorCode.GENERATION_FAILED.value,
                        }
                        yield f"data: {json.dumps(error_event)}\n\n"
                        logger.error(f"Unexpected error on chunk {idx}: {str(e)}")
                
                # Update generation status only if at least one segment succeeded
                if results:
                    generation.status = GenerationStatus.COMPLETED
                    db.commit()
                    yield f"data: {json.dumps({'type': 'complete', 'generation_id': generation.id, 'total': len(results), 'total_chars': total_chars})}\n\n"
                else:
                    generation.status = GenerationStatus.FAILED
                    db.commit()
                    yield f"data: {json.dumps({'type': 'complete', 'generation_id': generation.id, 'total': 0, 'message': 'All chunks failed.'})}\n\n"
                
            except Exception as e:
                db.rollback()
                logger.error(f"Stream generation failed: {str(e)}")
                yield f"data: {json.dumps({'type': 'error', 'message': 'An internal error occurred. Please try again.', 'error_code': ErrorCode.INTERNAL_ERROR.value})}\n\n"
            finally:
                db.close()

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            }
        )

    except AppException:
        db.rollback()
        raise
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Audio generation failed: {str(e)}")
        raise AppException(500, "An internal error occurred. Please try again later.", ErrorCode.INTERNAL_ERROR)


def generate_and_play_audio(req: GenerateAudioRequest, user: User, db: Session):
    """Legacy batch generation - kept for backward compatibility"""
    try:
        if not req.script or not req.script.strip():
            raise AppException(400, "The script is empty. Please provide some text.", ErrorCode.EMPTY_SCRIPT)
        
        sanitized_script = sanitize_script_input(req.script)
        encrypted_keys = encrypt_api_keys(req.api_keys)
        
        chunks = split_script_into_chunks(sanitized_script)
        if not chunks:
            raise AppException(400, "The script contains no paragraphs. Please add content.", ErrorCode.EMPTY_SCRIPT)
        
        if len(chunks) > 1000:
            raise AppException(400, f"Script has {len(chunks)} chunks, exceeding maximum of 1000.", ErrorCode.SCRIPT_TOO_LONG)

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

    except AppException:
        db.rollback()
        raise
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Audio generation failed: {str(e)}")
        raise AppException(500, "An internal error occurred. Please try again later.", ErrorCode.INTERNAL_ERROR)


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
        raise AppException(404, "Generation not found or you don't have access.", ErrorCode.NOT_FOUND)

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
        raise AppException(404, "Generation not found or you don't have access.", ErrorCode.NOT_FOUND)
    if not gen.segments:
        raise AppException(404, "No audio segments found to download.", ErrorCode.NOT_FOUND)

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
        raise AppException(404, "Generation not found or you don't have access.", ErrorCode.NOT_FOUND)
    db.delete(gen)
    db.commit()
    return {"success": True, "message": "Generation deleted successfully"}