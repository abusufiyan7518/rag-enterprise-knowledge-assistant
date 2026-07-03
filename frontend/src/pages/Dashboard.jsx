import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  MessageSquareText,
  Database,
  Bot,
  CloudUpload,
  Sparkles,
  History,
} from "lucide-react";

import Layout from "../components/Layout";
import { getDocuments } from "../services/documentService";
import { getQueryHistory } from "../services/chatService";
import "../styles/dashboard.css";

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

  const statCards = [
    {
      label: "Documents",
      value: loading ? "--" : stats.documents,
      note: "Uploaded files",
      icon: FileText,
      bg: "#eff6ff",
      color: "#2563eb",
    },
    {
      label: "Queries",
      value: loading ? "--" : stats.queries,
      note: "AI questions",
      icon: MessageSquareText,
      bg: "#f3e8ff",
      color: "#7c3aed",
    },
    {
      label: "Vector DB",
      value: stats.vectorDb,
      note: "ChromaDB",
      icon: Database,
      bg: "#dcfce7",
      color: "#16a34a",
    },
    {
      label: "LLM",
      value: stats.llm,
      note: "Answer engine",
      icon: Bot,
      bg: "#ffedd5",
      color: "#ea580c",
    },
  ];

  const actions = [
    {
      title: "Upload Documents",
      description:
        "Add PDF or DOCX files and prepare them for semantic retrieval.",
      icon: CloudUpload,
      bg: "#eff6ff",
      color: "#2563eb",
      button: "Upload",
      path: "/upload",
    },
    {
      title: "Ask Questions",
      description:
        "Select a document and ask natural-language questions using RAG.",
      icon: MessageSquareText,
      bg: "#f3e8ff",
      color: "#7c3aed",
      button: "Open Chat",
      path: "/chat",
    },
    {
      title: "Query History",
      description:
        "Review previous questions, answers, timestamps, and document references.",
      icon: History,
      bg: "#dcfce7",
      color: "#16a34a",
      button: "View History",
      path: "/history",
    },
  ];

  return (
    <Layout
      title="Dashboard"
      subtitle="Monitor documents, queries, and AI knowledge workflow."
    >
      <section className="dashboard-hero">
        <div className="hero-card">
          <div className="hero-badge">
            <Sparkles size={16} />
            RAG Knowledge Workspace
          </div>

          <h2>Ask accurate questions from your enterprise documents.</h2>

          <p>
            Upload PDF and DOCX documents, convert them into searchable chunks,
            retrieve relevant context using ChromaDB, and generate source-backed
            answers using Gemini.
          </p>

          <button className="primary-btn" onClick={() => navigate("/upload")}>
            Upload Document
          </button>
        </div>

        <div className="hero-side-card">
          <h3>Current Pipeline</h3>
          <p>
            Upload → Extract Text → Chunk → Embed → Store in ChromaDB → Ask →
            Retrieve → Generate Answer
          </p>
        </div>
      </section>

      <section className="stats-grid-premium">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card-premium" key={card.label}>
              <div className="stat-top">
                <div
                  className="stat-icon"
                  style={{
                    background: card.bg,
                    color: card.color,
                  }}
                >
                  <Icon size={23} />
                </div>
              </div>

              <p className="stat-value">{card.value}</p>
              <p className="stat-label">
                {card.label} · {card.note}
              </p>
            </div>
          );
        })}
      </section>

      <section className="action-grid-premium">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div className="action-card-premium" key={action.title}>
              <div
                className="action-icon"
                style={{
                  background: action.bg,
                  color: action.color,
                }}
              >
                <Icon size={24} />
              </div>

              <h3>{action.title}</h3>
              <p>{action.description}</p>

              <button
                className="primary-btn"
                onClick={() => navigate(action.path)}
              >
                {action.button}
              </button>
            </div>
          );
        })}
      </section>
    </Layout>
  );
}

export default Dashboard;