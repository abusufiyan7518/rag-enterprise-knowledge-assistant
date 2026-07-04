import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
} from "lucide-react";
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
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nameValidation = useMemo(() => {
    const name = formData.fullName.trim();

    if (!name) return "Full name is required.";
    if (name.length < 3) return "Name must be at least 3 characters.";
    if (name.length > 50) return "Name cannot exceed 50 characters.";
    if (!/^[A-Za-z ]+$/.test(name)) {
      return "Name can contain only letters and spaces.";
    }

    return "";
  }, [formData.fullName]);

  const emailValidation = useMemo(() => {
    const email = formData.email.trim();

    if (!email) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    return "";
  }, [formData.email]);

  const passwordRules = useMemo(
    () => [
      { label: "8+ characters", isValid: formData.password.length >= 8 },
      { label: "Uppercase letter", isValid: /[A-Z]/.test(formData.password) },
      { label: "Lowercase letter", isValid: /[a-z]/.test(formData.password) },
      { label: "One number", isValid: /\d/.test(formData.password) },
      {
        label: "Special character",
        isValid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      },
    ],
    [formData.password]
  );

  const isPasswordValid = passwordRules.every((rule) => rule.isValid);

  const confirmPasswordValidation =
    formData.confirmPassword && formData.password !== formData.confirmPassword
      ? "Passwords do not match."
      : "";

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword &&
    !nameValidation &&
    !emailValidation &&
    !confirmPasswordValidation &&
    isPasswordValid;

  const shouldShowError = (field) => submitted || touched[field];

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBlur = (event) => {
    setTouched({
      ...touched,
      [event.target.name]: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isFormValid) {
      toast.error("Please complete all required fields correctly.");
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
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              {shouldShowError("fullName") && nameValidation && (
                <p className="auth-field-error">{nameValidation}</p>
              )}
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
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {shouldShowError("email") && emailValidation && (
                <p className="auth-field-error">{emailValidation}</p>
              )}
            </div>

            <div className="auth-field">
              <label>Password</label>

              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Create a password"
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="password-requirements-card">
                <p>Password must include:</p>

                <div className="password-requirements-grid">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={
                        rule.isValid
                          ? "password-requirement valid"
                          : "password-requirement"
                      }
                    >
                      {rule.isValid ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Circle size={14} />
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {shouldShowError("password") && formData.password && !isPasswordValid && (
                <p className="auth-field-error">
                  Password does not meet the required criteria.
                </p>
              )}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>

              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {confirmPasswordValidation && (
                <p className="auth-field-error">{confirmPasswordValidation}</p>
              )}

              {formData.confirmPassword &&
                !confirmPasswordValidation &&
                formData.password && (
                  <p className="auth-field-success">Passwords match.</p>
                )}
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading || !isFormValid}
            >
              {loading ? "Creating Account..." : "Sign Up"}
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