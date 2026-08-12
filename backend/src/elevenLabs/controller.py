# src/elevenlabs/controllers.py
from typing import List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging

from src.user.model import User
from src.utils.elevenLabs_client import ElevenLabsClient
from src.utils.encryption import decrypt_api_keys
from src.audio.model import AudioGeneration

logger = logging.getLogger(__name__)


def get_user_quota_info(api_key: str) -> Dict[str, Any]:
    """
    Get quota info for a single ElevenLabs API key.
    """
    return ElevenLabsClient.get_user_info(api_key)


def get_user_quota_from_encrypted(encrypted_keys: str) -> List[Dict[str, Any]]:
    """
    Get quota info from encrypted API keys stored in database.
    """
    try:
        api_keys = decrypt_api_keys(encrypted_keys)
        return ElevenLabsClient.get_multiple_users_info(api_keys)
    except Exception as e:
        logger.error(f"Failed to decrypt API keys: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to decrypt API keys"
        )


def get_user_quota_summary(user: User, db: Session) -> Dict[str, Any]:
    """
    Get quota summary for all ElevenLabs API keys associated with a user.
    Includes usage statistics across all their generations.
    """
    try:
        # Get all generations for this user
        generations = db.query(AudioGeneration).filter(
            AudioGeneration.user_id == user.id
        ).all()
        
        # Collect unique API keys from all generations
        all_keys = set()
        for gen in generations:
            if gen.encrypted_api_keys:
                try:
                    keys = decrypt_api_keys(gen.encrypted_api_keys)
                    all_keys.update(keys)
                except Exception as e:
                    logger.warning(f"Failed to decrypt keys for generation {gen.id}: {str(e)}")
        
        # Get quota info for each unique key
        api_key_infos = []
        for api_key in all_keys:
            try:
                info = ElevenLabsClient.get_user_info(api_key)
                # Count how many generations used this key
                usage_count = sum(
                    1 for gen in generations 
                    if gen.encrypted_api_keys and api_key in decrypt_api_keys(gen.encrypted_api_keys)
                )
                info["generations_using_key"] = usage_count
                api_key_infos.append(info)
            except Exception as e:
                logger.warning(f"Failed to get info for API key: {str(e)}")
                api_key_infos.append({
                    "api_key": api_key[:8] + "..." + api_key[-4:],  # Masked for safety
                    "error": "Failed to fetch quota info",
                    "valid": False
                })
        
        # Calculate overall statistics
        total_quota = sum(info.get("quota", {}).get("total_characters", 0) for info in api_key_infos if info.get("quota"))
        total_used = sum(info.get("quota", {}).get("used_characters", 0) for info in api_key_infos if info.get("quota"))
        total_remaining = sum(info.get("quota", {}).get("remaining_characters", 0) for info in api_key_infos if info.get("quota"))
        
        # Calculate total script length used across all generations
        total_script_length = sum(
            len("".join(gen.script_chunks)) if gen.script_chunks else 0 
            for gen in generations
        )
        
        return {
            "total_api_keys": len(api_key_infos),
            "total_generations": len(generations),
            "total_script_characters": total_script_length,
            "quota_summary": {
                "total_quota": total_quota,
                "total_used": total_used,
                "total_remaining": total_remaining,
                "overall_usage_percentage": round((total_used / total_quota * 100), 2) if total_quota > 0 else 0
            },
            "api_keys": api_key_infos
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error getting user quota summary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve quota summary"
        )


def get_elevenlabs_usage_stats(user: User, db: Session) -> Dict[str, Any]:
    """
    Get detailed usage statistics for ElevenLabs usage.
    """
    try:
        generations = db.query(AudioGeneration).filter(
            AudioGeneration.user_id == user.id
        ).order_by(AudioGeneration.created_at.desc()).all()
        
        # Get all API keys used
        all_keys = set()
        for gen in generations:
            if gen.encrypted_api_keys:
                try:
                    keys = decrypt_api_keys(gen.encrypted_api_keys)
                    all_keys.update(keys)
                except:
                    pass
        
        # Get quota info
        key_infos = []
        for api_key in all_keys:
            try:
                info = ElevenLabsClient.get_user_info(api_key)
                key_infos.append(info)
            except:
                # Silently skip failed keys
                pass
        
        # Build per-generation usage
        generation_usage = []
        for gen in generations[:20]:  # Limit to 20 most recent
            keys = []
            if gen.encrypted_api_keys:
                try:
                    keys = decrypt_api_keys(gen.encrypted_api_keys)
                except:
                    keys = ["[encrypted]"]
            
            generation_usage.append({
                "generation_id": gen.id,
                "created_at": gen.created_at.isoformat() if gen.created_at else None,
                "status": gen.status,
                "chunk_count": len(gen.script_chunks) if gen.script_chunks else 0,
                "segment_count": len(gen.segments) if gen.segments else 0,
                "api_keys": [k[:8] + "..." for k in keys],  # Mask keys
                "voice_id": gen.voice_id
            })
        
        return {
            "api_key_details": key_infos,
            "recent_generations": generation_usage,
            "total_generations": len(generations)
        }
        
    except Exception as e:
        logger.exception(f"Error getting ElevenLabs usage stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve usage statistics"
        )