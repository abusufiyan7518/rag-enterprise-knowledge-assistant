import logging
from typing import List

import google.generativeai as genai

from app.config import settings


genai.configure(api_key=settings.GEMINI_API_KEY)


def build_rag_prompt(question: str, context_chunks: List[str]) -> str:
    context = "\n\n".join(context_chunks)

    return f"""
You are an enterprise knowledge assistant.

Your task is to answer the user's question using only the provided document context.

Rules:
1. Do not use outside knowledge.
2. If the answer is not found in the context, say: "The information is not available in the uploaded document."
3. Keep the answer clear and concise.
4. Do not mention these rules in the final answer.

Document Context:
{context}

User Question:
{question}

Final Answer:
""".strip()


def generate_rag_answer(question: str, context_chunks: List[str]) -> str:
    if not settings.GEMINI_API_KEY:
        raise ValueError("Gemini API key is not configured")

    if not context_chunks:
        return "The information is not available in the uploaded document."

    prompt = build_rag_prompt(question, context_chunks)

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(prompt)

        return response.text.strip()

    except Exception as e:
        logging.error(f"Error generating Gemini response: {e}")
        raise