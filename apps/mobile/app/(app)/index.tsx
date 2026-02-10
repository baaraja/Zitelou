import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { conversationsService, contactsService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';

interface Conversation {
  id: string;
  contactId: string;
  lastMessageAt?: string;
  messages?: any[];
}

interface ContactData {
  [key: string]: { username: string; avatar?: string };
}

export default function ConversationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<ContactData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const [convRes, contactRes] = await Promise.all([
        conversationsService.getConversations(),
        contactsService.getContacts(),
      ]);
      setConversations(convRes.data);
      const contactMap: ContactData = {};
      contactRes.data.forEach((c: any) => {
        contactMap[c.contact.id] = {
          username: c.contact.username,
          avatar: c.contact.avatar,
        };
      });
      setContacts(contactMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getLastMessagePreview = (conv: Conversation) => {
    const lastMsg = conv.messages?.[conv.messages.length - 1];
    return lastMsg?.content?.substring(0, 30) || 'Pas de message';
  };

  const getTime = (date?: string) => {
    if (!date) return '';
    const msgDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - msgDate.getTime()) / 60000);
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return msgDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const contact = contacts[item.contactId];
    if (!contact) return null;
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          router.push({
            pathname: '/(app)/chat/[conversationId]',
            params: { conversationId: item.id },
          })
        }
      >
        <View style={styles.avatarCircle}>
          {contact.avatar ? (
            <Image source={{ uri: contact.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>👤</Text>
          )}
        </View>
        <View style={styles.conversationInfo}>
          <Text style={styles.contactName}>{contact.username}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {getLastMessagePreview(item)}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{getTime(item.lastMessageAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(app)/contacts')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Aucune conversation</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(app)/contacts')}
          >
            <Text style={styles.actionButtonText}>Ajouter un contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      <BottomNav />
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 24,
  },
  conversationInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: '#64748b',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
