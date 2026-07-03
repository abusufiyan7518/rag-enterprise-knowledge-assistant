import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import { getDocuments } from "../services/documentService";
import { askQuestion } from "../services/chatService";
import "../styles/chat.css";

function Chat() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data.documents);

      if (data.documents.length > 0) {
        setSelectedDocument(data.documents[0]);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    if (!selectedDocument) {
      alert("Please select a document first.");
      return;
    }

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await askQuestion(question, selectedDocument.id);

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setQuestion("");
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content:
          error.response?.data?.detail ||
          "Unable to generate an answer. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
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
          <h2>My Documents</h2>
          <p>Select a document before asking a question.</p>

          <div style={{ marginTop: "18px" }}>
            {documents.length === 0 ? (
              <p>No documents uploaded yet.</p>
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
                  <h4>{document.original_filename}</h4>
                  <p>{document.file_type.toUpperCase()} · {document.status}</p>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="chat-panel">
          <h2>
            {selectedDocument
              ? selectedDocument.original_filename
              : "No document selected"}
          </h2>

          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                Select a document and ask a question to begin.
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-bubble">
                    {message.content}

                    {message.sources && (
                      <div className="source-box">
                        Sources:
                        {message.sources.map((source, idx) => (
                          <div key={idx}>
                            {source.filename} · Chunk {source.chunk_index}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
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
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </main>
      </section>
    </Layout>
  );
}

export default Chat;