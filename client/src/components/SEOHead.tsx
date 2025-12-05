import { Helmet } from 'react-helmet-async';
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

  const locale = language === 'fr' ? 'fr_FR' : language === 'en' ? 'en_US' : language === 'es' ? 'es_ES' : 'de_DE';

  return (
    <Helmet>
      {/* Title */}
      <title>{finalTitle}</title>

      {/* Meta tags standards */}
      <meta name="description" content={finalDescription} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={language} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Article meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Hreflang tags */}
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.fr} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
}
