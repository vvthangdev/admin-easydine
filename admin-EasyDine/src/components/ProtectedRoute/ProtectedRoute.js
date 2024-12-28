// components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {message} from "antd";
import { jwtDecode } from 'jwt-decode';



const ProtectedRoute = ({ children,roles }) => {
    const { user } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return <Navigate to="/login" />;
    }
    try {
        const decoded = jwtDecode(token?.split(' ')?.[1]);


        if (!user) {
            message.error("Please login");
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
        if (roles && !roles.includes(decoded.payload.role)) {
            return <Navigate to="/unauthorized" />;
        }

        return children;

    } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return <Navigate to="/login" />;
    }

};

export default ProtectedRoute;