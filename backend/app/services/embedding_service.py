from typing import List

import google.generativeai as genai

from app.config import settings


genai.configure(api_key=settings.GEMINI_API_KEY)

EMBEDDING_MODEL = "models/embedding-001"


def generate_embedding(text: str) -> List[float]:
    if not text:
        return []

    response = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_query"
    )

    return response["embedding"]


def generate_embeddings(text_chunks: List[str]) -> List[List[float]]:
    if not text_chunks:
        return []

    embeddings = []

    for chunk in text_chunks:
        response = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=chunk,
            task_type="retrieval_document"
        )

        embeddings.append(response["embedding"])

    return embeddings