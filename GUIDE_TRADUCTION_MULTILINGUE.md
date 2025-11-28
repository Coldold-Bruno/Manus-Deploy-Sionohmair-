# 🌍 Guide du Système de Traduction Multilingue

## Vue d'ensemble

Le site **Sionohmair Insight Academy** dispose maintenant d'un système de traduction multilingue optimisé supportant **4 langues** :

- 🇫🇷 **Français** (langue par défaut)
- 🇬🇧 **Anglais** (English)
- 🇪🇸 **Espagnol** (Español)
- 🇩🇪 **Allemand** (Deutsch)

## Fonctionnalités

### ✅ Détection automatique
- Le système détecte automatiquement la langue du navigateur de l'utilisateur
- Si la langue du navigateur est supportée (FR, EN, ES, DE), elle est appliquée
- Sinon, le français est utilisé par défaut

### ✅ Persistance
- La langue sélectionnée est sauvegardée dans `localStorage`
- L'utilisateur retrouve sa langue préférée lors de ses prochaines visites
- La balise `<html lang="...">` est mise à jour dynamiquement pour le SEO

### ✅ Sélecteur de langue
- Un sélecteur élégant avec drapeaux est disponible dans le header
- Dropdown avec les 4 langues disponibles
- Interface responsive (drapeaux seuls sur mobile, nom complet sur desktop)

## Architecture technique

### Structure des fichiers

```
client/src/
├── contexts/
│   └── LanguageContext.tsx          # Contexte React pour gérer la langue
├── components/
│   └── LanguageSelector.tsx         # Composant sélecteur de langue
└── translations/
    ├── fr.json                      # Traductions françaises
    ├── en.json                      # Traductions anglaises
    ├── es.json                      # Traductions espagnoles
    └── de.json                      # Traductions allemandes
```

### Utilisation dans le code

#### 1. Importer le hook `useLanguage`

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
}
```

#### 2. Fonction de traduction `t()`

La fonction `t()` accepte une clé en notation pointée :

```tsx
t('common.home')           // → "Accueil" (FR) / "Home" (EN)
t('hero.title')            // → "Transformez Vos Messages..." (FR)
t('services.sprint.name')  // → "Sprint de Clarté" (FR)
```

#### 3. Changer de langue programmatiquement

```tsx
const { setLanguage } = useLanguage();

// Changer en anglais
setLanguage('en');

// Changer en espagnol
setLanguage('es');
```

## Structure des fichiers de traduction

Les fichiers JSON sont organisés par sections logiques :

```json
{
  "common": {
    "home": "Accueil",
    "services": "Services",
    "blog": "Blog"
  },
  "hero": {
    "title": "Transformez Vos Messages en Insights Percutants",
    "subtitle": "L'Ingénierie du Génie",
    "cta": "Démarrer l'essai gratuit 30 jours"
  },
  "services": {
    "title": "Nos Services",
    "sprint": {
      "name": "Sprint de Clarté",
      "price": "490€"
    }
  }
}
```

## Ajouter une nouvelle langue

### Étape 1 : Créer le fichier de traduction

Créer `/client/src/translations/it.json` (exemple pour l'italien) :

```json
{
  "common": {
    "home": "Home",
    "services": "Servizi",
    "blog": "Blog"
  },
  "hero": {
    "title": "Trasforma i Tuoi Messaggi in Insight Potenti"
  }
}
```

### Étape 2 : Ajouter la langue dans le contexte

Modifier `LanguageContext.tsx` :

```tsx
export type Language = 'fr' | 'en' | 'es' | 'de' | 'it';  // Ajouter 'it'
```

### Étape 3 : Ajouter dans le sélecteur

Modifier `LanguageSelector.tsx` :

```tsx
const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },  // Ajouter ici
];
```

## Ajouter une nouvelle clé de traduction

### Étape 1 : Ajouter dans tous les fichiers JSON

Ajouter la clé dans `fr.json`, `en.json`, `es.json`, `de.json` :

```json
{
  "pricing": {
    "title": "Nos Tarifs",           // FR
    "subtitle": "Choisissez votre niveau"
  }
}
```

```json
{
  "pricing": {
    "title": "Our Pricing",          // EN
    "subtitle": "Choose your level"
  }
}
```

### Étape 2 : Utiliser dans le code

```tsx
function PricingPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('pricing.title')}</h1>
      <p>{t('pricing.subtitle')}</p>
    </div>
  );
}
```

## Bonnes pratiques

### ✅ À faire
- Toujours ajouter les traductions dans **tous les fichiers de langue**
- Utiliser des clés descriptives en notation pointée (`hero.title`, `services.sprint.name`)
- Grouper les traductions par section logique (`common`, `hero`, `services`, etc.)
- Tester chaque langue après ajout de nouvelles clés

### ❌ À éviter
- Ne pas coder en dur du texte dans les composants
- Ne pas oublier de traduire dans toutes les langues
- Ne pas utiliser de clés trop génériques (`text1`, `button2`)
- Ne pas mélanger du contenu traduit et du contenu en dur

## SEO et référencement

### Balise HTML lang

La balise `<html lang="...">` est automatiquement mise à jour :

```html
<!-- Français -->
<html lang="fr">

<!-- Anglais -->
<html lang="en">
```

### Meta tags par langue

Pour améliorer le SEO, vous pouvez ajouter des meta tags dynamiques :

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function SEOComponent() {
  const { t } = useLanguage();
  
  return (
    <Helmet>
      <title>{t('seo.title')}</title>
      <meta name="description" content={t('seo.description')} />
    </Helmet>
  );
}
```

## Statistiques actuelles

### Traductions disponibles
- **Français** : 100% (langue source)
- **Anglais** : 100% (traduction complète)
- **Espagnol** : 100% (traduction complète)
- **Allemand** : 100% (traduction complète)

### Sections traduites
- ✅ Navigation commune
- ✅ Hero section
- ✅ Services (3 niveaux)
- ✅ Blog
- ✅ Outils IA
- ✅ Footer
- ✅ Authentification
- ✅ Abonnement

### Pages à traduire (optionnel)
- [ ] Contenu des articles de blog (20 articles)
- [ ] Emails automatiques (7 templates)
- [ ] Dashboard utilisateur
- [ ] Pages admin

## Support et maintenance

### Vérifier les traductions manquantes

Si une clé n'existe pas, le système affiche la clé elle-même et un warning dans la console :

```
⚠️ Translation missing for key: hero.newKey in language: en
```

### Tester toutes les langues

1. Ouvrir le site
2. Cliquer sur le sélecteur de langue (icône 🌍)
3. Sélectionner chaque langue
4. Vérifier que tous les textes sont traduits

### Mise à jour des traductions

Pour mettre à jour une traduction, modifier directement le fichier JSON correspondant :

```bash
# Éditer la traduction française
vim client/src/translations/fr.json

# Éditer la traduction anglaise
vim client/src/translations/en.json
```

## Conclusion

Le système de traduction multilingue est maintenant **100% opérationnel** et prêt pour la production. Il offre une expérience utilisateur optimale avec détection automatique, persistance et interface élégante.

**Prochaines étapes suggérées** :
1. Traduire le contenu des articles de blog
2. Ajouter des langues supplémentaires (italien, portugais, etc.)
3. Implémenter des URLs multilingues (`/fr/blog`, `/en/blog`)
4. Ajouter un système de traduction automatique avec IA pour les nouveaux contenus

---

**Développé avec ❤️ par Sionohmair Insight Academy**
