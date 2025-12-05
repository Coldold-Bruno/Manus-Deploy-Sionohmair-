import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

/**
 * LanguageChangeIndicator - Affiche un badge élégant lors du changement de langue
 * 
 * Fonctionnalités :
 * - Animation d'entrée/sortie fluide avec CSS
 * - Badge avec le nom de la langue sélectionnée
 * - Icône de confirmation
 * - Disparition automatique après 2 secondes
 * 
 * Note : Utilise CSS transitions au lieu de Framer Motion pour éviter les erreurs NotFoundError sur mobile
 */
export function LanguageChangeIndicator() {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const languageNames: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch'
  };

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      // Nettoyer le timer précédent s'il existe
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setCurrentLang(lng);
      setIsVisible(true);

      // Masquer après 2 secondes
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Ne rien rendre si invisible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
      }`}
      style={{
        animation: isVisible ? 'slideInDown 0.3s ease-out' : 'slideOutUp 0.3s ease-out'
      }}
    >
      <div className="bg-gradient-to-r from-accent/95 to-accent/90 backdrop-blur-md text-accent-foreground px-6 py-3 rounded-full shadow-2xl border border-accent/20 flex items-center gap-3">
        <div className="animate-spin-slow">
          <Globe className="h-5 w-5" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {languageNames[currentLang] || currentLang}
          </span>
          
          <div className="animate-scale-in">
            <Check className="h-4 w-4 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
