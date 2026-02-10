import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Zitelou</Text>
      <Text style={styles.subtitle}>Messagerie sécurisée pour enfants</Text>
      <View style={styles.illustration}>
        <Text style={styles.illustrationText}>💬</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.buttonText}>Créer un compte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.secondaryButtonText}>Se connecter</Text>
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
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
    textAlign: 'center',
  },
  illustration: {
    marginBottom: 60,
  },
  illustrationText: {
    fontSize: 80,
  },
  button: {
    width: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e0f2fe',
  },
  secondaryButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
  },
});
