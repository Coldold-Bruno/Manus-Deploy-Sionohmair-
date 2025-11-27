#!/bin/bash

###############################################################################
# Script d'Initialisation Complète du Système NFT de Gratitude Économique
# Sionohmair Insight Academy
###############################################################################

set -e  # Exit on error

echo "🚀 Initialisation du Système NFT de Gratitude Économique"
echo "=========================================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_step() {
    echo -e "${BLUE}▶${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "Erreur : package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

log_info "Répertoire du projet détecté : $(pwd)"
echo ""

# Étape 1 : Vérifier les dépendances
log_step "Étape 1/5 : Vérification des dépendances"
echo ""

if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    log_warn "pnpm n'est pas installé. Installation en cours..."
    npm install -g pnpm
fi

log_info "Node.js version : $(node --version)"
log_info "pnpm version : $(pnpm --version)"
echo ""

# Étape 2 : Installer les dépendances
log_step "Étape 2/5 : Installation des dépendances"
echo ""

if [ ! -d "node_modules" ]; then
    log_info "Installation des dépendances npm..."
    pnpm install
else
    log_info "Dépendances déjà installées"
fi
echo ""

# Étape 3 : Configurer la base de données
log_step "Étape 3/5 : Configuration de la base de données"
echo ""

if [ ! -f ".env" ]; then
    log_warn "Fichier .env non trouvé"
    read -p "Voulez-vous créer un fichier .env maintenant ? (y/n) : " create_env
    
    if [ "$create_env" = "y" ]; then
        log_info "Création du fichier .env..."
        cat > .env << 'EOF'
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/sionohmair"

# JWT
JWT_SECRET="your-secret-key-min-32-characters-long"

# OAuth (optionnel)
OAUTH_SERVER_URL="https://oauth.manus.space"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.space"

# Stripe (optionnel)
STRIPE_SECRET_KEY="sk_test_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Cron Jobs
CRON_SECRET="your-cron-secret-min-32-characters"

# Email (optionnel)
SENDGRID_API_KEY=""
MAILGUN_API_KEY=""

# Analytics (optionnel)
GOOGLE_ANALYTICS_API_KEY=""
EOF
        log_info "Fichier .env créé. Veuillez le configurer avant de continuer."
        log_warn "Éditez le fichier .env avec vos vraies valeurs, puis relancez ce script."
        exit 0
    else
        log_error "Fichier .env requis pour continuer"
        exit 1
    fi
else
    log_info "Fichier .env détecté"
fi

# Appliquer les migrations
log_info "Application des migrations de base de données..."
pnpm db:push || log_warn "Erreur lors de l'application des migrations (continuons quand même)"
echo ""

# Étape 4 : Initialiser les NFT Sources
log_step "Étape 4/5 : Initialisation des NFT Sources"
echo ""

log_info "Les NFT Sources seront initialisés automatiquement au premier accès à /admin/seed-nft"
log_info "Ou vous pouvez les créer manuellement via l'interface admin"
echo ""

# Étape 5 : Configuration des cron jobs
log_step "Étape 5/5 : Configuration des cron jobs (optionnel)"
echo ""

read -p "Voulez-vous configurer les cron jobs maintenant ? (y/n) : " setup_cron

if [ "$setup_cron" = "y" ]; then
    if [ -f "deploy-cron.sh" ]; then
        log_info "Lancement du script de déploiement des cron jobs..."
        chmod +x deploy-cron.sh
        ./deploy-cron.sh
    else
        log_error "Script deploy-cron.sh non trouvé"
    fi
else
    log_info "Configuration des cron jobs ignorée (vous pouvez le faire plus tard avec ./deploy-cron.sh)"
fi
echo ""

# Résumé final
echo "=================================================================="
log_info "Initialisation terminée avec succès ! 🎉"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Démarrer le serveur de développement :"
echo "   pnpm dev"
echo ""
echo "2. Accéder à l'application :"
echo "   http://localhost:3000"
echo ""
echo "3. Initialiser les NFT Sources :"
echo "   http://localhost:3000/admin/seed-nft"
echo ""
echo "4. Configurer les API keys :"
echo "   http://localhost:3000/admin/api-keys"
echo ""
echo "5. Superviser le système :"
echo "   http://localhost:3000/admin/monitoring"
echo ""
echo "📚 Documentation :"
echo "- Guide de test : TESTING_GUIDE.md"
echo "- Configuration cron : CRON_SETUP.md"
echo "- Déploiement : DEPLOYMENT.md (à créer)"
echo ""
echo "🔐 Sécurité :"
echo "- Changez tous les secrets dans .env avant la production"
echo "- Ne commitez JAMAIS le fichier .env dans Git"
echo "- Utilisez des variables d'environnement en production"
echo ""
echo "=================================================================="
log_info "Le système NFT de Gratitude Économique est prêt ! 🚀"
echo ""
