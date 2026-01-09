import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './translations/en';
import ru from './translations/ru';
import uz from './translations/uz';

export type Language = 'en' | 'ru' | 'uz';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uz', name: 'Uzbek', nativeName: "O'zbekcha" },
];

const i18n = new I18n({
  en,
  ru,
  uz,
});

// Set default locale based on device settings
const deviceLocale = Localization.locale.split('-')[0] as Language;
i18n.defaultLocale = 'en';
i18n.locale = ['en', 'ru', 'uz'].includes(deviceLocale) ? deviceLocale : 'en';
i18n.enableFallback = true;

export const setLanguage = (lang: Language) => {
  i18n.locale = lang;
};

export const getCurrentLanguage = (): Language => {
  return i18n.locale as Language;
};

export const t = (key: string, options?: Record<string, unknown>) => {
  return i18n.t(key, options);
};

export default i18n;
