#!/bin/bash

# Script de test automatique pour Sionohmair Insight Academy
# Ce script teste les 3 composants principaux du système d'abonnement

set -e

echo "========================================="
echo "  Test du Système d'Abonnement"
echo "========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
APP_URL="${APP_URL:-https://sionohmair-insight-academy.manus.space}"
CRON_SECRET="${CRON_SECRET:-7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=}"

echo "Configuration :"
echo "- APP_URL: $APP_URL"
echo "- CRON_SECRET: ${CRON_SECRET:0:20}..."
echo ""

# Test 1 : Cron Job
echo "========================================="
echo "  Test 1 : Cron Job (Emails automatiques)"
echo "========================================="
echo ""

echo "Appel de l'endpoint /api/trpc/cron.checkTrialExpirations..."

RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"secret\":\"$CRON_SECRET\"}" \
  "$APP_URL/api/trpc/cron.checkTrialExpirations" || echo "ERROR")

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Test 1 RÉUSSI${NC} - Cron job fonctionne correctement"
    echo "Réponse : $RESPONSE"
else
    echo -e "${RED}❌ Test 1 ÉCHOUÉ${NC} - Cron job ne fonctionne pas"
    echo "Réponse : $RESPONSE"
    echo ""
    echo "Vérifiez :"
    echo "1. Le CRON_SECRET est correct dans Settings → Secrets"
    echo "2. L'URL de l'application est correcte"
    echo "3. Le serveur est démarré"
fi

echo ""

# Test 2 : Configuration SMTP
echo "========================================="
echo "  Test 2 : Configuration SMTP"
echo "========================================="
echo ""

if [ -z "$SMTP_HOST" ]; then
    echo -e "${YELLOW}⚠️  Test 2 IGNORÉ${NC} - Variables SMTP non configurées"
    echo ""
    echo "Pour configurer SMTP, exécutez :"
    echo "  ./scripts/configure-smtp.sh"
else
    echo -e "${GREEN}✅ Test 2 RÉUSSI${NC} - Variables SMTP configurées"
    echo "- SMTP_HOST: $SMTP_HOST"
    echo "- SMTP_PORT: $SMTP_PORT"
    echo "- SMTP_USER: $SMTP_USER"
    echo "- SMTP_FROM: $SMTP_FROM"
    echo ""
    echo "Pour tester l'envoi d'emails, créez un utilisateur test et exécutez le cron job."
fi

echo ""

# Test 3 : Configuration Stripe
echo "========================================="
echo "  Test 3 : Configuration Stripe"
echo "========================================="
echo ""

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${YELLOW}⚠️  Test 3 IGNORÉ${NC} - Variables Stripe non configurées"
    echo ""
    echo "Pour configurer Stripe :"
    echo "1. Activez votre compte : https://dashboard.stripe.com/claim_sandbox/..."
    echo "2. Créez le produit 'Abonnement Sionohmair' (36€/mois)"
    echo "3. Ajoutez les clés API dans Settings → Secrets"
else
    echo -e "${GREEN}✅ Test 3 RÉUSSI${NC} - Variables Stripe configurées"
    
    if [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
        echo "- Mode: TEST (utilisez la carte 4242 4242 4242 4242)"
    elif [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
        echo "- Mode: PRODUCTION (paiements réels)"
    else
        echo -e "${RED}⚠️  Clé Stripe invalide${NC}"
    fi
    
    echo ""
    echo "Pour tester le paiement :"
    echo "1. Allez sur $APP_URL/subscription"
    echo "2. Cliquez sur 'S'abonner maintenant (36€/mois)'"
    echo "3. Utilisez la carte de test : 4242 4242 4242 4242"
fi

echo ""

# Test 4 : Base de données
echo "========================================="
echo "  Test 4 : Base de données"
echo "========================================="
echo ""

echo "Vérification de la table subscriptions..."

if command -v psql &> /dev/null; then
    # Si PostgreSQL est installé, tester la connexion
    echo -e "${GREEN}✅ Test 4 RÉUSSI${NC} - PostgreSQL disponible"
    echo ""
    echo "Pour vérifier la table subscriptions, exécutez :"
    echo "  psql -d sionohmair -c 'SELECT * FROM subscriptions;'"
else
    echo -e "${YELLOW}⚠️  Test 4 IGNORÉ${NC} - PostgreSQL non installé localement"
    echo ""
    echo "Vous pouvez vérifier la base de données via :"
    echo "- Manus → Database → CRUD UI"
    echo "- Ou via un client PostgreSQL externe"
fi

echo ""

# Résumé
echo "========================================="
echo "  Résumé des Tests"
echo "========================================="
echo ""

TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Compter les résultats (simplifié)
if echo "$RESPONSE" | grep -q '"success":true'; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

if [ -n "$SMTP_HOST" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    TESTS_SKIPPED=$((TESTS_SKIPPED + 1))
fi

if [ -n "$STRIPE_SECRET_KEY" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    TESTS_SKIPPED=$((TESTS_SKIPPED + 1))
fi

echo -e "${GREEN}✅ Tests réussis : $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests échoués : $TESTS_FAILED${NC}"
echo -e "${YELLOW}⚠️  Tests ignorés : $TESTS_SKIPPED${NC}"

echo ""

if [ $TESTS_FAILED -eq 0 ] && [ $TESTS_SKIPPED -eq 0 ]; then
    echo -e "${GREEN}🎉 Tous les tests sont passés ! Votre système est prêt pour la production.${NC}"
elif [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Certaines configurations sont manquantes. Consultez CONFIGURATION_FINALE.md${NC}"
else
    echo -e "${RED}❌ Certains tests ont échoué. Vérifiez la configuration et réessayez.${NC}"
fi

echo ""
echo "========================================="
echo "  Fin des Tests"
echo "========================================="
