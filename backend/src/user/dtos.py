# src/user/dtos.py
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)
import re

def validate_password_strength(password: str) -> str:
    password = password.strip()
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        raise ValueError("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValueError("Password must contain at least one special character.")
    return password

class UserSchema(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, examples=["John Doe"])
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    confirmPassword: str = Field(..., min_length=8, max_length=100)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()
        if len(value) < 3:
            raise ValueError("Name must contain at least 3 characters.")
        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise ValueError("Name may only contain letters and spaces.")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr):
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        return validate_password_strength(value)

    @field_validator("confirmPassword")
    @classmethod
    def validate_confirm_password(cls, value: str):
        return validate_password_strength(value)

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.password != self.confirmPassword:
            raise ValueError("Password and Confirm Password do not match.")
        return self

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "Password@123",
                "confirmPassword": "Password@123",
            }
        }
    }

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., min_length=1, max_length=100)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr):
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("Password is required.")
        return value

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "john@example.com",
                "password": "Password@123",
            }
        }
    }

class GoogleLoginSchema(BaseModel):
    token: str = Field(..., min_length=10, description="Google ID Token")

class GithubLoginSchema(BaseModel):
    code: str = Field(..., min_length=10, description="GitHub OAuth authorization code")

class RefreshTokenSchema(BaseModel):
    refresh_token: str = Field(..., min_length=10)
    
    
    
    
    

class RequestPasswordResetSchema(BaseModel):
    email: EmailStr

class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP")

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, value: str):
        # reuse existing password strength validator from security.py
        from src.utils.security import validate_password_strength
        if not validate_password_strength(value):
            raise ValueError("Password does not meet security requirements")
        return value

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class OTPVerificationResponse(BaseModel):
    success: bool
    message: str