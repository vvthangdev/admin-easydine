import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) {
    console.log('Socket already connected, reusing Socket ID:', socket.id);
    return socket;
  }

  console.log('Creating new socket instance with token:', token.slice(0, 10) + '...');
  socket = io(SOCKET_URL, {
    auth: {
      token: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Kết nối tới server Socket.IO, Socket ID:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Lỗi kết nối socket:", error.message, "Socket ID:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Ngắt kết nối khỏi server Socket.IO, Socket ID:", socket?.id);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket, Socket ID:', socket.id);
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    console.log('Socket not initialized');
  } else {
    console.log('Getting socket, Socket ID:', socket.id);
  }
  return socket;
};