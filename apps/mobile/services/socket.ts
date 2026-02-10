import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const initSocket = async () => {
  const userId = await AsyncStorage.getItem('userId');
  const deviceId = await AsyncStorage.getItem('deviceId');

  if (!socket && userId && deviceId) {
    socket = io(SOCKET_URL, {
      auth: { userId, deviceId },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const socketService = {
  joinConversation: (conversationId: string) => {
    if (socket) {
      socket.emit('join_conversation', { conversationId });
    }
  },
  sendMessage: (conversationId: string, content: string, sharedSecret: string) => {
    if (socket) {
      socket.emit('send_message', { conversationId, content, sharedSecret });
    }
  },
  markAsDelivered: (messageId: string) => {
    if (socket) {
      socket.emit('mark_delivered', { messageId });
    }
  },
  markAsRead: (messageId: string) => {
    if (socket) {
      socket.emit('mark_read', { messageId });
    }
  },
  onMessageReceived: (callback: (message: any) => void) => {
    if (socket) {
      socket.on('message_received', callback);
    }
  },
  onMessageDelivered: (callback: (message: any) => void) => {
    if (socket) {
      socket.on('message_delivered', callback);
    }
  },
  onMessageRead: (callback: (message: any) => void) => {
    if (socket) {
      socket.on('message_read', callback);
    }
  },
};
