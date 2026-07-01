from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.services.embedding_service import generate_embedding
from app.services.vector_service import search_similar_chunks
from app.services.llm_service import generate_rag_answer

from sqlalchemy.orm import Session
from app.database import get_db
from app.models import QueryHistory


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
def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
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
    query_record = QueryHistory(
        user_id=None,
        document_id=request.document_id,
        question=request.question,
        answer=answer
    )

    db.add(query_record)
    db.commit()
    db.refresh(query_record)

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
        "sources": sources,
        "query_id": query_record.id,
    }

@router.get("/history")
def get_query_history(db: Session = Depends(get_db)):
    history = db.query(QueryHistory).order_by(QueryHistory.id.desc()).all()

    history_data = [
        {
            "id": item.id,
            "user_id": item.user_id,
            "document_id": item.document_id,
            "question": item.question,
            "answer": item.answer,
            "created_at": item.created_at
        }
        for item in history
    ]

    return {
        "total": len(history_data),
        "history": history_data
    } 