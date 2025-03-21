import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import viTranslation from './locales/vi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
    },
    lng: 'vi', // ngôn ngữ mặc định
    fallbackLng: 'en', // ngôn ngữ dự phòng nếu không tìm thấy bản dịch
    interpolation: {
      escapeValue: false, // không escape các giá trị HTML
    },
  });

export default i18n; 