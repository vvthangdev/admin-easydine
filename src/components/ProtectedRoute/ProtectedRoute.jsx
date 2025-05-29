import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { message } from "antd";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!token || typeof token !== "string" || token.trim() === "") {
      message.error("Vui lòng đăng nhập");
      localStorage.clear();
      setRedirect(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }

    if (!user) {
      message.error("Vui lòng đăng nhập");
      localStorage.clear();
      setRedirect(<Navigate to="/login" state={{ from: location }} replace />);
      return;
    }

    if (roles && !roles.includes(user.role)) {
      message.error("Bạn không có quyền truy cập");
      setRedirect(<Navigate to="/unauthorized" replace />);
      return;
    }
  }, [loading, token, user, roles, location]);

  if (loading) return null;
  if (redirect) return redirect;

  return children;
};

export default ProtectedRoute;
