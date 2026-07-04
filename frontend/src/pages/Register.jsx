import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await registerUser(
        formData.fullName,
        formData.email,
        formData.password
      );

      toast.success("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <img src={logo} alt="RAG Assistant Logo" className="auth-logo" />

        <h1>Build your AI knowledge workspace</h1>

        <p>
          Register to upload documents, generate embeddings, retrieve answers,
          and maintain your query history securely.
        </p>

        <div className="auth-features">
          <div className="auth-feature">✓ PDF and DOCX processing</div>
          <div className="auth-feature">✓ Semantic search with ChromaDB</div>
          <div className="auth-feature">✓ Gemini-powered RAG answers</div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p>Start using your enterprise knowledge assistant.</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;