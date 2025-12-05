import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

/**
 * LanguageChangeIndicator - Affiche un badge élégant lors du changement de langue
 * 
 * Fonctionnalités :
 * - Animation d'entrée/sortie fluide
 * - Badge avec le nom de la langue sélectionnée
 * - Icône de confirmation
 * - Disparition automatique après 2 secondes
 */
export function LanguageChangeIndicator() {
  const { i18n, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const languageNames: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch'
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleLanguageChange = (lng: string) => {
      // Nettoyer le timer précédent s'il existe
      if (timer) {
        clearTimeout(timer);
      }

      setCurrentLang(lng);
      setIsVisible(true);

      // Masquer après 2 secondes
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25 
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div className="bg-gradient-to-r from-accent/95 to-accent/90 backdrop-blur-md text-accent-foreground px-6 py-3 rounded-full shadow-2xl border border-accent/20 flex items-center gap-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Globe className="h-5 w-5" />
            </motion.div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {languageNames[currentLang] || currentLang}
              </span>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              >
                <Check className="h-4 w-4 text-green-400" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
