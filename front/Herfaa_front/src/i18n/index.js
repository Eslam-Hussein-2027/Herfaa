import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar.json'
import en from './en.json'

const saved = localStorage.getItem('herfaa_lang') || 'ar'

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: saved,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
})

function applyDirection(lng) {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
}

applyDirection(saved)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('herfaa_lang', lng)
  applyDirection(lng)
})

export default i18n
