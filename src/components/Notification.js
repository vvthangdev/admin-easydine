import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import PaymentNotification from "./PaymentNotification";
import OrderNotification from "./OrderNotification";
import OrderItemsUpdate from "./OrderItemsUpdate";
import soundOrder from "../assets/notification.mp3";

export default function Notification() {
  const { user, socket, socketInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Hàm phát âm thanh
  const playNotificationSound = () => {
    const audio = new Audio(soundOrder);
    audio.volume = 1;
    audio.play().catch((error) => {
      console.error("[Notification] Lỗi khi phát âm thanh:", error);
    });
  };

  // Xóa thông báo
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Thêm thông báo mới, memoized with useCallback
  const addNotification = useCallback(
    (notificationData) => {
      console.log(
        "[Notification] Dữ liệu nhận được:",
        JSON.stringify(notificationData, null, 2)
      );
      const notification = {
        id: notificationData.id || Date.now(),
        ...notificationData,
      };
      setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Giới hạn 5 thông báo
      playNotificationSound();
    },
    [] // Empty dependency array since playNotificationSound is stable
  );

  useEffect(() => {
    console.log("[Notification] useEffect triggered", {
      user: !!user,
      socket: !!socket,
      socketInitialized,
    });
    if (!user || !socket || !socketInitialized) {
      console.log("[Notification] Thiếu user, socket hoặc socketInitialized");
      return;
    }

    console.log("[Notification] Socket ID:", socket.id);
    socket.emit("getRooms", (rooms) => {
      console.log("[Notification] Current rooms:", rooms);
    });

    // Lắng nghe sự kiện "notification"
    socket.on("notification", (data) => {
      console.log(
        "[Notification] Sự kiện notification nhận được:",
        JSON.stringify(data, null, 2)
      );
      addNotification(data);
    });

    // Lắng nghe sự kiện "orderUpdate"
    socket.on("orderUpdate", (data) => {
      console.log(
        "[Notification] Sự kiện orderUpdate nhận được:",
        JSON.stringify(data, null, 2)
      );
      addNotification(data);
    });

    return () => {
      console.log("[Notification] Cleanup socket listeners");
      socket.off("notification");
      socket.off("orderUpdate");
    };
  }, [user, socket, socketInitialized, addNotification]); // Added addNotification to dependencies

  if (notifications.length === 0) {
    console.log("[Notification] Không có thông báo để render");
    return null;
  }

  // Các loại thông báo đơn hàng cho OrderNotification
  const orderNotificationTypes = [
    "CREATE_ORDER",
    "ADD_ITEM",
    "DELETE_ITEM",
    "CANCEL_ORDER",
    "CONFIRM_ORDER",
    "CALL_STAFF",
  ];

  // Các loại thông báo cập nhật món cho OrderItemsUpdate
  const orderItemsUpdateTypes = ["ORDER_ITEMS_UPDATE"];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxHeight: "80vh",
        overflowY: "auto",
        maxWidth: "400px",
      }}
    >
      {notifications.map((notification) => (
        <Box key={notification.id} sx={{ pointerEvents: "auto" }}>
          {notification.type === "PAYMENT_SUCCESS" ? (
            <PaymentNotification
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          ) : orderNotificationTypes.includes(notification.type) ? (
            <OrderNotification
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          ) : orderItemsUpdateTypes.includes(notification.type) ? (
            <OrderItemsUpdate
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          ) : (
            console.log(
              "[Notification] Bỏ qua thông báo không xác định:",
              notification
            )
          )}
        </Box>
      ))}
    </Box>
  );
}