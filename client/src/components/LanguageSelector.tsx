import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [location, setLocation] = useLocation();
  
  const currentLanguage = languages.find(lang => lang.code === language);
  
  // Helper pour changer de langue en conservant le chemin actuel
  const switchLanguage = (newLang: Language) => {
    // Retirer le préfixe de langue actuel
    const pathWithoutLang = location.replace(/^\/(fr|en|es|de)(\/|$)/, '/');
    // Ajouter le nouveau préfixe de langue
    const newPath = `/${newLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    setLanguage(newLang);
    setLocation(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
