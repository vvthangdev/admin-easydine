import { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUser({ username: parsedUser });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    try {
      const username = data.username || data.userData?.username;
      if (!username) {
        throw new Error('Username is missing in login data');
      }

      const cleanAccessToken = data.accessToken.replace(/^Bearer\s+/, '');
      const cleanRefreshToken = data.refreshToken.replace(/^Bearer\s+/, '');

      localStorage.setItem('accessToken', cleanAccessToken);
      localStorage.setItem('refreshToken', cleanRefreshToken);
      localStorage.setItem('user', JSON.stringify(username));

      const decoded = jwtDecode(cleanAccessToken);
      setUser({ username, ...decoded.payload });
    } catch (error) {
      message.error('Đăng nhập thất bại do lỗi dữ liệu!');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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