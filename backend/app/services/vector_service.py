import os
from typing import List

import chromadb


CHROMA_DB_PATH = "chroma_db"
COLLECTION_NAME = "document_chunks"

os.makedirs(CHROMA_DB_PATH, exist_ok=True)

chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME
)


def store_document_chunks(
    document_id: int,
    filename: str,
    chunks: List[str],
    embeddings: List[List[float]]
) -> int:
    if not chunks or not embeddings:
        return 0

    ids = []
    metadatas = []

    for index, chunk in enumerate(chunks):
        ids.append(f"doc_{document_id}_chunk_{index}")

        metadatas.append({
            "document_id": document_id,
            "filename": filename,
            "chunk_index": index
        })

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return len(chunks)


def search_similar_chunks(
    query_embedding: List[float],
    top_k: int = 3,
    document_id: int | None = None
):
    where_filter = None

    if document_id is not None:
        where_filter = {"document_id": document_id}

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_filter
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    search_results = []

    for index, document in enumerate(documents):
        search_results.append({
            "content": document,
            "metadata": metadatas[index] if index < len(metadatas) else {},
            "score": distances[index] if index < len(distances) else None
        })

    return search_results