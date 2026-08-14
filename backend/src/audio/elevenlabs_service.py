# src/audio/elevenlabs_service.py
import re
import requests
from typing import List, Tuple
from fastapi import HTTPException
from src.utils.settings import settings

def split_script_into_chunks(script: str) -> List[str]:
    return [s.strip() for s in re.split(r"\n\s*\n", script) if s.strip()]

def generate_audio_for_chunks(
    chunks: List[str],
    api_key: str,
    voice_id: str,
    model_id: str
) -> Tuple[List[Tuple[str, bytes]], int]:
    """
    Returns (list of (title, mp3_bytes), total_characters_used)
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "User-Agent": "BulkAudioGenerator/2.0"
    }
    results = []
    total_chars = 0

    for idx, chunk in enumerate(chunks, 1):
        payload = {"text": chunk, "model_id": model_id}
        try:
            resp = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=settings.AUDIO_TIMEOUT
            )
            resp.raise_for_status()
        except requests.RequestException as e:
            raise HTTPException(500, f"ElevenLabs API error for chunk {idx}: {str(e)}")

        # Track character usage (optional)
        char_header = resp.headers.get("x-character-count-used")
        if char_header:
            try:
                total_chars += int(char_header)
            except ValueError:
                total_chars += len(chunk)
        else:
            total_chars += len(chunk)

        # Generate a safe title
        title = chunk.split("\n")[0][:40].strip()
        title = re.sub(r'[\\/*?:"<>|]', "", title) or f"segment_{idx}"
        results.append((title, resp.content))

    return results, total_chars