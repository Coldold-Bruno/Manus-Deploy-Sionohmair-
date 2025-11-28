#!/bin/bash

# ============================================================================
# Script de Vérification de l'Automatisation Option 2
# ============================================================================
# Ce script vérifie que tous les composants de l'automatisation sont en place
# ============================================================================

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Compteurs
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Fonction de vérification
check_item() {
    local description="$1"
    local command="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Fonction de vérification de fichier
check_file() {
    local description="$1"
    local filepath="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$filepath" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Fonction de vérification de script exécutable
check_executable() {
    local description="$1"
    local filepath="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -x "$filepath" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Bannière
clear
echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║       VÉRIFICATION DE L'AUTOMATISATION OPTION 2                ║"
echo "║                                                                ║"
echo "║       Sionohmair Insight Academy                               ║"
echo "║       L'Ingénierie du Génie                                    ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# 1. Vérification des Scripts Principaux
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}1. Scripts Principaux${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_executable "Script maître (launch-production.sh)" "scripts/launch-production.sh"
check_executable "Configuration domaine (configure-domain.sh)" "scripts/configure-domain.sh"
check_executable "Configuration Stripe (configure-stripe.sh)" "scripts/configure-stripe.sh"
check_executable "Configuration SEO (configure-seo.sh)" "scripts/configure-seo.sh"

echo ""

# 2. Vérification des Templates
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}2. Templates de Configuration${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_file "Template DNS" "scripts/templates/dns-config-template.txt"
check_file "Template Stripe" "scripts/templates/stripe-config-template.txt"
check_file "Template SEO" "scripts/templates/seo-checklist-template.txt"

echo ""

# 3. Vérification de la Documentation
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}3. Documentation${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_file "Guide d'automatisation complet" "GUIDE-AUTOMATISATION.md"
check_file "Récapitulatif Option 2" "AUTOMATISATION-OPTION-2.md"
check_file "README des scripts" "scripts/README-AUTOMATISATION.md"

echo ""

# 4. Vérification des Scripts de Support
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}4. Scripts de Support${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_executable "Finalisation complète (finalize-everything.sh)" "scripts/finalize-everything.sh"
check_executable "Vérification finale (verify-final.sh)" "scripts/verify-final.sh"
check_executable "Tests système (test-system.sh)" "scripts/test-system.sh"
check_executable "Déploiement production (deploy-production.sh)" "scripts/deploy-production.sh"

echo ""

# 5. Vérification de la Structure du Projet
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}5. Structure du Projet${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_item "Répertoire scripts existe" "[ -d scripts ]"
check_item "Répertoire templates existe" "[ -d scripts/templates ]"
check_item "Répertoire client existe" "[ -d client ]"
check_item "Répertoire server existe" "[ -d server ]"

echo ""

# 6. Vérification des Dépendances
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}6. Dépendances Système${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_item "Node.js installé" "command -v node"
check_item "pnpm installé" "command -v pnpm"
check_item "Git installé" "command -v git"
check_item "curl installé" "command -v curl"

echo ""

# 7. Calcul du Score
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}7. Résultat de la Vérification${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo ""
echo -e "${BLUE}Total de vérifications : ${TOTAL_CHECKS}${NC}"
echo -e "${GREEN}Réussies : ${PASSED_CHECKS}${NC}"
echo -e "${RED}Échouées : ${FAILED_CHECKS}${NC}"
echo ""

if [ $SCORE -ge 90 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║                  ✅ SCORE : ${SCORE}/100 - EXCELLENT ✅                  ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║       Le système d'automatisation est 100% opérationnel       ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
elif [ $SCORE -ge 75 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║                                                                ║${NC}"
    echo -e "${YELLOW}║                   ⚠️  SCORE : ${SCORE}/100 - BON ⚠️                    ║${NC}"
    echo -e "${YELLOW}║                                                                ║${NC}"
    echo -e "${YELLOW}║       Quelques éléments manquants, mais fonctionnel           ║${NC}"
    echo -e "${YELLOW}║                                                                ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}║                ❌ SCORE : ${SCORE}/100 - INSUFFISANT ❌               ║${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}║       Éléments critiques manquants, vérifiez les erreurs      ║${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
fi

echo ""

# 8. Prochaines Étapes
if [ $SCORE -ge 90 ]; then
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}8. Prochaines Étapes${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}✅ Vous êtes prêt à lancer la production !${NC}"
    echo ""
    echo "Pour lancer l'automatisation complète :"
    echo ""
    echo -e "${YELLOW}  ./scripts/launch-production.sh${NC}"
    echo ""
    echo "Pour consulter la documentation :"
    echo ""
    echo -e "${YELLOW}  cat GUIDE-AUTOMATISATION.md${NC}"
    echo -e "${YELLOW}  cat AUTOMATISATION-OPTION-2.md${NC}"
    echo ""
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Retourner le code de sortie approprié
if [ $SCORE -ge 90 ]; then
    exit 0
elif [ $SCORE -ge 75 ]; then
    exit 1
else
    exit 2
fi
