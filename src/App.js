import React from "react";
import AppRoutes from "./routes";
import Notification from "./components/Notification";
import "antd/dist/reset.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./contexts/AuthContext";
import { Buffer } from "buffer";

window.Buffer = Buffer;

function App() {
  const { user, socketInitialized, loading } = useAuth();

  console.log("[App.js] user:", user ? { username: user.username, role: user.role, _id: user._id } : "null");
  console.log("[App.js] socketInitialized:", socketInitialized);
  console.log("[App.js] loading:", loading);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppRoutes />
      <Notification />
      {/* <div style={{ color: user && socketInitialized ? "green" : "red" }}>
        Notification status: {user ? (socketInitialized ? "Rendered with socket" : "No socket connection") : "User not logged in"}
      </div> */}
    </div>
  );
}

export default App;