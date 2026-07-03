import api from "../api/axios";

export const askQuestion = async (question, documentId) => {
  const response = await api.post("/api/chat/ask", {
    question,
    document_id: documentId,
  });

  return response.data;
};

export const getQueryHistory = async () => {
  const response = await api.get("/api/chat/history");

  return response.data;
};