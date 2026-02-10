import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '@/components/BottomNav';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          setAvatar(base64);
          await AsyncStorage.setItem('avatar', base64);
          try {
            await updateProfile(user?.username || '', base64);
          } catch (error) {
            console.error('Error saving avatar automatically:', error);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        setAvatar(uri);
        await AsyncStorage.setItem('avatar', uri);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Erreur', 'Le pseudo ne peut pas être vide');
      return;
    }
    setLoading(true);
    try {
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        )}
        <Text style={styles.changeAvatarText}>Changer</Text>
      </TouchableOpacity>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Pseudo"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              setUsername(user?.username || '');
              setAvatar(user?.avatar || '');
              setIsEditing(false);
            }}
          >
            <Text style={styles.secondaryButtonText}>Annuler</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Pseudo</Text>
            <Text style={styles.value}>{username}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.secondaryButtonText}>Modifier</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 24,
    marginTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  avatarText: {
    fontSize: 48,
  },
  changeAvatarText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  dangerButton: {
    backgroundColor: '#ef4444',
  },
});
