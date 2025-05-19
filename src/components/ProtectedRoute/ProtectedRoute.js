import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  if (!token || typeof token !== 'string' || token.trim() === '') {
    console.log('No valid accessToken, checking refreshToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      message.error('Vui lòng đăng nhập');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Cho phép interceptor xử lý refresh token
    return children;
  }

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token in ProtectedRoute:', decoded);

    if (!user) {
      message.error('Vui lòng đăng nhập');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(decoded.payload.role)) {
      message.error('Bạn không có quyền truy cập');
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      message.error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Cho phép interceptor thử làm mới token
    console.log('Invalid accessToken, but refreshToken exists, proceeding to API call');
    return children;
  }
};

export default ProtectedRoute;