import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document, User
from app.services.document_service import extract_text
from app.services.chunk_service import split_text_into_chunks
from app.services.embedding_service import generate_embeddings
from app.services.vector_service import store_document_chunks

from app.auth import get_current_user


router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = [".pdf", ".docx"]

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_document(file: UploadFile = File(...),db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    original_filename = file.filename
    file_extension = os.path.splitext(original_filename)[1].lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed"
        )

    unique_filename = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    extracted_text = extract_text(file_path)

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail="Text could not be extracted from the uploaded document"
        )

    chunks = split_text_into_chunks(extracted_text)
    embeddings = generate_embeddings(chunks)
    

    new_document = Document(
        user_id=current_user.id,
        filename=unique_filename,
        original_filename=original_filename,
        file_path=file_path,
        file_type=file_extension.replace(".", ""),
        file_size=file_size,
        status="uploaded"
    )
    
    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    stored_chunks = store_document_chunks(
        document_id=new_document.id,
        filename=new_document.original_filename,
        chunks=chunks,
        embeddings=embeddings
    )

    return {
        "message": "Document uploaded successfully",
        "document": {
            "id": new_document.id,
            "original_filename": new_document.original_filename,
            "file_type": new_document.file_type,
            "file_size": new_document.file_size,
            "status": new_document.status,
            "total_chunks": len(chunks),
            "total_embeddings": len(embeddings),
            "embedding_dimension": len(embeddings[0]) if embeddings else 0,
            "stored_chunks": stored_chunks,
            "text_preview": extracted_text[:300]
        }
    }


@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.id.desc())
        .all()
    )

    document_data = [
        {
            "id": document.id,
            "original_filename": document.original_filename,
            "file_type": document.file_type,
            "file_size": document.file_size,
            "status": document.status,
            "uploaded_at": document.uploaded_at
        }
        for document in documents
    ]

    return {
        "total": len(document_data),
        "documents": document_data
    }