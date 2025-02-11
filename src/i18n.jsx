import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
        },
        lng: 'en', // Ngôn ngữ mặc định
        fallbackLng: 'en', // Sử dụng tiếng Anh nếu ngôn ngữ không tìm thấy
        interpolation: {
            escapeValue: false, // Cho phép HTML trong chuỗi dịch
        },
    });

export default i18n;
