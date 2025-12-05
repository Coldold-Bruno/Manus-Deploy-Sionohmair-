import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { APP_LOGO } from "@/const";
import LanguageSelector from "@/components/LanguageSelector";
import { NavLink } from "@/components/NavLink";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";

/**
 * ToolHeader - Header de navigation pour les pages d'outils
 * 
 * Affiche :
 * - Logo + nom du site
 * - Sélecteur de langue
 * - Liens vers les outils
 * - Bouton "Essai gratuit" (si non connecté)
 * - Bouton "Mon abonnement" (si connecté)
 */
export function ToolHeader() {
  const { data: user } = trpc.auth.me.useQuery();
  const isAuthenticated = !!user;
  const { i18n } = useTranslation();
  const language = i18n.language;

  return (
    <nav className="border-b bg-background/95 bg-background/98 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <NavLink href="/">
          <div className="flex items-center space-x-3">
            <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-12 w-auto" />
            <span className="font-bold text-xl hidden md:inline">Sionohmair Insight Academy</span>
          </div>
        </NavLink>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <NavLink href="/content-analyzer" className="text-sm font-medium hover:text-accent transition-colors">Analyseur</NavLink>
          <NavLink href="/copy-generator" className="text-sm font-medium hover:text-accent transition-colors">Générateur</NavLink>
          <NavLink href="/avatar-builder" className="text-sm font-medium hover:text-accent transition-colors">Avatar Client</NavLink>
          <NavLink href="/script-analyzer" className="text-sm font-medium hover:text-accent transition-colors">Scripts</NavLink>
          <NavLink href="/frameworks" className="text-sm font-medium hover:text-accent transition-colors">Frameworks</NavLink>
          <NavLink href="/chat-ia" className="text-sm font-medium hover:text-accent transition-colors">Chat IA</NavLink>
          <NavLink href="/templates" className="text-sm font-medium hover:text-accent transition-colors">Templates</NavLink>
          <NavLink href="/exemples" className="text-sm font-medium hover:text-accent transition-colors">Exemples</NavLink>
          <NavLink href="/editor" className="text-sm font-medium hover:text-accent transition-colors">Éditeur</NavLink>
          <NavLink href="/guide" className="text-sm font-medium hover:text-accent transition-colors">Guide</NavLink>
          <NavLink href="/pricing" className="text-sm font-medium hover:text-accent transition-colors">Tarifs</NavLink>
          <NavLink href="/blog" className="text-sm font-medium hover:text-accent transition-colors">Blog</NavLink>
          {isAuthenticated && (
            <NavLink href="/subscription" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
              Mon abonnement
              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full">
                Essai gratuit
              </span>
            </NavLink>
          )}
          {!isAuthenticated && (
            <Button asChild variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold">
              <a href={`/${language}/subscription`} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Essai gratuit (30j)
              </a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
