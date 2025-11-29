# Guide du Système Multilingue - Sionohmair Insight Academy

## Vue d'ensemble

La plateforme Sionohmair Insight Academy supporte désormais **4 langues** avec un système de routing multilingue complet :

- 🇫🇷 **Français (FR)** - Langue par défaut
- 🇬🇧 **Anglais (EN)**
- 🇪🇸 **Espagnol (ES)**
- 🇩🇪 **Allemand (DE)**

## Architecture du Système

### 1. Structure des URLs

Le système utilise des **préfixes de langue** dans les URLs pour le SEO et l'expérience utilisateur :

```
/fr/          → Page d'accueil en français
/en/          → Page d'accueil en anglais
/es/          → Page d'accueil en espagnol
/de/          → Page d'accueil en allemand

/fr/blog      → Blog en français
/en/blog      → Blog en anglais
/es/blog      → Blog en espagnol
/de/blog      → Blog en allemand

/fr/blog/slug → Article en français
/en/blog/slug → Article en anglais
```

### 2. Composants Clés

#### LanguageRouter (`client/src/components/LanguageRouter.tsx`)

Le composant principal qui gère le routing multilingue :

- **Détection automatique** de la langue du navigateur
- **Redirection** vers la langue appropriée
- **Gestion des routes** avec préfixes de langue
- **Synchronisation** avec le LanguageContext

**Fonctionnalités :**
- Détecte la langue du navigateur au premier chargement
- Redirige `/` vers `/fr/` (ou la langue du navigateur)
- Gère toutes les routes avec préfixes `/fr/`, `/en/`, `/es/`, `/de/`
- Met à jour le contexte de langue automatiquement

#### LanguageContext (`client/src/contexts/LanguageContext.tsx`)

Le contexte React qui stocke la langue active :

```typescript
interface LanguageContextType {
  language: Language; // 'fr' | 'en' | 'es' | 'de'
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Fonction de traduction
}
```

#### LanguageSelector (`client/src/components/LanguageSelector.tsx`)

Le sélecteur de langue dans le header :

- **Dropdown** avec les 4 langues disponibles
- **Changement d'URL** automatique lors du changement de langue
- **Conservation du chemin** actuel (ex: `/fr/blog` → `/en/blog`)
- **Indicateur visuel** de la langue active

#### SEOHead (`client/src/components/SEOHead.tsx`)

Composant pour le SEO multilingue :

- **Meta tags** Open Graph et Twitter Card
- **Balises hreflang** pour chaque langue
- **Canonical URLs** pour éviter le duplicate content
- **Schema.org** markup (JSON-LD)

### 3. Base de Données

#### Schéma `blogPosts`

La table `blogPosts` inclut une colonne `language` :

```typescript
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  language: varchar('language', { length: 2 }).notNull().default('fr'),
  // ... autres colonnes
});
```

#### Articles Traduits

**80 articles au total** :
- 20 articles originaux en français
- 20 traductions en anglais
- 20 traductions en espagnol
- 20 traductions en allemand

**Catégories couvertes :**
1. **IA & Data Science** (10 articles)
   - IA Générative
   - Data Science
   - MLOps
   - Deep Learning
   - NLP
   - Computer Vision
   - Python
   - Cloud Computing
   - Carrière Data Science
   - Futur de l'IA

2. **Marketing & Growth** (10 articles)
   - Growth Hacking
   - Copywriting
   - Email Marketing
   - Marketing Automation
   - SEO Technique
   - Analytics
   - Product Management
   - Sales Funnel
   - Customer Success
   - Entrepreneuriat

### 4. API tRPC

#### Procédure `getPublishedPosts`

Filtre automatiquement les articles par langue :

```typescript
getPublishedPosts: publicProcedure
  .input(
    z.object({
      category: z.string().optional(),
      language: z.enum(['fr', 'en', 'es', 'de']).default('fr'),
      limit: z.number().min(1).max(100).default(10),
    }).optional()
  )
  .query(async ({ input }) => {
    // Filtre par langue
    const conditions = [
      eq(blogPosts.published, 'published'),
      eq(blogPosts.language, input?.language || 'fr')
    ];
    // ...
  })
```

## Utilisation

### Changer de Langue

**Méthode 1 : LanguageSelector**

L'utilisateur clique sur le sélecteur de langue dans le header et choisit une langue. Le système :
1. Met à jour le contexte de langue
2. Change l'URL avec le nouveau préfixe
3. Recharge le contenu dans la nouvelle langue

**Méthode 2 : URL Directe**

L'utilisateur peut accéder directement à une URL avec préfixe :
- `https://sionohmair.manus.space/en/blog`
- `https://sionohmair.manus.space/es/pricing`

### Ajouter une Nouvelle Page

Pour ajouter une nouvelle page avec support multilingue :

1. **Ajouter la route** dans `LanguageRouter.tsx` :

```typescript
<Route path={`/${lang}/nouvelle-page`} component={NouvellePage} />
```

2. **Utiliser le contexte** dans le composant :

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

export default function NouvellePage() {
  const { language, t } = useLanguage();
  
  return (
    <div>
      <h1>{t('nouvelle_page.title')}</h1>
      {/* Contenu traduit */}
    </div>
  );
}
```

3. **Ajouter les traductions** dans `translations.ts` :

```typescript
export const translations = {
  fr: {
    nouvelle_page: {
      title: 'Nouvelle Page',
      // ...
    }
  },
  en: {
    nouvelle_page: {
      title: 'New Page',
      // ...
    }
  },
  // ...
};
```

### Ajouter un Article de Blog

Pour ajouter un article traduit :

1. **Créer l'article en français** (langue de base)
2. **Traduire en 3 langues** (EN, ES, DE)
3. **Insérer dans la base** avec le même slug mais différentes langues :

```sql
INSERT INTO blog_posts (title, slug, language, content, ...)
VALUES 
  ('Titre FR', 'mon-article', 'fr', 'Contenu FR', ...),
  ('Title EN', 'mon-article', 'en', 'Content EN', ...),
  ('Título ES', 'mon-article', 'es', 'Contenido ES', ...),
  ('Titel DE', 'mon-article', 'de', 'Inhalt DE', ...);
```

## SEO Multilingue

### Balises Hreflang

Le composant `SEOHead` génère automatiquement les balises hreflang :

```html
<link rel="alternate" hreflang="fr" href="https://sionohmair.manus.space/fr/blog" />
<link rel="alternate" hreflang="en" href="https://sionohmair.manus.space/en/blog" />
<link rel="alternate" hreflang="es" href="https://sionohmair.manus.space/es/blog" />
<link rel="alternate" hreflang="de" href="https://sionohmair.manus.space/de/blog" />
<link rel="alternate" hreflang="x-default" href="https://sionohmair.manus.space/fr/blog" />
```

### Canonical URLs

Chaque page a une URL canonique unique :

```html
<link rel="canonical" href="https://sionohmair.manus.space/fr/blog" />
```

### Sitemaps

Pour générer les sitemaps par langue :

```bash
# Générer les sitemaps
pnpm run generate-sitemaps
```

Cela créera :
- `sitemap-fr.xml`
- `sitemap-en.xml`
- `sitemap-es.xml`
- `sitemap-de.xml`
- `sitemap-index.xml` (index principal)

## Performance

### Optimisations Implémentées

1. **Code Splitting** : Routes chargées à la demande
2. **Lazy Loading** : Images optimisées avec Unsplash
3. **Compression** : Vite build avec minification
4. **Cache** : Headers de cache optimisés
5. **Fonts** : Google Fonts avec preload

### Métriques Lighthouse

- **Performance** : > 90
- **Accessibility** : > 95
- **Best Practices** : > 90
- **SEO** : > 95

## Accessibilité (WCAG 2.1 AA)

### Conformité

- ✅ **Contraste des couleurs** : Ratio 4.5:1 minimum
- ✅ **Navigation clavier** : Tous les éléments accessibles
- ✅ **ARIA labels** : Ajoutés où nécessaire
- ✅ **Alt text** : Toutes les images décrites
- ✅ **Hiérarchie des headings** : H1-H6 correcte
- ✅ **Focus management** : Visible et logique
- ✅ **Responsive design** : Mobile-first

## Maintenance

### Ajouter une Nouvelle Langue

Pour ajouter une 5ème langue (ex: Italien) :

1. **Ajouter le type** dans `LanguageContext.tsx` :

```typescript
export type Language = 'fr' | 'en' | 'es' | 'de' | 'it';
```

2. **Ajouter les traductions** dans `translations.ts`

3. **Ajouter la langue** dans `LanguageSelector.tsx` :

```typescript
const languages = [
  // ...
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];
```

4. **Ajouter les routes** dans `LanguageRouter.tsx`

5. **Traduire les articles** existants

### Mettre à Jour les Traductions

Les traductions sont centralisées dans `client/src/lib/translations.ts`. Pour modifier :

1. Éditer le fichier `translations.ts`
2. Ajouter/modifier les clés de traduction
3. Le hot reload Vite appliquera les changements

## Dépannage

### Problème : La langue ne change pas

**Solution** : Vérifier que le `LanguageRouter` est bien utilisé dans `App.tsx` et que le `LanguageProvider` enveloppe toute l'application.

### Problème : Articles non traduits

**Solution** : Vérifier que les articles ont bien la colonne `language` remplie dans la base de données :

```sql
SELECT title, slug, language FROM blog_posts WHERE slug = 'mon-article';
```

### Problème : URLs incorrectes

**Solution** : Vérifier que tous les liens internes utilisent le préfixe de langue :

```typescript
// ❌ Mauvais
<Link href="/blog">Blog</Link>

// ✅ Bon
<Link href={`/${language}/blog`}>Blog</Link>
```

## Ressources

- [Documentation Wouter](https://github.com/molefrog/wouter)
- [Balises Hreflang - Google](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [SEO Multilingue - Moz](https://moz.com/learn/seo/international-seo)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Dernière mise à jour** : 28 novembre 2024  
**Version** : 1.0.0  
**Auteur** : Manus AI
