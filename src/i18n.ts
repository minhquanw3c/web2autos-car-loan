import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

// Define the type of the message schema for strong typing
export type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'es'>({
	legacy: false, // Use Composition API
	locale: localStorage.getItem('user-locale') || 'en', // Pull language preference from local storage
	fallbackLocale: 'en',
	messages: {
		en,
		es
	}
})

export default i18n
