import { createI18n } from 'vue-i18n';
import en from './locales/en';
import vi from './locales/vi';

const messages = {
	en,
	vi,
};

const i18n = createI18n({
	legacy: false, // Use for composition API
	locale: 'en',
	fallbackLocale: 'en',
	messages,
});

export default i18n;
