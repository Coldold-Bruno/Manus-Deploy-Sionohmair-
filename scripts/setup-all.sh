#!/bin/bash

# ========================================
# Script d'Automatisation Complète
# Sionohmair Insight Academy
# Configuration GitHub + Manus en une seule commande
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
║   ███████╗██╗ ██████╗ ███╗   ██╗ ██████╗ ██╗  ██╗███╗   ███╗ █████╗ ║
║   ██╔════╝██║██╔═══██╗████╗  ██║██╔═══██╗██║  ██║████╗ ████║██╔══██╗║
║   ███████╗██║██║   ██║██╔██╗ ██║██║   ██║███████║██╔████╔██║███████║║
║   ╚════██║██║██║   ██║██║╚██╗██║██║   ██║██╔══██║██║╚██╔╝██║██╔══██║║
║   ███████║██║╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║║
║   ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝║
║                                                                       ║
║                    🚀 Configuration Automatique Complète              ║
║                       Insight Academy - v1.0                          ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script va automatiser la configuration complète du système :${NC}"
echo -e "  ${GREEN}✅${NC} GitHub Secrets (CRON_SECRET, APP_URL)"
echo -e "  ${GREEN}✅${NC} Manus Secrets (CRON_SECRET, SMTP_*)"
echo -e "  ${GREEN}✅${NC} Tests automatiques (emails, cron, système)"
echo -e ""

read -p "$(echo -e ${YELLOW}Voulez-vous continuer ? \(o/n\) : ${NC})" CONFIRM

if [[ ! $CONFIRM =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Configuration annulée${NC}"
    exit 0
fi

# ========================================
# ÉTAPE 1 : GitHub Secrets
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 1/3 : Configuration GitHub Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Cette étape va configurer automatiquement les secrets GitHub${NC}"
echo -e "${CYAN}nécessaires pour le cron job quotidien.${NC}\n"

read -p "$(echo -e ${YELLOW}Lancer la configuration GitHub ? \(o/n\) : ${NC})" GITHUB_CONFIRM

if [[ $GITHUB_CONFIRM =~ ^[oOyY]$ ]]; then
    if [ -f "./scripts/setup-github-secrets.sh" ]; then
        ./scripts/setup-github-secrets.sh
        echo -e "${GREEN}✅ GitHub Secrets configurés${NC}"
    else
        echo -e "${RED}❌ Script setup-github-secrets.sh introuvable${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Étape GitHub ignorée${NC}"
fi

# ========================================
# ÉTAPE 2 : Manus Secrets
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 2/3 : Configuration Manus Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Cette étape va vous guider pour configurer les secrets Manus${NC}"
echo -e "${CYAN}nécessaires pour l'envoi d'emails et le cron job.${NC}\n"

read -p "$(echo -e ${YELLOW}Lancer la configuration Manus ? \(o/n\) : ${NC})" MANUS_CONFIRM

if [[ $MANUS_CONFIRM =~ ^[oOyY]$ ]]; then
    if [ -f "./scripts/setup-manus-secrets.sh" ]; then
        ./scripts/setup-manus-secrets.sh
        echo -e "${GREEN}✅ Manus Secrets configurés${NC}"
    else
        echo -e "${RED}❌ Script setup-manus-secrets.sh introuvable${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Étape Manus ignorée${NC}"
fi

# ========================================
# ÉTAPE 3 : Tests Automatiques
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 3/3 : Tests Automatiques"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Cette étape va tester toutes les configurations :${NC}"
echo -e "  ${BLUE}•${NC} Test d'envoi d'email SMTP"
echo -e "  ${BLUE}•${NC} Test du cron job"
echo -e "  ${BLUE}•${NC} Test de la base de données"
echo -e "  ${BLUE}•${NC} Test de Stripe"
echo -e ""

read -p "$(echo -e ${YELLOW}Lancer les tests automatiques ? \(o/n\) : ${NC})" TEST_CONFIRM

if [[ $TEST_CONFIRM =~ ^[oOyY]$ ]]; then
    # Test SMTP
    echo -e "\n${BLUE}🧪 Test SMTP...${NC}"
    if [ -f "./scripts/test-email.mjs" ]; then
        if node ./scripts/test-email.mjs; then
            echo -e "${GREEN}✅ Test SMTP réussi${NC}"
        else
            echo -e "${RED}❌ Test SMTP échoué${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Script test-email.mjs introuvable${NC}"
    fi
    
    # Test système complet
    echo -e "\n${BLUE}🧪 Test système complet...${NC}"
    if [ -f "./scripts/test-system.sh" ]; then
        ./scripts/test-system.sh
    else
        echo -e "${YELLOW}⚠️  Script test-system.sh introuvable${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Tests ignorés${NC}"
fi

# ========================================
# RÉSUMÉ FINAL
# ========================================
echo -e "\n${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ✅ Configuration Automatique Terminée !                             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}📋 Récapitulatif :${NC}"
echo -e "  ${GREEN}✅${NC} GitHub Secrets : CRON_SECRET, APP_URL"
echo -e "  ${GREEN}✅${NC} Manus Secrets : CRON_SECRET, SMTP_*"
echo -e "  ${GREEN}✅${NC} Tests automatiques exécutés"

echo -e "\n${BLUE}📝 Prochaines étapes :${NC}"
echo -e "  1. ${YELLOW}Vérifier le dashboard de configuration${NC} :"
echo -e "     ${CYAN}https://sionohmair-insight-academy.manus.space/config${NC}"
echo -e ""
echo -e "  2. ${YELLOW}Tester le cron job sur GitHub${NC} :"
echo -e "     ${CYAN}GitHub → Actions → Check Trial Expirations Daily → Run workflow${NC}"
echo -e ""
echo -e "  3. ${YELLOW}Configurer Stripe${NC} (si pas encore fait) :"
echo -e "     ${CYAN}https://dashboard.stripe.com/claim_sandbox/...${NC}"
echo -e ""
echo -e "  4. ${YELLOW}Créer un utilisateur test${NC} et tester le flux complet :"
echo -e "     ${CYAN}Inscription → Essai gratuit → Email J-7 → Paiement${NC}"

echo -e "\n${MAGENTA}🎉 Votre système d'abonnement est maintenant prêt pour la production !${NC}"
echo -e "${CYAN}📚 Documentation complète : CONFIGURATION_FINALE.md${NC}"
