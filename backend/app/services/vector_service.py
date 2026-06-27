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