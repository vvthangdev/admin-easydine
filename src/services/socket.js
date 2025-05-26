import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

let socket = null;

export const connectSocket = (token) => {
    console.log('[socket.js] connectSocket called with token:', token ? token.slice(0, 10) + '...' : 'missing');
    
    if (socket && socket.connected) {
        console.log('[socket.js] Socket already connected, reusing Socket ID:', socket.id);
        return socket;
    }

    console.log('[socket.js] Creating new socket instance');
    socket = io(SOCKET_URL, {
        auth: {
            token: `Bearer ${token}`,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        console.log('[socket.js] Connected to Socket.IO server, Socket ID:', socket.id);
    });

    socket.on("connect_error", (error) => {
        console.error('[socket.js] Socket connect_error:', error.message, 'Socket ID:', socket?.id || 'none');
    });

    socket.on("disconnect", () => {
        console.log('[socket.js] Disconnected from Socket.IO server, Socket ID:', socket?.id || 'none');
    });

    socket.on("reconnect_attempt", (attempt) => {
        console.log('[socket.js] Reconnect attempt:', attempt, 'Socket ID:', socket?.id || 'none');
    });

    socket.on("reconnect", (attempt) => {
        console.log('[socket.js] Reconnected to Socket.IO server after', attempt, 'attempts, Socket ID:', socket.id);
    });

    console.log('[socket.js] Socket instance created, Socket ID:', socket.id || 'pending');
    return socket;
};

export const disconnectSocket = () => {
    console.log('[socket.js] disconnectSocket called');
    if (socket) {
        console.log('[socket.js] Disconnecting socket, Socket ID:', socket.id);
        socket.disconnect();
        socket = null;
        console.log('[socket.js] Socket disconnected and cleared');
    } else {
        console.log('[socket.js] No socket to disconnect');
    }
};

export const getSocket = () => {
    console.log('[socket.js] getSocket called');
    if (!socket) {
        console.log('[socket.js] Socket not initialized');
    } else {
        console.log('[socket.js] Returning socket, Socket ID:', socket.id, 'Connected:', socket.connected);
    }
    return socket;
};