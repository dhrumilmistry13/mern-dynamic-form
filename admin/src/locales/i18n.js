import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
i18n.use(HttpApi).use(Backend).use(LanguageDetector).use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
});

export default i18n;
