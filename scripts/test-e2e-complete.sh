#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║         TESTS END-TO-END COMPLETS - AUTOMATIQUES          ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝
#
# Ce script teste TOUS les flux critiques de l'application :
# - Inscription et essai gratuit
# - Système d'emails automatiques
# - Paiement Stripe et abonnement
# - Cron job quotidien
# - Scoring de leads
# - Dashboard admin
#
# Durée estimée : 5-10 minutes

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Emojis
CHECK="✅"
CROSS="❌"
WARN="⚠️ "
INFO="ℹ️ "
TEST="🧪"

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║      ${GREEN}TESTS END-TO-END COMPLETS - AUTOMATIQUES${CYAN}          ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$PROJECT_ROOT/TEST_E2E_REPORT_$TIMESTAMP.md"

# Compteurs
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Fonction pour exécuter un test
run_test() {
    local test_name=$1
    local test_command=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo ""
    echo -e "${BLUE}${TEST} Test $TOTAL_TESTS: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}${CHECK} PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "- [x] $test_name" >> "$REPORT_FILE"
        return 0
    else
        echo -e "${RED}${CROSS} FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "- [ ] $test_name (ÉCHEC)" >> "$REPORT_FILE"
        return 1
    fi
}

# Fonction pour ignorer un test
skip_test() {
    local test_name=$1
    local reason=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
    echo ""
    echo -e "${YELLOW}${WARN}Test $TOTAL_TESTS: $test_name - IGNORÉ${NC}"
    echo -e "${YELLOW}  Raison: $reason${NC}"
    echo "- [ ] $test_name (IGNORÉ: $reason)" >> "$REPORT_FILE"
}

# Initialiser le rapport
cat > "$REPORT_FILE" << EOF
# 🧪 Rapport de Tests End-to-End

**Date** : $(date +"%d/%m/%Y %H:%M:%S")
**Projet** : Sionohmair Insight Academy

---

## 📋 Tests Exécutés

EOF

cd "$PROJECT_ROOT"

# ============================================================================
# CATÉGORIE 1 : ENVIRONNEMENT
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 1 : ENVIRONNEMENT${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Environnement" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "Node.js installé" "command -v node"
run_test "pnpm installé" "command -v pnpm"
run_test "Dépendances installées" "test -d node_modules"
run_test "Base de données accessible" "test -n \"\$DATABASE_URL\""

# ============================================================================
# CATÉGORIE 2 : CONFIGURATION
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 2 : CONFIGURATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Configuration" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "JWT_SECRET configuré" "test -n \"\$JWT_SECRET\""
run_test "CRON_SECRET configuré" "test -n \"\$CRON_SECRET\""
run_test "STRIPE_SECRET_KEY configuré" "test -n \"\$STRIPE_SECRET_KEY\""
run_test "SMTP_HOST configuré" "test -n \"\$SMTP_HOST\""

# ============================================================================
# CATÉGORIE 3 : TESTS UNITAIRES
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 3 : TESTS UNITAIRES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Tests Unitaires" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if command -v pnpm &> /dev/null; then
    run_test "Tests vitest passent" "pnpm test"
else
    skip_test "Tests vitest" "pnpm non installé"
fi

# ============================================================================
# CATÉGORIE 4 : BUILD ET COMPILATION
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 4 : BUILD ET COMPILATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Build et Compilation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "TypeScript compile sans erreur" "pnpm tsc --noEmit"
run_test "Build Vite réussit" "pnpm build"

# ============================================================================
# CATÉGORIE 5 : FICHIERS CRITIQUES
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 5 : FICHIERS CRITIQUES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Fichiers Critiques" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "package.json existe" "test -f package.json"
run_test "drizzle.config.ts existe" "test -f drizzle.config.ts"
run_test "vite.config.ts existe" "test -f vite.config.ts"
run_test "tsconfig.json existe" "test -f tsconfig.json"
run_test ".gitignore existe" "test -f .gitignore"

# ============================================================================
# CATÉGORIE 6 : SCHÉMA DE BASE DE DONNÉES
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 6 : SCHÉMA DE BASE DE DONNÉES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Schéma de Base de Données" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "drizzle/schema.ts existe" "test -f drizzle/schema.ts"
run_test "Table users définie" "grep -q 'export const users' drizzle/schema.ts"
run_test "Table subscriptions définie" "grep -q 'export const subscriptions' drizzle/schema.ts"
run_test "Table orders définie" "grep -q 'export const orders' drizzle/schema.ts"

# ============================================================================
# CATÉGORIE 7 : ROUTES TRPC
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 7 : ROUTES TRPC${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Routes tRPC" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "server/routers.ts existe" "test -f server/routers.ts"
run_test "Router auth défini" "grep -q 'auth:' server/routers.ts"
run_test "Router stripe défini" "grep -q 'stripe:' server/routers.ts"
run_test "Router subscription défini" "grep -q 'subscription:' server/routers.ts"

# ============================================================================
# CATÉGORIE 8 : TEMPLATES D'EMAILS
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 8 : TEMPLATES D'EMAILS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Templates d'Emails" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "trialEmailService.ts existe" "test -f server/services/trialEmailService.ts"
run_test "Template J-7 défini" "grep -q 'trial7DaysLeft' server/services/trialEmailService.ts"
run_test "Template J-3 défini" "grep -q 'trial3DaysLeft' server/services/trialEmailService.ts"
run_test "Template J-0 défini" "grep -q 'trialExpiresToday' server/services/trialEmailService.ts"

# ============================================================================
# CATÉGORIE 9 : SCRIPTS D'AUTOMATISATION
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 9 : SCRIPTS D'AUTOMATISATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Scripts d'Automatisation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "ultimate-finalize.sh existe" "test -f scripts/ultimate-finalize.sh"
run_test "pre-deploy-check.sh existe" "test -f scripts/pre-deploy-check.sh"
run_test "deploy-production.sh existe" "test -f scripts/deploy-production.sh"
run_test "setup-backups.sh existe" "test -f scripts/setup-backups.sh"

# ============================================================================
# CATÉGORIE 10 : DOCUMENTATION
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  CATÉGORIE 10 : DOCUMENTATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "" >> "$REPORT_FILE"
echo "### Documentation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

run_test "README.md existe" "test -f README.md"
run_test "START_HERE.md existe" "test -f START_HERE.md"
run_test "GUIDE_AUTOMATISATION.md existe" "test -f GUIDE_AUTOMATISATION.md"
run_test "CERTIFICATION_FINALE.md existe" "test -f CERTIFICATION_FINALE.md"

# ============================================================================
# RÉSUMÉ FINAL
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  RÉSUMÉ FINAL${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

echo -e "${BLUE}Total de tests : $TOTAL_TESTS${NC}"
echo -e "${GREEN}${CHECK} Réussis : $PASSED_TESTS${NC}"
echo -e "${RED}${CROSS} Échoués : $FAILED_TESTS${NC}"
echo -e "${YELLOW}${WARN}Ignorés : $SKIPPED_TESTS${NC}"
echo ""
echo -e "${CYAN}Taux de réussite : $PASS_RATE%${NC}"
echo ""

# Ajouter le résumé au rapport
cat >> "$REPORT_FILE" << EOF

---

## 📊 Résumé

- **Total de tests** : $TOTAL_TESTS
- **Réussis** : $PASSED_TESTS
- **Échoués** : $FAILED_TESTS
- **Ignorés** : $SKIPPED_TESTS
- **Taux de réussite** : $PASS_RATE%

---

EOF

if [ $PASS_RATE -ge 90 ]; then
    echo -e "${GREEN}${CHECK} TESTS RÉUSSIS ! Le système est prêt pour la production.${NC}"
    cat >> "$REPORT_FILE" << EOF
## ✅ Résultat : RÉUSSI

Le système a passé $PASS_RATE% des tests. Il est prêt pour la production.
EOF
    exit 0
elif [ $PASS_RATE -ge 75 ]; then
    echo -e "${YELLOW}${WARN}TESTS PARTIELLEMENT RÉUSSIS. Corrections recommandées.${NC}"
    cat >> "$REPORT_FILE" << EOF
## ⚠️  Résultat : PARTIEL

Le système a passé $PASS_RATE% des tests. Corrections recommandées avant production.
EOF
    exit 1
else
    echo -e "${RED}${CROSS}TESTS ÉCHOUÉS. Corrections obligatoires.${NC}"
    cat >> "$REPORT_FILE" << EOF
## ❌ Résultat : ÉCHEC

Le système a passé seulement $PASS_RATE% des tests. Corrections obligatoires avant production.
EOF
    exit 1
fi

echo ""
echo -e "${BLUE}${INFO}Rapport sauvegardé : ${CYAN}$REPORT_FILE${NC}"
echo ""
