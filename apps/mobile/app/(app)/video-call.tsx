import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { socket } from '@/services/socket';

const JITSI_DOMAIN = 'meet.jit.si';

export default function VideoCallScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const [roomUrl, setRoomUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (conversationId && user) {
      const roomId = `call-${conversationId}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
      const url = `https://${JITSI_DOMAIN}/${roomId}?userInfo.displayName=${encodeURIComponent(user.username || 'User')}`;
      setRoomUrl(url);
      setLoading(false);
      if (socket && conversationId) {
        socket.emit('call-start', {
          conversationId,
          from: user.id,
          fromUsername: user.username,
        });
      }
    }

    return () => {
      if (socket && conversationId) {
        socket.emit('call-ended', { conversationId });
      }
    };
  }, [conversationId, user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Initializing call...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      <iframe
        ref={iframeRef}
        src={roomUrl}
        style={styles.iframe as any}
        allow="camera; microphone; display-capture"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  iframe: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
});
