import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const data = await loginUser(formData.email, formData.password);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.full_name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <img src={logo} alt="RAG Assistant Logo" className="auth-logo" />

        <h1>Enterprise Knowledge Assistant</h1>

        <p>
          Securely upload enterprise documents and ask AI-powered questions
          using Retrieval-Augmented Generation.
        </p>

        <div className="auth-features">
          <div className="auth-feature">✓ AI-powered document search</div>
          <div className="auth-feature">✓ Source-backed responses</div>
          <div className="auth-feature">✓ Secure JWT authentication</div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your workspace.</p>

          <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;