#!/bin/bash

# Script de configuration automatique du webhook Stripe
# Ce script crée un webhook Stripe avec les événements nécessaires

set -e

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║     Configuration Automatique du Webhook Stripe           ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si Stripe CLI est installé
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI n'est pas installé.${NC}"
    echo -e "${YELLOW}Installation en cours...${NC}"
    
    # Installation de Stripe CLI
    curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
    echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
    sudo apt update
    sudo apt install -y stripe
    
    echo -e "${GREEN}✅ Stripe CLI installé avec succès !${NC}"
fi

echo -e "${YELLOW}📋 Étape 1 : Connexion à Stripe${NC}"
echo ""
echo "Vous allez être redirigé vers votre navigateur pour vous connecter à Stripe."
echo "Appuyez sur Entrée pour continuer..."
read

# Connexion à Stripe
stripe login

echo ""
echo -e "${GREEN}✅ Connexion réussie !${NC}"
echo ""

# URL du webhook
WEBHOOK_URL="https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook"

echo -e "${YELLOW}📋 Étape 2 : Création du webhook${NC}"
echo ""
echo "URL du webhook : ${WEBHOOK_URL}"
echo ""

# Créer le webhook avec les événements nécessaires
echo "Création du webhook en cours..."
WEBHOOK_OUTPUT=$(stripe webhooks create \
  --url "${WEBHOOK_URL}" \
  --enabled-events checkout.session.completed \
  --enabled-events payment_intent.succeeded \
  --enabled-events payment_intent.payment_failed \
  --format json)

# Extraire le webhook ID et le signing secret
WEBHOOK_ID=$(echo "$WEBHOOK_OUTPUT" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
WEBHOOK_SECRET=$(echo "$WEBHOOK_OUTPUT" | grep -o '"secret":"[^"]*"' | cut -d'"' -f4)

echo ""
echo -e "${GREEN}✅ Webhook créé avec succès !${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║              INFORMATIONS DU WEBHOOK                       ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Webhook ID :${NC} ${WEBHOOK_ID}"
echo -e "${YELLOW}Webhook URL :${NC} ${WEBHOOK_URL}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║              WEBHOOK SIGNING SECRET                        ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}${WEBHOOK_SECRET}${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║              ÉVÉNEMENTS CONFIGURÉS                         ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "✅ checkout.session.completed"
echo "✅ payment_intent.succeeded"
echo "✅ payment_intent.payment_failed"
echo ""

# Sauvegarder les informations dans un fichier
cat > /home/ubuntu/sionohmair-insight-academy/STRIPE_WEBHOOK_CONFIG.txt << EOF
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         CONFIGURATION WEBHOOK STRIPE                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Date de création : $(date)

Webhook ID : ${WEBHOOK_ID}
Webhook URL : ${WEBHOOK_URL}

╔════════════════════════════════════════════════════════════╗
║              WEBHOOK SIGNING SECRET                        ║
╚════════════════════════════════════════════════════════════╝

${WEBHOOK_SECRET}

⚠️  IMPORTANT : Copiez ce secret et ajoutez-le dans Manus :
   Settings → Secrets → STRIPE_WEBHOOK_SECRET

Événements configurés :
- checkout.session.completed
- payment_intent.succeeded
- payment_intent.payment_failed

EOF

echo -e "${GREEN}✅ Configuration sauvegardée dans STRIPE_WEBHOOK_CONFIG.txt${NC}"
echo ""
echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║                                                            ║${NC}"
echo -e "${YELLOW}║              PROCHAINES ÉTAPES                             ║${NC}"
echo -e "${YELLOW}║                                                            ║${NC}"
echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "1. Copiez le Webhook Signing Secret ci-dessus"
echo "2. Allez dans Manus → Settings → Secrets"
echo "3. Créez un nouveau secret :"
echo "   - Nom : STRIPE_WEBHOOK_SECRET"
echo "   - Valeur : ${WEBHOOK_SECRET}"
echo "4. Redémarrez votre serveur Manus"
echo ""
echo -e "${GREEN}🎉 Configuration terminée avec succès !${NC}"
echo ""
