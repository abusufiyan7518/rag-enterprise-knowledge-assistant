import logging
import os

import fitz
from docx import Document


def extract_text_from_pdf(file_path: str) -> str:
    text_parts = []

    try:
        with fitz.open(file_path) as pdf_document:
            for page in pdf_document:
                text_parts.append(page.get_text())

    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        return ""

    return "\n".join(text_parts).strip()


def extract_text_from_docx(file_path: str) -> str:
    text_parts = []

    try:
        document = Document(file_path)

        for paragraph in document.paragraphs:
            if paragraph.text.strip():
                text_parts.append(paragraph.text)

    except Exception as e:
        logging.error(f"Error extracting text from DOCX: {e}")
        return ""

    return "\n".join(text_parts).strip()


def extract_text(file_path: str) -> str:
    file_extension = os.path.splitext(file_path)[1].lower()

    if file_extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if file_extension == ".docx":
        return extract_text_from_docx(file_path)

    logging.error(f"Unsupported file type : Please upload a PDF or DOCX file. {file_extension}")
    return ""