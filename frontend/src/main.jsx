import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            boxShadow: "0 20px 40px rgba(15,23,42,0.12)",
            fontWeight: "600",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);