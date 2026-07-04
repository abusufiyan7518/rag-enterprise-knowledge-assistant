from typing import List

from google import genai

from app.config import settings


client = genai.Client(api_key=settings.GEMINI_API_KEY)

EMBEDDING_MODEL = "gemini-embedding-001"


def generate_embedding(text: str) -> List[float]:
    if not text:
        return []

    response = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text
    )

    return response.embeddings[0].values


def generate_embeddings(text_chunks: List[str]) -> List[List[float]]:
    if not text_chunks:
        return []

    embeddings = []

    for chunk in text_chunks:
        response = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=chunk
        )

        embeddings.append(response.embeddings[0].values)

    return embeddings