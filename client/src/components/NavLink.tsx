import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * NavLink - Composant de navigation qui gère automatiquement le préfixe de langue
 * 
 * Utilisation:
 * <NavLink href="/content-analyzer">Analyseur</NavLink>
 * 
 * Résultat:
 * - Si langue = 'fr' → /fr/content-analyzer
 * - Si langue = 'en' → /en/content-analyzer
 * - Si langue = 'es' → /es/content-analyzer
 * - Si langue = 'de' → /de/content-analyzer
 */
export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const { i18n } = useTranslation();
  const language = i18n.language;
  
  // Construire l'URL complète avec le préfixe de langue
  // Si l'URL commence par /, ajouter le préfixe de langue
  // Sinon, utiliser l'URL telle quelle (pour les URLs externes)
  const fullHref = href.startsWith('/') ? `/${language}${href}` : href;
  
  return (
    <Link href={fullHref}>
      <a className={className} onClick={onClick}>
        {children}
      </a>
    </Link>
  );
}
