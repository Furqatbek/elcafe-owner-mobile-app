import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '../types/api.types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const RESTAURANT_KEY = 'restaurant_id';

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setRestaurantId: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  restaurantId: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      set({ isLoading: true });

      const [token, userJson, restaurantId] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(RESTAURANT_KEY),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          token,
          user,
          restaurantId: restaurantId || user.restaurantId,
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

  login: async (token: string, user: User) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
        SecureStore.setItemAsync(RESTAURANT_KEY, user.restaurantId),
      ]);

      set({
        token,
        user,
        restaurantId: user.restaurantId,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
        SecureStore.deleteItemAsync(RESTAURANT_KEY),
      ]);

      set({
        token: null,
        user: null,
        restaurantId: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  setRestaurantId: async (id: string) => {
    try {
      await SecureStore.setItemAsync(RESTAURANT_KEY, id);
      set({ restaurantId: id });
    } catch (error) {
      console.error('Error saving restaurant ID:', error);
      throw error;
    }
  },
}));

export default useAuthStore;
