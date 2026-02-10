import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

export const cryptoService = {
  generateKeyPair: () => {
    const publicKey = CryptoJS.lib.WordArray.random(32).toString();
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    return { publicKey, privateKey };
  },

  encryptMessage: (message: string, sharedSecret: string) => {
    const encrypted = CryptoJS.AES.encrypt(message, sharedSecret).toString();
    return encrypted;
  },

  decryptMessage: (encryptedMessage: string, sharedSecret: string) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, sharedSecret).toString(
      CryptoJS.enc.Utf8,
    );
    return decrypted;
  },

  storePrivateKey: async (deviceId: string, privateKey: string) => {
    try {
      await SecureStore.setItemAsync(`privateKey_${deviceId}`, privateKey);
    } catch (error) {
      console.error('Failed to store private key:', error);
    }
  },

  getPrivateKey: async (deviceId: string) => {
    try {
      return await SecureStore.getItemAsync(`privateKey_${deviceId}`);
    } catch (error) {
      console.error('Failed to get private key:', error);
      return null;
    }
  },
};
