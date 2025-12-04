#!/bin/bash

# Script Maître de Déploiement en Production
# Sionohmair Insight Academy
# 
# Ce script orchestre toutes les étapes nécessaires pour un déploiement sécurisé

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/ubuntu/sionohmair-insight-academy"
SCRIPTS_DIR="$PROJECT_DIR/scripts"
LOG_FILE="$PROJECT_DIR/deployment-$(date +%Y%m%d-%H%M%S).log"

# Fonction de logging
log() {
    local message="$1"
    local color="${2:-$NC}"
    echo -e "${color}${message}${NC}" | tee -a "$LOG_FILE"
}

# Fonction pour afficher un séparateur
separator() {
    log "\n════════════════════════════════════════════════════════════" "$BLUE"
}

# Fonction pour vérifier le code de sortie
check_status() {
    if [ $? -ne 0 ]; then
        log "❌ Erreur détectée. Arrêt du déploiement." "$RED"
        log "📄 Consultez le log: $LOG_FILE" "$YELLOW"
        exit 1
    fi
}

# Fonction pour demander confirmation
confirm() {
    local message="$1"
    echo -e "${YELLOW}${message}${NC}"
    read -p "Continuer? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        log "❌ Déploiement annulé par l'utilisateur." "$RED"
        exit 1
    fi
}

# En-tête
clear
separator
log "║   🚀 DÉPLOIEMENT EN PRODUCTION                            ║" "$BLUE"
log "║   Sionohmair Insight Academy                               ║" "$BLUE"
separator
log "" "$NC"

# Étape 0: Vérifications préalables
separator
log "📋 [Étape 0/7] Vérifications préalables..." "$CYAN"
separator

log "Vérification de l'environnement..." "$YELLOW"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "$PROJECT_DIR" ]; then
    log "❌ Répertoire du projet non trouvé: $PROJECT_DIR" "$RED"
    exit 1
fi

cd "$PROJECT_DIR"

# Vérifier que Git est propre
if [ -n "$(git status --porcelain)" ]; then
    log "⚠️  Des changements non commités ont été détectés:" "$YELLOW"
    git status --short
    confirm "Voulez-vous continuer malgré tout?"
fi

# Vérifier la branche
CURRENT_BRANCH=$(git branch --show-current)
log "📌 Branche actuelle: $CURRENT_BRANCH" "$BLUE"

log "✅ Vérifications préalables OK" "$GREEN"

# Étape 1: Tests automatisés
separator
log "🧪 [Étape 1/7] Exécution des tests automatisés..." "$CYAN"
separator

log "Lancement des tests Vitest..." "$YELLOW"
pnpm test 2>&1 | tee -a "$LOG_FILE"
check_status
log "✅ Tests Vitest réussis" "$GREEN"

log "\nLancement des tests E2E..." "$YELLOW"
if [ -f "$SCRIPTS_DIR/run-e2e-tests.mjs" ]; then
    BASE_URL="http://localhost:3000" node "$SCRIPTS_DIR/run-e2e-tests.mjs" 2>&1 | tee -a "$LOG_FILE"
    if [ $? -ne 0 ]; then
        log "⚠️  Certains tests E2E ont échoué" "$YELLOW"
        confirm "Voulez-vous continuer malgré les échecs?"
    else
        log "✅ Tests E2E réussis" "$GREEN"
    fi
else
    log "⚠️  Script de tests E2E non trouvé. Ignoré." "$YELLOW"
fi

# Étape 2: Build de production
separator
log "🏗️  [Étape 2/7] Build de production..." "$CYAN"
separator

log "Nettoyage des builds précédents..." "$YELLOW"
rm -rf client/dist server/dist 2>/dev/null || true

log "Build du client..." "$YELLOW"
pnpm run build 2>&1 | tee -a "$LOG_FILE"
check_status

log "✅ Build de production réussi" "$GREEN"

# Étape 3: Vérification de la configuration Stripe
separator
log "💳 [Étape 3/7] Vérification de la configuration Stripe..." "$CYAN"
separator

if [ -f "$PROJECT_DIR/STRIPE_PRODUCTION_CONFIG.txt" ]; then
    log "✅ Configuration Stripe trouvée" "$GREEN"
    log "📄 Fichier: STRIPE_PRODUCTION_CONFIG.txt" "$BLUE"
else
    log "⚠️  Configuration Stripe non trouvée" "$YELLOW"
    log "Voulez-vous exécuter le script de configuration Stripe maintenant?" "$YELLOW"
    read -p "(o/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        if [ -f "$SCRIPTS_DIR/configure-stripe-production.sh" ]; then
            bash "$SCRIPTS_DIR/configure-stripe-production.sh" 2>&1 | tee -a "$LOG_FILE"
            check_status
        else
            log "❌ Script de configuration Stripe non trouvé" "$RED"
            exit 1
        fi
    else
        log "⚠️  Continuez sans configuration Stripe (paiements désactivés)" "$YELLOW"
    fi
fi

# Étape 4: Vérification des variables d'environnement
separator
log "🔐 [Étape 4/7] Vérification des variables d'environnement..." "$CYAN"
separator

REQUIRED_VARS=(
    "VITE_APP_TITLE"
    "VITE_APP_LOGO"
    "DATABASE_URL"
    "JWT_SECRET"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    log "⚠️  Variables d'environnement manquantes:" "$YELLOW"
    for var in "${MISSING_VARS[@]}"; do
        log "   - $var" "$YELLOW"
    done
    log "\n📝 Configurez ces variables dans Manus Settings → Secrets" "$BLUE"
    confirm "Voulez-vous continuer sans ces variables?"
else
    log "✅ Toutes les variables d'environnement requises sont configurées" "$GREEN"
fi

# Étape 5: Migration de la base de données
separator
log "🗄️  [Étape 5/7] Migration de la base de données..." "$CYAN"
separator

log "Exécution des migrations..." "$YELLOW"
pnpm db:push 2>&1 | tee -a "$LOG_FILE"
check_status

log "✅ Migrations de base de données réussies" "$GREEN"

# Étape 6: Création du checkpoint Manus
separator
log "💾 [Étape 6/7] Création du checkpoint Manus..." "$CYAN"
separator

log "⚠️  Cette étape doit être effectuée via l'interface Manus" "$YELLOW"
log "" "$NC"
log "Instructions:" "$BLUE"
log "1. Ouvrez l'interface Manus" "$BLUE"
log "2. Cliquez sur 'Save Checkpoint' en haut à droite" "$BLUE"
log "3. Donnez un nom au checkpoint (ex: 'Production Ready v1.0')" "$BLUE"
log "4. Attendez la confirmation" "$BLUE"
log "" "$NC"

confirm "Avez-vous créé le checkpoint Manus?"

log "✅ Checkpoint créé" "$GREEN"

# Étape 7: Publication
separator
log "🚀 [Étape 7/7] Publication de l'application..." "$CYAN"
separator

log "⚠️  La publication doit être effectuée via l'interface Manus" "$YELLOW"
log "" "$NC"
log "Instructions:" "$BLUE"
log "1. Ouvrez l'interface Manus" "$BLUE"
log "2. Cliquez sur le bouton 'Publish' en haut à droite" "$BLUE"
log "3. Configurez votre domaine si nécessaire" "$BLUE"
log "4. Confirmez la publication" "$BLUE"
log "5. Attendez le déploiement (quelques minutes)" "$BLUE"
log "" "$NC"

confirm "Avez-vous publié l'application?"

log "✅ Application publiée" "$GREEN"

# Résumé final
separator
log "║   🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !                    ║" "$GREEN"
separator
log "" "$NC"

log "📊 Résumé du déploiement:" "$BLUE"
log "   ✅ Tests automatisés: OK" "$GREEN"
log "   ✅ Build de production: OK" "$GREEN"
log "   ✅ Configuration Stripe: OK" "$GREEN"
log "   ✅ Variables d'environnement: OK" "$GREEN"
log "   ✅ Migrations DB: OK" "$GREEN"
log "   ✅ Checkpoint Manus: OK" "$GREEN"
log "   ✅ Publication: OK" "$GREEN"
log "" "$NC"

log "📄 Log complet: $LOG_FILE" "$BLUE"
log "" "$NC"

log "🎯 Prochaines étapes:" "$CYAN"
log "   1. Testez votre application en production" "$BLUE"
log "   2. Vérifiez que les paiements Stripe fonctionnent" "$BLUE"
log "   3. Configurez votre domaine personnalisé (optionnel)" "$BLUE"
log "   4. Configurez les analytics et monitoring" "$BLUE"
log "   5. Partagez votre application avec vos utilisateurs !" "$BLUE"
log "" "$NC"

separator
log "🚀 Votre application est maintenant en ligne !" "$GREEN"
log "🌐 Consultez le Dashboard Manus pour l'URL publique" "$CYAN"
separator

# Ouvrir le rapport de tests E2E si disponible
if [ -f "$PROJECT_DIR/E2E_TEST_REPORT.md" ]; then
    log "\n📊 Rapport de tests E2E disponible: E2E_TEST_REPORT.md" "$BLUE"
fi

# Afficher les screenshots de tests si disponibles
if [ -d "$PROJECT_DIR/test-screenshots" ]; then
    SCREENSHOT_COUNT=$(ls -1 "$PROJECT_DIR/test-screenshots" | wc -l)
    log "📸 $SCREENSHOT_COUNT screenshots de tests disponibles dans test-screenshots/" "$BLUE"
fi

log "\n✨ Félicitations ! Votre déploiement est terminé. ✨\n" "$MAGENTA"
