import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '@/context/AuthContext';

export default function MyQRScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user?.id && <QRCode value={user.id} size={300} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
