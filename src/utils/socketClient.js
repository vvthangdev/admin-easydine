import { io } from "socket.io-client";
import axiosInstance from "../config/axios.config"; // Import axiosInstance để refresh token

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

let socket = null;

export const initSocketClient = (setSocket) => {
  if (socket && socket.connected) {
    setSocket(socket);
    return socket;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy access token");
  }

  socket = io(API_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
    auth: { token },
  });

  socket.on("connect", () => {
    setSocket(socket);
  });

  socket.on("connect_error", async (error) => {
    if (error.message === "Invalid token") {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Không tìm thấy refresh token");

        const response = await axiosInstance.post("/users/refresh-token", { refreshToken });
        const newAccessToken = response.data?.accessToken?.replace(/^Bearer\s+/, "");
       

        localStorage.setItem("accessToken", newAccessToken);
        socket.auth.token = newAccessToken;
        socket.connect();
      } catch (err) {
        localStorage.clear();
        setSocket(null);
        socket = null;
        window.location.href = "/login";
      }
    } else {
      setSocket(null);
      socket = null;
    }
  });

  socket.on("disconnect", () => {
    setSocket(null);
    socket = null;
  });

  socket.on("error", (error) => {
    if (error.message === "Invalid token") {
      localStorage.clear();
      setSocket(null);
      socket = null;
      window.location.href = "/login";
    }
  });

  return socket;
};

export const getSocket = () => {
  if (!socket || !socket.connected) {
    throw new Error("Socket chưa được khởi tạo hoặc đã ngắt kết nối");
  }
  return socket;
};

export const sendDataClient = (data) => {
  const socket = getSocket();
  socket.emit("sendDataClient", data);
};

export const sendAdmin = (data) => {
  const socket = getSocket();
  socket.emit("admin", data);
};

export const sendAdminTest = (data) => {
  const socket = getSocket();
  socket.emit("admintest", data);
};

export const sendNewOrder = (data) => {
  const socket = getSocket();
  socket.emit("newOrder", data);
};