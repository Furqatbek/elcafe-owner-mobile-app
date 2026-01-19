import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';
import i18n, { Language, setLanguage as setI18nLanguage } from '../i18n';

const LANGUAGE_KEY = 'app_language';

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
};

interface LanguageStore {
  language: Language;
  isLoading: boolean;
  initialize: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
}

const getDeviceLanguage = (): Language => {
  const locales = getLocales();
  const deviceLocale = locales?.[0]?.languageCode ?? 'en';
  return ['en', 'ru', 'uz'].includes(deviceLocale) ? (deviceLocale as Language) : 'en';
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: getDeviceLanguage(),
  isLoading: true,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const savedLanguage = await storage.getItem(LANGUAGE_KEY);

      if (savedLanguage && ['en', 'ru', 'uz'].includes(savedLanguage)) {
        const lang = savedLanguage as Language;
        setI18nLanguage(lang);
        set({ language: lang, isLoading: false });
      } else {
        const deviceLang = getDeviceLanguage();
        setI18nLanguage(deviceLang);
        set({ language: deviceLang, isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      set({ isLoading: false });
    }
  },

  setLanguage: async (lang: Language) => {
    try {
      await storage.setItem(LANGUAGE_KEY, lang);
      setI18nLanguage(lang);
      set({ language: lang });
    } catch (error) {
      console.error('Error saving language:', error);
      throw error;
    }
  },
}));

export default useLanguageStore;
