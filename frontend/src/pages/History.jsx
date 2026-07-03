import { useEffect, useState } from "react";
import {
  CalendarClock,
  FileText,
  HelpCircle,
  Bot,
  History as HistoryIcon,
} from "lucide-react";

import Layout from "../components/Layout";
import { getQueryHistory } from "../services/chatService";
import "../styles/history.css";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const data = await getQueryHistory();
      setHistory(data.history || []);
    } catch (error) {
      console.error("Failed to load query history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Query History"
      subtitle="Review previous questions, answers, timestamps, and document references."
    >
      <section className="panel history-header-card">
        <h2>Previous Queries</h2>
        <p>
          Every question you ask is stored here with its generated answer and
          document reference.
        </p>
      </section>

      <section className="panel">
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading query history...</p>
        ) : history.length === 0 ? (
          <div className="empty-history">
            <div className="empty-history-icon">
              <HistoryIcon size={32} />
            </div>

            <h3>No query history yet</h3>
            <p>Ask your first question from the Chat Assistant.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <article className="history-card" key={item.id}>
                <div className="history-meta">
                  <div className="history-meta-item">
                    <CalendarClock size={16} />
                    {new Date(item.created_at).toLocaleString()}
                  </div>

                  <div className="document-badge">
                    <FileText size={14} style={{ verticalAlign: "middle" }} />{" "}
                    {item.document_id
                      ? `Document ID: ${item.document_id}`
                      : "Deleted document"}
                  </div>
                </div>

                <div className="history-question">
                  <div className="history-icon question-icon">
                    <HelpCircle size={20} />
                  </div>

                  <div>
                    <h3>{item.question}</h3>
                  </div>
                </div>

                <div className="history-answer">
                  <div className="history-icon answer-icon">
                    <Bot size={20} />
                  </div>

                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default History;