import { useCallback } from 'react';
import i18n, { Language, languages } from '../i18n';
import { useLanguageStore } from '../store/languageStore';

export const useTranslation = () => {
  const { language, setLanguage, isLoading } = useLanguageStore();

  const t = useCallback(
    (key: string, options?: Record<string, unknown>): string => {
      return i18n.t(key, options);
    },
    [language] // Re-create when language changes to trigger re-renders
  );

  const changeLanguage = useCallback(
    async (lang: Language) => {
      await setLanguage(lang);
    },
    [setLanguage]
  );

  return {
    t,
    language,
    changeLanguage,
    languages,
    isLoading,
  };
};

export default useTranslation;
