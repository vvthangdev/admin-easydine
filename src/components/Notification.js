import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import OrderNotification from "./OrderNotification";
import PaymentNotification from "./PaymentNotification";
import soundOrder from "../assets/notification.mp3";

export default function Notification() {
  const { user, socket, socketInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Hàm phát âm thanh cho thông báo
  const playNotificationSound = () => {
    const audio = new Audio(soundOrder);
    audio.volume = 1;
    audio.play().catch((error) => {
      console.error("[Notification] Lỗi khi phát âm thanh:", error);
    });
  };

  // Xóa thông báo theo id
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Thêm thông báo đơn hàng mới
  const addOrderNotification = (orderData) => {
    console.log("[Notification] Dữ liệu nhận được từ newOrder:", JSON.stringify(orderData, null, 2));
    const id = Date.now();
    const notification = {
      id,
      type: "ORDER",
      orderData,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    playNotificationSound();
  };

  // Thêm thông báo thanh toán thành công
  const addPaymentNotification = (paymentData) => {
    console.log("[Notification] Dữ liệu nhận được từ paymentSuccess:", JSON.stringify(paymentData, null, 2));
    const id = Date.now();
    const notification = {
      id,
      type: "PAYMENT",
      paymentData,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    playNotificationSound();
  };

  useEffect(() => {
    if (!user || !socket || !socketInitialized) {
      console.log("[Notification] Thiếu user, socket hoặc socketInitialized, không đăng ký lắng nghe sự kiện");
      return;
    }

    // Lắng nghe sự kiện newOrder
    socket.on("newOrder", (data) => {
      console.log("[Notification] Sự kiện newOrder được kích hoạt với dữ liệu:", JSON.stringify(data, null, 2));
      addOrderNotification(data);
    });

    // Lắng nghe sự kiện paymentSuccess
    socket.on("paymentSuccess", (data) => {
      console.log("[Notification] Sự kiện paymentSuccess được kích hoạt với dữ liệu:", JSON.stringify(data, null, 2));
      addPaymentNotification(data);
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off("newOrder");
      socket.off("paymentSuccess");
    };
  }, [user, socket, socketInitialized]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        maxWidth: "90vw",
        overflowX: "auto",
      }}
    >
      {notifications.map((notification) => (
        <Box
          key={notification.id}
          sx={{ pointerEvents: "auto" }}
        >
          {notification.type === "ORDER" ? (
            <OrderNotification
              {...notification.orderData}
              onClose={() => removeNotification(notification.id)}
            />
          ) : (
            <PaymentNotification
              {...notification.paymentData}
              onClose={() => removeNotification(notification.id)}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}