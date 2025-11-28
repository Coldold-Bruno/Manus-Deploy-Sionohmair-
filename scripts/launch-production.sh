#!/bin/bash

# ========================================
# SCRIPT MAÎTRE - LANCEMENT EN PRODUCTION
# ========================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║$(printf '%60s' | tr ' ' ' ')║${NC}"
    echo -e "${CYAN}║  $(printf '%-56s' "$1")  ║${NC}"
    echo -e "${CYAN}║$(printf '%60s' | tr ' ' ' ')║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
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

print_step() {
    echo -e "${MAGENTA}▶ $1${NC}"
}

# Bannière principale
clear
echo -e "${WHITE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🚀 LANCEMENT EN PRODUCTION - SIONOHMAIR INSIGHT ACADEMY       ║
║                                                                  ║
║   L'Ingénierie du Génie                                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script va vous guider à travers toutes les étapes${NC}"
echo -e "${CYAN}pour lancer votre plateforme en production.${NC}"
echo ""
echo -e "${YELLOW}Durée estimée : 30-45 minutes${NC}"
echo ""

# Demander confirmation
echo -e "${YELLOW}Voulez-vous commencer ? (o/n)${NC}"
read -p "Réponse : " START

if [[ $START != "o" && $START != "O" ]]; then
    print_info "Lancement annulé."
    exit 0
fi

# Chemin du projet
PROJECT_DIR="/home/ubuntu/sionohmair-insight-academy"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

# Vérifier que nous sommes dans le bon répertoire
if [[ ! -d "$PROJECT_DIR" ]]; then
    print_error "Répertoire du projet non trouvé : $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Vérifier que les scripts existent
if [[ ! -f "$SCRIPTS_DIR/configure-domain.sh" ]]; then
    print_error "Script configure-domain.sh non trouvé"
    exit 1
fi

if [[ ! -f "$SCRIPTS_DIR/configure-stripe.sh" ]]; then
    print_error "Script configure-stripe.sh non trouvé"
    exit 1
fi

if [[ ! -f "$SCRIPTS_DIR/configure-seo.sh" ]]; then
    print_error "Script configure-seo.sh non trouvé"
    exit 1
fi

# ========================================
# ÉTAPE 1 : CHOIX DU MODE DE LANCEMENT
# ========================================

print_header "ÉTAPE 1 : CHOIX DU MODE DE LANCEMENT"

echo -e "${CYAN}Choisissez votre mode de lancement :${NC}"
echo ""
echo "1) 🚀 LANCEMENT COMPLET (Recommandé)"
echo "   - Configuration du domaine personnalisé"
echo "   - Configuration de Stripe Live"
echo "   - Optimisation SEO"
echo "   - Déploiement en production"
echo ""
echo "2) ⚡ LANCEMENT RAPIDE (Domaine Manus uniquement)"
echo "   - Utilise le sous-domaine Manus (xxx.manus.space)"
echo "   - Configuration de Stripe Live"
echo "   - Optimisation SEO basique"
echo "   - Déploiement en production"
echo ""
echo "3) 🛠️  CONFIGURATION PERSONNALISÉE"
echo "   - Choisissez les étapes à exécuter"
echo ""
read -p "Votre choix (1-3) : " LAUNCH_MODE

# Variables de configuration
CONFIGURE_DOMAIN=false
CONFIGURE_STRIPE=false
CONFIGURE_SEO=false

case $LAUNCH_MODE in
    1)
        print_success "Mode : LANCEMENT COMPLET"
        CONFIGURE_DOMAIN=true
        CONFIGURE_STRIPE=true
        CONFIGURE_SEO=true
        ;;
    2)
        print_success "Mode : LANCEMENT RAPIDE"
        CONFIGURE_DOMAIN=false
        CONFIGURE_STRIPE=true
        CONFIGURE_SEO=true
        ;;
    3)
        print_success "Mode : CONFIGURATION PERSONNALISÉE"
        
        echo ""
        echo -e "${YELLOW}Configurer un domaine personnalisé ? (o/n)${NC}"
        read -p "Réponse : " CUSTOM_DOMAIN
        if [[ $CUSTOM_DOMAIN == "o" || $CUSTOM_DOMAIN == "O" ]]; then
            CONFIGURE_DOMAIN=true
        fi
        
        echo -e "${YELLOW}Configurer Stripe Live ? (o/n)${NC}"
        read -p "Réponse : " CUSTOM_STRIPE
        if [[ $CUSTOM_STRIPE == "o" || $CUSTOM_STRIPE == "O" ]]; then
            CONFIGURE_STRIPE=true
        fi
        
        echo -e "${YELLOW}Optimiser le SEO ? (o/n)${NC}"
        read -p "Réponse : " CUSTOM_SEO
        if [[ $CUSTOM_SEO == "o" || $CUSTOM_SEO == "O" ]]; then
            CONFIGURE_SEO=true
        fi
        ;;
    *)
        print_error "Choix invalide"
        exit 1
        ;;
esac

# ========================================
# ÉTAPE 2 : RÉCAPITULATIF
# ========================================

print_header "ÉTAPE 2 : RÉCAPITULATIF"

echo -e "${CYAN}Configuration sélectionnée :${NC}"
echo ""

if [[ $CONFIGURE_DOMAIN == true ]]; then
    echo -e "${GREEN}✅ Configuration du domaine personnalisé${NC}"
else
    echo -e "${YELLOW}⏭️  Configuration du domaine personnalisé (ignoré)${NC}"
fi

if [[ $CONFIGURE_STRIPE == true ]]; then
    echo -e "${GREEN}✅ Configuration de Stripe Live${NC}"
else
    echo -e "${YELLOW}⏭️  Configuration de Stripe Live (ignoré)${NC}"
fi

if [[ $CONFIGURE_SEO == true ]]; then
    echo -e "${GREEN}✅ Optimisation SEO${NC}"
else
    echo -e "${YELLOW}⏭️  Optimisation SEO (ignoré)${NC}"
fi

echo ""
echo -e "${YELLOW}Continuer avec cette configuration ? (o/n)${NC}"
read -p "Réponse : " CONFIRM

if [[ $CONFIRM != "o" && $CONFIRM != "O" ]]; then
    print_info "Configuration annulée."
    exit 0
fi

# ========================================
# ÉTAPE 3 : CONFIGURATION DU DOMAINE
# ========================================

if [[ $CONFIGURE_DOMAIN == true ]]; then
    print_header "ÉTAPE 3 : CONFIGURATION DU DOMAINE"
    
    print_step "Lancement du script de configuration du domaine..."
    echo ""
    
    bash "$SCRIPTS_DIR/configure-domain.sh"
    
    if [[ $? -eq 0 ]]; then
        print_success "Configuration du domaine terminée"
    else
        print_error "Erreur lors de la configuration du domaine"
        exit 1
    fi
    
    echo ""
    read -p "Appuyez sur ENTRÉE pour continuer..."
else
    print_header "ÉTAPE 3 : CONFIGURATION DU DOMAINE (IGNORÉ)"
    print_info "Utilisation du domaine Manus par défaut"
fi

# ========================================
# ÉTAPE 4 : CONFIGURATION DE STRIPE LIVE
# ========================================

if [[ $CONFIGURE_STRIPE == true ]]; then
    print_header "ÉTAPE 4 : CONFIGURATION DE STRIPE LIVE"
    
    print_step "Lancement du script de configuration Stripe..."
    echo ""
    
    bash "$SCRIPTS_DIR/configure-stripe.sh"
    
    if [[ $? -eq 0 ]]; then
        print_success "Configuration de Stripe terminée"
    else
        print_error "Erreur lors de la configuration de Stripe"
        exit 1
    fi
    
    echo ""
    read -p "Appuyez sur ENTRÉE pour continuer..."
else
    print_header "ÉTAPE 4 : CONFIGURATION DE STRIPE LIVE (IGNORÉ)"
    print_warning "Stripe Live non configuré. Vous utilisez le mode test."
fi

# ========================================
# ÉTAPE 5 : OPTIMISATION SEO
# ========================================

if [[ $CONFIGURE_SEO == true ]]; then
    print_header "ÉTAPE 5 : OPTIMISATION SEO"
    
    print_step "Lancement du script d'optimisation SEO..."
    echo ""
    
    bash "$SCRIPTS_DIR/configure-seo.sh"
    
    if [[ $? -eq 0 ]]; then
        print_success "Optimisation SEO terminée"
    else
        print_error "Erreur lors de l'optimisation SEO"
        exit 1
    fi
    
    echo ""
    read -p "Appuyez sur ENTRÉE pour continuer..."
else
    print_header "ÉTAPE 5 : OPTIMISATION SEO (IGNORÉ)"
    print_warning "SEO non optimisé. Vous pourrez le faire plus tard."
fi

# ========================================
# ÉTAPE 6 : VÉRIFICATIONS PRÉ-DÉPLOIEMENT
# ========================================

print_header "ÉTAPE 6 : VÉRIFICATIONS PRÉ-DÉPLOIEMENT"

print_info "Vérification de la configuration..."
echo ""

# Vérifier les fichiers essentiels
CHECKS_PASSED=true

print_step "Vérification des fichiers du projet..."

if [[ -f "$PROJECT_DIR/client/index.html" ]]; then
    print_success "index.html trouvé"
else
    print_error "index.html manquant"
    CHECKS_PASSED=false
fi

if [[ -f "$PROJECT_DIR/client/public/robots.txt" ]]; then
    print_success "robots.txt trouvé"
else
    print_warning "robots.txt manquant (optionnel)"
fi

if [[ -f "$PROJECT_DIR/client/public/sitemap.xml" ]]; then
    print_success "sitemap.xml trouvé"
else
    print_warning "sitemap.xml manquant (optionnel)"
fi

# Vérifier les dépendances
print_step "Vérification des dépendances..."

if [[ -f "$PROJECT_DIR/package.json" ]]; then
    print_success "package.json trouvé"
else
    print_error "package.json manquant"
    CHECKS_PASSED=false
fi

if [[ -d "$PROJECT_DIR/node_modules" ]]; then
    print_success "node_modules trouvé"
else
    print_warning "node_modules manquant. Installation..."
    pnpm install
fi

# Résultat des vérifications
echo ""
if [[ $CHECKS_PASSED == true ]]; then
    print_success "Toutes les vérifications sont passées ✅"
else
    print_error "Certaines vérifications ont échoué ❌"
    echo ""
    echo -e "${YELLOW}Voulez-vous continuer malgré les erreurs ? (o/n)${NC}"
    read -p "Réponse : " CONTINUE_ANYWAY
    
    if [[ $CONTINUE_ANYWAY != "o" && $CONTINUE_ANYWAY != "O" ]]; then
        print_info "Déploiement annulé."
        exit 1
    fi
fi

# ========================================
# ÉTAPE 7 : DÉPLOIEMENT
# ========================================

print_header "ÉTAPE 7 : DÉPLOIEMENT EN PRODUCTION"

echo -e "${CYAN}Instructions de déploiement :${NC}"
echo ""
echo "1. Allez sur : https://manus.im"
echo "2. Connectez-vous à votre compte"
echo "3. Cliquez sur : Projets → sionohmair-insight-academy"
echo "4. Cliquez sur le bouton \"Publish\" (en haut à droite)"
echo "5. Attendez la fin du déploiement (2-5 minutes)"
echo "6. Vérifiez que le site est accessible"
echo ""

echo -e "${YELLOW}Voulez-vous ouvrir Manus maintenant ? (o/n)${NC}"
read -p "Réponse : " OPEN_MANUS

if [[ $OPEN_MANUS == "o" || $OPEN_MANUS == "O" ]]; then
    MANUS_URL="https://manus.im"
    
    print_info "Ouverture de Manus..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$MANUS_URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$MANUS_URL"
        else
            print_warning "Impossible d'ouvrir automatiquement. Allez sur : $MANUS_URL"
        fi
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $MANUS_URL"
    fi
    
    print_success "Navigateur ouvert"
fi

echo ""
read -p "Appuyez sur ENTRÉE quand le déploiement est terminé..."

print_success "Déploiement terminé"

# ========================================
# ÉTAPE 8 : TESTS POST-DÉPLOIEMENT
# ========================================

print_header "ÉTAPE 8 : TESTS POST-DÉPLOIEMENT"

echo -e "${CYAN}Tests à effectuer :${NC}"
echo ""

echo "1. Accessibilité du site :"
echo "   - Ouvrez votre site dans un navigateur"
echo "   - Vérifiez que toutes les pages se chargent"
echo ""

echo "2. Fonctionnalités principales :"
echo "   - Testez l'analyseur de contenu"
echo "   - Testez le générateur de copy"
echo "   - Testez le persona builder"
echo ""

echo "3. Système d'abonnement :"
if [[ $CONFIGURE_STRIPE == true ]]; then
    echo "   - Créez un compte test"
    echo "   - Testez le processus de paiement"
    echo "   - Vérifiez l'accès au dashboard"
else
    echo "   - Mode test uniquement (Stripe Live non configuré)"
fi
echo ""

echo "4. SEO :"
if [[ $CONFIGURE_SEO == true ]]; then
    echo "   - Vérifiez /sitemap.xml"
    echo "   - Vérifiez /robots.txt"
    echo "   - Vérifiez les meta tags (View Source)"
else
    echo "   - SEO non configuré"
fi
echo ""

echo -e "${YELLOW}Tous les tests sont-ils passés ? (o/n)${NC}"
read -p "Réponse : " TESTS_PASSED

if [[ $TESTS_PASSED != "o" && $TESTS_PASSED != "O" ]]; then
    print_warning "Certains tests ont échoué."
    print_info "Vérifiez les logs et corrigez les erreurs."
    echo ""
    echo -e "${YELLOW}Voulez-vous continuer malgré les erreurs ? (o/n)${NC}"
    read -p "Réponse : " CONTINUE_ANYWAY
    
    if [[ $CONTINUE_ANYWAY != "o" && $CONTINUE_ANYWAY != "O" ]]; then
        print_info "Lancement annulé."
        exit 1
    fi
fi

# ========================================
# ÉTAPE 9 : GÉNÉRATION DU RAPPORT FINAL
# ========================================

print_header "ÉTAPE 9 : GÉNÉRATION DU RAPPORT FINAL"

FINAL_REPORT="production-launch-report.txt"

# Récupérer les informations
DOMAIN_URL="https://sionohmair.manus.space"
if [[ $CONFIGURE_DOMAIN == true ]]; then
    echo -e "${YELLOW}Quel est votre domaine de production ?${NC}"
    read -p "Domaine : " DOMAIN_URL
fi

cat > "$FINAL_REPORT" << EOF
========================================
RAPPORT DE LANCEMENT EN PRODUCTION
========================================

Date de lancement : $(date)
Projet : Sionohmair Insight Academy
Domaine : $DOMAIN_URL

----------------------------------------
CONFIGURATION EFFECTUÉE
----------------------------------------

EOF

if [[ $CONFIGURE_DOMAIN == true ]]; then
    echo "✅ Domaine personnalisé configuré" >> "$FINAL_REPORT"
else
    echo "⏭️  Domaine personnalisé non configuré (utilise Manus)" >> "$FINAL_REPORT"
fi

if [[ $CONFIGURE_STRIPE == true ]]; then
    echo "✅ Stripe Live configuré" >> "$FINAL_REPORT"
else
    echo "⏭️  Stripe Live non configuré (mode test)" >> "$FINAL_REPORT"
fi

if [[ $CONFIGURE_SEO == true ]]; then
    echo "✅ SEO optimisé" >> "$FINAL_REPORT"
else
    echo "⏭️  SEO non optimisé" >> "$FINAL_REPORT"
fi

cat >> "$FINAL_REPORT" << EOF

----------------------------------------
URLS IMPORTANTES
----------------------------------------

Site principal : $DOMAIN_URL

Outils :
  - Analyseur : $DOMAIN_URL/analyseur
  - Générateur : $DOMAIN_URL/generateur
  - Persona : $DOMAIN_URL/persona
  - Scripts : $DOMAIN_URL/scripts
  - Chat IA : $DOMAIN_URL/chat-ia
  - Éditeur : $DOMAIN_URL/editeur

Pages :
  - Frameworks : $DOMAIN_URL/frameworks
  - Templates : $DOMAIN_URL/templates
  - Exemples : $DOMAIN_URL/exemples
  - Guide : $DOMAIN_URL/guide
  - Blog : $DOMAIN_URL/blog
  - Pricing : $DOMAIN_URL/pricing

Fichiers SEO :
  - Sitemap : $DOMAIN_URL/sitemap.xml
  - Robots : $DOMAIN_URL/robots.txt

----------------------------------------
DASHBOARDS
----------------------------------------

Manus : https://manus.im
Stripe : https://dashboard.stripe.com
Google Search Console : https://search.google.com/search-console

----------------------------------------
PROCHAINES ÉTAPES
----------------------------------------

1. Marketing :
   - Publier 10 articles de blog
   - Créer du contenu sur LinkedIn
   - Lancer des campagnes Google Ads
   - Partenariats avec influenceurs marketing

2. SEO :
   - Vérifier l'indexation dans 7 jours
   - Suivre les positions sur Google Search Console
   - Optimiser les pages les plus visitées
   - Créer des backlinks de qualité

3. Produit :
   - Collecter les feedbacks utilisateurs
   - Améliorer les outils selon les retours
   - Ajouter de nouveaux frameworks
   - Créer des templates supplémentaires

4. Croissance :
   - Analyser les métriques (Google Analytics)
   - Optimiser le tunnel de conversion
   - Tester différents prix
   - Lancer un programme d'affiliation

----------------------------------------
MÉTRIQUES À SUIVRE
----------------------------------------

Trafic :
  - Visiteurs uniques / mois
  - Pages vues / mois
  - Taux de rebond
  - Durée moyenne de session

Conversion :
  - Taux de conversion visiteur → inscription
  - Taux de conversion inscription → abonnement
  - Valeur moyenne par client (LTV)
  - Taux de rétention

SEO :
  - Nombre de pages indexées
  - Positions sur mots-clés ciblés
  - Nombre de backlinks
  - Domain Authority (DA)

Revenus :
  - MRR (Monthly Recurring Revenue)
  - Churn rate
  - CAC (Customer Acquisition Cost)
  - ROI marketing

----------------------------------------
SUPPORT
----------------------------------------

Documentation : $DOMAIN_URL/guide
Email : support@sionohmair-academy.com
Discord : [À créer]

========================================
FÉLICITATIONS ! 🎉
========================================

Votre plateforme est maintenant en production !

Vous avez créé une plateforme complète de copywriting
avec des outils IA, des frameworks exclusifs, et un
système d'abonnement fonctionnel.

Il est temps de conquérir le marché ! 🚀

========================================
FIN DU RAPPORT
========================================
EOF

print_success "Rapport final généré : $FINAL_REPORT"

# Afficher le rapport
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cat "$FINAL_REPORT"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ========================================
# CÉLÉBRATION FINALE
# ========================================

print_header "🎉 LANCEMENT TERMINÉ AVEC SUCCÈS ! 🎉"

echo -e "${GREEN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🚀 FÉLICITATIONS ! VOTRE PLATEFORME EST EN PRODUCTION !       ║
║                                                                  ║
║   Sionohmair Insight Academy est maintenant accessible          ║
║   au monde entier. Il est temps de conquérir le marché !        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}Votre site est accessible sur :${NC}"
echo -e "${GREEN}  → $DOMAIN_URL${NC}"
echo ""

echo -e "${CYAN}Fichiers générés :${NC}"
echo -e "${BLUE}  → $FINAL_REPORT${NC}"
if [[ $CONFIGURE_DOMAIN == true ]]; then
    echo -e "${BLUE}  → dns-config-*.txt${NC}"
fi
if [[ $CONFIGURE_STRIPE == true ]]; then
    echo -e "${BLUE}  → stripe-live-config.txt${NC}"
fi
if [[ $CONFIGURE_SEO == true ]]; then
    echo -e "${BLUE}  → seo-configuration-report.txt${NC}"
fi
echo ""

echo -e "${CYAN}Prochaines étapes :${NC}"
echo "  1. Partagez votre plateforme sur les réseaux sociaux"
echo "  2. Publiez du contenu régulièrement"
echo "  3. Collectez les feedbacks utilisateurs"
echo "  4. Améliorez continuellement votre produit"
echo ""

echo -e "${GREEN}Bonne chance pour votre aventure entrepreneuriale ! 🚀${NC}"
echo ""

print_success "Script terminé avec succès !"
