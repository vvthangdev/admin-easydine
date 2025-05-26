import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('accessToken');

    console.log('✅ [ProtectedRoute.js] Checking auth for path:', location.pathname);
    console.log('[ProtectedRoute.js] Loading:', loading);
    console.log('[ProtectedRoute.js] User:', user ? { username: user.username, role: user.role } : 'null');
    console.log('[ProtectedRoute.js] Token:', token ? token.slice(0, 10) + '...' : 'missing');
    console.log('[ProtectedRoute.js] Required roles:', roles || 'none');

    if (loading) {
        console.log('⚠️ [ProtectedRoute.js] Waiting for auth loading');
        return null; // Hoặc component loading
    }

    if (!token || typeof token !== 'string' || token.trim() === '') {
        console.log('❌ [ProtectedRoute.js] No valid accessToken, redirecting to login');
        message.error('Vui lòng đăng nhập');
        localStorage.clear();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user) {
        console.log('❌ [ProtectedRoute.js] No user data, redirecting to login');
        message.error('Vui lòng đăng nhập');
        localStorage.clear();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        console.log('❌ [ProtectedRoute.js] User role not allowed:', user.role, 'Redirecting to unauthorized');
        message.error('Bạn không có quyền truy cập');
        return <Navigate to="/unauthorized" replace />;
    }

    console.log('✅ [ProtectedRoute.js] Access granted for user:', user.username);
    return children;
};

export default ProtectedRoute;