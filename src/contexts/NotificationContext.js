import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import socket from '../utils/socket';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('orderStatusUpdate', (notification) => {
      console.log('Nhận thông báo:', notification);
      toast.info(`Đơn hàng ${notification.orderId} cập nhật: ${notification.status}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      socket.off('orderStatusUpdate');
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};