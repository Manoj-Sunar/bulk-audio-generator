# src/utils/elevenlabs_client.py
import requests
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class ElevenLabsClient:
    """Client for interacting with ElevenLabs API"""
    
    BASE_URL = "https://api.elevenlabs.io/v1"
    
    @staticmethod
    def get_user_info(api_key: str) -> Dict[str, Any]:
        """
        Get user information including quota details from ElevenLabs.
        
        Returns:
            {
                "user_id": str,
                "email": str,
                "name": str,
                "quota": {
                    "total_characters": int,
                    "used_characters": int,
                    "remaining_characters": int,
                    "percentage_used": float,
                    "plan": str,
                    "next_reset": str (ISO datetime)
                }
            }
        """
        try:
            headers = {"xi-api-key": api_key}
            
            # Get user info
            user_response = requests.get(
                f"{ElevenLabsClient.BASE_URL}/user",
                headers=headers,
                timeout=10
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            
            # Get subscription info
            sub_response = requests.get(
                f"{ElevenLabsClient.BASE_URL}/subscription",
                headers=headers,
                timeout=10
            )
            sub_response.raise_for_status()
            sub_data = sub_response.json()
            
            # Extract quota information
            character_limit = sub_data.get("character_limit", 0)
            character_count = sub_data.get("character_count", 0)
            
            remaining = max(0, character_limit - character_count)
            percentage_used = (character_count / character_limit * 100) if character_limit > 0 else 0
            
            return {
                "user_id": user_data.get("user_id"),
                "email": user_data.get("email"),
                "name": user_data.get("name", "ElevenLabs User"),
                "quota": {
                    "total_characters": character_limit,
                    "used_characters": character_count,
                    "remaining_characters": remaining,
                    "percentage_used": round(percentage_used, 2),
                    "plan": sub_data.get("tier", "Unknown"),
                    "next_reset": sub_data.get("next_character_reset_unix")
                }
            }
            
        except requests.RequestException as e:
            logger.error(f"ElevenLabs API error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed to fetch ElevenLabs user info: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error fetching ElevenLabs info: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve ElevenLabs user information"
            )

    @staticmethod
    def validate_api_key(api_key: str) -> bool:
        """
        Validate if an API key is valid by making a lightweight request.
        Returns True if valid, False otherwise.
        """
        try:
            headers = {"xi-api-key": api_key}
            response = requests.get(
                f"{ElevenLabsClient.BASE_URL}/user",
                headers=headers,
                timeout=5
            )
            return response.status_code == 200
        except:
            return False

    @staticmethod
    def get_multiple_users_info(api_keys: list) -> list:
        """
        Get information for multiple API keys.
        Returns list of user info dicts.
        """
        results = []
        for api_key in api_keys:
            try:
                info = ElevenLabsClient.get_user_info(api_key)
                info["api_key"] = api_key  # Keep reference
                results.append(info)
            except HTTPException as e:
                # If one key fails, include error info
                results.append({
                    "api_key": api_key,
                    "error": str(e.detail),
                    "valid": False
                })
            except Exception as e:
                results.append({
                    "api_key": api_key,
                    "error": str(e),
                    "valid": False
                })
        return results