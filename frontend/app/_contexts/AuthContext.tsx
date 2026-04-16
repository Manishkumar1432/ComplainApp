import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';

async function getStoredToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('SecureStore getItem failed:', error);
    return null;
  }
}

async function storeTokenValue(value: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, value);
  } catch (error) {
    console.warn('SecureStore setItem failed:', error);
  }
}

async function removeStoredToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('SecureStore deleteItem failed:', error);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getStoredToken();
      setToken(storedToken);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    setToken(newToken);
    await storeTokenValue(newToken);
  };

  const logout = async () => {
    setToken(null);
    await removeStoredToken();
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Dummy default export so Expo Router does not treat this module as a route
export default function AuthContextScreen() {
  return null;
}