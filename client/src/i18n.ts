import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./translations/fr.json";
import en from "./translations/en.json";
import de from "./translations/de.json";
import es from "./translations/es.json";

// Récupérer la langue depuis localStorage ou depuis l'URL
const getInitialLanguage = (): string => {
  // 1. Vérifier localStorage
  const stored = localStorage.getItem('sionohmair-language');
  if (stored && ['fr', 'en', 'es', 'de'].includes(stored)) {
    return stored;
  }
  
  // 2. Vérifier l'URL
  const urlLang = window.location.pathname.match(/^\/(fr|en|es|de)(\/|$)/)?.[1];
  if (urlLang) {
    return urlLang;
  }
  
  // 3. Vérifier la langue du navigateur
  const browserLang = navigator.language.split('-')[0];
  if (['fr', 'en', 'es', 'de'].includes(browserLang)) {
    return browserLang;
  }
  
  // 4. Langue par défaut
  return 'fr';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
    },
    lng: getInitialLanguage(),
    fallbackLng: "fr",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
