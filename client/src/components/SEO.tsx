import { useEffect } from 'react';
import { APP_TITLE } from '@/const';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

export function SEO({
  title,
  description = "Transformez la communication d'un art subjectif en une science de la performance. Méthodologie Sionohmair : éliminez les 3 frictions qui tuent vos messages.",
  image = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
  url,
  type = 'website',
  author = 'Bruno Coldold',
  publishedTime,
  modifiedTime,
  keywords = ['clarté', 'communication', 'conversion', 'PFPMA', 'insight', 'méthodologie', 'performance'],
}: SEOProps) {
  const fullTitle = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);

    // Open Graph meta tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', APP_TITLE, true);
    updateMetaTag('og:locale', 'fr_FR', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', '@brunocoldold');

    // Article-specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      updateMetaTag('article:author', author, true);
      keywords.forEach(keyword => {
        updateMetaTag('article:tag', keyword, true);
      });
    }

    // Canonical URL
    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonicalUrl);
  }, [fullTitle, description, image, canonicalUrl, type, author, publishedTime, modifiedTime, keywords]);

  return null;
}
