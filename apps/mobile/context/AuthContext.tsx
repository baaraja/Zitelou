import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, usersService } from '@/services/api';
import { initSocket } from '@/services/socket';

interface AuthContextType {
  isSignedIn: boolean;
  user: { id: string; username: string; avatar?: string } | null;
  deviceId: string | null;
  loading: boolean;
  register: (username: string, pin: string, deviceName: string) => Promise<void>;
  login: (username: string, pin: string, deviceName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (username?: string, avatar?: string) => Promise<void>;
  handleUnauthorized: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  user: null,
  deviceId: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  handleUnauthorized: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string; avatar?: string } | null>(
    null,
  );
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const avatar = await AsyncStorage.getItem('avatar');
        const dId = await AsyncStorage.getItem('deviceId');

        if (token && userId && username) {
          try {
            await usersService.getProfile();
            setUser({ id: userId, username, avatar: avatar || undefined });
            setDeviceId(dId);
            setIsSignedIn(true);
            await initSocket();
          } catch (error: any) {
            if (error.response?.status === 401) {
              await AsyncStorage.multiRemove([
                'authToken',
                'userId',
                'username',
                'avatar',
                'deviceId',
              ]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore token:', error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const register = async (username: string, pin: string, deviceName: string) => {
    try {
      const response = await authService.register(username, pin, deviceName);
      const { access_token, user: userData, deviceId: newDeviceId } = response.data;

      await AsyncStorage.multiSet([
        ['authToken', access_token],
        ['userId', userData.id],
        ['username', userData.username],
        ['avatar', userData.avatar || ''],
        ['deviceId', newDeviceId],
      ]);

      setUser({ id: userData.id, username: userData.username, avatar: userData.avatar });
      setDeviceId(newDeviceId);
      setIsSignedIn(true);
      await initSocket();
    } catch (error) {
      throw error;
    }
  };

  const login = async (username: string, pin: string, deviceName: string) => {
    try {
      const response = await authService.login(username, pin, deviceName);
      const { access_token, user: userData, deviceId: newDeviceId } = response.data;

      await AsyncStorage.multiSet([
        ['authToken', access_token],
        ['userId', userData.id],
        ['username', userData.username],
        ['avatar', userData.avatar || ''],
        ['deviceId', newDeviceId],
      ]);

      setUser({ id: userData.id, username: userData.username, avatar: userData.avatar });
      setDeviceId(newDeviceId);
      setIsSignedIn(true);
      await initSocket();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'authToken',
        'userId',
        'username',
        'avatar',
        'deviceId',
      ]);
      setIsSignedIn(false);
      setUser(null);
      setDeviceId(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleUnauthorized = async () => {
    await logout();
  };

  const updateProfile = async (username?: string, avatar?: string) => {
    try {
      const response = await usersService.updateProfile(username, avatar);
      const updatedUser = response.data;

      await AsyncStorage.multiSet([
        ['username', updatedUser.username],
        ['avatar', updatedUser.avatar || ''],
      ]);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              username: updatedUser.username,
              avatar: updatedUser.avatar,
            }
          : null,
      );
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        deviceId,
        loading,
        register,
        login,
        logout,
        updateProfile,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
