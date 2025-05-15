import { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in when app loads
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setUser({ username: parsedUser }); // Đặt state user nhất quán
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        try {
            // Xử lý dữ liệu từ đăng nhập thông thường hoặc Google OAuth
            const username = data.username || data.userData?.username;
            if (!username) {
                throw new Error('Username is missing in login data');
            }

            // Lưu token và username vào localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(username));

            // Giải mã accessToken để lấy payload
            const token = data.accessToken.split(' ')[1]; // Loại bỏ "Bearer "
            const decoded = jwtDecode(token);
            setUser({ username, ...decoded.payload }); // Lưu username và payload vào state
        } catch (error) {
            console.error('Error during login:', error);
            message.error('Đăng nhập thất bại do lỗi dữ liệu!');
            throw error;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        message.success('Đăng xuất thành công');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);