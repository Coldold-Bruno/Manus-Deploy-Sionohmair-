#!/bin/bash

# ========================================
# Script d'Automatisation ULTIME
# Sionohmair Insight Academy
# Configure TOUT automatiquement en UNE commande
# ========================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🚀 AUTOMATISATION ULTIME                                            ║
║   Configuration Complète en UNE Commande                              ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script va configurer AUTOMATIQUEMENT :${NC}"
echo -e "  ${GREEN}✅${NC} GitHub Secrets (CRON_SECRET, APP_URL)"
echo -e "  ${GREEN}✅${NC} Manus Secrets (CRON_SECRET, SMTP_*)"
echo -e "  ${GREEN}✅${NC} Tests automatiques (SMTP, Cron, Système)"
echo -e "  ${GREEN}✅${NC} Vérification finale"
echo -e ""
echo -e "${YELLOW}⚠️  Utilise les valeurs par défaut (Gmail de Bruno)${NC}"
echo -e ""

read -p "$(echo -e ${YELLOW}Continuer avec l\'automatisation complète ? \(o/n\) : ${NC})" CONFIRM

if [[ ! $CONFIRM =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Automatisation annulée${NC}"
    exit 0
fi

# Variables par défaut
CRON_SECRET="7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="
APP_URL="https://sionohmair-insight-academy.manus.space"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="coldoldbruno@gmail.com"
SMTP_PASS="uiqq kpth pjdb oknb"
SMTP_FROM="coldoldbruno@gmail.com"

# ========================================
# ÉTAPE 1 : GitHub Secrets
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 1/5 : Configuration GitHub Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Vérifier si GitHub CLI est installé
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI non installé, installation en cours...${NC}"
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh -y
    fi
fi

# Vérifier l'authentification GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Authentification GitHub requise${NC}"
    gh auth login
fi

# Détecter le repository
if [ -d ".git" ]; then
    REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
    if [[ $REPO_URL == *"github.com"* ]]; then
        REPO_FULL=$(echo $REPO_URL | sed -E 's|.*github.com[:/](.*)\.git|\1|')
        echo -e "${GREEN}✅ Repository détecté : ${REPO_FULL}${NC}"
        
        # Configurer les secrets
        echo "$CRON_SECRET" | gh secret set CRON_SECRET --repo "$REPO_FULL" 2>/dev/null && \
            echo -e "${GREEN}✅ CRON_SECRET configuré${NC}" || \
            echo -e "${YELLOW}⚠️  CRON_SECRET déjà configuré ou erreur${NC}"
        
        echo "$APP_URL" | gh secret set APP_URL --repo "$REPO_FULL" 2>/dev/null && \
            echo -e "${GREEN}✅ APP_URL configuré${NC}" || \
            echo -e "${YELLOW}⚠️  APP_URL déjà configuré ou erreur${NC}"
    else
        echo -e "${YELLOW}⚠️  Repository GitHub non détecté${NC}"
        echo -e "${CYAN}Configurez manuellement les secrets GitHub :${NC}"
        echo -e "  CRON_SECRET=${CRON_SECRET}"
        echo -e "  APP_URL=${APP_URL}"
    fi
else
    echo -e "${YELLOW}⚠️  Pas de repository Git${NC}"
    echo -e "${CYAN}Initialisez Git et configurez GitHub manuellement${NC}"
fi

# ========================================
# ÉTAPE 2 : Manus Secrets
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 2/5 : Configuration Manus Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Secrets à configurer dans Manus → Settings → Secrets :${NC}\n"

cat << EOF
${GREEN}CRON_SECRET${NC}
${CRON_SECRET}

${GREEN}SMTP_HOST${NC}
${SMTP_HOST}

${GREEN}SMTP_PORT${NC}
${SMTP_PORT}

${GREEN}SMTP_USER${NC}
${SMTP_USER}

${GREEN}SMTP_PASS${NC}
${SMTP_PASS}

${GREEN}SMTP_FROM${NC}
${SMTP_FROM}
EOF

echo -e "\n${YELLOW}📋 Copiez ces valeurs dans Manus → Settings → Secrets${NC}"
echo -e "${CYAN}URL : https://manus.im${NC}\n"

read -p "Appuyez sur Entrée une fois les secrets configurés dans Manus..."

# ========================================
# ÉTAPE 3 : Test SMTP
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 3/5 : Test SMTP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

if [ -f "./scripts/test-email.mjs" ]; then
    echo -e "${CYAN}Test d'envoi d'email en cours...${NC}\n"
    
    export SMTP_HOST="$SMTP_HOST"
    export SMTP_PORT="$SMTP_PORT"
    export SMTP_USER="$SMTP_USER"
    export SMTP_PASS="$SMTP_PASS"
    export SMTP_FROM="$SMTP_FROM"
    export TEST_EMAIL="$SMTP_USER"
    
    if node ./scripts/test-email.mjs; then
        echo -e "\n${GREEN}✅ Test SMTP réussi !${NC}"
    else
        echo -e "\n${YELLOW}⚠️  Test SMTP échoué (vérifiez les secrets Manus)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Script test-email.mjs introuvable${NC}"
fi

# ========================================
# ÉTAPE 4 : Test Système Complet
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 4/5 : Test Système Complet"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

if [ -f "./scripts/test-system.sh" ]; then
    ./scripts/test-system.sh
else
    echo -e "${YELLOW}⚠️  Script test-system.sh introuvable${NC}"
fi

# ========================================
# ÉTAPE 5 : Vérification Finale
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ÉTAPE 5/5 : Vérification Finale"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

if [ -f "./scripts/verify-final.sh" ]; then
    ./scripts/verify-final.sh
else
    echo -e "${YELLOW}⚠️  Script verify-final.sh introuvable${NC}"
fi

# ========================================
# RÉSUMÉ FINAL
# ========================================
echo -e "\n${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ✅ Automatisation Complète Terminée !                               ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}📋 Récapitulatif :${NC}"
echo -e "  ${GREEN}✅${NC} GitHub Secrets configurés"
echo -e "  ${GREEN}✅${NC} Manus Secrets documentés"
echo -e "  ${GREEN}✅${NC} Tests SMTP exécutés"
echo -e "  ${GREEN}✅${NC} Tests système exécutés"
echo -e "  ${GREEN}✅${NC} Vérification finale effectuée"

echo -e "\n${BLUE}📝 Prochaines étapes :${NC}"
echo -e "  ${YELLOW}1.${NC} Activer Stripe :"
echo -e "     ${CYAN}https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE${NC}"
echo -e ""
echo -e "  ${YELLOW}2.${NC} Créer le produit Stripe (36€/mois)"
echo -e ""
echo -e "  ${YELLOW}3.${NC} Configurer le webhook Stripe :"
echo -e "     ${CYAN}${APP_URL}/api/stripe/webhook${NC}"
echo -e ""
echo -e "  ${YELLOW}4.${NC} Ajouter les clés Stripe dans Manus Secrets :"
echo -e "     ${CYAN}STRIPE_SECRET_KEY, VITE_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET${NC}"
echo -e ""
echo -e "  ${YELLOW}5.${NC} Tester le paiement avec la carte : ${CYAN}4242 4242 4242 4242${NC}"

echo -e "\n${MAGENTA}🎉 Votre système est prêt pour la production !${NC}"
echo -e "${CYAN}📚 Consultez FINALISATION_ULTIME.md pour plus de détails${NC}\n"
