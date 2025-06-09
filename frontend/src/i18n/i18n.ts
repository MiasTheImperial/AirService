import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ru from './locales/ru';

// Настройка i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      ru: {
        translation: ru
      }
    },
    lng: 'ru', // Русский язык по умолчанию
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

// Инициализация языка из хранилища (в этом случае всегда будет русский)
export const initLanguage = async () => {
  // Для совместимости с существующим кодом сохраняем язык в хранилище
  await AsyncStorage.setItem('userLanguage', 'ru');
};

export default i18n; 