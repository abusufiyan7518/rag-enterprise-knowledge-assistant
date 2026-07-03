import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout
      title="Dashboard"
      subtitle="Manage your enterprise documents and AI knowledge workflow."
    >
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
          <h2>Secure Knowledge Access</h2>
          <p>
            All document access is protected using JWT authentication and
            user-specific ownership authorization.
          </p>
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;