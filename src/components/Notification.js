import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

function Notification() {
  const { user, socket, socketInitialized } = useAuth();

  console.log("[Notification.js] Rendering Notification, user:", user ? user.username : "null", "socket:", socket ? socket.id : "null");

  useEffect(() => {
    if (!user || !socket || !socketInitialized) {
      console.log("[Notification.js] Skipping event listeners: user or socket not ready");
      return;
    }

    console.log("[Notification.js] Setting up socket event listeners for socket:", socket.id);

    socket.on("admintest", (data) => {
      console.log("[Notification.js] Received admintest event:", data);
      toast.success(`Admin test: ${data.message || JSON.stringify(data)}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        theme: "light",
      });
    });

    socket.onAny((event, ...args) => {
      console.log(`[Notification.js] Received event: ${event}, Payload:`, args);
    });

    return () => {
      console.log("[Notification.js] Cleaning up socket listeners");
      socket.off("admintest");
      socket.offAny();
    };
  }, [user, socketInitialized]);

  return null;
}

export default Notification;