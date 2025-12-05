import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

type Language = 'fr' | 'en' | 'es' | 'de';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

/**
 * Composant SEO pour gérer les meta tags et balises hreflang
 */
export function SEOHead({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOHeadProps) {
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.language as Language;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = `${baseUrl}${location}`;
  
  const basePath = location.replace(/^\/(fr|en|es|de)(\/|$)/, '/');
  
  const alternateUrls: Record<Language, string> = {
    fr: `${baseUrl}/fr${basePath === '/' ? '' : basePath}`,
    en: `${baseUrl}/en${basePath === '/' ? '' : basePath}`,
    es: `${baseUrl}/es${basePath === '/' ? '' : basePath}`,
    de: `${baseUrl}/de${basePath === '/' ? '' : basePath}`,
  };

  const defaultTitle = 'Sionohmair Insight Academy';
  const defaultDescription = 'Transformez votre communication en science de la performance';
  const defaultImage = `${baseUrl}/og-image.png`;

  const finalTitle = title ? `${title} | Sionohmair` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  useEffect(() => {
    document.title = finalTitle;

    const updateMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('description', finalDescription);
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', currentUrl, true);

    // Balises hreflang
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    Object.entries(alternateUrls).forEach(([lang, url]) => {
      const hreflang = document.createElement('link');
      hreflang.setAttribute('rel', 'alternate');
      hreflang.setAttribute('hreflang', lang);
      hreflang.setAttribute('href', url);
      document.head.appendChild(hreflang);
    });
  }, [finalTitle, finalDescription, finalImage, currentUrl, language]);

  return null;
}
