import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/context/AuthContext';

export default function MyQRScreen() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      QRCode.toDataURL(user.id, { width: 300 })
        .then((url) => {
          setQrCode(url);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
          setLoading(false);
        });
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
      {qrCode && <Image source={{ uri: qrCode }} style={styles.qrCode} />}
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
  qrCode: {
    width: 300,
    height: 300,
  },
});
