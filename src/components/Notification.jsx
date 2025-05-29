import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import OrderNotification from "./OrderNotification";
import soundOrder from "../assets/notification.mp3";

export default function Notification() {
  const { user, socket, socketInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Hàm phát âm thanh cho đơn hàng mới
  const playNewOrderSound = () => {
    const audio = new Audio(soundOrder);
    audio.volume = 1; // Giữ nguyên âm lượng
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
    console.log(
      "[Notification] Dữ liệu nhận được từ newOrder:",
      JSON.stringify(orderData, null, 2)
    );
    const id = Date.now();
    const notification = {
      id,
      orderData,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    playNewOrderSound(); // Phát âm thanh khi có đơn hàng mới
  };

  useEffect(() => {
    if (!user || !socket || !socketInitialized) {
      console.log(
        "[Notification] Thiếu user, socket hoặc socketInitialized, không đăng ký lắng nghe newOrder"
      );
      return;
    }

    // Lắng nghe sự kiện newOrder
    socket.on("newOrder", (data) => {
      console.log(
        "[Notification] Sự kiện newOrder được kích hoạt với dữ liệu:",
        JSON.stringify(data, null, 2)
      );
      addNotification(data);
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off("newOrder");
    };
  }, [user, socket, socketInitialized, addNotification]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16, // Đặt ở góc trên cùng
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "row", // Sắp xếp theo hàng ngang
        gap: 2, // Khoảng cách giữa các thông báo
        maxWidth: "90vw", // Giới hạn chiều rộng
        overflowX: "auto", // Cho phép cuộn ngang nếu quá nhiều thông báo
      }}
    >
      {notifications.map((notification) => (
        <Box key={notification.id} sx={{ pointerEvents: "auto" }}>
          <OrderNotification
            {...notification.orderData}
            onClose={() => removeNotification(notification.id)}
          />
        </Box>
      ))}
    </Box>
  );
}
