import React from "react";
import { Box, Typography } from "@mui/material";
import AppRoutes from "./routes";
import Notification from "./components/Notification";
import { ToastContainer } from "react-toastify";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./contexts/AuthContext";
import { useAppleStyles } from "./theme/theme-hooks";
import { Buffer } from "buffer";

window.Buffer = Buffer;

function App() {
  const { user, socketInitialized, loading } = useAuth();
  const styles = useAppleStyles();

  if (loading) {
    return (
      <Box sx={styles.card("main")}>
        <Typography variant="h6" sx={{ p: 4 }}>
          Đang tải...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="App" sx={{ textAlign: "center", p: styles.spacing(4) }}>
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
      <AppRoutes /> {/* Header đã được render trong AppRoutes */}
      <Notification />
      <Box sx={styles.status(user && socketInitialized ? "success" : "error")}>
        <Typography variant="caption">
          {user ? (socketInitialized ? "Kết nối socket thành công" : "Không có kết nối socket") : "Người dùng chưa đăng nhập"}
        </Typography>
      </Box>
    </Box>
  );
}

export default App;