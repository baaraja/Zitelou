import { useContext, createContext, useState, useCallback, ReactNode } from 'react';
import { conversationsService, contactsService } from '@/services/api';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isDelivered: boolean;
  isRead: boolean;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
}

interface Conversation {
  id: string;
  contactId: string;
  contact?: { id: string; username: string; avatar?: string };
  lastMessageAt?: string;
  messages?: Message[];
}

interface Contact {
  id: string;
  username: string;
  avatar?: string;
  verified?: boolean;
}

interface MessagesContextType {
  conversations: Conversation[];
  contacts: Contact[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  fetchConversations: () => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<void>;
  fetchContacts: () => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType>({
  conversations: [],
  contacts: [],
  currentConversation: null,
  messages: [],
  loading: false,
  fetchConversations: async () => {},
  fetchConversation: async () => {},
  fetchContacts: async () => {},
  sendMessage: async () => {},
  markAsRead: async () => {},
  deleteConversation: async () => {},
});

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider');
  }
  return context;
};

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await conversationsService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConversation = useCallback(async (conversationId: string) => {
    setLoading(true);
    try {
      const response = await conversationsService.getConversation(conversationId);
      setCurrentConversation(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await contactsService.getContacts();
      setContacts(response.data.map((c: any) => c.contact));
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      try {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            conversationId,
            senderId: '',
            content,
            isDelivered: false,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [],
  );

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await conversationsService.markAsRead(conversationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await conversationsService.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }, []);

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        contacts,
        currentConversation,
        messages,
        loading,
        fetchConversations,
        fetchConversation,
        fetchContacts,
        sendMessage,
        markAsRead,
        deleteConversation,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
