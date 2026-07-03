import { useNavigate, useLocation } from "react-router-dom";
import "../styles/layout.css";

function Layout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload Documents", path: "/upload" },
    { label: "Chat Assistant", path: "/chat" },
    { label: "Query History", path: "/history" },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>RAG Assistant</h2>
          <p>Enterprise Knowledge System</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={
                location.pathname === item.path
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="user-pill">
            {user?.full_name || "User"}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default Layout;