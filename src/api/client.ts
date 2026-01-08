import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { config } from '../config/env';

const ACCESS_TOKEN_KEY = 'access_token';

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

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (reqConfig: InternalAxiosRequestConfig) => {
    try {
      const token = await storage.getItem(ACCESS_TOKEN_KEY);
      if (token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from storage:', error);
    }
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and trigger logout
      try {
        await storage.deleteItem(ACCESS_TOKEN_KEY);
      } catch (e) {
        console.error('Error clearing token:', e);
      }
      // The auth store will handle the redirect
    }
    return Promise.reject(error);
  }
);

// Token management utilities
export const setAuthToken = async (token: string): Promise<void> => {
  await storage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await storage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAuthToken = async (): Promise<void> => {
  await storage.deleteItem(ACCESS_TOKEN_KEY);
};

export default apiClient;
