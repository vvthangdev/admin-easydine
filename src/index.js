import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { theme } from "./styles/theme"; // Import theme tùy chỉnh của bạn
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";

// Tạo MUI theme với theme tùy chỉnh
const muiTheme = createTheme({
  ...theme, // Spread theme tùy chỉnh vào MUI theme
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={muiTheme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);