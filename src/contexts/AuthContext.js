import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { message } from "antd";
import { initSocketClient, getSocket } from "../utils/socketClient";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socket, setSocket] = useState(null);

  const validateUserData = useCallback((userData) => {
    console.log("[Auth] Validating user data:", userData);
    if (!userData?.username || !userData?.role || !["ADMIN", "STAFF"].includes(userData.role)) {
      throw new Error("Invalid user data or role");
    }
    return {
      _id: userData.id || userData._id,
      username: userData.username,
      role: userData.role,
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      address: userData.address || "",
      avatar: userData.avatar || "",
    };
  }, []);

  const initSocket = useCallback((userId) => {
    if (!userId) return;
    console.log("[Socket] Initializing socket for userId:", userId);
    const socketInstance = initSocketClient(setSocket);
    socketInstance.on("connect", () => {
      console.log("[Socket] Connected");
      setSocketInitialized(true);
    });
    socketInstance.on("connect_error", (err) => {
      console.error("[Socket] Connect error:", err);
      setSocketInitialized(false);
      setSocket(null);
    });
    socketInstance.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      setSocketInitialized(false);
      setSocket(null);
    });
  }, []);

  const refreshAccessToken = useCallback(async (refreshToken) => {
    console.log("[Auth] Refreshing token with refreshToken:", refreshToken);
    const { data } = await axios.post(`${API_URL}/users/refresh-token`, { refreshToken });
    const accessToken = data.data.accessToken?.replace(/^Bearer\s+/, "");
    console.log("[Auth] New accessToken received:", accessToken);
    if (!accessToken) throw new Error("No access token");
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      console.log("[Auth] Initializing authentication...");
      try {
        const userData = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("[Auth] LocalStorage userData:", userData);
        console.log("[Auth] accessToken:", accessToken);
        console.log("[Auth] refreshToken:", refreshToken);

        if (!userData || (!accessToken && !refreshToken)) {
          console.log("[Auth] No valid session found.");
          setUser(null);
          setSocketInitialized(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        const normalizedUser = validateUserData(parsedUser);

        if (!accessToken && refreshToken) {
          await refreshAccessToken(refreshToken);
        }

        setUser(normalizedUser);

        if (normalizedUser._id && !socket?.connected) {
          initSocket(normalizedUser._id);
        }
      } catch (error) {
        console.error("[Auth] Error initializing authentication:", error);
        localStorage.clear();
        setUser(null);
        setSocketInitialized(false);
        message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      const socket = getSocket();
      if (socket) {
        console.log("[Auth] Cleaning up socket on unmount");
        socket.disconnect();
        setSocketInitialized(false);
        setSocket(null);
      }
    };
  }, [validateUserData, initSocket, refreshAccessToken]);

  const login = useCallback(
    async (data) => {
      try {
        console.log("[Auth] Logging in with data:", data);
        const userData = data.userData || data;
        const normalizedUser = validateUserData(userData);

        const accessToken = data.accessToken?.replace(/^Bearer\s+/, "");
        const refreshToken = data.refreshToken?.replace(/^Bearer\s+/, "");

        if (!accessToken || !refreshToken) throw new Error("Missing tokens");

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        setUser(normalizedUser);
        initSocket(normalizedUser._id);
        message.success("Đăng nhập thành công");
      } catch (error) {
        console.error("[Auth] Login failed:", error);
        message.error("Đăng nhập thất bại");
        throw error;
      }
    },
    [validateUserData, initSocket]
  );

  const logout = useCallback(() => {
    console.log("[Auth] Logging out");
    localStorage.clear();
    setUser(null);
    setSocketInitialized(false);
    const socket = getSocket();
    if (socket) {
      console.log("[Auth] Disconnecting socket...");
      socket.disconnect();
    }
    setSocket(null);
    message.success("Đăng xuất thành công");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, socketInitialized, socket }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
