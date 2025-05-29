import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

let socket = null;

export const initSocketClient = (setSocket) => {
  if (socket && socket.connected) {
    console.log(
      "[socketClient.js] Socket already initialized and connected:",
      socket.id
    );
    setSocket(socket);
    return socket;
  }

  const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
  console.log("[socketClient.js] Access token:", token);
  if (!token) {
    console.error("[socketClient.js] No access token found!");
    return null;
  }

  console.log(
    `[socketClient.js] Initializing new socket connection to ${API_URL}`
  );
  socket = io(API_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
    auth: {
      token, // Gửi token trong handshake
    },
  });

  socket.on("connect", () => {
    console.log("[socketClient.js] Connected to socket server:", socket.id);
    setSocket(socket);
  });

  socket.on("connect_error", (error) => {
    console.error("[socketClient.js] Socket connection error:", error.message);
    if (error.message === "Invalid token") {
      console.log(
        "[socketClient.js] Invalid token, removing accessToken and redirecting to login"
      );
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    socket = null;
    setSocket(null);
  });

  socket.on("disconnect", () => {
    console.log("[socketClient.js] Disconnected from socket server");
    socket = null;
    setSocket(null);
  });

  socket.on("error", (error) => {
    console.error("[socketClient.js] Server error:", error.message);
    if (error.message === "Invalid token") {
      console.log(
        "[socketClient.js] Invalid token, removing accessToken and redirecting to login"
      );
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  });

  socket.onAny((event, ...args) => {
    console.log(`[socketClient.js] Received event: ${event}, Payload:`, args);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket || !socket.connected) {
    console.error("[socketClient.js] Socket not initialized or not connected!");
    return null;
  }
  return socket;
};

export const sendDataClient = (data) => {
  const socket = getSocket();
  console.log("[socketClient.js] Sending sendDataClient:", data);
  socket.emit("sendDataClient", data);
};

export const sendAdmin = (data) => {
  const socket = getSocket();
  console.log("[socketClient.js] Sending admin:", data);
  socket.emit("admin", data);
};

export const sendAdminTest = (data) => {
  const socket = getSocket();
  console.log("[socketClient.js] Sending admintest:", data);
  socket.emit("admintest", data);
};

export const sendNewOrder = (data) => {
  const socket = getSocket();
  console.log("[socketClient.js] Sending newOrder:", data);
  socket.emit("newOrder", data);
};
