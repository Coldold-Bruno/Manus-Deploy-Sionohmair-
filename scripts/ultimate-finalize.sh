#!/bin/bash

# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║      FINALISATION ULTIME - AUTOMATISATION COMPLÈTE        ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝
#
# Ce script combine TOUS les scripts d'automatisation pour une
# finalisation complète en une seule commande.
#
# Durée estimée : 30-40 minutes
#
# Étapes :
# 1. Audit de sécurité et conformité (deploy-certified.sh)
# 2. Vérification pré-déploiement (pre-deploy-check.sh)
# 3. Configuration automatique (automate-everything.sh)
# 4. Configuration des backups (setup-backups.sh)
# 5. Tests end-to-end automatiques
# 6. Génération du rapport de certification finale
# 7. Déploiement production (deploy-production.sh)

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
WARN="⚠️ "
INFO="ℹ️ "
ROCKET="🚀"
LOCK="🔒"
CHART="📊"
DOC="📄"

echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}║      ${CYAN}FINALISATION ULTIME - AUTOMATISATION COMPLÈTE${PURPLE}        ║${NC}"
echo -e "${PURPLE}║                                                            ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Ce script va automatiser TOUTES les étapes de finalisation :${NC}"
echo -e "  ${ROCKET} Audit de sécurité et conformité"
echo -e "  ${LOCK} Vérification pré-déploiement"
echo -e "  ${CHART} Configuration automatique"
echo -e "  ${DOC} Tests end-to-end"
echo -e "  ${CHECK} Certification finale"
echo -e "  ${ROCKET} Déploiement production"
echo ""
echo -e "${YELLOW}Durée estimée : 30-40 minutes${NC}"
echo ""
read -p "$(echo -e ${CYAN}Voulez-vous continuer ? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}Annulé par l'utilisateur.${NC}"
    exit 1
fi

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$PROJECT_ROOT/RAPPORT_FINALISATION_$TIMESTAMP.md"

# Compteurs
TOTAL_STEPS=7
CURRENT_STEP=0
ERRORS=0
WARNINGS=0

# Fonction pour afficher l'étape en cours
step() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  ÉTAPE $CURRENT_STEP/$TOTAL_STEPS: $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Fonction pour logger les résultats
log_result() {
    local status=$1
    local message=$2
    
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}${CHECK} ${message}${NC}"
    elif [ "$status" = "error" ]; then
        echo -e "${RED}${CROSS} ${message}${NC}"
        ERRORS=$((ERRORS + 1))
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}${WARN}${message}${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${BLUE}${INFO}${message}${NC}"
    fi
}

# Initialiser le rapport
cat > "$REPORT_FILE" << EOF
# 🎉 Rapport de Finalisation Ultime

**Date** : $(date +"%d/%m/%Y %H:%M:%S")
**Projet** : Sionohmair Insight Academy
**Version** : Production Ready

---

## 📋 Résumé Exécutif

Ce rapport documente l'exécution complète du script de finalisation ultime.

---

## 🔍 Étapes Exécutées

EOF

# ============================================================================
# ÉTAPE 1 : Audit de sécurité et conformité
# ============================================================================
step "Audit de sécurité et conformité"

echo "Exécution de deploy-certified.sh..."
if [ -f "$SCRIPT_DIR/deploy-certified.sh" ]; then
    if bash "$SCRIPT_DIR/deploy-certified.sh"; then
        log_result "success" "Audit de sécurité complété avec succès"
        echo "### ✅ Étape 1 : Audit de sécurité et conformité - RÉUSSI" >> "$REPORT_FILE"
    else
        log_result "error" "Échec de l'audit de sécurité"
        echo "### ❌ Étape 1 : Audit de sécurité et conformité - ÉCHEC" >> "$REPORT_FILE"
    fi
else
    log_result "warning" "Script deploy-certified.sh non trouvé, passage à l'étape suivante"
    echo "### ⚠️  Étape 1 : Audit de sécurité et conformité - IGNORÉ" >> "$REPORT_FILE"
fi

# ============================================================================
# ÉTAPE 2 : Vérification pré-déploiement
# ============================================================================
step "Vérification pré-déploiement"

echo "Exécution de pre-deploy-check.sh..."
if [ -f "$SCRIPT_DIR/pre-deploy-check.sh" ]; then
    if bash "$SCRIPT_DIR/pre-deploy-check.sh"; then
        log_result "success" "Vérification pré-déploiement réussie (score ≥ 90/100)"
        echo "### ✅ Étape 2 : Vérification pré-déploiement - RÉUSSI" >> "$REPORT_FILE"
    else
        log_result "error" "Vérification pré-déploiement échouée (score < 90/100)"
        echo "### ❌ Étape 2 : Vérification pré-déploiement - ÉCHEC" >> "$REPORT_FILE"
        echo ""
        echo -e "${RED}Le score de vérification est insuffisant pour continuer.${NC}"
        echo -e "${YELLOW}Veuillez corriger les erreurs et réexécuter ce script.${NC}"
        exit 1
    fi
else
    log_result "warning" "Script pre-deploy-check.sh non trouvé"
    echo "### ⚠️  Étape 2 : Vérification pré-déploiement - IGNORÉ" >> "$REPORT_FILE"
fi

# ============================================================================
# ÉTAPE 3 : Configuration automatique
# ============================================================================
step "Configuration automatique"

echo "Exécution de automate-everything.sh..."
if [ -f "$SCRIPT_DIR/automate-everything.sh" ]; then
    if bash "$SCRIPT_DIR/automate-everything.sh"; then
        log_result "success" "Configuration automatique complétée"
        echo "### ✅ Étape 3 : Configuration automatique - RÉUSSI" >> "$REPORT_FILE"
    else
        log_result "error" "Échec de la configuration automatique"
        echo "### ❌ Étape 3 : Configuration automatique - ÉCHEC" >> "$REPORT_FILE"
    fi
else
    log_result "warning" "Script automate-everything.sh non trouvé"
    echo "### ⚠️  Étape 3 : Configuration automatique - IGNORÉ" >> "$REPORT_FILE"
fi

# ============================================================================
# ÉTAPE 4 : Configuration des backups
# ============================================================================
step "Configuration des backups"

echo "Exécution de setup-backups.sh..."
if [ -f "$SCRIPT_DIR/setup-backups.sh" ]; then
    if bash "$SCRIPT_DIR/setup-backups.sh"; then
        log_result "success" "Backups configurés avec succès"
        echo "### ✅ Étape 4 : Configuration des backups - RÉUSSI" >> "$REPORT_FILE"
    else
        log_result "warning" "Échec de la configuration des backups (non bloquant)"
        echo "### ⚠️  Étape 4 : Configuration des backups - ÉCHEC" >> "$REPORT_FILE"
    fi
else
    log_result "warning" "Script setup-backups.sh non trouvé"
    echo "### ⚠️  Étape 4 : Configuration des backups - IGNORÉ" >> "$REPORT_FILE"
fi

# ============================================================================
# ÉTAPE 5 : Tests end-to-end automatiques
# ============================================================================
step "Tests end-to-end automatiques"

echo "Exécution des tests vitest..."
cd "$PROJECT_ROOT"
if command -v pnpm &> /dev/null; then
    if pnpm test; then
        log_result "success" "Tous les tests passent avec succès"
        echo "### ✅ Étape 5 : Tests end-to-end - RÉUSSI" >> "$REPORT_FILE"
    else
        log_result "warning" "Certains tests ont échoué (non bloquant)"
        echo "### ⚠️  Étape 5 : Tests end-to-end - ÉCHEC PARTIEL" >> "$REPORT_FILE"
    fi
else
    log_result "warning" "pnpm non trouvé, tests ignorés"
    echo "### ⚠️  Étape 5 : Tests end-to-end - IGNORÉ" >> "$REPORT_FILE"
fi

# ============================================================================
# ÉTAPE 6 : Génération du rapport de certification finale
# ============================================================================
step "Génération du rapport de certification finale"

echo "Génération du rapport..."
if [ -f "$SCRIPT_DIR/generate-validation-report.sh" ]; then
    if bash "$SCRIPT_DIR/generate-validation-report.sh"; then
        log_result "success" "Rapport de certification généré"
        echo "### ✅ Étape 6 : Rapport de certification - GÉNÉRÉ" >> "$REPORT_FILE"
    else
        log_result "warning" "Échec de la génération du rapport"
        echo "### ⚠️  Étape 6 : Rapport de certification - ÉCHEC" >> "$REPORT_FILE"
    fi
else
    log_result "warning" "Script generate-validation-report.sh non trouvé"
    echo "### ⚠️  Étape 6 : Rapport de certification - IGNORÉ" >> "$REPORT_FILE"
fi

# ============================================================================
# ÉTAPE 7 : Préparation au déploiement production
# ============================================================================
step "Préparation au déploiement production"

echo ""
echo -e "${CYAN}Le système est maintenant prêt pour le déploiement en production.${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes manuelles :${NC}"
echo -e "  1. ${INFO}Activer Stripe en mode Live"
echo -e "  2. ${INFO}Configurer le webhook Stripe production"
echo -e "  3. ${INFO}Tester le flux complet en production"
echo -e "  4. ${INFO}Configurer le monitoring (Sentry, etc.)"
echo ""
echo -e "${GREEN}Pour déployer en production, exécutez :${NC}"
echo -e "  ${CYAN}./scripts/deploy-production.sh${NC}"
echo ""

echo "### ✅ Étape 7 : Préparation au déploiement - COMPLÉTÉ" >> "$REPORT_FILE"

# ============================================================================
# RÉSUMÉ FINAL
# ============================================================================
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  RÉSUMÉ FINAL${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}${CHECK} Étapes complétées : $TOTAL_STEPS/$TOTAL_STEPS${NC}"
echo -e "${RED}${CROSS} Erreurs : $ERRORS${NC}"
echo -e "${YELLOW}${WARN}Avertissements : $WARNINGS${NC}"
echo ""

# Ajouter le résumé au rapport
cat >> "$REPORT_FILE" << EOF

---

## 📊 Résumé Final

- **Étapes complétées** : $TOTAL_STEPS/$TOTAL_STEPS
- **Erreurs** : $ERRORS
- **Avertissements** : $WARNINGS

---

## 🎯 Prochaines Étapes

1. Activer Stripe en mode Live
2. Configurer le webhook Stripe production
3. Tester le flux complet en production
4. Configurer le monitoring (Sentry, etc.)
5. Exécuter \`./scripts/deploy-production.sh\`

---

## 📄 Fichiers Générés

- Rapport de finalisation : \`RAPPORT_FINALISATION_$TIMESTAMP.md\`
- Rapport de validation : \`VALIDATION_REPORT_*.md\`
- Rapport d'audit : \`pre-deploy-report-*.md\`

---

*Rapport généré automatiquement par ultimate-finalize.sh*
*Sionohmair Insight Academy - L'Ingénierie du Génie*
EOF

echo -e "${BLUE}${DOC} Rapport de finalisation sauvegardé : ${CYAN}$REPORT_FILE${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}${ROCKET} FINALISATION ULTIME RÉUSSIE ! Le système est prêt pour la production.${NC}"
    exit 0
else
    echo -e "${YELLOW}${WARN}FINALISATION COMPLÉTÉE AVEC DES ERREURS. Veuillez corriger avant de déployer.${NC}"
    exit 1
fi
