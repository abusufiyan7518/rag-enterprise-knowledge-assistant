import { useNavigate } from "react-router-dom";

import "../styles/notfound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          The page you are looking for doesn't exist or has been moved.
        </p>

        <button
          className="notfound-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;