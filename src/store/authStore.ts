import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState, LoginCredentials } from '../types/api.types';
import { authApi } from '../api';
import { queryClient } from '../utils/queryClient';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const RESTAURANT_KEY = 'restaurant_id';

// Storage abstraction for web compatibility
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setRestaurantId: (id: number) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  restaurantId: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      set({ isLoading: true });

      const [accessToken, refreshToken, userJson, restaurantId] = await Promise.all([
        storage.getItem(ACCESS_TOKEN_KEY),
        storage.getItem(REFRESH_TOKEN_KEY),
        storage.getItem(USER_KEY),
        storage.getItem(RESTAURANT_KEY),
      ]);

      if (accessToken && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          accessToken,
          refreshToken,
          user,
          restaurantId: restaurantId ? parseInt(restaurantId, 10) : user.restaurantId,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  login: async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { accessToken, refreshToken, user } = response.data;
      const restaurantId = user?.restaurantId ?? null;

      const storagePromises: Promise<void>[] = [
        storage.setItem(ACCESS_TOKEN_KEY, accessToken),
        storage.setItem(REFRESH_TOKEN_KEY, refreshToken),
        storage.setItem(USER_KEY, JSON.stringify(user)),
      ];

      if (restaurantId !== null) {
        storagePromises.push(storage.setItem(RESTAURANT_KEY, restaurantId.toString()));
      }

      await Promise.all(storagePromises);

      // Set new auth state - this will trigger component re-renders
      // Since userId is in query keys, new user gets fresh queries
      set({
        accessToken,
        refreshToken,
        user,
        restaurantId,
        isAuthenticated: true,
      });

      // Invalidate all queries to ensure fresh data is fetched
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    // Clear state to log user out
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      restaurantId: null,
      isAuthenticated: false,
    });

    // Clear storage
    try {
      await Promise.all([
        storage.deleteItem(ACCESS_TOKEN_KEY),
        storage.deleteItem(REFRESH_TOKEN_KEY),
        storage.deleteItem(USER_KEY),
        storage.deleteItem(RESTAURANT_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  },

  setRestaurantId: async (id: number) => {
    try {
      await storage.setItem(RESTAURANT_KEY, id.toString());
      set({ restaurantId: id });
    } catch (error) {
      console.error('Error saving restaurant ID:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
