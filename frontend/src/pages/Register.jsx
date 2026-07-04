import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, CheckCircle2, XCircle } from "lucide-react";
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

  const nameValidation = useMemo(() => {
    const name = formData.fullName.trim();

    if (!name) return "";
    if (name.length < 3) return "Name must be at least 3 characters.";
    if (name.length > 50) return "Name cannot exceed 50 characters.";
    if (!/^[A-Za-z ]+$/.test(name)) {
      return "Name can contain only letters and spaces.";
    }

    return "";
  }, [formData.fullName]);

  const emailValidation = useMemo(() => {
    const email = formData.email.trim();

    if (!email) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }

    return "";
  }, [formData.email]);

  const passwordRules = useMemo(
    () => [
      {
        label: "Minimum 8 characters",
        isValid: formData.password.length >= 8,
      },
      {
        label: "At least one uppercase letter",
        isValid: /[A-Z]/.test(formData.password),
      },
      {
        label: "At least one lowercase letter",
        isValid: /[a-z]/.test(formData.password),
      },
      {
        label: "At least one number",
        isValid: /\d/.test(formData.password),
      },
      {
        label: "At least one special character",
        isValid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      },
    ],
    [formData.password]
  );

  const isPasswordValid = passwordRules.every((rule) => rule.isValid);

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.password &&
    !nameValidation &&
    !emailValidation &&
    isPasswordValid;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(
        formData.fullName.trim(),
        formData.email.trim(),
        formData.password
      );

      toast.success("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Unable to register. Please try again.");
      } else {
        toast.error(detail || "Unable to register. Please try again.");
      }
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
                  minLength={3}
                  maxLength={50}
                />
              </div>

              {nameValidation && (
                <p className="auth-field-error">{nameValidation}</p>
              )}

              <p className="auth-field-hint">
                Name must be 3-50 characters and contain only letters/spaces.
              </p>
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

              {emailValidation && (
                <p className="auth-field-error">{emailValidation}</p>
              )}
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
                  minLength={8}
                />
              </div>

              <div className="password-rules">
                {passwordRules.map((rule) => (
                  <div
                    key={rule.label}
                    className={
                      rule.isValid
                        ? "password-rule valid"
                        : "password-rule invalid"
                    }
                  >
                    {rule.isValid ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <XCircle size={15} />
                    )}
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading || !isFormValid}
            >
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