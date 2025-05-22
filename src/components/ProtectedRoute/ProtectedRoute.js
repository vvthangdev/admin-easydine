import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.log('No valid accessToken, checking refreshToken');
      if (!refreshToken) {
        message.error('Vui lòng đăng nhập');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } else if (!user) {
      console.log('No user data, checking refreshToken');
      if (!refreshToken) {
        message.error('Vui lòng đăng nhập');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } else if (roles && !roles.includes(user.role)) {
      message.error('Bạn không có quyền truy cập');
    }
  }, [token, refreshToken, user, roles]);

  if (!token || typeof token !== 'string' || token.trim() === '') {
    if (!refreshToken) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  if (!user) {
    if (!refreshToken) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;