import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { getDocuments } from "../services/documentService";
import { getQueryHistory } from "../services/chatService";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    documents: 0,
    queries: 0,
    vectorDb: "Active",
    llm: "Gemini",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);

    try {
      const [documentsData, historyData] = await Promise.all([
        getDocuments(),
        getQueryHistory(),
      ]);

      setStats({
        documents: documentsData.total,
        queries: historyData.total,
        vectorDb: "Active",
        llm: "Gemini",
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Dashboard"
      subtitle="Manage your enterprise documents and AI knowledge workflow."
    >
      <section className="content-grid" style={{ marginBottom: "24px" }}>
        <div className="panel">
          <h2>Documents</h2>
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#111827" }}>
            {loading ? "--" : stats.documents}
          </p>
          <p>Total documents uploaded by your account.</p>
        </div>

        <div className="panel">
          <h2>Queries</h2>
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#111827" }}>
            {loading ? "--" : stats.queries}
          </p>
          <p>Total questions asked from your documents.</p>
        </div>

        <div className="panel">
          <h2>Vector DB</h2>
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#16a34a" }}>
            {stats.vectorDb}
          </p>
          <p>ChromaDB is used for semantic retrieval.</p>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <h2>Upload Documents</h2>
          <p>
            Add PDF or DOCX files and convert them into searchable knowledge
            using embeddings and vector storage.
          </p>
          <button className="primary-btn" onClick={() => navigate("/upload")}>
            Upload Document
          </button>
        </div>

        <div className="panel">
          <h2>Ask Questions</h2>
          <p>
            Query your uploaded documents using semantic search and Gemini-based
            RAG answer generation.
          </p>
          <button className="primary-btn" onClick={() => navigate("/chat")}>
            Open Chat
          </button>
        </div>

        <div className="panel">
          <h2>LLM Engine</h2>
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#2563eb" }}>
            {stats.llm}
          </p>
          <p>Gemini is used for final answer generation.</p>
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;