import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage, Language } from '@/contexts/LanguageContext';

/**
 * Hook pour gérer le routing multilingue avec préfixes /fr/, /en/, /es/, /de/
 * 
 * Fonctionnalités :
 * - Détecte la langue depuis l'URL (ex: /en/blog → langue EN)
 * - Redirige automatiquement vers la langue du navigateur si pas de préfixe
 * - Synchronise la langue active avec le contexte LanguageContext
 * - Fournit des helpers pour naviguer avec le bon préfixe de langue
 */
export function useLanguageRouter() {
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();

  // Extraire la langue depuis l'URL
  const getLangFromPath = (path: string): Language | null => {
    const match = path.match(/^\/(fr|en|es|de)(\/|$)/);
    return match ? (match[1] as Language) : null;
  };

  // Retirer le préfixe de langue de l'URL
  const getPathWithoutLang = (path: string): string => {
    return path.replace(/^\/(fr|en|es|de)(\/|$)/, '/');
  };

  // Ajouter le préfixe de langue à un chemin
  const addLangPrefix = (path: string, lang: Language): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  useEffect(() => {
    const langFromUrl = getLangFromPath(location);
    
    if (langFromUrl) {
      // Si l'URL contient une langue, la définir comme langue active
      if (langFromUrl !== language) {
        setLanguage(langFromUrl);
      }
    } else {
      // Si pas de préfixe de langue, rediriger vers la langue active
      const newPath = addLangPrefix(location, language);
      if (newPath !== location) {
        setLocation(newPath, { replace: true });
      }
    }
  }, [location, language]);

  // Helper pour naviguer avec le bon préfixe de langue
  const navigate = (path: string, lang?: Language) => {
    const targetLang = lang || language;
    const newPath = addLangPrefix(path, targetLang);
    setLocation(newPath);
  };

  // Helper pour changer de langue en conservant le chemin actuel
  const switchLanguage = (newLang: Language) => {
    const pathWithoutLang = getPathWithoutLang(location);
    const newPath = addLangPrefix(pathWithoutLang, newLang);
    setLanguage(newLang);
    setLocation(newPath);
  };

  return {
    currentLang: language,
    pathWithoutLang: getPathWithoutLang(location),
    navigate,
    switchLanguage,
    addLangPrefix,
  };
}
