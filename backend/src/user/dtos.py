from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
    
)
import re


def validate_password_strength(password: str) -> str:
    """
    Validate password strength.

    Requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """

    password = password.strip()

    if not re.search(r"[A-Z]", password):
        raise ValueError(
            "Password must contain at least one uppercase letter."
        )

    if not re.search(r"[a-z]", password):
        raise ValueError(
            "Password must contain at least one lowercase letter."
        )

    if not re.search(r"\d", password):
        raise ValueError(
            "Password must contain at least one number."
        )

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValueError(
            "Password must contain at least one special character."
        )

    return password


class UserSchema(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="User full name",
        examples=["John Doe"],
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
    )

    confirmPassword: str = Field(
        ...,
        min_length=8,
        max_length=100,
    )


    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):

        value = value.strip()

        if len(value) < 3:
            raise ValueError(
                "Name must contain at least 3 characters."
            )

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise ValueError(
                "Name may only contain letters and spaces."
            )

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
            raise ValueError(
                "Password and Confirm Password do not match."
            )

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
    email: EmailStr = Field(
        ...,
        description="Registered email address",
        examples=["john@example.com"],
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Account password",
    )


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
    """
    Google OAuth Login Request

    The frontend sends the Google ID Token received from
    Google Identity Services.
    """

    token: str = Field(
        ...,
        min_length=10,
        description="Google ID Token",
    )

  


class GithubLoginSchema(BaseModel):
    """
    GitHub OAuth Login Request

    The frontend sends the GitHub Access Token obtained
    after completing the OAuth flow.
    """

    access_token: str = Field(
        ...,
        min_length=10,
        description="GitHub OAuth Access Token",
    )

   
   
class RefreshTokenSchema(BaseModel):
    refresh_token: str = Field(
        ...,
        min_length=10,
        description="Refresh JWT",
    )