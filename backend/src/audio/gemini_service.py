# src/audio/gemini_service.py
import re
import base64
import wave
import logging
from io import BytesIO
from typing import List, Tuple
from fastapi import HTTPException
from google import genai
from google.genai.types import GenerateContentConfig, SpeechConfig, VoiceConfig, PrebuiltVoiceConfig
from src.utils.errors import AppException, ErrorCode

logger = logging.getLogger(__name__)

def b64decode_audio(data: str) -> bytes:
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
            config=GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=SpeechConfig(
                    voice_config=VoiceConfig(
                        prebuilt_voice_config=PrebuiltVoiceConfig(voice_name=voice_name)
                    )
                )
            )
        )
    except Exception as e:
        error_str = str(e)
        # Map common errors
        if "API key" in error_str or "invalid" in error_str.lower():
            raise AppException(
                400,
                "The Gemini API key is invalid. Please check your key and try again.",
                ErrorCode.INVALID_API_KEY
            )
        elif "quota" in error_str.lower() or "exceeded" in error_str.lower():
            raise AppException(
                402,
                "Gemini API quota exceeded. Please upgrade your plan or try again later.",
                ErrorCode.QUOTA_EXCEEDED
            )
        elif "rate" in error_str.lower():
            raise AppException(
                429,
                "Gemini API rate limit exceeded. Please wait and try again.",
                ErrorCode.RATE_LIMIT
            )
        else:
            raise AppException(
                500,
                f"Gemini API error: {error_str}",
                ErrorCode.PROVIDER_ERROR,
                {"original_error": error_str}
            )

    # Extract audio data
    try:
        part = response.candidates[0].content.parts[0]
        raw_audio = part.inline_data.data
    except (AttributeError, IndexError, KeyError) as e:
        raise AppException(
            500,
            "Failed to parse Gemini response. Please try again.",
            ErrorCode.PROVIDER_ERROR,
            {"original_error": str(e)}
        )

    # Decode
    try:
        if isinstance(raw_audio, bytes):
            pcm_bytes = raw_audio
        else:
            pcm_bytes = b64decode_audio(raw_audio)
    except Exception as e:
        logger.error(f"Failed to decode audio: {str(e)}")
        raise AppException(
            500,
            "Failed to decode Gemini audio. Please try again.",
            ErrorCode.PROVIDER_ERROR
        )

    # Convert PCM to WAV
    try:
        wav_bytes = pcm_to_wav(pcm_bytes)
    except Exception as e:
        logger.error(f"Failed to convert PCM to WAV: {str(e)}")
        raise AppException(
            500,
            "Failed to convert audio format. Please try again.",
            ErrorCode.PROVIDER_ERROR
        )

    # Token usage
    if response.usage_metadata:
        total_tokens = response.usage_metadata.candidates_token_count

    # Title
    title = chunk.split("\n")[0][:40].strip()
    title = re.sub(r'[\\/*?:"<>|]', "", title) or "segment"

    return (title, wav_bytes), total_tokens

def generate_audio_for_chunks(
    chunks: List[str],
    api_key: str,
    voice_name: str,
) -> Tuple[List[Tuple[str, bytes]], int]:
    results = []
    total_tokens = 0
    
    for idx, chunk in enumerate(chunks, 1):
        try:
            result, tokens = generate_audio_for_single_chunk(chunk, api_key, voice_name)
            results.append(result)
            total_tokens += tokens
        except AppException as e:
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
    
    return results, total_tokens

def pcm_to_wav(pcm_data: bytes, channels: int = 1, rate: int = 24000, sample_width: int = 2) -> bytes:
    buffer = BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_data)
    return buffer.getvalue()