import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CloudUpload,
  MessageSquareText,
  History,
  LogOut,
  ShieldCheck,
} from "lucide-react";

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
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Upload Documents",
      path: "/upload",
      icon: CloudUpload,
    },
    {
      label: "Chat Assistant",
      path: "/chat",
      icon: MessageSquareText,
    },
    {
      label: "Query History",
      path: "/history",
      icon: History,
    },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-brand-icon">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h2>RAG Assistant</h2>
            <p>Enterprise Knowledge System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={isActive ? "sidebar-link active" : "sidebar-link"}
                onClick={() => navigate(item.path)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          <div className="user-pill">{user?.full_name || "User"}</div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default Layout;