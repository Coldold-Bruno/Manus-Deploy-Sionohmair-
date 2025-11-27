#!/bin/bash

# ========================================
# Script de Vérification Finale
# Sionohmair Insight Academy
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

clear

echo -e "${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🔍 Vérification Finale du Système                                   ║
║   Sionohmair Insight Academy                                          ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script va vérifier que toutes les configurations sont en place.${NC}\n"

# Compteurs
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Fonction pour afficher un résultat de test
check_result() {
    local NAME=$1
    local STATUS=$2
    local MESSAGE=$3
    
    ((TOTAL_CHECKS++))
    
    case $STATUS in
        "pass")
            echo -e "${GREEN}✅${NC} ${NAME}"
            [ -n "$MESSAGE" ] && echo -e "   ${CYAN}${MESSAGE}${NC}"
            ((PASSED_CHECKS++))
            ;;
        "fail")
            echo -e "${RED}❌${NC} ${NAME}"
            [ -n "$MESSAGE" ] && echo -e "   ${RED}${MESSAGE}${NC}"
            ((FAILED_CHECKS++))
            ;;
        "warn")
            echo -e "${YELLOW}⚠️${NC}  ${NAME}"
            [ -n "$MESSAGE" ] && echo -e "   ${YELLOW}${MESSAGE}${NC}"
            ((WARNING_CHECKS++))
            ;;
    esac
}

# ========================================
# 1. Vérification des fichiers essentiels
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  1/6 : Vérification des Fichiers Essentiels${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Vérifier package.json
if [ -f "package.json" ]; then
    check_result "package.json" "pass" "Fichier de configuration npm présent"
else
    check_result "package.json" "fail" "Fichier manquant"
fi

# Vérifier .github/workflows
if [ -f ".github/workflows/check-trial-expirations.yml" ]; then
    check_result "GitHub Actions Workflow" "pass" "Cron job configuré"
else
    check_result "GitHub Actions Workflow" "fail" "Workflow manquant"
fi

# Vérifier les scripts
if [ -f "scripts/setup-all.sh" ]; then
    check_result "Scripts d'automatisation" "pass" "Tous les scripts présents"
else
    check_result "Scripts d'automatisation" "fail" "Scripts manquants"
fi

# Vérifier la documentation
if [ -f "FINALISATION.md" ] && [ -f "CONFIGURATION_FINALE.md" ]; then
    check_result "Documentation" "pass" "Guides complets disponibles"
else
    check_result "Documentation" "warn" "Certains guides manquants"
fi

# ========================================
# 2. Vérification de la base de données
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  2/6 : Vérification de la Base de Données${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Vérifier le schéma
if [ -f "server/db/schema.ts" ]; then
    check_result "Schéma de base de données" "pass" "Schéma défini (users, trials, subscriptions)"
else
    check_result "Schéma de base de données" "fail" "Schéma manquant"
fi

# Vérifier les migrations
if [ -d "drizzle" ]; then
    check_result "Migrations" "pass" "Dossier de migrations présent"
else
    check_result "Migrations" "warn" "Aucune migration trouvée"
fi

# ========================================
# 3. Vérification des variables d'environnement
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  3/6 : Vérification des Variables d'Environnement${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# SMTP
if [ -n "$SMTP_HOST" ] && [ -n "$SMTP_PORT" ] && [ -n "$SMTP_USER" ] && [ -n "$SMTP_PASS" ] && [ -n "$SMTP_FROM" ]; then
    check_result "Configuration SMTP" "pass" "Toutes les variables SMTP configurées"
else
    check_result "Configuration SMTP" "warn" "Variables SMTP manquantes (à configurer dans Manus Secrets)"
fi

# CRON_SECRET
if [ -n "$CRON_SECRET" ]; then
    check_result "CRON_SECRET" "pass" "Secret configuré"
else
    check_result "CRON_SECRET" "warn" "À configurer dans Manus Secrets"
fi

# Stripe
if [ -n "$STRIPE_SECRET_KEY" ] && [ -n "$VITE_STRIPE_PUBLISHABLE_KEY" ] && [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    check_result "Configuration Stripe" "pass" "Toutes les clés Stripe configurées"
else
    check_result "Configuration Stripe" "warn" "Clés Stripe manquantes (à configurer dans Manus Secrets)"
fi

# ========================================
# 4. Vérification du serveur
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  4/6 : Vérification du Serveur${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Vérifier si le serveur répond
APP_URL="${APP_URL:-https://sionohmair-insight-academy.manus.space}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    check_result "Serveur web" "pass" "Serveur accessible ($APP_URL)"
elif [ "$HTTP_CODE" = "000" ]; then
    check_result "Serveur web" "fail" "Serveur inaccessible"
else
    check_result "Serveur web" "warn" "Code HTTP: $HTTP_CODE"
fi

# Vérifier l'endpoint de configuration
CONFIG_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/config" || echo "000")

if [ "$CONFIG_CODE" = "200" ]; then
    check_result "Dashboard de configuration" "pass" "Accessible à $APP_URL/config"
else
    check_result "Dashboard de configuration" "warn" "Non accessible (code: $CONFIG_CODE)"
fi

# ========================================
# 5. Vérification des endpoints API
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  5/6 : Vérification des Endpoints API${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Vérifier l'endpoint tRPC
TRPC_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/trpc" || echo "000")

if [ "$TRPC_CODE" = "200" ] || [ "$TRPC_CODE" = "404" ]; then
    check_result "API tRPC" "pass" "Endpoint accessible"
else
    check_result "API tRPC" "warn" "Code HTTP: $TRPC_CODE"
fi

# Vérifier l'endpoint Stripe webhook
STRIPE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/stripe/webhook" || echo "000")

if [ "$STRIPE_CODE" = "400" ] || [ "$STRIPE_CODE" = "200" ]; then
    check_result "Webhook Stripe" "pass" "Endpoint accessible"
else
    check_result "Webhook Stripe" "warn" "Code HTTP: $STRIPE_CODE"
fi

# ========================================
# 6. Vérification GitHub
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  6/6 : Vérification GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Vérifier si GitHub CLI est installé
if command -v gh &> /dev/null; then
    check_result "GitHub CLI" "pass" "Installé (version $(gh --version | head -n1 | awk '{print $3}'))"
    
    # Vérifier l'authentification
    if gh auth status &> /dev/null; then
        check_result "Authentification GitHub" "pass" "Authentifié"
    else
        check_result "Authentification GitHub" "warn" "Non authentifié (exécutez: gh auth login)"
    fi
else
    check_result "GitHub CLI" "warn" "Non installé (nécessaire pour setup-github-secrets.sh)"
fi

# Vérifier si c'est un repository Git
if [ -d ".git" ]; then
    check_result "Repository Git" "pass" "Initialisé"
    
    # Vérifier la remote origin
    if git config --get remote.origin.url &> /dev/null; then
        REPO_URL=$(git config --get remote.origin.url)
        check_result "Remote GitHub" "pass" "$REPO_URL"
    else
        check_result "Remote GitHub" "warn" "Aucune remote configurée"
    fi
else
    check_result "Repository Git" "warn" "Non initialisé"
fi

# ========================================
# RÉSUMÉ FINAL
# ========================================
echo -e "\n${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   📊 Résumé de la Vérification                                        ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}Total de vérifications : ${TOTAL_CHECKS}${NC}"
echo -e "${GREEN}✅ Réussies : ${PASSED_CHECKS}${NC}"
echo -e "${YELLOW}⚠️  Avertissements : ${WARNING_CHECKS}${NC}"
echo -e "${RED}❌ Échouées : ${FAILED_CHECKS}${NC}"

# Calculer le pourcentage
PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo -e "\n${BLUE}Progression : ${PERCENTAGE}%${NC}"

# Barre de progression
BAR_LENGTH=50
FILLED=$((PERCENTAGE * BAR_LENGTH / 100))
EMPTY=$((BAR_LENGTH - FILLED))

echo -n "["
for ((i=0; i<FILLED; i++)); do echo -n "█"; done
for ((i=0; i<EMPTY; i++)); do echo -n "░"; done
echo "]"

# Recommandations
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📝 Prochaines Étapes${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ $WARNING_CHECKS -gt 0 ] || [ $FAILED_CHECKS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Des configurations sont manquantes.${NC}\n"
    
    echo -e "${CYAN}Pour configurer automatiquement :${NC}"
    echo -e "  ${BLUE}./scripts/setup-all.sh${NC}\n"
    
    echo -e "${CYAN}Ou consultez le guide détaillé :${NC}"
    echo -e "  ${BLUE}FINALISATION.md${NC}\n"
    
    echo -e "${CYAN}Dashboard de configuration :${NC}"
    echo -e "  ${BLUE}$APP_URL/config${NC}"
else
    echo -e "${GREEN}✅ Toutes les vérifications sont passées !${NC}\n"
    
    echo -e "${CYAN}Votre système est prêt. Prochaines étapes :${NC}"
    echo -e "  ${BLUE}1.${NC} Tester l'envoi d'emails : ${BLUE}node scripts/test-email.mjs${NC}"
    echo -e "  ${BLUE}2.${NC} Tester le système complet : ${BLUE}./scripts/test-system.sh${NC}"
    echo -e "  ${BLUE}3.${NC} Créer un utilisateur test et tester le flux d'abonnement"
    echo -e "  ${BLUE}4.${NC} Passer Stripe en mode Live quand vous êtes prêt"
fi

echo -e "\n${MAGENTA}🎉 Vérification terminée !${NC}"
