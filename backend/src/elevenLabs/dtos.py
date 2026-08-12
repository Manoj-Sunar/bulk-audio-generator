# src/elevenlabs/dtos.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class QuotaInfo(BaseModel):
    """ElevenLabs quota information"""
    total_characters: int = Field(..., description="Total character limit")
    used_characters: int = Field(..., description="Used characters")
    remaining_characters: int = Field(..., description="Remaining characters")
    percentage_used: float = Field(..., description="Percentage of quota used")
    plan: str = Field(..., description="Plan tier name")
    next_reset: Optional[str] = Field(None, description="Next reset timestamp")


class ElevenLabsQuotaRequest(BaseModel):
    """Request for ElevenLabs quota info"""
    api_key: str = Field(..., description="ElevenLabs API key")


class ElevenLabsQuotaResponse(BaseModel):
    """Response with ElevenLabs user and quota info"""
    user_id: str
    email: str
    name: str
    quota: QuotaInfo
    valid: bool = True


class APIKeyInfo(BaseModel):
    """Information about a single API key"""
    user_id: str
    email: str
    name: str
    quota: QuotaInfo
    generations_using_key: Optional[int] = 0
    valid: bool = True
    error: Optional[str] = None
    api_key: Optional[str] = None  # Masked for display


class QuotaSummary(BaseModel):
    """Overall quota summary"""
    total_quota: int
    total_used: int
    total_remaining: int
    overall_usage_percentage: float


class ElevenLabsSummaryResponse(BaseModel):
    """Comprehensive quota summary response"""
    total_api_keys: int
    total_generations: int
    total_script_characters: int
    quota_summary: QuotaSummary
    api_keys: List[APIKeyInfo]


class RecentGeneration(BaseModel):
    """Recent generation info"""
    generation_id: int
    created_at: Optional[str]
    status: str
    chunk_count: int
    segment_count: int
    api_keys: List[str]  # Masked keys
    voice_id: str


class ElevenLabsUsageResponse(BaseModel):
    """Detailed usage statistics"""
    api_key_details: List[APIKeyInfo]
    recent_generations: List[RecentGeneration]
    total_generations: int