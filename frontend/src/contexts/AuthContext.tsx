import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../utils/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user?: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(apiUrl('/auth/profile'), {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken,
        },
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getStoredToken();
      if (storedToken) {
        setToken(storedToken);
        await fetchUserProfile(storedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, [fetchUserProfile]);

  const login = useCallback(async (newToken: string, newUser?: UserProfile) => {
    setToken(newToken);
    await storeTokenValue(newToken);

    if (newUser) {
      setUser(newUser);
    } else {
      await fetchUserProfile(newToken);
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    await removeStoredToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
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
