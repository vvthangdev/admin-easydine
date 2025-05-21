import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!token || typeof token !== 'string' || token.trim() === '') {
    console.log('No valid accessToken, checking refreshToken');
    if (!refreshToken) {
      message.error('Vui lòng đăng nhập');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Allow Axios interceptor to handle token refresh
    return children;
  }

  if (!user) {
    console.log('No user data, checking refreshToken');
    if (!refreshToken) {
      message.error('Vui lòng đăng nhập');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Allow Axios interceptor to handle token refresh
    return children;
  }

  if (roles && !roles.includes(user.role)) {
    message.error('Bạn không có quyền truy cập');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;