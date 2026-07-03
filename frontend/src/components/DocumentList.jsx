import { useEffect, useState } from "react";

import { getDocuments, deleteDocument } from "../services/documentService";

function DocumentList({ refreshKey }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (documentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDocument(documentId);
      await loadDocuments();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to delete document.");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [refreshKey]);

  const loadDocuments = async () => {
    setLoading(true);

    try {
      const data = await getDocuments();
      setDocuments(data.documents);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading documents...</p>;
  }

  return (
    <div>
      <h2>My Documents</h2>

      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
          {documents.map((document) => (
            <div
              key={document.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "16px",
                background: "#f8fafc",
              }}
            >
              <h3 style={{ margin: "0 0 8px" }}>
                {document.original_filename}
              </h3>

              <p style={{ margin: "4px 0", color: "#64748b" }}>
                Type: {document.file_type.toUpperCase()}
              </p>

              <p style={{ margin: "4px 0", color: "#64748b" }}>
                Status: {document.status}
              </p>

              <p style={{ margin: "4px 0", color: "#64748b" }}>
                Uploaded: {new Date(document.uploaded_at).toLocaleString()}
              </p>

              <button
                style={{
                  marginTop: "12px",
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
                onClick={() => handleDelete(document.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;