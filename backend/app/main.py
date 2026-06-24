from fastapi import FastAPI

from .database import engine
from .models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RAG Enterprise Knowledge Assistant",
    description="Backend API for RAG-Based Enterprise Knowledge Assistant",
    version="1.0.0"
)


@app.get("/")
def home():
    return {"message": "RAG Enterprise Knowledge Assistant API is running"}


@app.get("/health")
def health_check():
    return {"status": "OK"}