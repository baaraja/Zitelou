import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { WebView } from 'react-native-webview';

const JITSI_DOMAIN = 'meet.jit.si';

export default function VideoCallScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const [roomUrl, setRoomUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId && user) {
      const roomId = `call-${conversationId}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
      const url = `https://${JITSI_DOMAIN}/${roomId}?userInfo.displayName=${encodeURIComponent(user.username || 'User')}`;
      setRoomUrl(url);
      setLoading(false);
    }
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
      <WebView
        source={{ uri: roomUrl }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
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
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
});
