import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import { getQueryHistory } from "../services/chatService";

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
      setHistory(data.history);
    } catch (error) {
      console.error("Failed to load query history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Query History"
      subtitle="Review your previous questions and AI-generated answers."
    >
      <section className="panel">
        <h2>Previous Queries</h2>

        {loading ? (
          <p>Loading query history...</p>
        ) : history.length === 0 ? (
          <p>No query history found.</p>
        ) : (
          <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "18px",
                  background: "#f8fafc",
                }}
              >
                <p style={{ margin: "0 0 8px", color: "#64748b" }}>
                  {new Date(item.created_at).toLocaleString()}
                </p>

                <h3 style={{ margin: "0 0 10px" }}>{item.question}</h3>

                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "#334155",
                    lineHeight: "1.6",
                  }}
                >
                  {item.answer}
                </p>

                <p style={{ marginTop: "12px", color: "#64748b" }}>
                  Document ID: {item.document_id || "Deleted document"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default History;