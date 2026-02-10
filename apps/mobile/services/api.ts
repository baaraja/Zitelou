import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('avatar');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (username: string, pin: string, deviceName: string) =>
    apiClient.post('/auth/register', { username, pin, deviceName }),
  login: (username: string, pin: string, deviceName: string) =>
    apiClient.post('/auth/login', { username, pin, deviceName }),
};

export const usersService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (username?: string, avatar?: string) =>
    apiClient.patch('/users/profile', { username, avatar }),
  deleteProfile: () => apiClient.delete('/users/profile'),
};

export const conversationsService = {
  getConversations: () => apiClient.get('/conversations'),
  getConversation: (conversationId: string) =>
    apiClient.get(`/conversations/${conversationId}`),
  deleteConversation: (conversationId: string) =>
    apiClient.delete(`/conversations/${conversationId}`),
  markAsRead: (conversationId: string) =>
    apiClient.post(`/messages/conversation/${conversationId}/read`, {}),
};

export const messagesService = {
  getMessages: (conversationId: string, limit?: number, offset?: number) =>
    apiClient.get(`/messages/conversation/${conversationId}`, {
      data: { limit, offset },
    }),
  getMessage: (messageId: string) => apiClient.get(`/messages/${messageId}`),
  markAsDelivered: (messageId: string) =>
    apiClient.post(`/messages/${messageId}/delivered`, {}),
  markAsRead: (messageId: string) => apiClient.post(`/messages/${messageId}/read`, {}),
  deleteMessage: (messageId: string) => apiClient.delete(`/messages/${messageId}`),
};

export const contactsService = {
  getContacts: () => apiClient.get('/contacts'),
  addContact: (contactId: string) =>
    apiClient.post('/contacts', { contactId }),
  removeContact: (contactId: string) =>
    apiClient.delete(`/contacts/${contactId}`),
  blockContact: (contactId: string, reason?: string) =>
    apiClient.post(`/contacts/${contactId}/block`, { reason }),
  unblockContact: (contactId: string) =>
    apiClient.delete(`/contacts/${contactId}/block`),
  getBlocked: () => apiClient.get('/contacts/blocked'),
  whitelistContact: (approvedId: string) =>
    apiClient.post(`/contacts/${approvedId}/whitelist`, {}),
  removeFromWhitelist: (approvedId: string) =>
    apiClient.delete(`/contacts/${approvedId}/whitelist`),
  getWhitelisted: () => apiClient.get('/contacts/whitelist'),
};

export default apiClient;
