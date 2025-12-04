#!/bin/bash

# Script d'automatisation de configuration Stripe Production
# Sionohmair Insight Academy

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Configuration Stripe Production - Automatisation        ║${NC}"
echo -e "${BLUE}║   Sionohmair Insight Academy                               ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Étape 1: Vérifier si Stripe CLI est installé
echo -e "${YELLOW}[1/5] Vérification de Stripe CLI...${NC}"
if ! command -v stripe &> /dev/null; then
    echo -e "${YELLOW}Stripe CLI non trouvé. Installation...${NC}"
    
    # Détecter l'OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
        echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
        sudo apt update
        sudo apt install stripe
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install stripe/stripe-cli/stripe
    else
        echo -e "${RED}❌ OS non supporté. Installez Stripe CLI manuellement: https://stripe.com/docs/stripe-cli${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Stripe CLI installé${NC}"
echo ""

# Étape 2: Login Stripe
echo -e "${YELLOW}[2/5] Connexion à Stripe...${NC}"
echo -e "${BLUE}Ouvrez le lien qui va s'afficher et autorisez l'accès.${NC}"
stripe login

echo -e "${GREEN}✅ Connecté à Stripe${NC}"
echo ""

# Étape 3: Créer les produits Premium
echo -e "${YELLOW}[3/5] Création des produits Premium...${NC}"

# Produit Mensuel
echo -e "${BLUE}Création du produit Premium Mensuel (29€/mois)...${NC}"
PRODUCT_MONTHLY=$(stripe products create \
  --name="Premium Mensuel" \
  --description="Accès illimité à tous les outils de copywriting IA" \
  --format=json | jq -r '.id')

PRICE_MONTHLY=$(stripe prices create \
  --product="$PRODUCT_MONTHLY" \
  --unit-amount=2900 \
  --currency=eur \
  --recurring[interval]=month \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Produit Mensuel créé: $PRODUCT_MONTHLY${NC}"
echo -e "${GREEN}   Prix ID: $PRICE_MONTHLY${NC}"

# Produit Annuel
echo -e "${BLUE}Création du produit Premium Annuel (290€/an)...${NC}"
PRODUCT_YEARLY=$(stripe products create \
  --name="Premium Annuel" \
  --description="Accès illimité à tous les outils de copywriting IA (économisez 58€/an)" \
  --format=json | jq -r '.id')

PRICE_YEARLY=$(stripe prices create \
  --product="$PRODUCT_YEARLY" \
  --unit-amount=29000 \
  --currency=eur \
  --recurring[interval]=year \
  --format=json | jq -r '.id')

echo -e "${GREEN}✅ Produit Annuel créé: $PRODUCT_YEARLY${NC}"
echo -e "${GREEN}   Prix ID: $PRICE_YEARLY${NC}"
echo ""

# Étape 4: Récupérer les clés API
echo -e "${YELLOW}[4/5] Récupération des clés API Live...${NC}"

# Obtenir les clés via Stripe CLI
PUBLISHABLE_KEY=$(stripe keys list --live --format=json | jq -r '.[] | select(.type=="publishable") | .secret')
SECRET_KEY=$(stripe keys list --live --format=json | jq -r '.[] | select(.type=="secret") | .secret')

echo -e "${GREEN}✅ Clés API récupérées${NC}"
echo ""

# Étape 5: Générer le fichier de configuration
echo -e "${YELLOW}[5/5] Génération du fichier de configuration...${NC}"

cat > /home/ubuntu/sionohmair-insight-academy/STRIPE_PRODUCTION_CONFIG.txt << ENDOFCONFIG
╔════════════════════════════════════════════════════════════╗
║   Configuration Stripe Production                          ║
║   Sionohmair Insight Academy                               ║
╚════════════════════════════════════════════════════════════╝

📋 PRODUITS CRÉÉS
─────────────────────────────────────────────────────────────

Premium Mensuel (29€/mois):
  Product ID: $PRODUCT_MONTHLY
  Price ID: $PRICE_MONTHLY

Premium Annuel (290€/an):
  Product ID: $PRODUCT_YEARLY
  Price ID: $PRICE_YEARLY

🔑 CLÉS API LIVE
─────────────────────────────────────────────────────────────

Publishable Key:
$PUBLISHABLE_KEY

Secret Key:
$SECRET_KEY

📝 PROCHAINES ÉTAPES
─────────────────────────────────────────────────────────────

1. Copiez ces secrets dans Manus Settings → Secrets:

   STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY
   STRIPE_SECRET_KEY=$SECRET_KEY
   STRIPE_PRICE_MONTHLY=$PRICE_MONTHLY
   STRIPE_PRICE_YEARLY=$PRICE_YEARLY

2. Configurez le webhook Stripe:
   - URL: https://votre-domaine.com/api/stripe/webhook
   - Événements: customer.subscription.created, 
                 customer.subscription.updated,
                 customer.subscription.deleted,
                 invoice.payment_succeeded,
                 invoice.payment_failed

3. Copiez le Webhook Secret dans Manus:
   STRIPE_WEBHOOK_SECRET=whsec_...

4. Redémarrez le serveur Manus

5. Testez un paiement réel avec une vraie carte

╔════════════════════════════════════════════════════════════╗
║   Configuration générée le $(date)   ║
╚════════════════════════════════════════════════════════════╝
ENDOFCONFIG

echo -e "${GREEN}✅ Fichier de configuration créé: STRIPE_PRODUCTION_CONFIG.txt${NC}"
echo ""

# Résumé
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ✅ Configuration Stripe Production Terminée !            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📄 Consultez le fichier STRIPE_PRODUCTION_CONFIG.txt pour les détails${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo -e "   1. Copiez les secrets dans Manus Settings → Secrets"
echo -e "   2. Configurez le webhook Stripe"
echo -e "   3. Redémarrez le serveur"
echo -e "   4. Testez un paiement réel"
echo ""
echo -e "${BLUE}Prêt à continuer avec les tests automatisés !${NC}"
