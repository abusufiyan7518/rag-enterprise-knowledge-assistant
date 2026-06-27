from typing import List

from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> List[float]:
    if not text:
        return []

    embedding = model.encode(text)
    return embedding.tolist()


def generate_embeddings(text_chunks: List[str]) -> List[List[float]]:
    if not text_chunks:
        return []

    embeddings = model.encode(text_chunks)
    return embeddings.tolist()