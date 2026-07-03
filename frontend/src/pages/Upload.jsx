import { useState } from "react";

import Layout from "../components/Layout";
import DocumentList from "../components/DocumentList";
import { uploadDocument } from "../services/documentService";
import LoadingSpinner from "../components/LoadingSpinner";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a PDF or DOCX file.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const data = await uploadDocument(file);

      setMessage(
        `Document uploaded successfully. Total chunks: ${data.document.total_chunks}`
      );

      setFile(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Document upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout
      title="Document Upload"
      subtitle="Upload enterprise documents and prepare them for AI-powered search."
    >
      <section className="panel" style={{ marginBottom: "24px" }}>
        <h2>Upload New Document</h2>
        <p>
          Supported formats: PDF and DOCX. Uploaded documents are processed,
          chunked, embedded, and stored in ChromaDB.
        </p>

        <form onSubmit={handleUpload}>
          <div style={{ margin: "20px 0" }}>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => setFile(event.target.files[0])}
            />
          </div>
      
          <button className="primary-btn" type="submit" disabled={uploading}>
            {uploading ? "Processing..." : "Upload Document"}
          </button>

          {uploading && (
            <div style={{ marginTop: "16px" }}>
              <LoadingSpinner text="Extracting text, generating embeddings, and storing vectors..." />
            </div>
          )}
        </form>

        {message && (
          <p style={{ marginTop: "18px", fontWeight: "600" }}>
            {message}
          </p>
        )}
      </section>

      <section className="panel">
        <DocumentList refreshKey={refreshKey} />
      </section>
    </Layout>
  );
}

export default Upload;