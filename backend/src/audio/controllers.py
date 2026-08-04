from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
import zipfile

from src.audio.model import AudioGeneration, AudioSegment, GenerationStatus
from src.audio.dtos import GenerateAudioRequest
from src.audio.elevenlabs_service import split_script_into_chunks, generate_audio_for_chunks
from src.utils.encryption import encrypt_api_keys
from src.user.model import User


from fastapi.responses import StreamingResponse
from io import BytesIO
import base64


def generate_audio_for_user(req: GenerateAudioRequest, user: User, db: Session):
    # 1. Encrypt API keys
    encrypted_keys = encrypt_api_keys(req.api_keys)

    # 2. Split script
    chunks = split_script_into_chunks(req.script)
    if not chunks:
        raise HTTPException(400, "Script is empty or contains no paragraphs.")

    # 3. Create generation record
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

    try:
        # 4. Use first API key for generation
        api_key = req.api_keys[0]
        results = generate_audio_for_chunks(chunks, api_key, req.voice_id, req.model_id)

        # 5. Create segments in DB
        segments = []
        for idx, (title, audio_bytes) in enumerate(results, 1):
            segment = AudioSegment(
                generation_id=generation.id,
                index=idx,
                title=title,
                audio_data=audio_bytes
            )
            db.add(segment)
            segments.append(segment)

        # 6. Update generation status
        generation.status = GenerationStatus.COMPLETED
        db.commit()

        return {
            "generation_id": generation.id,
            "status": "completed",
            "segments": len(segments)

        }

    except Exception as e:
        generation.status = GenerationStatus.FAILED
        db.commit()
        raise HTTPException(500, f"Audio generation failed: {str(e)}")



def generate_and_play_audio(req, user, db):
    # 1. API keys encrypt गर्ने
    encrypted_keys = encrypt_api_keys(req.api_keys)

    # 2. Script लाई chunks मा तोड्ने
    chunks = split_script_into_chunks(req.script)
    if not chunks:
        raise HTTPException(400, "Script is empty or contains no paragraphs.")

    # 3. AudioGeneration रेकर्ड सिर्जना गर्ने
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
    db.refresh(generation)   # `generation.id` प्राप्त गर्न

    try:
        # 4. ElevenLabs बाट अडियो उत्पादन
        api_key = req.api_keys[0]
        results = generate_audio_for_chunks(chunks, api_key, req.voice_id, req.model_id)

        # 5. सेगमेन्टहरू डाटाबेसमा सेभ गर्ने
        segments = []
        for idx, (title, audio_bytes) in enumerate(results, 1):
            segment = AudioSegment(
                generation_id=generation.id,
                index=idx,
                title=title,
                audio_data=audio_bytes
            )
            db.add(segment)
            segments.append(segment)

        # 6. Status update र commit
        generation.status = GenerationStatus.COMPLETED
        db.commit()

        # 7. JSON रेस्पोन्स बनाउने – प्रत्येक सेगमेन्टको सबै जानकारी सहित
        response_data = []
        for seg in segments:
            # `seg.id` र `seg.created_at` अब उपलब्ध छ (commit पछि)
            audio_base64 = base64.b64encode(seg.audio_data).decode('utf-8')
            response_data.append({
                "id": seg.id,
                "generation_id": seg.generation_id,
                "index": seg.index,
                "title": seg.title,
                "audio_data": audio_base64,   # base64 ढाँचामा
                "created_at": seg.created_at.isoformat() if seg.created_at else None
            })

        return {
            "generation_id": generation.id,
            "segments": response_data
        }

    except Exception as e:
        generation.status = GenerationStatus.FAILED
        db.commit()
        raise HTTPException(500, f"Audio generation failed: {str(e)}")




def list_generations(user: User, db: Session):
    gens = db.query(AudioGeneration).filter(AudioGeneration.user_id == user.id).order_by(
        AudioGeneration.created_at.desc()
    ).all()
    return [
        {
            "id": g.id,
            "status": g.status,
            "chunk_count": len(g.script_chunks),
            "segment_count": len(g.segments),
            "created_at": g.created_at,
        }
        for g in gens
    ]


def get_generation(generation_id: int, user: User, db: Session):
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
        "segments": [{"index": s.index, "title": s.title} for s in gen.segments],
        "voice_id": gen.voice_id,
        "model_id": gen.model_id,
        "created_at": gen.created_at,
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

    # Create ZIP in memory from DB segments
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for seg in gen.segments:
            filename = f"{seg.index:03d}_{seg.title}.mp3"
            zip_file.writestr(filename, seg.audio_data)
    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=generation_{generation_id}.zip"}
    )