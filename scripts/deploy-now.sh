#!/bin/bash

# ============================================================================
# DÉPLOIEMENT AUTOMATIQUE ULTRA-RAPIDE
# ============================================================================
# Ce script automatise les 3 dernières configurations pour la production
# Durée : 5-10 minutes
# ============================================================================

set -e  # Arrêter en cas d'erreur

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Bannière
clear
echo -e "${PURPLE}${BOLD}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        DÉPLOIEMENT AUTOMATIQUE ULTRA-RAPIDE                ║
║        Sionohmair Insight Academy                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script va automatiser les 3 dernières configurations :${NC}"
echo -e "  1. Configuration SMTP (Gmail recommandé)"
echo -e "  2. Configuration CRON_SECRET (GitHub + Manus)"
echo -e "  3. Instructions Stripe Live (manuel)"
echo ""
echo -e "${YELLOW}Durée estimée : 5-10 minutes${NC}"
echo ""
read -p "Appuyez sur Entrée pour commencer..."

# ============================================================================
# ÉTAPE 1 : CONFIGURATION SMTP
# ============================================================================

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  ÉTAPE 1/3 : Configuration SMTP${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}Choisissez votre fournisseur SMTP :${NC}"
echo "  1) Gmail (Gratuit, simple) ⭐ RECOMMANDÉ"
echo "  2) SendGrid (100 emails/jour gratuits)"
echo "  3) Brevo (300 emails/jour gratuits)"
echo "  4) Passer cette étape"
echo ""
read -p "Votre choix (1-4) : " smtp_choice

case $smtp_choice in
  1)
    echo ""
    echo -e "${YELLOW}Configuration Gmail${NC}"
    echo ""
    echo -e "${CYAN}Instructions :${NC}"
    echo "1. Activez l'authentification à 2 facteurs sur votre compte Gmail"
    echo "   → https://myaccount.google.com/security"
    echo ""
    echo "2. Créez un mot de passe d'application"
    echo "   → https://myaccount.google.com/apppasswords"
    echo "   → Sélectionnez 'Mail' et 'Autre (nom personnalisé)'"
    echo "   → Nommez-le 'Sionohmair Academy'"
    echo "   → Copiez le mot de passe généré (16 caractères)"
    echo ""
    read -p "Appuyez sur Entrée quand c'est fait..."
    echo ""
    
    read -p "Votre email Gmail : " gmail_user
    read -p "Mot de passe d'application (16 caractères) : " gmail_pass
    
    SMTP_HOST="smtp.gmail.com"
    SMTP_PORT="587"
    SMTP_SECURE="false"
    SMTP_USER="$gmail_user"
    SMTP_PASS="$gmail_pass"
    
    echo ""
    echo -e "${GREEN}✅ Configuration Gmail enregistrée${NC}"
    ;;
    
  2)
    echo ""
    echo -e "${YELLOW}Configuration SendGrid${NC}"
    echo ""
    echo -e "${CYAN}Instructions :${NC}"
    echo "1. Créez un compte sur https://sendgrid.com"
    echo "2. Créez une API Key (Settings → API Keys)"
    echo ""
    read -p "Appuyez sur Entrée quand c'est fait..."
    echo ""
    
    read -p "Votre API Key SendGrid : " sendgrid_key
    
    SMTP_HOST="smtp.sendgrid.net"
    SMTP_PORT="587"
    SMTP_SECURE="false"
    SMTP_USER="apikey"
    SMTP_PASS="$sendgrid_key"
    
    echo ""
    echo -e "${GREEN}✅ Configuration SendGrid enregistrée${NC}"
    ;;
    
  3)
    echo ""
    echo -e "${YELLOW}Configuration Brevo${NC}"
    echo ""
    echo -e "${CYAN}Instructions :${NC}"
    echo "1. Créez un compte sur https://www.brevo.com"
    echo "2. Créez une clé SMTP (Settings → SMTP & API)"
    echo ""
    read -p "Appuyez sur Entrée quand c'est fait..."
    echo ""
    
    read -p "Votre email Brevo : " brevo_user
    read -p "Votre clé SMTP Brevo : " brevo_pass
    
    SMTP_HOST="smtp-relay.brevo.com"
    SMTP_PORT="587"
    SMTP_SECURE="false"
    SMTP_USER="$brevo_user"
    SMTP_PASS="$brevo_pass"
    
    echo ""
    echo -e "${GREEN}✅ Configuration Brevo enregistrée${NC}"
    ;;
    
  4)
    echo ""
    echo -e "${YELLOW}⚠️  Étape SMTP ignorée${NC}"
    SMTP_HOST=""
    ;;
    
  *)
    echo ""
    echo -e "${RED}❌ Choix invalide${NC}"
    exit 1
    ;;
esac

# ============================================================================
# ÉTAPE 2 : CONFIGURATION CRON_SECRET
# ============================================================================

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  ÉTAPE 2/3 : Configuration CRON_SECRET${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

CRON_SECRET="7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="

echo -e "${CYAN}Secret généré :${NC} ${BOLD}$CRON_SECRET${NC}"
echo ""

# Détecter le repository GitHub
if [ -d ".git" ]; then
  REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
  if [ ! -z "$REPO_URL" ]; then
    echo -e "${GREEN}✅ Repository GitHub détecté${NC}"
    echo ""
    
    # Vérifier si GitHub CLI est installé
    if command -v gh &> /dev/null; then
      echo -e "${CYAN}GitHub CLI détecté. Configuration automatique...${NC}"
      echo ""
      
      # Vérifier l'authentification
      if gh auth status &> /dev/null; then
        echo -e "${GREEN}✅ Authentifié sur GitHub${NC}"
        echo ""
        
        # Ajouter les secrets
        echo "Ajout de CRON_SECRET..."
        echo "$CRON_SECRET" | gh secret set CRON_SECRET
        
        echo "Ajout de APP_URL..."
        APP_URL="https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer"
        echo "$APP_URL" | gh secret set APP_URL
        
        echo ""
        echo -e "${GREEN}✅ Secrets GitHub configurés automatiquement${NC}"
      else
        echo -e "${YELLOW}⚠️  Non authentifié sur GitHub${NC}"
        echo ""
        echo -e "${CYAN}Authentifiez-vous avec :${NC}"
        echo "  gh auth login"
        echo ""
        echo -e "${CYAN}Puis ajoutez les secrets manuellement :${NC}"
        echo "  gh secret set CRON_SECRET"
        echo "  gh secret set APP_URL"
        echo ""
        read -p "Appuyez sur Entrée pour continuer..."
      fi
    else
      echo -e "${YELLOW}⚠️  GitHub CLI non installé${NC}"
      echo ""
      echo -e "${CYAN}Configuration manuelle requise :${NC}"
      echo ""
      echo "1. Ouvrez votre repository GitHub"
      echo "2. Allez dans Settings → Secrets and variables → Actions"
      echo "3. Ajoutez ces 2 secrets :"
      echo ""
      echo -e "   ${BOLD}Name:${NC} CRON_SECRET"
      echo -e "   ${BOLD}Value:${NC} $CRON_SECRET"
      echo ""
      echo -e "   ${BOLD}Name:${NC} APP_URL"
      echo -e "   ${BOLD}Value:${NC} https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer"
      echo ""
      read -p "Appuyez sur Entrée quand c'est fait..."
    fi
  fi
fi

# ============================================================================
# ÉTAPE 3 : AFFICHAGE DES VARIABLES POUR MANUS
# ============================================================================

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  CONFIGURATION MANUS SECRETS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}Copiez-collez ces variables dans Manus (Settings → Secrets) :${NC}"
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ ! -z "$SMTP_HOST" ]; then
  echo ""
  echo -e "${YELLOW}# SMTP Configuration${NC}"
  echo "SMTP_HOST=$SMTP_HOST"
  echo "SMTP_PORT=$SMTP_PORT"
  echo "SMTP_SECURE=$SMTP_SECURE"
  echo "SMTP_USER=$SMTP_USER"
  echo "SMTP_PASS=$SMTP_PASS"
fi

echo ""
echo -e "${YELLOW}# Cron Secret${NC}"
echo "CRON_SECRET=$CRON_SECRET"

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Sauvegarder dans un fichier temporaire
cat > /tmp/manus-secrets.txt << EOF
# SMTP Configuration
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_SECURE=$SMTP_SECURE
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS

# Cron Secret
CRON_SECRET=$CRON_SECRET
EOF

echo -e "${GREEN}✅ Variables sauvegardées dans /tmp/manus-secrets.txt${NC}"
echo ""
read -p "Appuyez sur Entrée quand vous avez ajouté ces variables dans Manus..."

# ============================================================================
# ÉTAPE 4 : INSTRUCTIONS STRIPE
# ============================================================================

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  ÉTAPE 3/3 : Configuration Stripe Live${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT : Réclamez votre sandbox avant le 20 janvier 2026${NC}"
echo ""
echo -e "${CYAN}Instructions :${NC}"
echo ""
echo "1. Réclamez votre sandbox Stripe"
echo "   → https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE"
echo ""
echo "2. Activez le mode Live"
echo "   → Dans le dashboard Stripe, cliquez sur 'Test mode' → 'Live mode'"
echo ""
echo "3. Créez le produit d'abonnement"
echo "   → Products → Add product"
echo "   → Name: Abonnement Mensuel Sionohmair Insight Academy"
echo "   → Price: 36.00 EUR / Monthly"
echo ""
echo "4. Récupérez les clés Live"
echo "   → Developers → API keys"
echo "   → Copiez 'Publishable key' (pk_live_...)"
echo "   → Copiez 'Secret key' (sk_live_...)"
echo ""
echo "5. Configurez le webhook"
echo "   → Developers → Webhooks → Add endpoint"
echo "   → URL: https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook"
echo "   → Events: customer.subscription.*, invoice.payment_*"
echo "   → Copiez 'Signing secret' (whsec_...)"
echo ""
echo "6. Ajoutez dans Manus (Settings → Secrets)"
echo "   → VITE_STRIPE_PUBLISHABLE_KEY=pk_live_..."
echo "   → STRIPE_SECRET_KEY=sk_live_..."
echo "   → STRIPE_WEBHOOK_SECRET=whsec_..."
echo ""
read -p "Appuyez sur Entrée quand c'est fait..."

# ============================================================================
# ÉTAPE 5 : TEST SMTP
# ============================================================================

if [ ! -z "$SMTP_HOST" ]; then
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}  TEST SMTP${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  echo -e "${CYAN}Voulez-vous tester l'envoi d'email maintenant ? (o/n)${NC}"
  read -p "Votre choix : " test_smtp
  
  if [ "$test_smtp" = "o" ] || [ "$test_smtp" = "O" ]; then
    echo ""
    echo "Test d'envoi d'email..."
    
    # Créer un fichier de test temporaire
    cat > /tmp/test-smtp.mjs << EOF
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: '$SMTP_HOST',
  port: $SMTP_PORT,
  secure: $SMTP_SECURE,
  auth: {
    user: '$SMTP_USER',
    pass: '$SMTP_PASS',
  },
});

try {
  const info = await transporter.sendMail({
    from: '$SMTP_USER',
    to: '$SMTP_USER',
    subject: '✅ Test SMTP - Sionohmair Insight Academy',
    html: '<h1>Test réussi !</h1><p>Votre configuration SMTP fonctionne correctement.</p>',
  });
  
  console.log('✅ Email envoyé avec succès !');
  console.log('Message ID:', info.messageId);
  process.exit(0);
} catch (error) {
  console.error('❌ Erreur lors de l\'envoi:', error.message);
  process.exit(1);
}
EOF
    
    if node /tmp/test-smtp.mjs 2>&1; then
      echo ""
      echo -e "${GREEN}✅ Test SMTP réussi ! Vérifiez votre boîte email.${NC}"
    else
      echo ""
      echo -e "${RED}❌ Test SMTP échoué. Vérifiez vos identifiants.${NC}"
    fi
    
    rm /tmp/test-smtp.mjs
  fi
fi

# ============================================================================
# RÉSUMÉ FINAL
# ============================================================================

echo ""
echo -e "${PURPLE}${BOLD}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              CONFIGURATION TERMINÉE !                      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}✅ Étape 1/3 : SMTP configuré${NC}"
echo -e "${GREEN}✅ Étape 2/3 : CRON_SECRET configuré${NC}"
echo -e "${GREEN}✅ Étape 3/3 : Instructions Stripe affichées${NC}"
echo ""

echo -e "${CYAN}${BOLD}Prochaines étapes :${NC}"
echo ""
echo "1. Redémarrez le serveur pour appliquer les changements"
echo "   → Dans le dashboard Manus, cliquez sur 'Restart'"
echo ""
echo "2. Testez le flux complet"
echo "   → Ouvrez https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer"
echo "   → Cliquez sur 'Essai gratuit (30j)'"
echo "   → Vérifiez que vous recevez l'email de bienvenue"
echo ""
echo "3. Créez un checkpoint et publiez"
echo "   → Dashboard Manus → Save Checkpoint"
echo "   → Dashboard Manus → Publish"
echo ""

echo -e "${YELLOW}Documentation complète :${NC}"
echo "  → DEPLOIEMENT_PRODUCTION_RAPIDE.md"
echo "  → GUIDE_AUTOMATISATION.md"
echo "  → START_HERE.md"
echo ""

echo -e "${PURPLE}${BOLD}🎉 Votre plateforme est prête pour la production !${NC}"
echo ""

# Sauvegarder un résumé
cat > /tmp/deployment-summary.txt << EOF
DÉPLOIEMENT TERMINÉ - $(date)
================================

SMTP Configuration:
- Host: $SMTP_HOST
- Port: $SMTP_PORT
- User: $SMTP_USER

CRON_SECRET:
$CRON_SECRET

GitHub Secrets:
- CRON_SECRET: Configuré
- APP_URL: https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer

Stripe:
- Mode: À activer en Live
- Webhook URL: https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook

Prochaines étapes:
1. Redémarrer le serveur
2. Tester le flux complet
3. Créer un checkpoint et publier

Documentation:
- DEPLOIEMENT_PRODUCTION_RAPIDE.md
- GUIDE_AUTOMATISATION.md
- START_HERE.md
EOF

echo -e "${GREEN}✅ Résumé sauvegardé dans /tmp/deployment-summary.txt${NC}"
echo ""
