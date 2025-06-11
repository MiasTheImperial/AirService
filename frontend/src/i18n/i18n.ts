import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ru from './locales/ru';
import en from './locales/en';

// Настройка i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
    lng: 'ru', // Русский язык по умолчанию
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

// Инициализация языка из хранилища
export const initLanguage = async () => {
  const stored = await AsyncStorage.getItem('userLanguage');
  const lang = stored || 'ru';
  await i18n.changeLanguage(lang);
  return lang;
};

export const changeLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem('userLanguage', lang);
};

export default i18n; 