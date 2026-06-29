from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.embedding_service import generate_embedding
from app.services.vector_service import search_similar_chunks


router = APIRouter(prefix="/api/chat", tags=["Chat"])

class QuestionRequest(BaseModel):
    question: str
    document_id: int | None = None

@router.post("/search")
def semantic_search(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    query_embedding = generate_embedding(request.question)

    results = search_similar_chunks(
        query_embedding=query_embedding,
        top_k=3,
        document_id=request.document_id
    )

    return {
        "question": request.question,
        "results": results
    }