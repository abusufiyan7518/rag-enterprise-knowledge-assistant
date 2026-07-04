from typing import List, Optional

from sentence_transformers import SentenceTransformer


_model: Optional[SentenceTransformer] = None


def get_embedding_model() -> SentenceTransformer:
    global _model

    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


def generate_embedding(text: str) -> List[float]:
    if not text:
        return []

    model = get_embedding_model()
    embedding = model.encode(text, show_progress_bar=False)
    return embedding.tolist()


def generate_embeddings(text_chunks: List[str]) -> List[List[float]]:
    if not text_chunks:
        return []

    model = get_embedding_model()
    embeddings = model.encode(text_chunks, show_progress_bar=False)
    return embeddings.tolist()