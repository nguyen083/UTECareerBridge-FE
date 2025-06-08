import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';
import { useSelector } from 'react-redux';

const I18nInitializer = () => {
    const lang = useSelector(state => state.web.lang) || 'en';

    i18n
        .use(initReactI18next)
        .init({
            resources: {
                en: { translation: en },
                vi: { translation: vi },
            },
            lng: lang,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });

    return null; 
};

export default I18nInitializer;
