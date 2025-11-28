#!/bin/bash

# ========================================
# SCRIPT D'AUTOMATISATION - CONFIGURATION STRIPE LIVE
# ========================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Bannière
clear
echo -e "${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   💳 CONFIGURATION AUTOMATIQUE DE STRIPE LIVE            ║
║                                                           ║
║   Sionohmair Insight Academy                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_warning "Ce script va vous guider pour configurer Stripe en mode LIVE."
print_warning "Vous pourrez accepter de VRAIS paiements après cette configuration."
echo ""

# Vérifier si l'utilisateur veut continuer
echo -e "${YELLOW}Voulez-vous continuer ? (o/n)${NC}"
read -p "Réponse : " CONTINUE

if [[ $CONTINUE != "o" && $CONTINUE != "O" ]]; then
    print_info "Configuration annulée."
    exit 0
fi

# PARTIE 1 : Activation du compte Stripe
print_header "PARTIE 1 : ACTIVATION DU COMPTE STRIPE"

echo -e "${CYAN}Pour activer Stripe Live, vous devez :${NC}"
echo "  1. Fournir vos informations d'entreprise"
echo "  2. Fournir vos informations bancaires"
echo "  3. Fournir une pièce d'identité"
echo "  4. Attendre la validation (1-3 jours)"
echo ""

echo -e "${YELLOW}Avez-vous déjà un compte Stripe activé ? (o/n)${NC}"
read -p "Réponse : " HAS_STRIPE_ACCOUNT

if [[ $HAS_STRIPE_ACCOUNT != "o" && $HAS_STRIPE_ACCOUNT != "O" ]]; then
    print_info "Ouverture de Stripe Dashboard..."
    
    STRIPE_URL="https://dashboard.stripe.com"
    
    # Ouvrir le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$STRIPE_URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$STRIPE_URL"
        else
            print_warning "Impossible d'ouvrir automatiquement. Allez sur : $STRIPE_URL"
        fi
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $STRIPE_URL"
    fi
    
    echo ""
    echo -e "${CYAN}Instructions pour activer votre compte :${NC}"
    echo ""
    echo "1. Connectez-vous sur https://dashboard.stripe.com"
    echo "2. Cliquez sur \"Activer votre compte\""
    echo "3. Remplissez les informations demandées :"
    echo "   - Type d'entreprise (Auto-entrepreneur / Entreprise individuelle)"
    echo "   - Nom légal"
    echo "   - Adresse"
    echo "   - Numéro SIRET"
    echo "   - Date de naissance"
    echo "   - Pièce d'identité (CNI ou passeport)"
    echo "4. Remplissez vos informations bancaires :"
    echo "   - IBAN"
    echo "   - BIC"
    echo "   - Nom du titulaire"
    echo "5. Soumettez la demande"
    echo "6. Attendez la validation (1-3 jours ouvrés)"
    echo ""
    
    read -p "Appuyez sur ENTRÉE quand votre compte est activé..."
    
    print_success "Compte Stripe activé"
fi

# PARTIE 2 : Récupération des clés Live
print_header "PARTIE 2 : RÉCUPÉRATION DES CLÉS LIVE"

echo -e "${CYAN}Récupération des clés Stripe Live...${NC}"
echo ""

# Ouvrir la page des clés API
STRIPE_API_KEYS_URL="https://dashboard.stripe.com/apikeys"

print_info "Ouverture de la page des clés API..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$STRIPE_API_KEYS_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$STRIPE_API_KEYS_URL"
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $STRIPE_API_KEYS_URL"
    fi
else
    print_warning "Impossible d'ouvrir automatiquement. Allez sur : $STRIPE_API_KEYS_URL"
fi

echo ""
echo -e "${CYAN}Instructions pour récupérer les clés :${NC}"
echo ""
echo "1. Sur la page https://dashboard.stripe.com/apikeys"
echo "2. Basculez en mode \"Live\" (toggle en haut à droite)"
echo "3. Copiez la \"Clé publique\" (commence par pk_live_...)"
echo "4. Copiez la \"Clé secrète\" (commence par sk_live_...)"
echo ""
echo -e "${RED}⚠️  IMPORTANT : Ne partagez JAMAIS votre clé secrète !${NC}"
echo ""

# Demander la clé publique
echo -e "${YELLOW}Collez votre clé publique Stripe Live :${NC}"
read -p "pk_live_... : " STRIPE_PUBLISHABLE_KEY

# Valider le format
if [[ ! $STRIPE_PUBLISHABLE_KEY =~ ^pk_live_ ]]; then
    print_error "Format invalide. La clé publique doit commencer par pk_live_"
    exit 1
fi

print_success "Clé publique enregistrée"

# Demander la clé secrète
echo ""
echo -e "${YELLOW}Collez votre clé secrète Stripe Live :${NC}"
read -sp "sk_live_... : " STRIPE_SECRET_KEY
echo ""

# Valider le format
if [[ ! $STRIPE_SECRET_KEY =~ ^sk_live_ ]]; then
    print_error "Format invalide. La clé secrète doit commencer par sk_live_"
    exit 1
fi

print_success "Clé secrète enregistrée"

# PARTIE 3 : Configuration du Webhook
print_header "PARTIE 3 : CONFIGURATION DU WEBHOOK"

echo -e "${CYAN}Configuration du webhook Stripe...${NC}"
echo ""

# Demander le domaine
echo -e "${YELLOW}Quel est votre domaine de production ?${NC}"
echo ""
echo "Exemples :"
echo "  - https://sionohmair-academy.com"
echo "  - https://sionohmair.manus.space"
echo ""
read -p "Votre domaine : " PRODUCTION_DOMAIN

# Valider le format
if [[ ! $PRODUCTION_DOMAIN =~ ^https:// ]]; then
    print_error "Le domaine doit commencer par https://"
    exit 1
fi

# Construire l'URL du webhook
WEBHOOK_URL="${PRODUCTION_DOMAIN}/api/stripe/webhook"

print_success "URL du webhook : $WEBHOOK_URL"

# Ouvrir la page des webhooks
STRIPE_WEBHOOKS_URL="https://dashboard.stripe.com/webhooks"

print_info "Ouverture de la page des webhooks..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$STRIPE_WEBHOOKS_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$STRIPE_WEBHOOKS_URL"
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $STRIPE_WEBHOOKS_URL"
    fi
else
    print_warning "Impossible d'ouvrir automatiquement. Allez sur : $STRIPE_WEBHOOKS_URL"
fi

echo ""
echo -e "${CYAN}Instructions pour configurer le webhook :${NC}"
echo ""
echo "1. Sur la page https://dashboard.stripe.com/webhooks"
echo "2. Cliquez sur \"Ajouter un endpoint\""
echo "3. URL de l'endpoint : $WEBHOOK_URL"
echo "4. Cliquez sur \"Sélectionner les événements\""
echo "5. Sélectionnez ces événements :"
echo "   - customer.subscription.created"
echo "   - customer.subscription.updated"
echo "   - customer.subscription.deleted"
echo "   - invoice.payment_succeeded"
echo "   - invoice.payment_failed"
echo "   - checkout.session.completed"
echo "6. Cliquez sur \"Ajouter un endpoint\""
echo "7. Copiez le \"Secret de signature\" (commence par whsec_...)"
echo ""

read -p "Appuyez sur ENTRÉE quand le webhook est créé..."

# Demander le secret de signature
echo ""
echo -e "${YELLOW}Collez le secret de signature du webhook :${NC}"
read -sp "whsec_... : " STRIPE_WEBHOOK_SECRET
echo ""

# Valider le format
if [[ ! $STRIPE_WEBHOOK_SECRET =~ ^whsec_ ]]; then
    print_error "Format invalide. Le secret doit commencer par whsec_"
    exit 1
fi

print_success "Secret de signature enregistré"

# PARTIE 4 : Génération du fichier de configuration
print_header "PARTIE 4 : GÉNÉRATION DU FICHIER DE CONFIGURATION"

CONFIG_FILE="stripe-live-config.txt"

cat > "$CONFIG_FILE" << EOF
========================================
CONFIGURATION STRIPE LIVE
========================================

Date de génération : $(date)
Domaine de production : $PRODUCTION_DOMAIN

----------------------------------------
CLÉS STRIPE LIVE
----------------------------------------

Clé publique (VITE_STRIPE_PUBLISHABLE_KEY) :
$STRIPE_PUBLISHABLE_KEY

Clé secrète (STRIPE_SECRET_KEY) :
$STRIPE_SECRET_KEY

Secret de signature du webhook (STRIPE_WEBHOOK_SECRET) :
$STRIPE_WEBHOOK_SECRET

----------------------------------------
WEBHOOK CONFIGURÉ
----------------------------------------

URL du webhook : $WEBHOOK_URL

Événements écoutés :
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_succeeded
  - invoice.payment_failed
  - checkout.session.completed

----------------------------------------
CONFIGURATION DANS MANUS
----------------------------------------

1. Allez sur : https://manus.im
2. Projets → sionohmair-insight-academy
3. Settings → Secrets
4. Modifiez ces 3 secrets :

Secret 1 :
  Name  : VITE_STRIPE_PUBLISHABLE_KEY
  Value : $STRIPE_PUBLISHABLE_KEY

Secret 2 :
  Name  : STRIPE_SECRET_KEY
  Value : $STRIPE_SECRET_KEY

Secret 3 :
  Name  : STRIPE_WEBHOOK_SECRET
  Value : $STRIPE_WEBHOOK_SECRET

5. Sauvegardez les modifications
6. Redémarrez le serveur (icône 🔄)

----------------------------------------
TEST STRIPE LIVE
----------------------------------------

⚠️  ATTENTION : Vous allez utiliser une VRAIE carte bancaire !
⚠️  Vous serez débité de 36€ (abonnement mensuel)

1. Créez un compte test sur votre site
2. Cliquez sur "S'abonner"
3. Utilisez une vraie carte bancaire
4. Vérifiez :
   - Paiement réussi
   - Email de confirmation reçu
   - Abonnement visible dans Stripe Dashboard
   - Accès au dashboard utilisateur

5. Annulez l'abonnement test :
   - Sur Stripe : Clients → Sélectionnez le client → Annuler l'abonnement

----------------------------------------
⚠️  SÉCURITÉ
----------------------------------------

NE PARTAGEZ JAMAIS :
  - Votre clé secrète (sk_live_...)
  - Votre secret de signature (whsec_...)

Stockez ce fichier en lieu sûr et supprimez-le après configuration.

========================================
FIN DE LA CONFIGURATION
========================================
EOF

print_success "Configuration générée : $CONFIG_FILE"

# Afficher le fichier
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cat "$CONFIG_FILE"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# PARTIE 5 : Configuration dans Manus
print_header "PARTIE 5 : CONFIGURATION DANS MANUS"

echo -e "${YELLOW}Voulez-vous ouvrir Manus pour configurer les secrets ? (o/n)${NC}"
read -p "Réponse : " OPEN_MANUS

if [[ $OPEN_MANUS == "o" || $OPEN_MANUS == "O" ]]; then
    MANUS_URL="https://manus.im"
    
    print_info "Ouverture de Manus..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$MANUS_URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$MANUS_URL"
        else
            print_warning "Impossible d'ouvrir automatiquement. Allez sur : $MANUS_URL"
        fi
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $MANUS_URL"
    fi
    
    print_success "Navigateur ouvert"
fi

echo ""
echo -e "${CYAN}Configurez les 3 secrets dans Manus :${NC}"
echo ""
echo "1. Allez sur : https://manus.im"
echo "2. Projets → sionohmair-insight-academy"
echo "3. Settings → Secrets"
echo "4. Modifiez ces 3 secrets (copiez-collez depuis $CONFIG_FILE) :"
echo ""
echo "   Secret 1 : VITE_STRIPE_PUBLISHABLE_KEY"
echo "   Secret 2 : STRIPE_SECRET_KEY"
echo "   Secret 3 : STRIPE_WEBHOOK_SECRET"
echo ""
echo "5. Sauvegardez les modifications"
echo "6. Redémarrez le serveur (icône 🔄)"
echo ""

read -p "Appuyez sur ENTRÉE quand les secrets sont configurés..."

print_success "Secrets configurés dans Manus"

# PARTIE 6 : Test Stripe Live
print_header "PARTIE 6 : TEST STRIPE LIVE"

echo -e "${RED}⚠️  ATTENTION : Vous allez utiliser une VRAIE carte bancaire !${NC}"
echo -e "${RED}⚠️  Vous serez débité de 36€ (abonnement mensuel)${NC}"
echo ""

echo -e "${YELLOW}Voulez-vous tester Stripe Live maintenant ? (o/n)${NC}"
read -p "Réponse : " TEST_STRIPE

if [[ $TEST_STRIPE == "o" || $TEST_STRIPE == "O" ]]; then
    print_info "Ouverture de votre site..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$PRODUCTION_DOMAIN"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "$PRODUCTION_DOMAIN"
        else
            print_warning "Impossible d'ouvrir automatiquement. Allez sur : $PRODUCTION_DOMAIN"
        fi
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $PRODUCTION_DOMAIN"
    fi
    
    echo ""
    echo -e "${CYAN}Instructions de test :${NC}"
    echo ""
    echo "1. Créez un compte test sur votre site"
    echo "2. Cliquez sur \"S'abonner\""
    echo "3. Utilisez une vraie carte bancaire"
    echo "4. Vérifiez :"
    echo "   - Paiement réussi ✅"
    echo "   - Email de confirmation reçu ✅"
    echo "   - Abonnement visible dans Stripe Dashboard ✅"
    echo "   - Accès au dashboard utilisateur ✅"
    echo ""
    echo "5. Annulez l'abonnement test :"
    echo "   - Sur Stripe : Clients → Sélectionnez le client → Annuler l'abonnement"
    echo ""
    
    read -p "Appuyez sur ENTRÉE quand le test est terminé..."
    
    print_success "Test Stripe Live effectué"
else
    print_info "Test Stripe Live ignoré. Vous pourrez le faire plus tard."
fi

# Résumé final
print_header "✅ CONFIGURATION TERMINÉE"

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎉 STRIPE LIVE CONFIGURÉ AVEC SUCCÈS !                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}Résumé de la configuration :${NC}"
echo ""
echo -e "${GREEN}✅ Compte Stripe activé${NC}"
echo -e "${GREEN}✅ Clés Live récupérées${NC}"
echo -e "${GREEN}✅ Webhook configuré${NC}"
echo -e "${GREEN}✅ Secrets Manus mis à jour${NC}"
if [[ $TEST_STRIPE == "o" || $TEST_STRIPE == "O" ]]; then
    echo -e "${GREEN}✅ Test de paiement effectué${NC}"
fi
echo ""

echo -e "${CYAN}Fichier de configuration généré :${NC}"
echo -e "${BLUE}  → $CONFIG_FILE${NC}"
echo ""

echo -e "${RED}⚠️  IMPORTANT :${NC}"
echo "  - Stockez ce fichier en lieu sûr (gestionnaire de mots de passe)"
echo "  - Supprimez-le après avoir configuré Manus"
echo "  - Ne partagez JAMAIS vos clés secrètes"
echo ""

echo -e "${CYAN}Vous pouvez maintenant accepter de VRAIS paiements ! 💳${NC}"
echo ""

echo -e "${CYAN}Prochaines étapes :${NC}"
echo "  1. Optimisez le SEO (./scripts/configure-seo.sh)"
echo "  2. Lancez votre plateforme ! 🚀"
echo ""

print_success "Script terminé avec succès !"

# Proposer de supprimer le fichier de configuration
echo ""
echo -e "${YELLOW}Voulez-vous supprimer le fichier de configuration maintenant ? (o/n)${NC}"
echo -e "${YELLOW}(Assurez-vous d'avoir sauvegardé les clés ailleurs)${NC}"
read -p "Réponse : " DELETE_CONFIG

if [[ $DELETE_CONFIG == "o" || $DELETE_CONFIG == "O" ]]; then
    rm -f "$CONFIG_FILE"
    print_success "Fichier de configuration supprimé"
else
    print_warning "N'oubliez pas de supprimer $CONFIG_FILE après avoir configuré Manus !"
fi
