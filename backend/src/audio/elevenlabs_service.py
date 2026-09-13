# src/audio/elevenlabs_service.py
import re
import requests
from typing import List, Tuple
from fastapi import HTTPException
from src.utils.settings import settings
from src.utils.errors import AppException, ErrorCode

def split_script_into_chunks(script: str) -> List[str]:
    return [s.strip() for s in re.split(r"\n\s*\n", script) if s.strip()]

def generate_audio_for_single_chunk(
    chunk: str,
    api_key: str,
    voice_id: str,
    model_id: str
) -> Tuple[Tuple[str, bytes], int]:
    """
    Generate audio for a single chunk.
    Returns (title, audio_bytes) and characters used.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "User-Agent": "BulkAudioGenerator/2.0"
    }
    payload = {"text": chunk, "model_id": model_id}
    
    try:
        resp = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=settings.AUDIO_TIMEOUT
        )
        resp.raise_for_status()
    except requests.HTTPError as e:
        status_code = e.response.status_code if e.response else 500
        error_msg = ""
        try:
            error_data = e.response.json()
            error_msg = error_data.get("detail", {}).get("message", str(e))
        except:
            error_msg = str(e)
        
        if status_code == 401:
            raise AppException(
                400,
                "The ElevenLabs API key is invalid. Please check your key and try again.",
                ErrorCode.INVALID_API_KEY
            )
        elif status_code == 402:
            # Payment required – quota exceeded
            raise AppException(
                402,
                "You've reached your monthly character limit for this API key. Please upgrade your plan or use a different key.",
                ErrorCode.QUOTA_EXCEEDED
            )
        elif status_code == 429:
            raise AppException(
                429,
                "You are generating audio too quickly. Please wait a moment and try again.",
                ErrorCode.RATE_LIMIT
            )
        elif status_code in (500, 502, 503, 504):
            raise AppException(
                503,
                "The ElevenLabs service is currently unavailable. Please try again later.",
                ErrorCode.SERVICE_UNAVAILABLE
            )
        else:
            raise AppException(
                500,
                f"ElevenLabs returned an error: {error_msg}",
                ErrorCode.PROVIDER_ERROR,
                {"original_error": error_msg}
            )
    except requests.Timeout:
        raise AppException(
            503,
            "The ElevenLabs service is not responding. Please try again later.",
            ErrorCode.SERVICE_UNAVAILABLE
        )
    except requests.RequestException as e:
        raise AppException(
            500,
            "Failed to connect to ElevenLabs. Please try again later.",
            ErrorCode.SERVICE_UNAVAILABLE,
            {"original_error": str(e)}
        )
    
    # Track character usage
    char_header = resp.headers.get("x-character-count-used")
    if char_header:
        try:
            chars_used = int(char_header)
        except ValueError:
            chars_used = len(chunk)
    else:
        chars_used = len(chunk)
    
    # Generate a safe title
    title = chunk.split("\n")[0][:40].strip()
    title = re.sub(r'[\\/*?:"<>|]', "", title) or f"segment"
    
    return (title, resp.content), chars_used

def generate_audio_for_chunks(
    chunks: List[str],
    api_key: str,
    voice_id: str,
    model_id: str
) -> Tuple[List[Tuple[str, bytes]], int]:
    """
    Returns (list of (title, mp3_bytes), total_characters_used)
    """
    results = []
    total_chars = 0

    for idx, chunk in enumerate(chunks, 1):
        try:
            result, chars_used = generate_audio_for_single_chunk(chunk, api_key, voice_id, model_id)
            results.append(result)
            total_chars += chars_used
        except AppException as e:
            # Re-raise with chunk context
            raise AppException(
                e.status_code,
                f"Error on chunk {idx}: {e.message}",
                e.error_code,
                e.details
            )
        except Exception as e:
            raise AppException(
                500,
                f"Unexpected error on chunk {idx}: {str(e)}",
                ErrorCode.GENERATION_FAILED
            )

    return results, total_chars