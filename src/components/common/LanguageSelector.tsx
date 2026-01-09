import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../i18n';

interface LanguageSelectorProps {
  compact?: boolean;
}

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
  uz: '🇺🇿',
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
}) => {
  const { t, language, changeLanguage, languages } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageSelect = async (lang: Language) => {
    await changeLanguage(lang);
    setModalVisible(false);
  };

  const currentLanguage = languages.find((l) => l.code === language);

  if (compact) {
    return (
      <>
        <TouchableOpacity
          style={styles.compactButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.flagText}>{languageFlags[language]}</Text>
        </TouchableOpacity>
        <LanguageModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          currentLanguage={language}
          languages={languages}
          onSelect={handleLanguageSelect}
          t={t}
        />
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorLeft}>
          <View style={styles.iconContainer}>
            <Feather name="globe" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.selectorLabel}>{t('settings.language')}</Text>
            <Text style={styles.selectorValue}>
              {languageFlags[language]} {currentLanguage?.nativeName}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <LanguageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentLanguage={language}
        languages={languages}
        onSelect={handleLanguageSelect}
        t={t}
      />
    </>
  );
};

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: Language;
  languages: { code: Language; name: string; nativeName: string }[];
  onSelect: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onClose,
  currentLanguage,
  languages,
  onSelect,
  t,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  currentLanguage === lang.code && styles.languageItemActive,
                ]}
                onPress={() => onSelect(lang.code)}
              >
                <Text style={styles.flagText}>{languageFlags[lang.code]}</Text>
                <View style={styles.languageInfo}>
                  <Text
                    style={[
                      styles.languageName,
                      currentLanguage === lang.code && styles.languageNameActive,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.languageNameEnglish}>{lang.name}</Text>
                </View>
                {currentLanguage === lang.code && (
                  <Feather name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 24,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectorValue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  languageItemActive: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  languageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  languageNameActive: {
    color: colors.primary,
  },
  languageNameEnglish: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default LanguageSelector;
