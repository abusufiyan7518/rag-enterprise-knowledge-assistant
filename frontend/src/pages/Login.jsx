import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

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
        error.response?.data?.detail ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "22px",
            background: "linear-gradient(135deg,#2563eb,#4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            marginBottom: "24px",
            boxShadow: "0 20px 45px rgba(37,99,235,.30)",
          }}
        >
          <ShieldCheck size={36} />
        </div>

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

              <div
                style={{
                  position: "relative",
                }}
              >
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />

                <input
                  style={{ paddingLeft: "42px" }}
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

              <div
                style={{
                  position: "relative",
                }}
              >
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />

                <input
                  style={{ paddingLeft: "42px" }}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;