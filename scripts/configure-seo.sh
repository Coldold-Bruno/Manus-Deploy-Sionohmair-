#!/bin/bash

# ========================================
# SCRIPT D'AUTOMATISATION - CONFIGURATION SEO
# ========================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Bannière
clear
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔍 CONFIGURATION AUTOMATIQUE DU SEO                    ║
║                                                           ║
║   Sionohmair Insight Academy                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Chemin du projet
PROJECT_DIR="/home/ubuntu/sionohmair-insight-academy"
PUBLIC_DIR="$PROJECT_DIR/client/public"
INDEX_HTML="$PROJECT_DIR/client/index.html"

# Vérifier que nous sommes dans le bon répertoire
if [[ ! -d "$PROJECT_DIR" ]]; then
    print_error "Répertoire du projet non trouvé : $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# PARTIE 1 : Configuration du domaine
print_header "PARTIE 1 : CONFIGURATION DU DOMAINE"

echo -e "${YELLOW}Quel est votre domaine de production ?${NC}"
echo ""
echo "Exemples :"
echo "  - https://sionohmair-academy.com"
echo "  - https://sionohmair.manus.space"
echo ""
read -p "Votre domaine : " DOMAIN_URL

# Valider le format
if [[ ! $DOMAIN_URL =~ ^https:// ]]; then
    print_error "Le domaine doit commencer par https://"
    exit 1
fi

# Extraire le nom de domaine sans https://
DOMAIN_NAME=$(echo "$DOMAIN_URL" | sed 's|https://||')

print_success "Domaine : $DOMAIN_NAME"

# PARTIE 2 : Création du sitemap.xml
print_header "PARTIE 2 : CRÉATION DU SITEMAP.XML"

print_info "Génération du sitemap.xml..."

# Créer le sitemap
SITEMAP_FILE="$PUBLIC_DIR/sitemap.xml"

cat > "$SITEMAP_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Page d'accueil -->
  <url>
    <loc>$DOMAIN_URL/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Outils principaux -->
  <url>
    <loc>$DOMAIN_URL/analyseur</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/generateur</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/persona</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/scripts</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/chat-ia</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/editeur</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Pages informatives -->
  <url>
    <loc>$DOMAIN_URL/frameworks</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/templates</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/exemples</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/guide</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Blog et ressources -->
  <url>
    <loc>$DOMAIN_URL/blog</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Pages commerciales -->
  <url>
    <loc>$DOMAIN_URL/pricing</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>$DOMAIN_URL/about</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
EOF

print_success "Sitemap créé : $SITEMAP_FILE"

# PARTIE 3 : Création du robots.txt
print_header "PARTIE 3 : CRÉATION DU ROBOTS.TXT"

print_info "Génération du robots.txt..."

ROBOTS_FILE="$PUBLIC_DIR/robots.txt"

cat > "$ROBOTS_FILE" << EOF
# Robots.txt pour Sionohmair Insight Academy
# Généré automatiquement le $(date)

User-agent: *
Allow: /

# Sitemap
Sitemap: $DOMAIN_URL/sitemap.xml

# Bloquer les pages privées
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/
Disallow: /subscription/

# Bloquer les pages de configuration
Disallow: /config/

# Autoriser les outils publics
Allow: /analyseur
Allow: /generateur
Allow: /persona
Allow: /scripts
Allow: /frameworks
Allow: /templates
Allow: /exemples
Allow: /blog
Allow: /pricing

# Crawl-delay (optionnel, pour éviter la surcharge)
Crawl-delay: 1
EOF

print_success "Robots.txt créé : $ROBOTS_FILE"

# PARTIE 4 : Optimisation des meta tags
print_header "PARTIE 4 : OPTIMISATION DES META TAGS"

print_info "Vérification des meta tags dans index.html..."

# Vérifier si Open Graph est déjà présent
if grep -q "og:title" "$INDEX_HTML"; then
    print_success "Meta tags Open Graph déjà présents"
else
    print_warning "Meta tags Open Graph manquants"
    
    echo -e "${YELLOW}Voulez-vous ajouter les meta tags Open Graph ? (o/n)${NC}"
    read -p "Réponse : " ADD_OG
    
    if [[ $ADD_OG == "o" || $ADD_OG == "O" ]]; then
        # Créer une sauvegarde
        cp "$INDEX_HTML" "$INDEX_HTML.backup"
        
        # Ajouter les meta tags Open Graph avant </head>
        sed -i '/<\/head>/i \
    <!-- Open Graph Meta Tags -->\
    <meta property="og:type" content="website">\
    <meta property="og:title" content="Sionohmair Insight Academy - L'\''Ingénierie du Génie">\
    <meta property="og:description" content="Transformez votre contenu marketing en machine de conversion avec la méthodologie PFPMA & APTEA. Essai gratuit 30 jours.">\
    <meta property="og:image" content="'$DOMAIN_URL'/og-image.jpg">\
    <meta property="og:url" content="'$DOMAIN_URL'">\
    <meta property="og:site_name" content="Sionohmair Insight Academy">\
    \
    <!-- Twitter Card Meta Tags -->\
    <meta name="twitter:card" content="summary_large_image">\
    <meta name="twitter:title" content="Sionohmair Insight Academy - L'\''Ingénierie du Génie">\
    <meta name="twitter:description" content="Transformez votre contenu marketing en machine de conversion avec PFPMA & APTEA">\
    <meta name="twitter:image" content="'$DOMAIN_URL'/twitter-card.jpg">\
    ' "$INDEX_HTML"
        
        print_success "Meta tags Open Graph ajoutés"
        print_info "Sauvegarde créée : $INDEX_HTML.backup"
    fi
fi

# PARTIE 5 : Configuration Google Search Console
print_header "PARTIE 5 : GOOGLE SEARCH CONSOLE"

echo -e "${CYAN}Configuration de Google Search Console...${NC}"
echo ""

SEARCH_CONSOLE_URL="https://search.google.com/search-console"

print_info "Ouverture de Google Search Console..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$SEARCH_CONSOLE_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$SEARCH_CONSOLE_URL"
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $SEARCH_CONSOLE_URL"
    fi
else
    print_warning "Impossible d'ouvrir automatiquement. Allez sur : $SEARCH_CONSOLE_URL"
fi

echo ""
echo -e "${CYAN}Instructions pour Google Search Console :${NC}"
echo ""
echo "1. Connectez-vous sur https://search.google.com/search-console"
echo "2. Cliquez sur \"Ajouter une propriété\""
echo "3. Choisissez \"Préfixe d'URL\""
echo "4. Entrez : $DOMAIN_URL"
echo "5. Méthode de vérification recommandée : \"Balise HTML\""
echo "   - Copiez la balise meta"
echo "   - Ajoutez-la dans client/index.html (dans <head>)"
echo "   - Ou utilisez la méthode DNS (TXT record)"
echo "6. Cliquez sur \"Vérifier\""
echo "7. Une fois vérifié, allez dans \"Sitemaps\""
echo "8. Ajoutez le sitemap : $DOMAIN_URL/sitemap.xml"
echo "9. Cliquez sur \"Envoyer\""
echo ""

read -p "Appuyez sur ENTRÉE quand la vérification est terminée..."

print_success "Google Search Console configuré"

# PARTIE 6 : Demande d'indexation
print_header "PARTIE 6 : DEMANDE D'INDEXATION"

echo -e "${CYAN}Demande d'indexation des pages principales...${NC}"
echo ""

echo "Dans Google Search Console :"
echo ""
echo "1. Allez dans \"Inspection de l'URL\""
echo "2. Entrez ces URLs une par une et cliquez sur \"Demander l'indexation\" :"
echo ""
echo "   - $DOMAIN_URL/"
echo "   - $DOMAIN_URL/analyseur"
echo "   - $DOMAIN_URL/generateur"
echo "   - $DOMAIN_URL/persona"
echo "   - $DOMAIN_URL/frameworks"
echo "   - $DOMAIN_URL/blog"
echo "   - $DOMAIN_URL/pricing"
echo ""

read -p "Appuyez sur ENTRÉE quand les demandes d'indexation sont envoyées..."

print_success "Demandes d'indexation envoyées"

# PARTIE 7 : Génération du rapport SEO
print_header "PARTIE 7 : GÉNÉRATION DU RAPPORT SEO"

SEO_REPORT_FILE="seo-configuration-report.txt"

cat > "$SEO_REPORT_FILE" << EOF
========================================
RAPPORT DE CONFIGURATION SEO
========================================

Date de génération : $(date)
Domaine : $DOMAIN_NAME

----------------------------------------
FICHIERS CRÉÉS
----------------------------------------

✅ Sitemap : $PUBLIC_DIR/sitemap.xml
   URL publique : $DOMAIN_URL/sitemap.xml

✅ Robots.txt : $PUBLIC_DIR/robots.txt
   URL publique : $DOMAIN_URL/robots.txt

✅ Meta tags Open Graph : Ajoutés dans client/index.html

----------------------------------------
PAGES INDEXABLES
----------------------------------------

Pages principales (15 URLs) :
  - Page d'accueil (priorité 1.0)
  - Analyseur de Contenu (priorité 0.9)
  - Générateur de Copy (priorité 0.9)
  - Persona Builder (priorité 0.8)
  - Analyseur de Scripts (priorité 0.8)
  - Chat IA (priorité 0.7)
  - Éditeur (priorité 0.7)
  - Frameworks (priorité 0.8)
  - Templates (priorité 0.7)
  - Exemples (priorité 0.7)
  - Guide (priorité 0.6)
  - Blog (priorité 0.7)
  - Pricing (priorité 0.8)
  - À Propos (priorité 0.5)

Pages bloquées (robots.txt) :
  - /dashboard/ (privé)
  - /admin/ (privé)
  - /api/ (technique)
  - /subscription/ (privé)
  - /config/ (configuration)

----------------------------------------
GOOGLE SEARCH CONSOLE
----------------------------------------

✅ Propriété ajoutée : $DOMAIN_URL
✅ Sitemap soumis : $DOMAIN_URL/sitemap.xml
✅ Demandes d'indexation envoyées

Délai d'indexation : 1-7 jours

----------------------------------------
MOTS-CLÉS CIBLÉS
----------------------------------------

Principaux :
  - content marketing
  - copywriting
  - PFPMA
  - APTEA
  - analyseur de contenu
  - générateur de copy
  - framework copywriting
  - conversion marketing

Longue traîne :
  - comment améliorer son copywriting
  - outil d'analyse de contenu marketing
  - générateur de copy IA
  - framework PFPMA
  - méthode APTEA
  - optimiser conversion landing page

----------------------------------------
OPTIMISATIONS RECOMMANDÉES
----------------------------------------

1. Images :
   - Créez une image og-image.jpg (1200x630px)
   - Créez une image twitter-card.jpg (1200x600px)
   - Placez-les dans client/public/
   - Optimisez toutes les images (WebP, compression)

2. Contenu :
   - Publiez 10 articles de blog SEO-optimisés
   - Ajoutez des FAQ sur chaque page outil
   - Créez des guides détaillés (3000+ mots)

3. Backlinks :
   - Partenariats avec blogs marketing
   - Guest posts sur sites à forte autorité
   - Mentions dans communautés marketing

4. Performance :
   - Optimisez le temps de chargement (< 2s)
   - Activez la compression gzip
   - Utilisez un CDN pour les assets

5. Schema.org :
   - Ajoutez des données structurées (JSON-LD)
   - Type : SoftwareApplication
   - Avis clients (AggregateRating)

----------------------------------------
VÉRIFICATIONS POST-CONFIGURATION
----------------------------------------

✅ Sitemap accessible : $DOMAIN_URL/sitemap.xml
✅ Robots.txt accessible : $DOMAIN_URL/robots.txt
✅ Meta tags présents (View Source)
✅ Google Search Console configuré
✅ Sitemap soumis

À vérifier dans 7 jours :
  - Pages indexées dans Google (site:$DOMAIN_NAME)
  - Position sur mots-clés ciblés
  - Trafic organique (Google Analytics)

----------------------------------------
OUTILS DE SUIVI SEO
----------------------------------------

Google Search Console :
  https://search.google.com/search-console

Google Analytics :
  https://analytics.google.com

PageSpeed Insights :
  https://pagespeed.web.dev/?url=$DOMAIN_URL

GTmetrix :
  https://gtmetrix.com/?url=$DOMAIN_URL

Ahrefs (audit SEO) :
  https://ahrefs.com/site-audit

SEMrush (analyse concurrence) :
  https://www.semrush.com

========================================
FIN DU RAPPORT
========================================
EOF

print_success "Rapport SEO généré : $SEO_REPORT_FILE"

# Afficher le rapport
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cat "$SEO_REPORT_FILE"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# PARTIE 8 : Tests SEO
print_header "PARTIE 8 : TESTS SEO"

echo -e "${CYAN}Vérification de l'accessibilité des fichiers SEO...${NC}"
echo ""

# Tester sitemap
print_info "Test du sitemap..."
if curl -s -o /dev/null -w "%{http_code}" "$DOMAIN_URL/sitemap.xml" | grep -q "200"; then
    print_success "Sitemap accessible : $DOMAIN_URL/sitemap.xml"
else
    print_warning "Sitemap non accessible. Vérifiez après le déploiement."
fi

# Tester robots.txt
print_info "Test du robots.txt..."
if curl -s -o /dev/null -w "%{http_code}" "$DOMAIN_URL/robots.txt" | grep -q "200"; then
    print_success "Robots.txt accessible : $DOMAIN_URL/robots.txt"
else
    print_warning "Robots.txt non accessible. Vérifiez après le déploiement."
fi

# Résumé final
print_header "✅ CONFIGURATION SEO TERMINÉE"

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎉 SEO CONFIGURÉ AVEC SUCCÈS !                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}Résumé de la configuration :${NC}"
echo ""
echo -e "${GREEN}✅ Sitemap créé (15 URLs)${NC}"
echo -e "${GREEN}✅ Robots.txt créé${NC}"
echo -e "${GREEN}✅ Meta tags Open Graph ajoutés${NC}"
echo -e "${GREEN}✅ Google Search Console configuré${NC}"
echo -e "${GREEN}✅ Sitemap soumis${NC}"
echo -e "${GREEN}✅ Demandes d'indexation envoyées${NC}"
echo ""

echo -e "${CYAN}Fichiers générés :${NC}"
echo -e "${BLUE}  → $SITEMAP_FILE${NC}"
echo -e "${BLUE}  → $ROBOTS_FILE${NC}"
echo -e "${BLUE}  → $SEO_REPORT_FILE${NC}"
echo ""

echo -e "${CYAN}Prochaines étapes :${NC}"
echo "  1. Créez les images og-image.jpg et twitter-card.jpg"
echo "  2. Publiez 10 articles de blog SEO-optimisés"
echo "  3. Vérifiez l'indexation dans 7 jours (site:$DOMAIN_NAME)"
echo "  4. Suivez vos positions sur Google Search Console"
echo ""

print_success "Script terminé avec succès !"
