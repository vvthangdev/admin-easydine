import { useEffect } from 'react';
import { notification } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { getSocket } from '../services/socket';

const Notification = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit('joinAdminRoom', { room: 'adminRoom' });

    socket.on('newOrder', (data) => {
      notification.info({
        message: 'New Order Received',
        description: (
          <div>
            <p>{data.message}</p>
            <p><strong>Order ID:</strong> {data.orderId}</p>
            <p><strong>Type:</strong> {data.type}</p>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Time:</strong> {new Date(data.time).toLocaleString()}</p>
          </div>
        ),
        placement: 'topRight',
        duration: 5,
      });
    });

    return () => {
      socket.off('newOrder');
    };
  }, [user]);

  return null;
};

export default Notification;