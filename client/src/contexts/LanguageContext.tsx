import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import frTranslations from '../translations/fr.json';
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import deTranslations from '../translations/de.json';

export type Language = 'fr' | 'en' | 'es' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'sionohmair-language';

// Map des traductions statiques
const translationsMap: Record<Language, any> = {
  fr: frTranslations,
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Récupérer la langue depuis localStorage ou utiliser le navigateur
    const stored = localStorage.getItem(STORAGE_KEY) as Language;
    if (stored && ['fr', 'en', 'es', 'de'].includes(stored)) {
      return stored;
    }
    
    // Détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'en', 'es', 'de'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'fr'; // Langue par défaut
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    try {
      const translations = translationsMap[language];
      const keys = key.split('.');
      let value: any = translations;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      if (value === undefined || value === null) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
      
      return String(value);
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
