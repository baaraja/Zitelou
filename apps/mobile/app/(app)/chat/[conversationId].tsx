import { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { messagesService, conversationsService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  encryptedContent: string;
  isDelivered: boolean;
  isRead: boolean;
  createdAt: string;
}

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      markAsRead();
    }
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const response = await messagesService.getMessages(conversationId || '');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      if (conversationId) {
        await conversationsService.markAsRead(conversationId);
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId || !user) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId: user.id,
        encryptedContent: messageText,
        isDelivered: false,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;
    const content = item.encryptedContent;
    return (
      <View style={[styles.messageRow, isOwnMessage && styles.ownMessageRow]}>
        <View
          style={[
            styles.messageBubble,
            isOwnMessage && styles.ownMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage && styles.ownMessageText,
            ]}
          >
            {content}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isOwnMessage && styles.ownMessageTime,
              ]}
            >
              {new Date(item.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {isOwnMessage && (
              <Text style={styles.statusIcon}>
                {item.isRead ? '✓✓' : item.isDelivered ? '✓' : '•'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          value={messageText}
          onChangeText={setMessageText}
          placeholderTextColor="#999"
          editable={!sending}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (sending || !messageText.trim()) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={sending || !messageText.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
    paddingTop: 12,
  },
  backButton: {
    fontSize: 32,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  headerSpacer: {
    width: 32,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  ownMessageRow: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '75%',
  },
  ownMessageBubble: {
    backgroundColor: '#0ea5e9',
  },
  messageText: {
    fontSize: 15,
    color: '#1e293b',
  },
  ownMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#64748b',
  },
  ownMessageTime: {
    color: '#cffafe',
  },
  statusIcon: {
    fontSize: 12,
    color: '#cffafe',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0f2fe',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
    backgroundColor: '#f9fafb',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
