import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { contactsService } from '@/services/api';

export default function ScanQRScreen() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const startScanning = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const interval = setInterval(() => {
          scanQRCode();
        }, 500);
        return () => {
          clearInterval(interval);
          stream.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        Alert.alert('Erreur', 'Impossible d\'accéder à la caméra');
        router.back();
      }
    };
    if (scanning) {
      startScanning();
    }
  }, [scanning]);

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      // La logique de décodage du QR code nécessiterait une lib
    }
  };

  const handleManualEntry = () => {
    router.push('/(app)/contacts');
  };

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={styles.video}
      />
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Scannez le QR code</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanning(false);
          if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
          }
          router.back();
        }}
      >
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  } as any,
  overlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -60,
    backgroundColor: '#2f95dc',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
