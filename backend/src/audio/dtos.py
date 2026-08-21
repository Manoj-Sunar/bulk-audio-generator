# src/audio/dtos.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ProviderType(str, Enum):
    ELEVENLABS = "elevenlabs"
    GEMINI = "gemini"

class GenerateAudioRequest(BaseModel):
    script: str = Field(..., description="Full script with double newline separators")
    api_keys: List[str] = Field(..., min_items=1, description="List of API keys (ElevenLabs or Gemini)")
    voice_id: str = Field("pNInz6obpgDQGcFmaJgB", description="ElevenLabs voice ID or Gemini voice name")
    model_id: str = Field("eleven_multilingual_v2", description="ElevenLabs model ID (ignored for Gemini)")
    provider: ProviderType = Field(ProviderType.ELEVENLABS, description="Provider to use")

class SegmentResponse(BaseModel):
    index: int
    title: str

class GenerationListItem(BaseModel):
    id: int
    status: str
    chunk_count: int
    segment_count: int
    created_at: datetime

class GenerationDetail(BaseModel):
    id: int
    status: str
    script_chunks: List[str]
    segments: List[SegmentResponse]
    voice_id: str
    model_id: str
    created_at: datetime
    characters_used: Optional[int] = None