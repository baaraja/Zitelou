import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isSignedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isSignedIn) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isSignedIn, loading, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' }}>
      <ActivityIndicator size="large" color="#0ea5e9" />
    </View>
  );
}
