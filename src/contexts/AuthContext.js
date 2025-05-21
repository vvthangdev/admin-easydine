import { createContext, useState, useContext, useEffect } from 'react';
import { message, notification } from 'antd';
import { toast } from 'react-toastify';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    if (user && accessToken) {
      try {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser);
        if (parsedUser.role === 'ADMIN') {
          const socket = connectSocket(accessToken);
          socket.on('connect', () => {
            setSocketInitialized(true);
            console.log('Socket initialized in AuthContext, Socket ID:', socket.id);
          });
        }
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.role || user.role !== 'ADMIN' || !socketInitialized) return;

    const socket = getSocket();
    if (!socket) {
      console.log('Socket not available in AuthContext');
      return;
    }

    console.log('AuthContext: Attaching newOrder listener for user:', user.username, 'Socket ID:', socket.id);

    socket.emit('joinAdminRoom', { room: 'adminRoom' });

    const handleNewOrder = (data) => {
      console.log('AuthContext: Received newOrder event:', data, 'Socket ID:', socket.id);
      notification.info({
        message: 'Có Đơn Hàng Mới',
        description: (
          <div>
            <p>{data.message}</p>
            <p><strong>ID Đơn Hàng:</strong> {data.orderId}</p>
            <p><strong>Loại:</strong> {data.type}</p>
            <p><strong>Trạng Thái:</strong> {data.status}</p>
            <p><strong>Thời Gian:</strong> {new Date(data.time).toLocaleString()}</p>
          </div>
        ),
        placement: 'topRight',
        duration: 5,
      });
    };

    socket.on('newOrder', handleNewOrder);

    return () => {
      console.log('AuthContext: Removing newOrder listener for user:', user?.username, 'Socket ID:', socket.id);
      socket.off('newOrder', handleNewOrder);
    };
  }, [user, socketInitialized]);

  const login = (data) => {
    try {
      const userData = data.userData || data;
      if (!userData.username) {
        throw new Error('Thiếu username trong dữ liệu đăng nhập');
      }

      const cleanAccessToken = data.accessToken.replace(/^Bearer\s+/, '');
      const cleanRefreshToken = data.refreshToken.replace(/^Bearer\s+/, '');

      localStorage.setItem('accessToken', cleanAccessToken);
      localStorage.setItem('refreshToken', cleanRefreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      if (userData.role === 'ADMIN') {
        const socket = connectSocket(cleanAccessToken);
        socket.on('connect', () => {
          setSocketInitialized(true);
          console.log('Socket initialized on login, Socket ID:', socket.id);
        });
      }
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
    setSocketInitialized(false);
    disconnectSocket();
    message.success('Đăng xuất thành công');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);