# src/audio/dtos.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class GenerateAudioRequest(BaseModel):
    script: str = Field(..., description="Full script with double newline separators")
    api_keys: List[str] = Field(..., min_items=1, description="List of ElevenLabs API keys (plain text)")
    voice_id: str = Field("21m00Tcm4TlvDq8ikWAM", description="ElevenLabs voice ID")
    model_id: str = Field("eleven_multilingual_v2", description="ElevenLabs model ID")

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