import AsyncStorage from '@react-native-async-storage/async-storage';

interface QueuedMessage {
  id: string;
  conversationId: string;
  content: string;
  timestamp: number;
  status: 'pending' | 'sent';
}

const QUEUE_KEY = 'messages_queue';
const DELIVERY_KEY = 'delivery_status';

export const messageQueueService = {
  addToQueue: async (conversationId: string, content: string) => {
    try {
      const queue = await AsyncStorage.getItem(QUEUE_KEY);
      const messages: QueuedMessage[] = queue ? JSON.parse(queue) : [];
      const newMessage: QueuedMessage = {
        id: Date.now().toString(),
        conversationId,
        content,
        timestamp: Date.now(),
        status: 'pending',
      };
      messages.push(newMessage);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(messages));
      return newMessage;
    } catch (error) {
      console.error('Failed to add message to queue:', error);
      throw error;
    }
  },

  getQueue: async (): Promise<QueuedMessage[]> => {
    try {
      const queue = await AsyncStorage.getItem(QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to get queue:', error);
      return [];
    }
  },

  removeFromQueue: async (messageId: string) => {
    try {
      const queue = await AsyncStorage.getItem(QUEUE_KEY);
      if (queue) {
        const messages: QueuedMessage[] = JSON.parse(queue);
        const filtered = messages.filter((m) => m.id !== messageId);
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Failed to remove message from queue:', error);
    }
  },

  clearQueue: async () => {
    try {
      await AsyncStorage.removeItem(QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  },

  setDeliveryStatus: async (messageId: string, status: string) => {
    try {
      const statusMap = await AsyncStorage.getItem(DELIVERY_KEY);
      const map = statusMap ? JSON.parse(statusMap) : {};
      map[messageId] = { status, timestamp: Date.now() };
      await AsyncStorage.setItem(DELIVERY_KEY, JSON.stringify(map));
    } catch (error) {
      console.error('Failed to set delivery status:', error);
    }
  },

  getDeliveryStatus: async (messageId: string) => {
    try {
      const statusMap = await AsyncStorage.getItem(DELIVERY_KEY);
      if (statusMap) {
        const map = JSON.parse(statusMap);
        return map[messageId]?.status || 'pending';
      }
      return 'pending';
    } catch (error) {
      console.error('Failed to get delivery status:', error);
      return 'pending';
    }
  },
};
