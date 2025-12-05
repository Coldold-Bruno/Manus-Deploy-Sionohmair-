import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export default function SEOHead({
  title,
  description,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = []
}: SEOHeadProps) {
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const defaultTitle = 'Sionohmair Insight Academy - L\'Ingénierie du Génie';
  const defaultDescription = 'Maîtrisez le Content Marketing & Copywriting avec la méthodologie Sionohmair. 11 outils IA pour multiplier vos conversions par 3 grâce à l\'élimination des 3 frictions.';
  const defaultImage = 'https://sionacademy-fpekmv2k.manus.space/og-image.jpg';

  // Construire l'URL complète
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = `${baseUrl}${location}`;

  // URLs alternatives pour chaque langue
  const alternateUrls = {
    fr: `${baseUrl}/fr${location.replace(/^\/(fr|en|es|de)/, '')}`,
    en: `${baseUrl}/en${location.replace(/^\/(fr|en|es|de)/, '')}`,
    es: `${baseUrl}/es${location.replace(/^\/(fr|en|es|de)/, '')}`,
    de: `${baseUrl}/de${location.replace(/^\/(fr|en|es|de)/, '')}`
  };

  const finalTitle = title ? `${title} | Sionohmair` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Helper function to update or create meta tags
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

    // Meta tags standards
    updateMetaTag('description', finalDescription);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', language);
    
    // Open Graph
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:locale', language === 'fr' ? 'fr_FR' : language === 'en' ? 'en_US' : language === 'es' ? 'es_ES' : 'de_DE', true);
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);
    
    // Article meta tags (si type = article)
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
      if (author) updateMetaTag('article:author', author, true);
      
      // Nettoyer les anciens tags avant d'en ajouter de nouveaux
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      
      // Ajouter les nouveaux tags
      if (tags && tags.length > 0) {
        tags.forEach(tag => {
          const tagElement = document.createElement('meta');
          tagElement.setAttribute('property', 'article:tag');
          tagElement.setAttribute('content', tag);
          document.head.appendChild(tagElement);
        });
      }
    }

    // Nettoyer les anciennes balises hreflang avant d'en ajouter de nouvelles
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Ajouter les balises hreflang pour chaque langue
    Object.entries(alternateUrls).forEach(([lang, url]) => {
      const hreflang = document.createElement('link');
      hreflang.setAttribute('rel', 'alternate');
      hreflang.setAttribute('hreflang', lang);
      hreflang.setAttribute('href', url);
      document.head.appendChild(hreflang);
    });
    
    // Ajouter x-default pour la langue par défaut (français)
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', alternateUrls.fr);
    document.head.appendChild(xDefault);
    
    // Balise canonical pour éviter le contenu dupliqué
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Cleanup function pour éviter les fuites mémoire
    return () => {
      // Pas besoin de nettoyer les meta tags car ils seront réutilisés
      // Mais on nettoie les tags d'articles qui peuvent s'accumuler
      if (type === 'article') {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      }
    };
  }, [finalTitle, finalDescription, finalImage, currentUrl, language, type, publishedTime, modifiedTime, author, tags]);

  return null;
}
