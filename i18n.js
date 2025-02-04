import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './src/config/locales/en.json';
import translationIT from './src/config/locales/it.json';

const resources = {
  en: {
    translation: translationEN,
  },
  it: {
    translation: translationIT,
  },
};

const defaultLanguage = localStorage.getItem('language');

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
