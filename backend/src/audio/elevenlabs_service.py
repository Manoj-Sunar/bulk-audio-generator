import re
import requests
from typing import List, Tuple
from fastapi import HTTPException

def split_script_into_chunks(script: str) -> List[str]:
    """Split script by double newlines; return non‑empty chunks."""
    return [s.strip() for s in re.split(r"\n\s*\n", script) if s.strip()]

def generate_audio_for_chunks(
    chunks: List[str],
    api_key: str,
    voice_id: str,
    model_id: str
) -> List[Tuple[str, bytes]]:
    """
    For each chunk, call ElevenLabs and return (title, mp3_bytes).
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }
    results = []
    for idx, chunk in enumerate(chunks, 1):
        payload = {"text": chunk, "model_id": model_id}
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
        except requests.RequestException as e:
            raise HTTPException(500, f"ElevenLabs API error for chunk {idx}: {str(e)}")
        # Safe title from first line
        title = chunk.split("\n")[0][:40].strip()
        title = re.sub(r'[\\/*?:"<>|]', "", title) or f"segment_{idx}"
        results.append((title, resp.content))
    return results