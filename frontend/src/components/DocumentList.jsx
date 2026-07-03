import { useEffect, useState } from "react";
import { FileText, Trash2, CheckCircle2, CloudUpload } from "lucide-react";
import toast from "react-hot-toast";

import ConfirmModal from "./ConfirmModal";
import { getDocuments, deleteDocument } from "../services/documentService";

function DocumentList({ refreshKey }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeleteDocument, setSelectedDeleteDocument] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, [refreshKey]);

  const loadDocuments = async () => {
    setLoading(true);

    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteDocument) return;

    try {
      await deleteDocument(selectedDeleteDocument.id);
      toast.success("Document deleted successfully.");
      setSelectedDeleteDocument(null);
      await loadDocuments();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete document.");
    }
  };

  const getFileTheme = (fileType) => {
    const type = fileType?.toLowerCase();

    if (type === "pdf") {
      return {
        label: "PDF",
        background: "linear-gradient(135deg, #fee2e2, #fff1f2)",
        color: "#dc2626",
      };
    }

    if (type === "docx") {
      return {
        label: "DOCX",
        background: "linear-gradient(135deg, #dbeafe, #eef2ff)",
        color: "#2563eb",
      };
    }

    return {
      label: "FILE",
      background: "linear-gradient(135deg, #f1f5f9, #ffffff)",
      color: "#475569",
    };
  };

  if (loading) {
    return <p style={{ color: "#64748b" }}>Loading documents...</p>;
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "22px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "#eff6ff",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={26} />
        </div>

        <div>
          <h2 style={{ margin: 0 }}>My Documents</h2>
          <p style={{ color: "#64748b", margin: "6px 0 0" }}>
            Manage and delete your uploaded enterprise documents.
          </p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="empty-action-card">
          <CloudUpload size={34} color="#2563eb" />
          <h3>No documents uploaded</h3>
          <p>Upload your first PDF or DOCX file to build your knowledge base.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {documents.map((document) => {
            const fileTheme = getFileTheme(document.file_type);

            return (
              <div
                key={document.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "20px",
                  padding: "18px",
                  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "18px",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "18px",
                      background: fileTheme.background,
                      color: fileTheme.color,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: "900",
                      fontSize: "11px",
                      letterSpacing: "0.04em",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.7)",
                    }}
                  >
                    <FileText size={26} />
                    <span style={{ marginTop: "3px" }}>
                      {fileTheme.label}
                    </span>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        margin: "0 0 8px",
                        color: "#0f172a",
                        wordBreak: "break-word",
                      }}
                    >
                      {document.original_filename}
                    </h3>

                    <p style={{ margin: "4px 0", color: "#64748b" }}>
                      {document.file_type?.toUpperCase()} ·{" "}
                      <span style={{ color: "#16a34a", fontWeight: "700" }}>
                        <CheckCircle2
                          size={14}
                          style={{ verticalAlign: "middle" }}
                        />{" "}
                        {document.status}
                      </span>{" "}
                      · {new Date(document.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  style={{
                    border: "1px solid #fecaca",
                    background: "#fff1f2",
                    color: "#dc2626",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                  onClick={() => setSelectedDeleteDocument(document)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedDeleteDocument && (
        <ConfirmModal
          title="Delete Document?"
          message={`Are you sure you want to delete "${selectedDeleteDocument.original_filename}"? This action cannot be undone.`}
          onCancel={() => setSelectedDeleteDocument(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default DocumentList;