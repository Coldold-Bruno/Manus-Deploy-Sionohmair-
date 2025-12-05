import { Helmet } from 'react-helmet-async';
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

  return (
    <Helmet>
      {/* Title */}
      <title>{fullTitle}</title>

      {/* Basic meta tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={APP_TITLE} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@brunocoldold" />

      {/* Article-specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && keywords.map(keyword => (
        <meta key={keyword} property="article:tag" content={keyword} />
      ))}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
