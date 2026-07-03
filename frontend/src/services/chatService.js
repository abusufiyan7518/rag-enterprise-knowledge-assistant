import api from "../api/axios";

export const askQuestion = async (question, documentId) => {
  const response = await api.post("/api/chat/ask", {
    question,
    document_id: documentId,
  });

  return response.data;
};