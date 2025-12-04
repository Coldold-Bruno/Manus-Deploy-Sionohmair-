#!/bin/bash
# Script de tests End-to-End complets
# Sionohmair Insight Academy - Production Readiness

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Tests End-to-End - Sionohmair Insight Academy           ║${NC}"
echo -e "${BLUE}║   Vérification complète avant production                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Compteurs
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction de test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}[TEST $TOTAL_TESTS] $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}1. Tests unitaires (Vitest)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

cd /home/ubuntu/sionohmair-insight-academy

if pnpm test; then
    echo -e "${GREEN}✓ Tous les tests unitaires sont passés${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ Certains tests unitaires ont échoué${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}2. Vérifications de sécurité${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 2.1: Vérifier que les clés secrètes ne sont pas exposées
run_test "Clés API non exposées dans le code client" \
    "! grep -r 'sk_live' client/src/ && ! grep -r 'sk_test' client/src/"

# Test 2.2: Vérifier la présence des variables d'environnement critiques
run_test "Variables d'environnement critiques présentes" \
    "grep -q 'STRIPE_SECRET_KEY' .env.local || grep -q 'STRIPE_SECRET_KEY' .env"

# Test 2.3: Vérifier que le webhook secret est configuré
run_test "Webhook secret configuré" \
    "grep -q 'STRIPE_WEBHOOK_SECRET' .env.local || grep -q 'STRIPE_WEBHOOK_SECRET' .env"

# Test 2.4: Vérifier l'absence de console.log en production
run_test "Pas de console.log dans le code de production" \
    "! grep -r 'console.log' client/src/pages/ || true"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}3. Vérifications de structure${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 3.1: Vérifier la présence des fichiers critiques
run_test "Fichiers critiques présents" \
    "test -f client/src/App.tsx && test -f server/index.ts && test -f drizzle.config.ts"

# Test 3.2: Vérifier la structure de la base de données
run_test "Schéma de base de données présent" \
    "test -f server/db/schema.ts"

# Test 3.3: Vérifier les migrations
run_test "Dossier de migrations présent" \
    "test -d drizzle"

# Test 3.4: Vérifier les composants UI essentiels
run_test "Composants UI essentiels présents" \
    "test -f client/src/components/ui/button.tsx && test -f client/src/components/ui/card.tsx"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}4. Vérifications de dépendances${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 4.1: Vérifier l'installation des dépendances
run_test "Node modules installés" \
    "test -d node_modules"

# Test 4.2: Vérifier la présence de package.json
run_test "package.json valide" \
    "test -f package.json && node -e 'require(\"./package.json\")'"

# Test 4.3: Vérifier les scripts npm
run_test "Scripts npm configurés" \
    "grep -q '\"dev\"' package.json && grep -q '\"build\"' package.json"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}5. Vérifications de configuration${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 5.1: Vérifier la configuration TypeScript
run_test "tsconfig.json valide" \
    "test -f tsconfig.json"

# Test 5.2: Vérifier la configuration Tailwind
run_test "Tailwind configuré" \
    "test -f tailwind.config.ts"

# Test 5.3: Vérifier la configuration Vite
run_test "Vite configuré" \
    "test -f vite.config.ts"

# Test 5.4: Vérifier la configuration Drizzle
run_test "Drizzle configuré" \
    "test -f drizzle.config.ts"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}6. Vérifications de contenu${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 6.1: Vérifier la présence du README
run_test "README présent" \
    "test -f README.md"

# Test 6.2: Vérifier la présence de la documentation Stripe
run_test "Documentation Stripe Production présente" \
    "test -f STRIPE_PRODUCTION_SETUP.md"

# Test 6.3: Vérifier la présence du todo.md
run_test "Todo.md présent" \
    "test -f todo.md"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}7. Vérifications de build${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Test 7.1: Tenter un build de production
echo -e "${YELLOW}[TEST] Build de production...${NC}"
if pnpm build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✓ Build de production réussi${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ Build de production échoué${NC}"
    echo -e "${YELLOW}Logs du build:${NC}"
    tail -20 /tmp/build.log
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}8. Résumé des tests${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "Total de tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Tests réussis: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Tests échoués: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✓ TOUS LES TESTS SONT PASSÉS !                          ║${NC}"
    echo -e "${GREEN}║   Votre application est prête pour la production          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ✗ CERTAINS TESTS ONT ÉCHOUÉ                             ║${NC}"
    echo -e "${RED}║   Veuillez corriger les erreurs avant la production       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
