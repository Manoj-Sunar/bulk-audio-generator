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
            
            # ✅ ONLY call subscription endpoint (more reliable than /user)
            sub_response = requests.get(
                f"{ElevenLabsClient.BASE_URL}/subscription",
                headers=headers,
                timeout=10
            )
            
            # If subscription fails, try user endpoint as fallback
            if sub_response.status_code != 200:
                logger.warning(f"Subscription endpoint failed with {sub_response.status_code}, trying user endpoint...")
                user_response = requests.get(
                    f"{ElevenLabsClient.BASE_URL}/user",
                    headers=headers,
                    timeout=10
                )
                user_response.raise_for_status()
                user_data = user_response.json()
                
                # Try to get subscription info from user data (if available)
                return {
                    "user_id": user_data.get("user_id"),
                    "email": user_data.get("email"),
                    "name": user_data.get("name", "ElevenLabs User"),
                    "quota": {
                        "total_characters": user_data.get("character_limit", 0),
                        "used_characters": user_data.get("character_count", 0),
                        "remaining_characters": max(0, user_data.get("character_limit", 0) - user_data.get("character_count", 0)),
                        "percentage_used": round((user_data.get("character_count", 0) / user_data.get("character_limit", 1) * 100), 2) if user_data.get("character_limit", 0) > 0 else 0,
                        "plan": user_data.get("tier", "Unknown"),
                        "next_reset": None
                    }
                }
            
            sub_response.raise_for_status()
            sub_data = sub_response.json()
            
            # Extract quota information
            character_limit = sub_data.get("character_limit", 0)
            character_count = sub_data.get("character_count", 0)
            
            remaining = max(0, character_limit - character_count)
            percentage_used = (character_count / character_limit * 100) if character_limit > 0 else 0
            
            # Try to get user info for email/name
            try:
                user_response = requests.get(
                    f"{ElevenLabsClient.BASE_URL}/user",
                    headers=headers,
                    timeout=5
                )
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    email = user_data.get("email", "Unknown")
                    name = user_data.get("name", "ElevenLabs User")
                    user_id = user_data.get("user_id")
                else:
                    email = "Unknown"
                    name = "ElevenLabs User"
                    user_id = None
            except:
                email = "Unknown"
                name = "ElevenLabs User"
                user_id = None
            
            return {
                "user_id": user_id,
                "email": email,
                "name": name,
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
            # ✅ Return a structured error instead of raising
            return {
                "valid": False,
                "error": f"Failed to fetch ElevenLabs quota: {str(e)}",
                "quota": {
                    "total_characters": 0,
                    "used_characters": 0,
                    "remaining_characters": 0,
                    "percentage_used": 0,
                    "plan": "Unknown",
                    "next_reset": None
                }
            }
        except Exception as e:
            logger.error(f"Unexpected error fetching ElevenLabs info: {str(e)}")
            return {
                "valid": False,
                "error": f"Unexpected error: {str(e)}",
                "quota": {
                    "total_characters": 0,
                    "used_characters": 0,
                    "remaining_characters": 0,
                    "percentage_used": 0,
                    "plan": "Unknown",
                    "next_reset": None
                }
            }

    @staticmethod
    def validate_api_key(api_key: str) -> bool:
        """Validate if an API key is valid by making a lightweight request."""
        try:
            headers = {"xi-api-key": api_key}
            # ✅ Try subscription endpoint first (more reliable)
            response = requests.get(
                f"{ElevenLabsClient.BASE_URL}/subscription",
                headers=headers,
                timeout=5
            )
            if response.status_code == 200:
                return True
            # Fallback to user endpoint
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
        """Get information for multiple API keys."""
        results = []
        for api_key in api_keys:
            try:
                info = ElevenLabsClient.get_user_info(api_key)
                info["api_key"] = api_key
                results.append(info)
            except Exception as e:
                results.append({
                    "api_key": api_key,
                    "error": str(e),
                    "valid": False,
                    "quota": {
                        "total_characters": 0,
                        "used_characters": 0,
                        "remaining_characters": 0,
                        "percentage_used": 0,
                        "plan": "Unknown",
                        "next_reset": None
                    }
                })
        return results