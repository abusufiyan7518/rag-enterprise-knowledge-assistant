import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document
from app.services.document_service import extract_text


router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = [".pdf", ".docx"]

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
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

    new_document = Document(
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

    return {
        "message": "Document uploaded successfully",
        "document": {
            "id": new_document.id,
            "original_filename": new_document.original_filename,
            "file_type": new_document.file_type,
            "file_size": new_document.file_size,
            "status": new_document.status,
            "text_preview": extracted_text[:300]
        }
    }


@router.get("/")
def get_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).order_by(Document.id.desc()).all()

    return {
        "total": len(documents),
        "documents": documents
    }