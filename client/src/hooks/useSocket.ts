import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl) {
      console.warn('VITE_SOCKET_URL not configured');
      return;
    }

    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      // Only log if it's not a normal disconnection
      if (error.message !== 'xhr poll error') {
        console.log('Connection error:', error.message);
      }
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance.connected) {
        socketInstance.disconnect();
      }
      setSocket(null);
    };
  }, []);

  return { socket, isConnected };
};