#!/bin/bash

# ========================================
# Script d'Automatisation Manus Secrets
# Sionohmair Insight Academy
# ========================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🔐 Configuration Automatique Manus Secrets              ║"
echo "║   Sionohmair Insight Academy                              ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📋 Ce script va vous guider pour configurer tous les secrets Manus${NC}"
echo -e "${CYAN}nécessaires au fonctionnement du système d'abonnement.${NC}\n"

# Fonction pour afficher un secret à copier
show_secret() {
    local KEY=$1
    local VALUE=$2
    local DESCRIPTION=$3
    
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔑 Secret ${SECRET_COUNT}/${TOTAL_SECRETS} : ${KEY}${NC}"
    echo -e "${CYAN}${DESCRIPTION}${NC}"
    echo -e "\n${GREEN}Key :${NC}"
    echo -e "${BLUE}${KEY}${NC}"
    echo -e "\n${GREEN}Value :${NC}"
    echo -e "${BLUE}${VALUE}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    read -p "Appuyez sur Entrée une fois copié dans Manus..."
    ((SECRET_COUNT++))
}

# Compteur de secrets
SECRET_COUNT=1
TOTAL_SECRETS=6

echo -e "${YELLOW}⚠️  Ouvrez Manus dans votre navigateur :${NC}"
echo -e "${BLUE}https://manus.im${NC}"
echo -e "\n${CYAN}Puis allez dans :${NC}"
echo -e "  ${BLUE}Votre projet → Settings → Secrets → Add Secret${NC}\n"

read -p "Appuyez sur Entrée quand vous êtes prêt..."

# ========================================
# 1. CRON_SECRET
# ========================================
show_secret \
    "CRON_SECRET" \
    "7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=" \
    "Secret pour sécuriser l'endpoint du cron job quotidien (emails automatiques)"

# ========================================
# 2-6. SMTP (Gmail par défaut)
# ========================================
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📧 Configuration SMTP (Gmail)${NC}"
echo -e "${CYAN}Les secrets suivants sont pré-configurés avec Gmail.${NC}"
echo -e "${CYAN}Vous pouvez les modifier si vous utilisez un autre fournisseur.${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Valeurs par défaut (Gmail de l'utilisateur)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="coldoldbruno@gmail.com"
SMTP_PASS="uiqq kpth pjdb oknb"
SMTP_FROM="coldoldbruno@gmail.com"

echo -e "\n${YELLOW}Voulez-vous utiliser les valeurs Gmail par défaut ?${NC}"
echo -e "${CYAN}Email : ${SMTP_USER}${NC}"
read -p "(o/n) : " USE_DEFAULT

if [[ ! $USE_DEFAULT =~ ^[oOyY]$ ]]; then
    echo -e "\n${YELLOW}Configuration personnalisée SMTP${NC}"
    
    echo -e "\n${CYAN}Fournisseur SMTP :${NC}"
    echo -e "  1. Gmail (gratuit, simple)"
    echo -e "  2. SendGrid (100 emails/jour gratuits)"
    echo -e "  3. Brevo (300 emails/jour gratuits)"
    echo -e "  4. Autre"
    read -p "Choix (1-4) : " SMTP_CHOICE
    
    case $SMTP_CHOICE in
        1)
            SMTP_HOST="smtp.gmail.com"
            SMTP_PORT="587"
            echo -e "\n${CYAN}Email Gmail :${NC}"
            read -p "Email : " SMTP_USER
            SMTP_FROM=$SMTP_USER
            echo -e "\n${YELLOW}⚠️  Créez un mot de passe d'application :${NC}"
            echo -e "${BLUE}https://myaccount.google.com/apppasswords${NC}"
            read -p "Mot de passe d'application : " SMTP_PASS
            ;;
        2)
            SMTP_HOST="smtp.sendgrid.net"
            SMTP_PORT="587"
            SMTP_USER="apikey"
            echo -e "\n${YELLOW}⚠️  Créez une clé API SendGrid :${NC}"
            echo -e "${BLUE}https://app.sendgrid.com/settings/api_keys${NC}"
            read -p "Clé API SendGrid : " SMTP_PASS
            read -p "Email expéditeur : " SMTP_FROM
            ;;
        3)
            SMTP_HOST="smtp-relay.brevo.com"
            SMTP_PORT="587"
            echo -e "\n${CYAN}Email Brevo :${NC}"
            read -p "Email : " SMTP_USER
            echo -e "\n${YELLOW}⚠️  Créez une clé SMTP Brevo :${NC}"
            echo -e "${BLUE}https://app.brevo.com/settings/keys/smtp${NC}"
            read -p "Clé SMTP Brevo : " SMTP_PASS
            read -p "Email expéditeur : " SMTP_FROM
            ;;
        4)
            read -p "SMTP Host : " SMTP_HOST
            read -p "SMTP Port : " SMTP_PORT
            read -p "SMTP User : " SMTP_USER
            read -p "SMTP Pass : " SMTP_PASS
            read -p "SMTP From : " SMTP_FROM
            ;;
    esac
fi

# Afficher les secrets SMTP
show_secret "SMTP_HOST" "$SMTP_HOST" "Serveur SMTP pour l'envoi d'emails"
show_secret "SMTP_PORT" "$SMTP_PORT" "Port SMTP (généralement 587)"
show_secret "SMTP_USER" "$SMTP_USER" "Nom d'utilisateur SMTP"
show_secret "SMTP_PASS" "$SMTP_PASS" "Mot de passe SMTP (ou clé API)"
show_secret "SMTP_FROM" "$SMTP_FROM" "Adresse email expéditeur"

# ========================================
# Résumé
# ========================================
echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅ Configuration Manus Secrets Terminée !               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${BLUE}📋 Récapitulatif des secrets configurés :${NC}"
echo -e "  ${GREEN}✅${NC} CRON_SECRET"
echo -e "  ${GREEN}✅${NC} SMTP_HOST"
echo -e "  ${GREEN}✅${NC} SMTP_PORT"
echo -e "  ${GREEN}✅${NC} SMTP_USER"
echo -e "  ${GREEN}✅${NC} SMTP_PASS"
echo -e "  ${GREEN}✅${NC} SMTP_FROM"

echo -e "\n${BLUE}📝 Prochaines étapes :${NC}"
echo -e "  1. ${YELLOW}Redémarrer le serveur Manus${NC} pour appliquer les secrets"
echo -e "  2. ${YELLOW}Tester l'envoi d'emails${NC} avec :"
echo -e "     ${BLUE}./scripts/test-email.mjs${NC}"
echo -e "  3. ${YELLOW}Tester le système complet${NC} avec :"
echo -e "     ${BLUE}./scripts/test-system.sh${NC}"

echo -e "\n${CYAN}💡 Pour vérifier l'état de toutes les configurations :${NC}"
echo -e "  ${BLUE}https://sionohmair-insight-academy.manus.space/config${NC}"
