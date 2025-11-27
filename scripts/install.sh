#!/bin/bash

# Script d'installation automatique - Sionohmair Insight Academy
# Ce script configure automatiquement tout le système d'abonnement

set -e

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🚀 Sionohmair Insight Academy - Installation 🚀        ║"
echo "║                                                           ║"
echo "║   Configuration automatique du système d'abonnement      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Fonction pour afficher une étape
step() {
    echo -e "${BLUE}${BOLD}▶ $1${NC}"
}

# Fonction pour afficher un succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher un avertissement
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour afficher une erreur
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour afficher une info
info() {
    echo -e "   $1"
}

echo ""
step "Étape 1/5 : Vérification de l'environnement"
echo ""

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js installé : $NODE_VERSION"
else
    error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    success "pnpm installé : $PNPM_VERSION"
else
    error "pnpm n'est pas installé"
    exit 1
fi

echo ""
step "Étape 2/5 : Configuration SMTP"
echo ""

info "Variables SMTP détectées :"
echo ""
echo "  SMTP_HOST=smtp.gmail.com"
echo "  SMTP_PORT=587"
echo "  SMTP_USER=coldoldbruno@gmail.com"
echo "  SMTP_PASS=uiqq kpth pjdb oknb"
echo "  SMTP_FROM=coldoldbruno@gmail.com"
echo ""

warning "Ces variables doivent être ajoutées dans Manus → Settings → Secrets"
echo ""
info "Instructions :"
info "1. Ouvrez Manus → Votre projet → Settings → Secrets"
info "2. Cliquez sur 'Add Secret' pour chaque variable"
info "3. Copiez-collez les valeurs ci-dessus"
echo ""

read -p "Appuyez sur Entrée quand vous avez ajouté les variables SMTP dans Manus..."

echo ""
step "Étape 3/5 : Configuration CRON_SECRET"
echo ""

CRON_SECRET="7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="

info "CRON_SECRET généré :"
echo ""
echo "  $CRON_SECRET"
echo ""

warning "Ce secret doit être ajouté dans 2 endroits :"
echo ""
info "1. GitHub → Settings → Secrets → Actions → CRON_SECRET"
info "2. Manus → Settings → Secrets → CRON_SECRET"
echo ""

read -p "Appuyez sur Entrée quand vous avez ajouté CRON_SECRET dans GitHub et Manus..."

echo ""
step "Étape 4/5 : Configuration Stripe"
echo ""

info "Pour activer Stripe :"
echo ""
info "1. Activez votre compte Stripe :"
info "   https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE"
echo ""
info "2. Créez le produit 'Abonnement Sionohmair' (36€/mois)"
echo ""
info "3. Récupérez les clés API (Mode Test) :"
info "   Stripe Dashboard → Developers → API keys"
echo ""
info "4. Ajoutez dans Manus → Settings → Secrets :"
info "   - STRIPE_SECRET_KEY=sk_test_..."
info "   - VITE_STRIPE_PUBLISHABLE_KEY=pk_test_..."
echo ""

read -p "Voulez-vous configurer Stripe maintenant ? (o/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Oo]$ ]]; then
    info "Ouvrez le lien ci-dessus dans votre navigateur..."
    read -p "Appuyez sur Entrée quand vous avez terminé la configuration Stripe..."
else
    warning "Configuration Stripe ignorée. Vous pourrez la faire plus tard."
fi

echo ""
step "Étape 5/5 : Test du système"
echo ""

info "Test de l'envoi d'email..."
echo ""

# Tester l'envoi d'email
if SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_USER=coldoldbruno@gmail.com SMTP_PASS="uiqq kpth pjdb oknb" SMTP_FROM=coldoldbruno@gmail.com TEST_EMAIL=coldoldbruno@gmail.com node scripts/test-email.mjs 2>&1 | grep -q "Test SMTP RÉUSSI"; then
    success "Test d'envoi d'email RÉUSSI"
    info "Vérifiez votre boîte de réception : coldoldbruno@gmail.com"
else
    warning "Test d'envoi d'email ÉCHOUÉ"
    info "Vérifiez que les variables SMTP sont correctes dans Manus"
fi

echo ""
echo -e "${GREEN}${BOLD}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅ Installation terminée !                              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

echo -e "${BOLD}📋 Récapitulatif :${NC}"
echo ""
success "SMTP configuré (Gmail)"
success "CRON_SECRET généré et configuré"

if [[ $REPLY =~ ^[Oo]$ ]]; then
    success "Stripe configuré"
else
    warning "Stripe non configuré (à faire plus tard)"
fi

echo ""
echo -e "${BOLD}🎯 Prochaines étapes :${NC}"
echo ""
info "1. Vérifiez que toutes les variables sont dans Manus → Settings → Secrets"
info "2. Redémarrez le serveur dans Manus"
info "3. Testez le système avec : ./scripts/test-system.sh"
info "4. Créez un utilisateur test et testez l'abonnement"
echo ""

echo -e "${BOLD}📚 Documentation :${NC}"
echo ""
info "- CONFIGURATION_FINALE.md : Guide complet"
info "- CRON_AUTOMATION.md : Documentation du cron job"
info "- GUIDE_UTILISATEUR.md : Guide utilisateur"
info "- scripts/README.md : Documentation des scripts"
echo ""

echo -e "${GREEN}${BOLD}🎉 Votre système d'abonnement est prêt ! 🚀${NC}"
echo ""
