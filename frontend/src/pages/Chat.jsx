import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Send,
  Paperclip,
  Bot,
  CloudUpload,
} from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getDocuments } from "../services/documentService";
import { askQuestion } from "../services/chatService";
import "../styles/chat.css";

function Chat() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      const userDocuments = data.documents || [];

      setDocuments(userDocuments);

      if (userDocuments.length > 0) {
        setSelectedDocument(userDocuments[0]);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load documents.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim()) return;

    if (!selectedDocument) {
      toast.error("Please select a document first.");
      return;
    }

    const currentQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await askQuestion(currentQuestion, selectedDocument.id);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.detail ||
            "Unable to generate an answer. Please try again.",
        },
      ]);

      toast.error("Unable to generate answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Chat Assistant"
      subtitle="Ask questions from your uploaded enterprise documents."
    >
      <section className="chat-layout">
        <aside className="document-panel">
          <div className="document-panel-header">
            <div className="document-panel-icon">
              <FileText size={22} />
            </div>

            <div>
              <h2>My Documents</h2>
              <p>Select a document before asking a question.</p>
            </div>
          </div>

          <div className="document-list">
            {documents.length === 0 ? (
              <div className="empty-action-card">
                <CloudUpload size={34} color="#2563eb" />
                <h3>No documents uploaded</h3>
                <p>Upload your first PDF or DOCX file to start chatting.</p>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/upload")}
                >
                  Upload Document
                </button>
              </div>
            ) : (
              documents.map((document) => (
                <div
                  key={document.id}
                  className={
                    selectedDocument?.id === document.id
                      ? "document-card active"
                      : "document-card"
                  }
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="document-card-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h4>{document.original_filename}</h4>
                    <p>
                      {document.file_type.toUpperCase()} · {document.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="chat-panel">
          <div className="chat-header">
            <div>
              <h2>AI Document Chat</h2>
              <p className="chat-subtitle">
                Ask focused questions and get source-backed answers.
              </p>
            </div>

            <div className="selected-document-badge">
              <FileText size={15} />
              {selectedDocument
                ? selectedDocument.original_filename
                : "No document selected"}
            </div>
          </div>

          <div className="messages">
            {messages.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Bot size={34} />
                </div>

                <h3>Start a document conversation</h3>

                <p>
                  {selectedDocument
                    ? "Ask a question about the selected document."
                    : "Upload or select a document to begin."}
                </p>

                {selectedDocument && (
                  <div style={{ marginTop: "16px", color: "#64748b" }}>
                    Try: “Summarize this document” or “What skills are
                    mentioned?”
                  </div>
                )}
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-bubble">
                  {message.content}

                  {message.sources && (
                    <div className="source-box">
                      <div className="source-title">
                        <Paperclip size={14} />
                        Sources
                      </div>

                      {message.sources.map((source, idx) => (
                        <div className="source-item" key={idx}>
                          {source.filename} · Chunk {source.chunk_index}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-bubble">
                  <LoadingSpinner text="Gemini is generating an answer..." />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question about the selected document..."
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? (
                "Thinking..."
              ) : (
                <>
                  <Send size={17} />
                  Send
                </>
              )}
            </button>
          </form>
        </main>
      </section>
    </Layout>
  );
}

export default Chat;