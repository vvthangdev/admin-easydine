import { io } from 'socket.io-client';
import { refreshToken } from '../utils/refreshToken';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const socket = io(API_URL, {
  auth: {
    token: localStorage.getItem('accessToken')
      ? `Bearer ${localStorage.getItem('accessToken')}`
      : null, // Thêm Bearer
  },
});

// Xử lý lỗi xác thực
socket.on('connect_error', async (error) => {
  console.error('Lỗi kết nối Socket.IO:', error.message);
  if (error.message.includes('Authentication error')) {
    try {
      const newToken = await refreshToken();
      const { accessToken } = newToken; // Token thuần
      localStorage.setItem('accessToken', accessToken);

      socket.auth.token = `Bearer ${accessToken}`;
      socket.disconnect().connect();
    } catch (err) {
      console.error('Lỗi làm mới token:', err.message);
      localStorage.clear();
      window.location.href = '/login';
    }
  }
});

export default socket;