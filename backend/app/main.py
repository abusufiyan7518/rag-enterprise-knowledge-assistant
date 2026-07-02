from fastapi import FastAPI

from .database import engine
from .models import Base
from .routes import auth_routes, document_routes, chat_routes

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RAG Enterprise Knowledge Assistant",
    version="1.0.0",
    description="Backend API for RAG-Based Enterprise Knowledge Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(document_routes.router)
app.include_router(chat_routes.router)


@app.get("/")
def home():
    return {"message": "RAG Enterprise Knowledge Assistant API is running"}


@app.get("/health")
def health_check():
    return {"status": "OK"}