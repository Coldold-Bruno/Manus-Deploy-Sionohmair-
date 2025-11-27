#!/bin/bash

# ========================================
# Script de Démarrage One-Click
# Sionohmair Insight Academy
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
║   ███████╗██╗ ██████╗ ███╗   ██╗ ██████╗ ██╗  ██╗███╗   ███╗ █████╗ ║
║   ██╔════╝██║██╔═══██╗████╗  ██║██╔═══██╗██║  ██║████╗ ████║██╔══██╗║
║   ███████╗██║██║   ██║██╔██╗ ██║██║   ██║███████║██╔████╔██║███████║║
║   ╚════██║██║██║   ██║██║╚██╗██║██║   ██║██╔══██║██║╚██╔╝██║██╔══██║║
║   ███████║██║╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║║
║   ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝║
║                                                                       ║
║                    🚀 Démarrage One-Click                             ║
║                       Insight Academy                                 ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Bienvenue ! Ce script va vous guider pour démarrer votre système.${NC}\n"

# ========================================
# MENU PRINCIPAL
# ========================================

echo -e "${BLUE}Que souhaitez-vous faire ?${NC}\n"
echo -e "  ${GREEN}1.${NC} Configuration complète (première fois)"
echo -e "  ${GREEN}2.${NC} Vérifier l'état du système"
echo -e "  ${GREEN}3.${NC} Tester le système (SMTP, Cron, Stripe)"
echo -e "  ${GREEN}4.${NC} Démarrer le serveur de développement"
echo -e "  ${GREEN}5.${NC} Afficher les URLs importantes"
echo -e "  ${GREEN}6.${NC} Afficher l'aide"
echo -e "  ${GREEN}0.${NC} Quitter"
echo -e ""

read -p "$(echo -e ${YELLOW}Votre choix \(1-6\) : ${NC})" CHOICE

case $CHOICE in
    1)
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Configuration Complète${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        echo -e "${CYAN}Cette option va exécuter :${NC}"
        echo -e "  ${GREEN}1.${NC} Configuration GitHub Secrets"
        echo -e "  ${GREEN}2.${NC} Configuration Manus Secrets (SMTP)"
        echo -e "  ${GREEN}3.${NC} Tests automatiques"
        echo -e ""
        
        read -p "$(echo -e ${YELLOW}Continuer ? \(o/n\) : ${NC})" CONFIRM
        
        if [[ $CONFIRM =~ ^[oOyY]$ ]]; then
            if [ -f "./scripts/setup-all.sh" ]; then
                ./scripts/setup-all.sh
            else
                echo -e "${RED}❌ Fichier setup-all.sh introuvable${NC}"
            fi
        else
            echo -e "${YELLOW}⏭️  Configuration annulée${NC}"
        fi
        ;;
        
    2)
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Vérification du Système${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        if [ -f "./scripts/verify-final.sh" ]; then
            ./scripts/verify-final.sh
        else
            echo -e "${RED}❌ Fichier verify-final.sh introuvable${NC}"
        fi
        ;;
        
    3)
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Tests du Système${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        echo -e "${CYAN}Quel test souhaitez-vous exécuter ?${NC}\n"
        echo -e "  ${GREEN}1.${NC} Test SMTP (envoi d'email)"
        echo -e "  ${GREEN}2.${NC} Test système complet"
        echo -e "  ${GREEN}3.${NC} Les deux"
        echo -e ""
        
        read -p "$(echo -e ${YELLOW}Votre choix \(1-3\) : ${NC})" TEST_CHOICE
        
        case $TEST_CHOICE in
            1)
                if [ -f "./scripts/test-email.mjs" ]; then
                    node ./scripts/test-email.mjs
                else
                    echo -e "${RED}❌ Fichier test-email.mjs introuvable${NC}"
                fi
                ;;
            2)
                if [ -f "./scripts/test-system.sh" ]; then
                    ./scripts/test-system.sh
                else
                    echo -e "${RED}❌ Fichier test-system.sh introuvable${NC}"
                fi
                ;;
            3)
                echo -e "\n${BLUE}🧪 Test SMTP...${NC}"
                if [ -f "./scripts/test-email.mjs" ]; then
                    node ./scripts/test-email.mjs
                fi
                
                echo -e "\n${BLUE}🧪 Test système complet...${NC}"
                if [ -f "./scripts/test-system.sh" ]; then
                    ./scripts/test-system.sh
                fi
                ;;
            *)
                echo -e "${RED}❌ Choix invalide${NC}"
                ;;
        esac
        ;;
        
    4)
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Démarrage du Serveur${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        echo -e "${CYAN}Le serveur va démarrer sur :${NC}"
        echo -e "  ${GREEN}http://localhost:3000${NC}"
        echo -e ""
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter le serveur${NC}\n"
        
        sleep 2
        
        if command -v pnpm &> /dev/null; then
            pnpm dev
        else
            echo -e "${RED}❌ pnpm n'est pas installé${NC}"
            echo -e "${CYAN}Installation de pnpm...${NC}"
            npm install -g pnpm
            pnpm install
            pnpm dev
        fi
        ;;
        
    5)
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  URLs Importantes${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        echo -e "${CYAN}Application :${NC}"
        echo -e "  ${GREEN}•${NC} Production : ${BLUE}https://sionohmair-insight-academy.manus.space${NC}"
        echo -e "  ${GREEN}•${NC} Dashboard Config : ${BLUE}https://sionohmair-insight-academy.manus.space/config${NC}"
        echo -e "  ${GREEN}•${NC} Admin : ${BLUE}https://sionohmair-insight-academy.manus.space/admin${NC}"
        echo -e "  ${GREEN}•${NC} Dashboard User : ${BLUE}https://sionohmair-insight-academy.manus.space/dashboard${NC}"
        echo -e ""
        
        echo -e "${CYAN}Services Externes :${NC}"
        echo -e "  ${GREEN}•${NC} GitHub Actions : ${BLUE}https://github.com/votre-username/sionohmair-insight-academy/actions${NC}"
        echo -e "  ${GREEN}•${NC} Stripe Dashboard : ${BLUE}https://dashboard.stripe.com${NC}"
        echo -e "  ${GREEN}•${NC} Stripe Sandbox : ${BLUE}https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE${NC}"
        echo -e "  ${GREEN}•${NC} Manus Settings : ${BLUE}https://manus.im${NC}"
        echo -e ""
        ;;
        
    6)
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Aide${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        
        echo -e "${CYAN}Documentation disponible :${NC}"
        echo -e "  ${GREEN}•${NC} START_HERE.md : Guide de démarrage rapide"
        echo -e "  ${GREEN}•${NC} FINALISATION.md : Guide des 3 dernières étapes"
        echo -e "  ${GREEN}•${NC} README.md : Documentation principale"
        echo -e "  ${GREEN}•${NC} COMMANDES.md : Toutes les commandes"
        echo -e "  ${GREEN}•${NC} QUICKSTART.md : Démarrage rapide"
        echo -e ""
        
        echo -e "${CYAN}Scripts disponibles :${NC}"
        echo -e "  ${GREEN}•${NC} ./scripts/setup-all.sh : Configuration complète"
        echo -e "  ${GREEN}•${NC} ./scripts/verify-final.sh : Vérification"
        echo -e "  ${GREEN}•${NC} ./scripts/test-system.sh : Tests"
        echo -e "  ${GREEN}•${NC} node scripts/test-email.mjs : Test SMTP"
        echo -e ""
        
        echo -e "${CYAN}Commandes utiles :${NC}"
        echo -e "  ${GREEN}•${NC} pnpm dev : Démarrer le serveur"
        echo -e "  ${GREEN}•${NC} pnpm build : Build pour production"
        echo -e "  ${GREEN}•${NC} pnpm db:push : Push du schéma DB"
        echo -e ""
        ;;
        
    0)
        echo -e "\n${GREEN}Au revoir ! 👋${NC}\n"
        exit 0
        ;;
        
    *)
        echo -e "\n${RED}❌ Choix invalide${NC}\n"
        ;;
esac

echo -e "\n${MAGENTA}🎉 Terminé !${NC}\n"
