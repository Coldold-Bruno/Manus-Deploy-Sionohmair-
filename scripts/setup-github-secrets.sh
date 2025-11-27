#!/bin/bash

# ========================================
# Script d'Automatisation GitHub Secrets
# Sionohmair Insight Academy
# ========================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🔐 Configuration Automatique GitHub Secrets             ║"
echo "║   Sionohmair Insight Academy                              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérifier si GitHub CLI est installé
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) n'est pas installé${NC}"
    echo -e "${YELLOW}Installation de GitHub CLI...${NC}"
    
    # Installer GitHub CLI
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    else
        echo -e "${RED}❌ Système d'exploitation non supporté${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ GitHub CLI installé avec succès${NC}"
fi

# Vérifier l'authentification GitHub
echo -e "\n${BLUE}🔍 Vérification de l'authentification GitHub...${NC}"
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas authentifié sur GitHub${NC}"
    echo -e "${BLUE}Lancement de l'authentification...${NC}"
    gh auth login
else
    echo -e "${GREEN}✅ Authentifié sur GitHub${NC}"
fi

# Détecter le repository GitHub
echo -e "\n${BLUE}🔍 Détection du repository GitHub...${NC}"

# Essayer de détecter automatiquement le repository
if [ -d ".git" ]; then
    REPO_URL=$(git config --get remote.origin.url)
    if [[ $REPO_URL == *"github.com"* ]]; then
        # Extraire owner/repo depuis l'URL
        REPO_FULL=$(echo $REPO_URL | sed -E 's|.*github.com[:/](.*)\.git|\1|')
        echo -e "${GREEN}✅ Repository détecté : ${REPO_FULL}${NC}"
    else
        echo -e "${YELLOW}⚠️  Pas de repository GitHub détecté${NC}"
        REPO_FULL=""
    fi
else
    echo -e "${YELLOW}⚠️  Pas de dossier .git trouvé${NC}"
    REPO_FULL=""
fi

# Demander confirmation ou saisie manuelle
if [ -z "$REPO_FULL" ]; then
    echo -e "${YELLOW}Veuillez entrer le repository GitHub (format: owner/repo)${NC}"
    read -p "Repository : " REPO_FULL
fi

# Valider le format
if [[ ! $REPO_FULL =~ ^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$ ]]; then
    echo -e "${RED}❌ Format invalide. Utilisez : owner/repo${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Repository : ${REPO_FULL}${NC}"

# Définir les secrets à configurer
CRON_SECRET="7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="
APP_URL="https://sionohmair-insight-academy.manus.space"

echo -e "\n${BLUE}📋 Secrets à configurer :${NC}"
echo -e "  1. CRON_SECRET : ${CRON_SECRET}"
echo -e "  2. APP_URL : ${APP_URL}"

# Demander confirmation
echo -e "\n${YELLOW}⚠️  Cette opération va créer/mettre à jour les secrets GitHub${NC}"
read -p "Continuer ? (o/n) : " CONFIRM

if [[ ! $CONFIRM =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Opération annulée${NC}"
    exit 0
fi

# Configurer les secrets
echo -e "\n${BLUE}🔐 Configuration des secrets GitHub...${NC}"

# Secret 1 : CRON_SECRET
echo -e "\n${YELLOW}Configuration de CRON_SECRET...${NC}"
echo "$CRON_SECRET" | gh secret set CRON_SECRET --repo "$REPO_FULL"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CRON_SECRET configuré${NC}"
else
    echo -e "${RED}❌ Erreur lors de la configuration de CRON_SECRET${NC}"
fi

# Secret 2 : APP_URL
echo -e "\n${YELLOW}Configuration de APP_URL...${NC}"
echo "$APP_URL" | gh secret set APP_URL --repo "$REPO_FULL"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ APP_URL configuré${NC}"
else
    echo -e "${RED}❌ Erreur lors de la configuration de APP_URL${NC}"
fi

# Vérifier les secrets configurés
echo -e "\n${BLUE}🔍 Vérification des secrets configurés...${NC}"
gh secret list --repo "$REPO_FULL"

echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅ Configuration GitHub Secrets Terminée !              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${BLUE}📝 Prochaines étapes :${NC}"
echo -e "  1. Vérifier les secrets sur GitHub → Settings → Secrets → Actions"
echo -e "  2. Configurer les mêmes secrets sur Manus (Settings → Secrets)"
echo -e "  3. Tester le cron job : GitHub → Actions → Run workflow"
echo -e "\n${YELLOW}💡 Pour configurer Manus, utilisez :${NC}"
echo -e "  ${BLUE}./scripts/setup-manus-secrets.sh${NC}"
