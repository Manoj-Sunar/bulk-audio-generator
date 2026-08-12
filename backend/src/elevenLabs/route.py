# src/elevenlabs/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from src.utils.db import getDb
from src.utils.auth import get_current_user
from src.user.model import User
from src.elevenLabs import controller
from src.elevenLabs.dtos import (
    ElevenLabsQuotaRequest,
    ElevenLabsQuotaResponse,
    ElevenLabsSummaryResponse,
    ElevenLabsUsageResponse
)

elevenlabs_routes = APIRouter(prefix="/elevenlabs", tags=["ElevenLabs"])


@elevenlabs_routes.post("/quota", response_model=ElevenLabsQuotaResponse)
def get_quota_info(
    request: ElevenLabsQuotaRequest,
    user: User = Depends(get_current_user)
):
    """
    Get quota information for a specific ElevenLabs API key.
    
    Returns:
        - Total characters allowed
        - Used characters
        - Remaining characters
        - Percentage used
        - Plan tier
    """
    return controller.get_user_quota_info(request.api_key)


@elevenlabs_routes.get("/quota-summary", response_model=ElevenLabsSummaryResponse)
def get_quota_summary(
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user)
):
    """
    Get comprehensive quota summary for all ElevenLabs API keys 
    associated with the current user's generations.
    
    Returns:
        - Total API keys
        - Total generations
        - Total script characters used
        - Quota summary (total, used, remaining, percentage)
        - Per-key details
    """
    return controller.get_user_quota_summary(user, db)


@elevenlabs_routes.get("/usage-stats", response_model=ElevenLabsUsageResponse)
def get_usage_stats(
    db: Session = Depends(getDb),
    user: User = Depends(get_current_user)
):
    """
    Get detailed ElevenLabs usage statistics.
    
    Returns:
        - API key details with quota
        - Recent generations with API key usage
        - Total generations count
    """
    return controller.get_elevenlabs_usage_stats(user, db)


@elevenlabs_routes.post("/validate-key")
def validate_api_key(
    api_key: str,
    user: User = Depends(get_current_user)
):
    """
    Validate if an ElevenLabs API key is valid.
    """
    from src.utils.elevenLabs_client import ElevenLabsClient
    is_valid = ElevenLabsClient.validate_api_key(api_key)
    return {
        "valid": is_valid,
        "message": "API key is valid" if is_valid else "API key is invalid or expired"
    }


@elevenlabs_routes.post("/validate-keys")
def validate_multiple_api_keys(
    api_keys: List[str],
    user: User = Depends(get_current_user)
):
    """
    Validate multiple ElevenLabs API keys.
    """
    from src.utils.elevenLabs_client import ElevenLabsClient
    results = []
    for key in api_keys:
        is_valid = ElevenLabsClient.validate_api_key(key)
        results.append({
            "api_key": key[:8] + "..." + key[-4:],  # Mask for security
            "valid": is_valid
        })
    return {"results": results}