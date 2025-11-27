#!/bin/bash

# ========================================
# Script d'Automatisation GitHub Actions
# ========================================
# Ce script configure automatiquement les secrets GitHub
# nécessaires pour les tâches CRON quotidiennes

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Bannière
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║       🤖 Configuration GitHub Actions Automatique      ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Fonction pour afficher les étapes
step() {
    echo -e "${BLUE}▶ $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# ========================================
# Étape 1 : Vérifier les prérequis
# ========================================

step "Étape 1/5 : Vérification des prérequis..."

# Vérifier si GitHub CLI est installé
if ! command -v gh &> /dev/null; then
    error "GitHub CLI (gh) n'est pas installé"
    echo ""
    echo "📦 Installation automatique de GitHub CLI..."
    
    # Détecter l'OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install gh
    else
        error "OS non supporté pour l'installation automatique"
        echo "Installez GitHub CLI manuellement : https://cli.github.com/"
        exit 1
    fi
    
    success "GitHub CLI installé avec succès"
fi

# Vérifier l'authentification GitHub
step "Vérification de l'authentification GitHub..."
if ! gh auth status &> /dev/null; then
    warning "Vous n'êtes pas authentifié sur GitHub"
    echo ""
    echo "🔐 Authentification GitHub requise..."
    gh auth login
    success "Authentification réussie"
else
    success "Déjà authentifié sur GitHub"
fi

# ========================================
# Étape 2 : Détecter le repository
# ========================================

step "Étape 2/5 : Détection du repository GitHub..."

# Vérifier si on est dans un repo Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Ce répertoire n'est pas un repository Git"
    exit 1
fi

# Obtenir le nom du repository
REPO_OWNER=$(gh repo view --json owner --jq .owner.login 2>/dev/null || echo "")
REPO_NAME=$(gh repo view --json name --jq .name 2>/dev/null || echo "")

if [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ]; then
    error "Impossible de détecter le repository GitHub"
    echo ""
    echo "Assurez-vous que :"
    echo "  1. Vous êtes dans le bon répertoire"
    echo "  2. Le repository a une remote GitHub configurée"
    echo "  3. Vous avez les permissions nécessaires"
    exit 1
fi

REPO_FULL="$REPO_OWNER/$REPO_NAME"
success "Repository détecté : $REPO_FULL"

# ========================================
# Étape 3 : Récupérer les valeurs des secrets
# ========================================

step "Étape 3/5 : Récupération des valeurs des secrets..."

# CRON_SECRET
CRON_SECRET="7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="
success "CRON_SECRET : $CRON_SECRET"

# APP_URL
echo ""
echo "📝 Entrez l'URL de votre application déployée :"
echo "   Exemple : https://sionohmair-insight-academy.manus.space"
echo "   Ou : https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer"
echo ""
read -p "APP_URL : " APP_URL

if [ -z "$APP_URL" ]; then
    error "APP_URL ne peut pas être vide"
    exit 1
fi

# Supprimer le slash final si présent
APP_URL="${APP_URL%/}"

success "APP_URL : $APP_URL"

# ========================================
# Étape 4 : Configurer les secrets GitHub
# ========================================

step "Étape 4/5 : Configuration des secrets GitHub..."

echo ""
echo "🔐 Configuration du secret CRON_SECRET..."
if gh secret set CRON_SECRET --body "$CRON_SECRET" --repo "$REPO_FULL"; then
    success "CRON_SECRET configuré"
else
    error "Échec de la configuration de CRON_SECRET"
    exit 1
fi

echo ""
echo "🔐 Configuration du secret APP_URL..."
if gh secret set APP_URL --body "$APP_URL" --repo "$REPO_FULL"; then
    success "APP_URL configuré"
else
    error "Échec de la configuration de APP_URL"
    exit 1
fi

# ========================================
# Étape 5 : Vérification
# ========================================

step "Étape 5/5 : Vérification de la configuration..."

echo ""
echo "📋 Liste des secrets configurés :"
gh secret list --repo "$REPO_FULL"

# ========================================
# Résumé
# ========================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║          ✅ Configuration Terminée avec Succès          ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "📊 Résumé de la configuration :"
echo "  • Repository : $REPO_FULL"
echo "  • CRON_SECRET : ✅ Configuré"
echo "  • APP_URL : ✅ Configuré ($APP_URL)"
echo ""

echo "🚀 Prochaines étapes :"
echo ""
echo "  1. Vérifiez que le workflow est activé :"
echo "     https://github.com/$REPO_FULL/actions"
echo ""
echo "  2. Testez manuellement le workflow :"
echo "     • Allez dans l'onglet Actions"
echo "     • Sélectionnez 'Check Trial Expirations'"
echo "     • Cliquez sur 'Run workflow'"
echo ""
echo "  3. Le workflow s'exécutera automatiquement tous les jours à 9h00 (UTC+1)"
echo ""

echo "📚 Documentation :"
echo "  • Workflow : .github/workflows/check-trial-expirations.yml"
echo "  • Guide CRON : docs/GUIDE_CRON_CONFIGURATION.md"
echo ""

success "Configuration GitHub Actions terminée ! 🎉"
echo ""
