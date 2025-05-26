import { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd";
import { initSocketClient, getSocket } from "../utils/socketClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("[AuthContext.js] Initializing auth");
    const initializeAuth = async () => {
      const userData = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      console.log("[AuthContext.js] userData:", userData ? userData : "missing");
      console.log("[AuthContext.js] accessToken:", accessToken ? accessToken.slice(0, 10) + "..." : "missing");

      if (userData && accessToken) {
        try {
          const parsedUser = JSON.parse(userData);
          const normalizedUser = {
            _id: parsedUser.id || parsedUser._id,
            username: parsedUser.username,
            role: parsedUser.role,
            name: parsedUser.name,
            email: parsedUser.email,
            phone: parsedUser.phone,
            address: parsedUser.address,
            avatar: parsedUser.avatar,
          };
          setUser(normalizedUser);

          if (normalizedUser._id && !socket?.connected) {
            console.log("[AuthContext.js] Initializing socket for user:", normalizedUser.username);
            const socketInstance = initSocketClient(setSocket);

            socketInstance.on("connect", () => {
              console.log("[AuthContext.js] Socket connected:", socketInstance.id);
              setSocketInitialized(true);
            });

            socketInstance.on("connect_error", (error) => {
              console.error("[AuthContext.js] Socket connect error:", error.message);
              setSocketInitialized(false);
              setSocket(null);
            });

            socketInstance.on("disconnect", () => {
              console.log("[AuthContext.js] Socket disconnected");
              setSocketInitialized(false);
              setSocket(null);
            });
          }
        } catch (error) {
          console.error("[AuthContext.js] Error initializing auth:", error.message);
          localStorage.clear();
          setUser(null);
          setSocketInitialized(false);
          message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        }
      } else {
        console.log("[AuthContext.js] No user or accessToken in localStorage");
        setUser(null);
        setSocketInitialized(false);
      }
      console.log("[AuthContext.js] Auth initialization complete");
      setLoading(false);
    };

    initializeAuth();

    return () => {
      try {
        const socket = getSocket();
        if (socket) {
          console.log("[AuthContext.js] Disconnecting socket on unmount");
          socket.disconnect();
          setSocketInitialized(false);
          setSocket(null);
        }
      } catch (error) {
        console.log("[AuthContext.js] No socket to disconnect");
      }
    };
  }, []);

  const login = (data) => {
    try {
      const userData = data.userData || data;
      if (!userData.username) {
        throw new Error("Thiếu username trong dữ liệu đăng nhập");
      }

      const cleanAccessToken = data.accessToken.replace(/^Bearer\s+/, "");
      const cleanRefreshToken = data.refreshToken.replace(/^Bearer\s+/, "");

      const normalizedUser = {
        _id: userData.id || userData._id,
        username: userData.username,
        role: userData.role,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        avatar: userData.avatar,
      };

      console.log("[AuthContext.js] Storing user and tokens in localStorage");
      localStorage.setItem("accessToken", cleanAccessToken);
      localStorage.setItem("refreshToken", cleanRefreshToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      console.log("[AuthContext.js] Setting user:", normalizedUser);
      setUser(normalizedUser);

      if (normalizedUser._id) {
        console.log("[AuthContext.js] Initializing socket on login for user:", normalizedUser.username);
        const socketInstance = initSocketClient((socket) => {
          setSocket(socket);
          setSocketInitialized(socket?.connected || false);
        });

        socketInstance.on("connect", () => {
          console.log("[AuthContext.js] Socket connected on login:", socketInstance.id);
          setSocketInitialized(true);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("[AuthContext.js] Socket connect error on login:", error.message);
          setSocketInitialized(false);
          setSocket(null);
        });

        socketInstance.on("disconnect", () => {
          console.log("[AuthContext.js] Socket disconnected on login");
          setSocketInitialized(false);
          setSocket(null);
        });
      }
    } catch (error) {
      console.error("[AuthContext.js] Login error:", error.message);
      message.error("Đăng nhập thất bại do lỗi dữ liệu!");
      throw error;
    }
  };

  const logout = () => {
    console.log("[AuthContext.js] Logging out");
    localStorage.clear();
    setUser(null);
    setSocketInitialized(false);
    try {
      const socket = getSocket();
      if (socket) {
        console.log("[AuthContext.js] Disconnecting socket on logout");
        socket.disconnect();
        setSocket(null);
      }
    } catch (error) {
      console.log("[AuthContext.js] No socket to disconnect on logout");
    }
    message.success("Đăng xuất thành công");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, socketInitialized, socket }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);