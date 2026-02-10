import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => pathname.includes(route);

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, isActive('index') && styles.navItemActive]}
        onPress={() => router.push('/(app)')}
      >
        <Text style={styles.navIcon}>💬</Text>
        <Text style={[styles.navLabel, isActive('index') && styles.navLabelActive]}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive('contacts') && styles.navItemActive]}
        onPress={() => router.push('/(app)/contacts')}
      >
        <Text style={styles.navIcon}>👥</Text>
        <Text style={[styles.navLabel, isActive('contacts') && styles.navLabelActive]}>Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive('profile') && styles.navItemActive]}
        onPress={() => router.push('/(app)/profile')}
      >
        <Text style={styles.navIcon}>👤</Text>
        <Text style={[styles.navLabel, isActive('profile') && styles.navLabelActive]}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 16,
    paddingTop: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navItemActive: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  navLabelActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
});
