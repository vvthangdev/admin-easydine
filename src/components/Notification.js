import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import OrderNotification from "./OrderNotification";
import soundOrder from "../assets/notification.mp3"

export default function Notification() {
  const { user, socket, socketInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Hàm phát âm thanh cho đơn hàng mới
  const playNewOrderSound = () => {
    const audio = new Audio(soundOrder); // Đường dẫn tới file âm thanh cho đơn hàng mới
    audio.volume = 1.0; // Điều chỉnh âm lượng (0.0 đến 1.0)
    audio.play().catch((error) => {
      console.error("Lỗi khi phát âm thanh đơn hàng mới:", error);
    });
  };

  // Xóa thông báo theo id
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Thêm thông báo mới
  const addNotification = (orderData) => {
    const id = Date.now();
    const notification = {
      id,
      orderData,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    playNewOrderSound(); // Phát âm thanh khi có đơn hàng mới
    setTimeout(() => removeNotification(id), 5000); // Tự động xóa sau 5 giây
  };

  useEffect(() => {
    if (!user || !socket || !socketInitialized) {
      return;
    }

    // Lắng nghe sự kiện newOrder
    socket.on("newOrder", (data) => {
      addNotification(data);
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off("newOrder");
    };
  }, [user, socket, socketInitialized]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {notifications.map((notification) => (
        <Box
          key={notification.id}
          sx={{ m: 1, pointerEvents: "auto" }}
        >
          <OrderNotification
            {...notification.orderData}
            onClose={() => removeNotification(notification.id)}
          />
        </Box>
      ))}
    </Box>
  );
}