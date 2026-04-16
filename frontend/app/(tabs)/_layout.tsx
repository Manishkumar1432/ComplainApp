import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../_contexts/AuthContext';

export default function TabLayout() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/signup');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!token) {
    return null; // Will redirect
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen name="Home" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="Complaint" options={{ title: "Complaint", tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle" size={size} color={color} /> }} />
      <Tabs.Screen name="Views" options={{ title: "View", tabBarIcon: ({ color, size }) => <Ionicons name="eye" size={size} color={color} /> }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}