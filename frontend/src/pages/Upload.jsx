import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import DocumentList from "../components/DocumentList";
import LoadingSpinner from "../components/LoadingSpinner";
import { uploadDocument } from "../services/documentService";

function Upload() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    const isAllowed =
      selectedFile.type === "application/pdf" ||
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx");

    if (!isAllowed) {
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.error("Only PDF and DOCX files are allowed.");
      return;
    }

    setFile(selectedFile);
    toast.success("File selected successfully.");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a PDF or DOCX file.");
      return;
    }

    setUploading(true);

    try {
      const data = await uploadDocument(file);

      toast.success(
        `Document uploaded successfully. Total chunks: ${data.document.total_chunks}`
      );

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Document upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout
      title="Document Upload"
      subtitle="Upload and manage enterprise documents for AI-powered search."
    >
      <section className="panel" style={{ marginBottom: "24px" }}>
        <form onSubmit={handleUpload}>
          <div
            style={{
              minHeight: "250px",
              border: "2px dashed #bfdbfe",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(239,246,255,0.75), rgba(255,255,255,0.95))",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "32px",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "24px",
                background: "#dbeafe",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <CloudUpload size={38} strokeWidth={2.2} />
            </div>

            <h2 style={{ margin: "0 0 8px" }}>
              Drop your file here, or click to browse
            </h2>

            <p style={{ margin: "0 0 20px", color: "#64748b" }}>
              Supports PDF and DOCX files
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </button>

            {file && (
              <p style={{ marginTop: "16px", fontWeight: "800" }}>
                Selected: {file.name}
              </p>
            )}
          </div>

          <div style={{ marginTop: "22px" }}>
            <button className="primary-btn" type="submit" disabled={uploading}>
              {uploading ? "Processing..." : "Upload Document"}
            </button>
          </div>
        </form>

        {uploading && (
          <div style={{ marginTop: "16px" }}>
            <LoadingSpinner text="Extracting text, generating embeddings, and storing vectors..." />
          </div>
        )}
      </section>

      <section className="panel">
        <DocumentList refreshKey={refreshKey} />
      </section>
    </Layout>
  );
}

export default Upload;