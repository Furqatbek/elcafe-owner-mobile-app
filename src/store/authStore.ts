import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState, LoginCredentials } from '../types/api.types';
import { authApi } from '../api';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const RESTAURANT_KEY = 'restaurant_id';

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
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(RESTAURANT_KEY),
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

      await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
        SecureStore.setItemAsync(RESTAURANT_KEY, user.restaurantId.toString()),
      ]);

      set({
        accessToken,
        refreshToken,
        user,
        restaurantId: user.restaurantId,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Try to call logout API (optional, may fail if token expired)
      try {
        await authApi.logout();
      } catch (e) {
        // Ignore logout API errors
      }

      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
        SecureStore.deleteItemAsync(RESTAURANT_KEY),
      ]);

      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        restaurantId: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  setRestaurantId: async (id: number) => {
    try {
      await SecureStore.setItemAsync(RESTAURANT_KEY, id.toString());
      set({ restaurantId: id });
    } catch (error) {
      console.error('Error saving restaurant ID:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
