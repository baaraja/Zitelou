import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const PinInput = ({ onComplete }: { onComplete: (pin: string) => void }) => {
  const [pin, setPin] = useState('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.pinContainer}>
      <View style={styles.pinDisplay}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.pinDot}>
            <Text style={styles.pinText}>{pin[i] ? '●' : '○'}</Text>
          </View>
        ))}
      </View>
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.keypadButton}
            onPress={() => handleKeyPress(String(num))}
          >
            <Text style={styles.keypadText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.keypadButton}
          onPress={() => handleKeyPress('0')}
        >
          <Text style={styles.keypadText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keypadButton} onPress={handleDelete}>
          <Text style={styles.keypadText}>⌫</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, pin.length < 6 && styles.buttonDisabled]}
        disabled={pin.length < 6}
        onPress={() => {
          if (pin.length === 6) {
            onComplete(pin);
            setPin('');
          }
        }}
      >
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [showPin, setShowPin] = useState(false);
  const { login, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(app)');
    }
  }, [isSignedIn, router]);

  const handlePinComplete = async (pin: string) => {
    try {
      setIsLoading(true);
      await login(username, pin, 'Mobile Device');
    } catch (error: any) {
      Alert.alert('Erreur', error?.response?.data?.message || 'Identifiants invalides');
      setShowPin(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (showPin) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setShowPin(false)}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Entrez votre code PIN</Text>
        <PinInput onComplete={handlePinComplete} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/(auth)')}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Se connecter</Text>
      <Text style={styles.subtitle}>Accès à ton compte</Text>
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={[styles.button, !username && styles.buttonDisabled]}
        disabled={!username || isLoading}
        onPress={() => setShowPin(true)}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  pinDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  pinText: {
    fontSize: 20,
    color: '#0ea5e9',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
    maxWidth: 300,
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0ea5e9',
  },
});
