# src/audio/gemini_service.py
import re
import base64
import wave
import logging
from io import BytesIO
from typing import List, Tuple
from fastapi import HTTPException
from google import genai

logger = logging.getLogger(__name__)

def b64decode_audio(data: str) -> bytes:
    """Decode base64 string, adding missing padding and handling URL-safe chars."""
    missing_padding = len(data) % 4
    if missing_padding:
        data += '=' * (4 - missing_padding)
    data = data.replace('-', '+').replace('_', '/')
    return base64.b64decode(data)

def generate_audio_for_single_chunk(
    chunk: str,
    api_key: str,
    voice_name: str,
) -> Tuple[Tuple[str, bytes], int]:
    """
    Generate audio for a single chunk using Gemini TTS.
    Returns (title, wav_bytes) and tokens_used.
    """
    client = genai.Client(api_key=api_key)
    total_tokens = 0
    
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview",
            contents=chunk,
            config={
                "response_modalities": ["AUDIO"],
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice_config": {"voice_name": voice_name}
                    }
                }
            }
        )
    except Exception as e:
        raise HTTPException(500, f"Gemini API error: {str(e)}")

    # Extract the audio data
    try:
        part = response.candidates[0].content.parts[0]
        raw_audio = part.inline_data.data
    except (AttributeError, IndexError, KeyError) as e:
        raise HTTPException(500, f"Failed to parse Gemini response: {str(e)}")

    # Handle both base64 string and raw bytes
    try:
        if isinstance(raw_audio, bytes):
            pcm_bytes = raw_audio
        else:
            pcm_bytes = b64decode_audio(raw_audio)
    except Exception as e:
        logger.error(f"Failed to decode audio: {str(e)}")
        raise HTTPException(500, f"Failed to decode audio: {str(e)}")

    # Convert PCM to WAV (24kHz, mono, 16-bit)
    try:
        wav_bytes = pcm_to_wav(pcm_bytes)
    except Exception as e:
        logger.error(f"Failed to convert PCM to WAV: {str(e)}")
        raise HTTPException(500, f"Failed to convert PCM to WAV: {str(e)}")

    # Track token usage if available
    if response.usage_metadata:
        total_tokens = response.usage_metadata.candidates_token_count

    # Generate a clean title
    title = chunk.split("\n")[0][:40].strip()
    title = re.sub(r'[\\/*?:"<>|]', "", title) or "segment"

    return (title, wav_bytes), total_tokens

def generate_audio_for_chunks(
    chunks: List[str],
    api_key: str,
    voice_name: str,
) -> Tuple[List[Tuple[str, bytes]], int]:
    """Generate audio for all chunks (batch mode)."""
    results = []
    total_tokens = 0
    
    for idx, chunk in enumerate(chunks, 1):
        try:
            result, tokens = generate_audio_for_single_chunk(chunk, api_key, voice_name)
            results.append(result)
            total_tokens += tokens
        except HTTPException as e:
            raise HTTPException(500, f"Gemini API error for chunk {idx}: {str(e)}")
    
    return results, total_tokens

def pcm_to_wav(pcm_data: bytes, channels: int = 1, rate: int = 24000, sample_width: int = 2) -> bytes:
    buffer = BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_data)
    return buffer.getvalue()