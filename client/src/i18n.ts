import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./translations/fr.json";
import en from "./translations/en.json";
import de from "./translations/de.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
    },
    fallbackLng: "fr",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
