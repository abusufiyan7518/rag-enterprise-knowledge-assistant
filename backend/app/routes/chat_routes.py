from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.embedding_service import generate_embedding
from app.services.vector_service import search_similar_chunks
from app.services.llm_service import generate_rag_answer


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

@router.post("/ask")
def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    query_embedding = generate_embedding(request.question)

    search_results = search_similar_chunks(
        query_embedding=query_embedding,
        top_k=3,
        document_id=request.document_id
    )

    context_chunks = [
        result["content"]
        for result in search_results
    ]

    answer = generate_rag_answer(
        question=request.question,
        context_chunks=context_chunks
    )

    sources = [
        {
            "filename": result["metadata"].get("filename"),
            "document_id": result["metadata"].get("document_id"),
            "chunk_index": result["metadata"].get("chunk_index"),
            "score": result["score"]
        }
        for result in search_results
    ]

    return {
        "question": request.question,
        "answer": answer,
        "sources": sources
    }