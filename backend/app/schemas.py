from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str


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