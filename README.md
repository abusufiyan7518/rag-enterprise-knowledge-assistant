# RAG-Based Enterprise Knowledge Assistant

An AI-powered Enterprise Knowledge Assistant built using FastAPI, PostgreSQL, ChromaDB, Sentence Transformers, and Google's Gemini API.

The application enables users to upload enterprise documents (PDF/DOCX), automatically extracts and indexes their content using vector embeddings, and answers user questions through Retrieval-Augmented Generation (RAG). Responses are generated using only the retrieved document context, ensuring accurate and context-aware answers.

---

# Project Overview

Traditional keyword-based search struggles to answer natural language questions from large enterprise documents.

This project solves that problem by implementing a complete RAG pipeline:

- Upload enterprise documents
- Extract document text
- Split text into semantic chunks
- Generate embeddings
- Store embeddings in ChromaDB
- Retrieve relevant chunks using semantic search
- Generate AI-powered answers using Gemini
- Maintain query history
- Return source references with every response

---

# Features

### Authentication
- User Registration
- User Login
- Password Hashing using bcrypt

### Document Management
- Upload PDF documents
- Upload DOCX documents
- Automatic text extraction
- File metadata storage

### Document Processing
- Intelligent text chunking
- Embedding generation using Sentence Transformers
- ChromaDB vector storage

### Semantic Search
- Query embedding generation
- Similarity search
- Document-level filtering
- Top-k chunk retrieval

### RAG Answer Generation
- Gemini API Integration
- Prompt Engineering
- Context Injection
- AI-generated answers
- Source citations

### Query History
- Store user questions
- Store AI responses
- Timestamp tracking
- History retrieval

### Production Features
- Structured API Responses
- Response Models
- Error Handling
- Validation
- Environment Variable Configuration

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Backend | FastAPI |
| Frontend | React.js |
| Database | PostgreSQL |
| Vector Database | ChromaDB |
| Embedding Model | Sentence Transformers (all-MiniLM-L6-v2) |
| LLM | Gemini 2.5 Flash |
| ORM | SQLAlchemy |
| Authentication | Passlib (bcrypt) |
| API Documentation | Swagger UI |

---

# System Architecture

```
User
 │
 ▼
Upload PDF/DOCX
 │
 ▼
Text Extraction
 │
 ▼
Chunk Generation
 │
 ▼
Embedding Generation
 │
 ▼
ChromaDB
 │
 ▼
User Question
 │
 ▼
Question Embedding
 │
 ▼
Semantic Search
 │
 ▼
Relevant Chunks
 │
 ▼
Gemini API
 │
 ▼
Final Answer
 │
 ▼
Source References
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|--------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

## Documents

| Method | Endpoint |
|--------|----------|
| POST | /api/documents/upload |

## Chat

| Method | Endpoint |
|--------|----------|
| POST | /api/chat/search |
| POST | /api/chat/ask |
| GET | /api/chat/history |

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
GEMINI_API_KEY=
GEMINI_MODEL=
```

---

# Local Setup

```bash
git clone <repository-url>

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

# Project Status

Current Development Progress:

- Authentication
- PostgreSQL Integration
- Document Upload
- PDF/DOCX Processing
- Text Chunking
- Embedding Generation
- ChromaDB Integration
- Semantic Search
- Gemini Integration
- RAG Answer Generation
- Query History
- Response Models
- Production Error Handling

---

# Future Improvements

- Conversation Memory
- Multi-document Search
- Role-based Access Control
- JWT Authentication
- Streaming Responses
- Document Deletion
- Conversation Sessions
- Docker Deployment
- CI/CD Pipeline
- Unit Testing

---

# Author

**Abusufiyan**

MCA Student | Python Backend Developer

Built as part of the internship project at **PY Digital Services Pvt. Ltd.**