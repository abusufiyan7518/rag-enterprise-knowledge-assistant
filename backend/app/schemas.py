from datetime import datetime
from typing import List, Optional
import re

from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str):
        value = value.strip()

        if len(value) < 3:
            raise ValueError("Full name must be at least 3 characters long.")

        if len(value) > 50:
            raise ValueError("Full name cannot exceed 50 characters.")

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise ValueError(
                "Full name can contain only letters and spaces."
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        if not re.search(r"[A-Z]", value):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise ValueError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError(
                "Password must contain at least one special character."
            )

        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True


class SourceResponse(BaseModel):
    filename: Optional[str] = None
    document_id: Optional[int] = None
    chunk_index: Optional[int] = None
    score: Optional[float] = None


class QuestionRequest(BaseModel):
    question: str
    document_id: Optional[int] = None


class AskQuestionResponse(BaseModel):
    query_id: int
    question: str
    answer: str
    sources: List[SourceResponse]


class QueryHistoryResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    document_id: Optional[int] = None
    question: str
    answer: str
    created_at: datetime


class QueryHistoryListResponse(BaseModel):
    total: int
    history: List[QueryHistoryResponse]