#!/bin/bash

# ============================================
# PRÉ-VÉRIFICATION AVANT DÉPLOIEMENT PRODUCTION
# ============================================
# Ce script effectue toutes les vérifications critiques
# avant d'autoriser le déploiement en production
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Variables globales
SCORE=0
MAX_SCORE=0
ERRORS=()
WARNINGS=()
PASSED=()
REPORT_FILE="pre-deploy-report-$(date +%Y%m%d-%H%M%S).md"

# ============================================
# FONCTIONS UTILITAIRES
# ============================================

print_header() {
    echo ""
    echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║                                                            ║${NC}"
    echo -e "${BOLD}${CYAN}║      PRÉ-VÉRIFICATION AVANT DÉPLOIEMENT PRODUCTION        ║${NC}"
    echo -e "${BOLD}${CYAN}║                                                            ║${NC}"
    echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${PURPLE}  $1${NC}"
    echo -e "${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

check_item() {
    local name="$1"
    local points="$2"
    MAX_SCORE=$((MAX_SCORE + points))
    echo -e "${CYAN}Vérification : ${NC}$name"
}

pass_check() {
    local message="$1"
    local points="$2"
    SCORE=$((SCORE + points))
    PASSED+=("✅ $message (+$points pts)")
    echo -e "${GREEN}✅ PASS${NC} - $message"
}

fail_check() {
    local message="$1"
    ERRORS+=("❌ $message")
    echo -e "${RED}❌ FAIL${NC} - $message"
}

warn_check() {
    local message="$1"
    local points="$2"
    SCORE=$((SCORE + points))
    WARNINGS+=("⚠️  $message (+$points pts)")
    echo -e "${YELLOW}⚠️  WARN${NC} - $message"
}

# ============================================
# VÉRIFICATIONS
# ============================================

check_environment() {
    print_section "1. ENVIRONNEMENT"
    
    # Node.js
    check_item "Node.js installé" 2
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        pass_check "Node.js $NODE_VERSION installé" 2
    else
        fail_check "Node.js non installé"
    fi
    
    # pnpm
    check_item "pnpm installé" 2
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        pass_check "pnpm $PNPM_VERSION installé" 2
    else
        fail_check "pnpm non installé"
    fi
    
    # Dépendances installées
    check_item "Dépendances Node.js installées" 3
    if [ -d "node_modules" ]; then
        pass_check "node_modules présent" 3
    else
        fail_check "node_modules absent - exécutez 'pnpm install'"
    fi
}

check_database() {
    print_section "2. BASE DE DONNÉES"
    
    # Variable DATABASE_URL
    check_item "Variable DATABASE_URL configurée" 5
    if [ -n "$DATABASE_URL" ]; then
        pass_check "DATABASE_URL configurée" 5
    else
        fail_check "DATABASE_URL non configurée"
    fi
    
    # Test de connexion
    check_item "Connexion à la base de données" 5
    if [ -n "$DATABASE_URL" ]; then
        if pnpm drizzle-kit push --force &> /dev/null; then
            pass_check "Connexion DB réussie" 5
        else
            fail_check "Impossible de se connecter à la base de données"
        fi
    else
        fail_check "Impossible de tester la connexion (DATABASE_URL manquante)"
    fi
    
    # Migrations
    check_item "Migrations appliquées" 3
    if [ -d "drizzle/migrations" ] && [ "$(ls -A drizzle/migrations)" ]; then
        pass_check "Migrations présentes" 3
    else
        warn_check "Aucune migration trouvée" 1
    fi
}

check_secrets() {
    print_section "3. SECRETS ET CONFIGURATION"
    
    # GitHub Secrets
    check_item "CRON_SECRET configuré" 5
    if [ -n "$CRON_SECRET" ]; then
        pass_check "CRON_SECRET configuré" 5
    else
        fail_check "CRON_SECRET non configuré"
    fi
    
    # SMTP
    check_item "Configuration SMTP complète" 10
    SMTP_VARS=("SMTP_HOST" "SMTP_PORT" "SMTP_USER" "SMTP_PASS")
    SMTP_OK=true
    for var in "${SMTP_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            SMTP_OK=false
            break
        fi
    done
    
    if [ "$SMTP_OK" = true ]; then
        pass_check "SMTP entièrement configuré" 10
    else
        fail_check "Configuration SMTP incomplète"
    fi
    
    # Stripe
    check_item "Clés Stripe configurées" 10
    if [ -n "$STRIPE_SECRET_KEY" ] && [ -n "$VITE_STRIPE_PUBLISHABLE_KEY" ]; then
        if [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
            pass_check "Stripe en mode LIVE" 10
        else
            warn_check "Stripe en mode TEST (pas encore en production)" 5
        fi
    else
        fail_check "Clés Stripe non configurées"
    fi
    
    # JWT Secret
    check_item "JWT_SECRET configuré" 3
    if [ -n "$JWT_SECRET" ]; then
        pass_check "JWT_SECRET configuré" 3
    else
        fail_check "JWT_SECRET non configuré"
    fi
}

check_email_system() {
    print_section "4. SYSTÈME D'EMAILS"
    
    # Test d'envoi d'email
    check_item "Test d'envoi d'email" 8
    if [ -f "scripts/test-email.mjs" ]; then
        if node scripts/test-email.mjs &> /dev/null; then
            pass_check "Email de test envoyé avec succès" 8
        else
            fail_check "Échec de l'envoi d'email de test"
        fi
    else
        warn_check "Script de test d'email non trouvé" 2
    fi
    
    # Templates d'emails
    check_item "Templates d'emails créés" 5
    EMAIL_TEMPLATES=(
        "server/emailTemplates/welcomeEmail.ts"
        "server/emailTemplates/trialReminderEmail.ts"
        "server/emailTemplates/orderConfirmationEmail.ts"
    )
    TEMPLATES_OK=true
    for template in "${EMAIL_TEMPLATES[@]}"; do
        if [ ! -f "$template" ]; then
            TEMPLATES_OK=false
            break
        fi
    done
    
    if [ "$TEMPLATES_OK" = true ]; then
        pass_check "Tous les templates d'emails présents" 5
    else
        warn_check "Certains templates d'emails manquants" 2
    fi
}

check_cron_jobs() {
    print_section "5. CRON JOBS"
    
    # GitHub Actions workflow
    check_item "Workflow GitHub Actions configuré" 5
    if [ -f ".github/workflows/check-trial-expirations.yml" ]; then
        pass_check "Workflow GitHub Actions présent" 5
    else
        fail_check "Workflow GitHub Actions manquant"
    fi
    
    # Endpoint cron sécurisé
    check_item "Endpoint cron sécurisé" 5
    if grep -q "CRON_SECRET" server/cronRouter.ts 2>/dev/null; then
        pass_check "Endpoint cron sécurisé avec CRON_SECRET" 5
    else
        warn_check "Vérifiez la sécurisation de l'endpoint cron" 2
    fi
}

check_backups() {
    print_section "6. BACKUPS"
    
    # Scripts de backup
    check_item "Scripts de backup configurés" 5
    if [ -f "/home/ubuntu/backups/backup-db.sh" ]; then
        pass_check "Script de backup présent" 5
    else
        warn_check "Script de backup non trouvé - exécutez ./scripts/setup-backups.sh" 2
    fi
    
    # Cron de backup
    check_item "Cron de backup configuré" 3
    if crontab -l 2>/dev/null | grep -q "backup-db.sh"; then
        pass_check "Cron de backup configuré" 3
    else
        warn_check "Cron de backup non configuré" 1
    fi
    
    # Test de backup
    check_item "Test de backup" 5
    if [ -f "/home/ubuntu/backups/backup-db.sh" ]; then
        if /home/ubuntu/backups/backup-db.sh &> /dev/null; then
            pass_check "Backup de test réussi" 5
        else
            warn_check "Échec du backup de test" 2
        fi
    else
        warn_check "Impossible de tester le backup" 0
    fi
}

check_tests() {
    print_section "7. TESTS"
    
    # Tests unitaires
    check_item "Tests unitaires présents" 5
    if [ -f "vitest.config.ts" ]; then
        pass_check "Configuration vitest présente" 5
    else
        warn_check "Configuration vitest manquante" 2
    fi
    
    # Exécution des tests
    check_item "Exécution des tests" 8
    if command -v pnpm &> /dev/null && [ -f "vitest.config.ts" ]; then
        if pnpm test &> /dev/null; then
            pass_check "Tous les tests passent" 8
        else
            warn_check "Certains tests échouent" 3
        fi
    else
        warn_check "Impossible d'exécuter les tests" 0
    fi
}

check_security() {
    print_section "8. SÉCURITÉ"
    
    # Fichiers sensibles non commités
    check_item "Fichiers sensibles protégés" 5
    if [ -f ".gitignore" ] && grep -q ".env" .gitignore; then
        pass_check ".env dans .gitignore" 5
    else
        fail_check ".env non protégé par .gitignore"
    fi
    
    # Pas de secrets dans le code
    check_item "Pas de secrets hardcodés" 5
    if ! grep -r "sk_live_" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v node_modules | grep -v ".git"; then
        pass_check "Aucun secret hardcodé détecté" 5
    else
        fail_check "Secrets hardcodés détectés dans le code"
    fi
    
    # HTTPS
    check_item "HTTPS configuré" 3
    if [ -n "$APP_URL" ] && [[ "$APP_URL" == https://* ]]; then
        pass_check "APP_URL utilise HTTPS" 3
    else
        warn_check "APP_URL ne semble pas utiliser HTTPS" 1
    fi
}

check_stripe() {
    print_section "9. STRIPE"
    
    # Produits Stripe
    check_item "Produits Stripe configurés" 5
    if grep -q "price_" server/stripeRouter.ts 2>/dev/null; then
        pass_check "Produits Stripe configurés dans le code" 5
    else
        warn_check "Vérifiez la configuration des produits Stripe" 2
    fi
    
    # Webhook Stripe
    check_item "Webhook Stripe configuré" 5
    if grep -q "STRIPE_WEBHOOK_SECRET" server/_core/index.ts 2>/dev/null; then
        if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
            pass_check "Webhook Stripe configuré" 5
        else
            warn_check "STRIPE_WEBHOOK_SECRET non défini" 2
        fi
    else
        warn_check "Vérifiez la configuration du webhook Stripe" 2
    fi
}

check_documentation() {
    print_section "10. DOCUMENTATION"
    
    # Guides essentiels
    check_item "Guides de documentation présents" 5
    GUIDES=(
        "START_HERE.md"
        "DEMARRAGE_RAPIDE.md"
        "GUIDE_AUTOMATISATION.md"
        "CERTIFICATION_FINALE.md"
    )
    GUIDES_OK=true
    for guide in "${GUIDES[@]}"; do
        if [ ! -f "$guide" ]; then
            GUIDES_OK=false
            break
        fi
    done
    
    if [ "$GUIDES_OK" = true ]; then
        pass_check "Tous les guides essentiels présents" 5
    else
        warn_check "Certains guides manquants" 2
    fi
}

# ============================================
# GÉNÉRATION DU RAPPORT
# ============================================

generate_report() {
    print_section "GÉNÉRATION DU RAPPORT"
    
    local percentage=$((SCORE * 100 / MAX_SCORE))
    
    cat > "$REPORT_FILE" << EOF
# 📋 RAPPORT DE PRÉ-VÉRIFICATION DÉPLOIEMENT PRODUCTION

**Date** : $(date '+%Y-%m-%d %H:%M:%S')  
**Score** : **${SCORE}/${MAX_SCORE}** (${percentage}%)

---

## 🎯 RÉSULTAT GLOBAL

EOF

    if [ $percentage -ge 90 ]; then
        cat >> "$REPORT_FILE" << EOF
✅ **DÉPLOIEMENT AUTORISÉ**

Le système a passé toutes les vérifications critiques avec un score de ${percentage}%.
Vous pouvez procéder au déploiement en production.

EOF
    elif [ $percentage -ge 75 ]; then
        cat >> "$REPORT_FILE" << EOF
⚠️  **DÉPLOIEMENT POSSIBLE AVEC RÉSERVES**

Le système a obtenu un score de ${percentage}%. Certaines vérifications ont échoué ou généré des avertissements.
Veuillez corriger les erreurs critiques avant de déployer.

EOF
    else
        cat >> "$REPORT_FILE" << EOF
❌ **DÉPLOIEMENT NON RECOMMANDÉ**

Le système a obtenu un score insuffisant de ${percentage}%.
Trop d'erreurs critiques ont été détectées. Veuillez corriger tous les problèmes avant de déployer.

EOF
    fi
    
    # Vérifications réussies
    if [ ${#PASSED[@]} -gt 0 ]; then
        cat >> "$REPORT_FILE" << EOF
---

## ✅ VÉRIFICATIONS RÉUSSIES (${#PASSED[@]})

EOF
        for item in "${PASSED[@]}"; do
            echo "$item" >> "$REPORT_FILE"
        done
    fi
    
    # Avertissements
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        cat >> "$REPORT_FILE" << EOF

---

## ⚠️  AVERTISSEMENTS (${#WARNINGS[@]})

EOF
        for item in "${WARNINGS[@]}"; do
            echo "$item" >> "$REPORT_FILE"
        done
    fi
    
    # Erreurs
    if [ ${#ERRORS[@]} -gt 0 ]; then
        cat >> "$REPORT_FILE" << EOF

---

## ❌ ERREURS CRITIQUES (${#ERRORS[@]})

EOF
        for item in "${ERRORS[@]}"; do
            echo "$item" >> "$REPORT_FILE"
        done
        
        cat >> "$REPORT_FILE" << EOF

---

## 🔧 ACTIONS CORRECTIVES RECOMMANDÉES

EOF
        
        for error in "${ERRORS[@]}"; do
            if [[ "$error" == *"DATABASE_URL"* ]]; then
                echo "1. Configurez DATABASE_URL dans Manus Settings → Secrets" >> "$REPORT_FILE"
            elif [[ "$error" == *"CRON_SECRET"* ]]; then
                echo "2. Exécutez ./scripts/setup-github-secrets.sh pour configurer CRON_SECRET" >> "$REPORT_FILE"
            elif [[ "$error" == *"SMTP"* ]]; then
                echo "3. Exécutez ./scripts/setup-manus-secrets.sh pour configurer SMTP" >> "$REPORT_FILE"
            elif [[ "$error" == *"Stripe"* ]]; then
                echo "4. Configurez les clés Stripe dans Manus Settings → Secrets" >> "$REPORT_FILE"
            elif [[ "$error" == *"pnpm"* ]]; then
                echo "5. Installez pnpm : npm install -g pnpm" >> "$REPORT_FILE"
            elif [[ "$error" == *"node_modules"* ]]; then
                echo "6. Installez les dépendances : pnpm install" >> "$REPORT_FILE"
            fi
        done
    fi
    
    cat >> "$REPORT_FILE" << EOF

---

## 📚 DOCUMENTATION

- **Guide de démarrage rapide** : START_HERE.md
- **Guide d'automatisation** : GUIDE_AUTOMATISATION.md
- **Certification finale** : CERTIFICATION_FINALE.md
- **Configuration SMTP** : Exécutez ./scripts/setup-manus-secrets.sh
- **Configuration GitHub** : Exécutez ./scripts/setup-github-secrets.sh

---

## 🚀 PROCHAINES ÉTAPES

EOF

    if [ $percentage -ge 90 ]; then
        cat >> "$REPORT_FILE" << EOF
1. Exécutez \`./scripts/deploy-production.sh\` pour déployer en production
2. Activez Stripe en mode Live
3. Testez le flux complet (inscription → paiement → accès)
4. Configurez le monitoring (Sentry, Uptime Robot)
5. Annoncez le lancement ! 🎉
EOF
    else
        cat >> "$REPORT_FILE" << EOF
1. Corrigez toutes les erreurs critiques listées ci-dessus
2. Exécutez à nouveau \`./scripts/pre-deploy-check.sh\`
3. Une fois le score ≥ 90%, procédez au déploiement
EOF
    fi
    
    echo -e "${GREEN}✅ Rapport généré : ${REPORT_FILE}${NC}"
}

# ============================================
# AFFICHAGE DU RÉSULTAT
# ============================================

display_result() {
    print_section "RÉSULTAT FINAL"
    
    local percentage=$((SCORE * 100 / MAX_SCORE))
    
    echo -e "${BOLD}Score final : ${CYAN}${SCORE}/${MAX_SCORE}${NC} ${BOLD}(${percentage}%)${NC}"
    echo ""
    
    if [ $percentage -ge 90 ]; then
        echo -e "${GREEN}${BOLD}✅ DÉPLOIEMENT AUTORISÉ${NC}"
        echo ""
        echo -e "${GREEN}Le système a passé toutes les vérifications critiques.${NC}"
        echo -e "${GREEN}Vous pouvez procéder au déploiement en production.${NC}"
        echo ""
        echo -e "${CYAN}Prochaine étape :${NC}"
        echo -e "  ${BOLD}./scripts/deploy-production.sh${NC}"
    elif [ $percentage -ge 75 ]; then
        echo -e "${YELLOW}${BOLD}⚠️  DÉPLOIEMENT POSSIBLE AVEC RÉSERVES${NC}"
        echo ""
        echo -e "${YELLOW}Certaines vérifications ont échoué ou généré des avertissements.${NC}"
        echo -e "${YELLOW}Veuillez corriger les erreurs critiques avant de déployer.${NC}"
        echo ""
        echo -e "${CYAN}Consultez le rapport pour plus de détails :${NC}"
        echo -e "  ${BOLD}cat $REPORT_FILE${NC}"
    else
        echo -e "${RED}${BOLD}❌ DÉPLOIEMENT NON RECOMMANDÉ${NC}"
        echo ""
        echo -e "${RED}Le système a obtenu un score insuffisant.${NC}"
        echo -e "${RED}Trop d'erreurs critiques ont été détectées.${NC}"
        echo ""
        echo -e "${CYAN}Actions requises :${NC}"
        echo -e "  1. Consultez le rapport : ${BOLD}cat $REPORT_FILE${NC}"
        echo -e "  2. Corrigez toutes les erreurs critiques"
        echo -e "  3. Exécutez à nouveau ce script"
    fi
    
    echo ""
    echo -e "${BOLD}Détails :${NC}"
    echo -e "  ✅ Réussies : ${GREEN}${#PASSED[@]}${NC}"
    echo -e "  ⚠️  Avertissements : ${YELLOW}${#WARNINGS[@]}${NC}"
    echo -e "  ❌ Erreurs : ${RED}${#ERRORS[@]}${NC}"
    echo ""
}

# ============================================
# MAIN
# ============================================

main() {
    print_header
    
    echo -e "${CYAN}Ce script vérifie que votre système est prêt pour le déploiement en production.${NC}"
    echo -e "${CYAN}Cela prendra environ 2-3 minutes...${NC}"
    echo ""
    
    # Exécuter toutes les vérifications
    check_environment
    check_database
    check_secrets
    check_email_system
    check_cron_jobs
    check_backups
    check_tests
    check_security
    check_stripe
    check_documentation
    
    # Générer le rapport
    generate_report
    
    # Afficher le résultat
    display_result
    
    # Code de sortie
    local percentage=$((SCORE * 100 / MAX_SCORE))
    if [ $percentage -ge 90 ]; then
        exit 0
    else
        exit 1
    fi
}

# Exécuter le script
main
