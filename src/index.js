import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { AppleThemeProvider } from "./theme/theme-provider"; // Đường dẫn đúng
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <AppleThemeProvider>
        <App />
      </AppleThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);