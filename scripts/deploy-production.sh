#!/bin/bash

# ========================================
# Script de Déploiement Production
# Sionohmair Insight Academy
# Déploie en production en UNE commande
# ========================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🚀 DÉPLOIEMENT PRODUCTION                                           ║
║   Passage en Mode Live                                                ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${YELLOW}⚠️  ATTENTION : Ce script passe le système en mode PRODUCTION${NC}"
echo -e "${CYAN}Assurez-vous que tous les tests sont validés en mode test${NC}\n"

read -p "$(echo -e ${YELLOW}Continuer avec le déploiement en production ? \(o/n\) : ${NC})" CONFIRM

if [[ ! $CONFIRM =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Déploiement annulé${NC}"
    exit 0
fi

# ========================================
# VÉRIFICATIONS PRÉALABLES AUTOMATIQUES
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Vérifications Préalables Automatiques"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Vérifier que le script de pré-vérification existe
if [ ! -f "./scripts/pre-deploy-check.sh" ]; then
    echo -e "${RED}❌ Script pre-deploy-check.sh introuvable${NC}"
    echo -e "${YELLOW}Ce script est essentiel pour valider le système avant déploiement${NC}"
    exit 1
fi

# Exécuter la pré-vérification automatique
echo -e "${CYAN}Exécution de la pré-vérification complète...${NC}\n"
if ./scripts/pre-deploy-check.sh; then
    echo -e "\n${GREEN}✅ Toutes les vérifications automatiques ont réussi !${NC}"
else
    echo -e "\n${RED}❌ Certaines vérifications ont échoué${NC}"
    echo -e "${YELLOW}Consultez le rapport généré pour plus de détails${NC}"
    echo -e "${CYAN}Corrigez les erreurs et exécutez à nouveau ce script${NC}\n"
    exit 1
fi

# Générer le rapport de validation détaillé
echo -e "\n${CYAN}Génération du rapport de validation détaillé...${NC}\n"
if [ -f "./scripts/generate-validation-report.sh" ]; then
    ./scripts/generate-validation-report.sh
    echo -e "\n${GREEN}✅ Rapport de validation généré${NC}"
fi

echo -e "\n${YELLOW}⚠️  Vérifiez le rapport de validation avant de continuer${NC}"
read -p "Score ≥ 90% et prêt à déployer ? (o/n) : " VERIFY_OK

if [[ ! $VERIFY_OK =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Déploiement annulé${NC}"
    exit 0
fi

# ========================================
# CHECKLIST MANUELLE
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Checklist Manuelle"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Avant de continuer, vérifiez que :${NC}\n"
echo -e "  ${GREEN}✓${NC} Tous les tests sont validés (SMTP, Cron, Paiement)"
echo -e "  ${GREEN}✓${NC} Le compte Stripe est activé"
echo -e "  ${GREEN}✓${NC} Le produit Stripe est créé (36€/mois)"
echo -e "  ${GREEN}✓${NC} Le webhook Stripe est configuré"
echo -e "  ${GREEN}✓${NC} Les emails de test sont reçus"
echo -e "  ${GREEN}✓${NC} Un paiement test a réussi"
echo -e ""

read -p "$(echo -e ${YELLOW}Tous les tests sont validés ? \(o/n\) : ${NC})" TESTS_OK

if [[ ! $TESTS_OK =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Déploiement annulé - Validez d'abord tous les tests${NC}"
    exit 0
fi

# ========================================
# PASSAGE EN MODE LIVE
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Passage en Mode Live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Instructions pour passer Stripe en mode Live :${NC}\n"
echo -e "  ${YELLOW}1.${NC} Allez sur Stripe Dashboard"
echo -e "  ${YELLOW}2.${NC} Activez le mode ${GREEN}Live${NC} (en haut à droite)"
echo -e "  ${YELLOW}3.${NC} Allez dans ${CYAN}Developers → API keys${NC}"
echo -e "  ${YELLOW}4.${NC} Copiez les nouvelles clés :"
echo -e "     - ${GREEN}pk_live_...${NC} (Publishable key)"
echo -e "     - ${GREEN}sk_live_...${NC} (Secret key)"
echo -e ""

read -p "Appuyez sur Entrée une fois les clés Live récupérées..."

echo -e "\n${CYAN}Mettez à jour les secrets dans Manus → Settings → Secrets :${NC}\n"
echo -e "  ${GREEN}STRIPE_SECRET_KEY${NC} = sk_live_votre_cle"
echo -e "  ${GREEN}VITE_STRIPE_PUBLISHABLE_KEY${NC} = pk_live_votre_cle"
echo -e ""

read -p "Secrets mis à jour dans Manus ? (o/n) : " SECRETS_UPDATED

if [[ ! $SECRETS_UPDATED =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Mettez à jour les secrets avant de continuer${NC}"
    exit 0
fi

# ========================================
# WEBHOOK LIVE
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Configuration Webhook Live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Créez un nouveau webhook en mode Live :${NC}\n"
echo -e "  ${YELLOW}1.${NC} Stripe Dashboard → ${CYAN}Developers → Webhooks${NC}"
echo -e "  ${YELLOW}2.${NC} Cliquez sur ${GREEN}Add endpoint${NC}"
echo -e "  ${YELLOW}3.${NC} URL : ${CYAN}https://sionohmair-insight-academy.manus.space/api/stripe/webhook${NC}"
echo -e "  ${YELLOW}4.${NC} Events :"
echo -e "     - ${GREEN}customer.subscription.created${NC}"
echo -e "     - ${GREEN}customer.subscription.updated${NC}"
echo -e "     - ${GREEN}customer.subscription.deleted${NC}"
echo -e "     - ${GREEN}invoice.payment_succeeded${NC}"
echo -e "     - ${GREEN}invoice.payment_failed${NC}"
echo -e "  ${YELLOW}5.${NC} Copiez le ${GREEN}Signing secret${NC} (whsec_...)"
echo -e ""

read -p "Appuyez sur Entrée une fois le webhook créé..."

echo -e "\n${CYAN}Mettez à jour le secret dans Manus :${NC}\n"
echo -e "  ${GREEN}STRIPE_WEBHOOK_SECRET${NC} = whsec_votre_nouveau_secret"
echo -e ""

read -p "Secret webhook mis à jour ? (o/n) : " WEBHOOK_UPDATED

if [[ ! $WEBHOOK_UPDATED =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Mettez à jour le webhook secret avant de continuer${NC}"
    exit 0
fi

# ========================================
# DOMAINE PERSONNALISÉ (OPTIONNEL)
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Domaine Personnalisé (Optionnel)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

read -p "$(echo -e ${YELLOW}Souhaitez-vous configurer un domaine personnalisé ? \(o/n\) : ${NC})" CUSTOM_DOMAIN

if [[ $CUSTOM_DOMAIN =~ ^[oOyY]$ ]]; then
    echo -e "\n${CYAN}Instructions pour le domaine personnalisé :${NC}\n"
    echo -e "  ${YELLOW}1.${NC} Allez dans ${CYAN}Manus → Settings → Domains${NC}"
    echo -e "  ${YELLOW}2.${NC} Ajoutez votre domaine (ex: ${GREEN}app.sionohmair.com${NC})"
    echo -e "  ${YELLOW}3.${NC} Configurez les DNS selon les instructions"
    echo -e "  ${YELLOW}4.${NC} Mettez à jour ${GREEN}APP_URL${NC} dans GitHub Secrets"
    echo -e ""
    
    read -p "Appuyez sur Entrée une fois le domaine configuré..."
fi

# ========================================
# TEST FINAL EN PRODUCTION
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Final en Production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Effectuez un test complet en production :${NC}\n"
echo -e "  ${YELLOW}1.${NC} Créez un compte utilisateur test"
echo -e "  ${YELLOW}2.${NC} Démarrez un essai gratuit"
echo -e "  ${YELLOW}3.${NC} Vérifiez la réception de l'email de bienvenue"
echo -e "  ${YELLOW}4.${NC} Testez un paiement réel (petit montant)"
echo -e "  ${YELLOW}5.${NC} Vérifiez la réception de l'email de confirmation"
echo -e ""

read -p "Test en production réussi ? (o/n) : " PROD_TEST_OK

if [[ ! $PROD_TEST_OK =~ ^[oOyY]$ ]]; then
    echo -e "${YELLOW}⚠️  Vérifiez les logs et corrigez les problèmes${NC}"
    exit 0
fi

# ========================================
# MONITORING
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Activation du Monitoring"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${CYAN}Surveillez ces éléments :${NC}\n"
echo -e "  ${GREEN}✓${NC} Dashboard de configuration : ${CYAN}/config${NC}"
echo -e "  ${GREEN}✓${NC} Logs GitHub Actions : ${CYAN}https://github.com/votre-repo/actions${NC}"
echo -e "  ${GREEN}✓${NC} Dashboard Stripe : ${CYAN}https://dashboard.stripe.com${NC}"
echo -e "  ${GREEN}✓${NC} Emails envoyés (vérifiez les logs)"
echo -e ""

# ========================================
# RÉSUMÉ FINAL
# ========================================
echo -e "\n${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ✅ Déploiement Production Terminé !                                 ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}🎉 Félicitations ! Votre système est en production !${NC}\n"

echo -e "${CYAN}URLs importantes :${NC}"
echo -e "  ${GREEN}•${NC} Application : ${CYAN}https://sionohmair-insight-academy.manus.space${NC}"
echo -e "  ${GREEN}•${NC} Dashboard Config : ${CYAN}https://sionohmair-insight-academy.manus.space/config${NC}"
echo -e "  ${GREEN}•${NC} Admin : ${CYAN}https://sionohmair-insight-academy.manus.space/admin${NC}"
echo -e "  ${GREEN}•${NC} Stripe Dashboard : ${CYAN}https://dashboard.stripe.com${NC}"

echo -e "\n${MAGENTA}🚀 Votre plateforme est maintenant LIVE ! 🎉${NC}\n"
