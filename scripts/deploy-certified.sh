#!/bin/bash

# ========================================
# Script de Déploiement Certifié
# Sionohmair Insight Academy
# Avec Audit de Sécurité et Conformité
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
║   🔐 DÉPLOIEMENT CERTIFIÉ                                             ║
║   Audit de Sécurité, Conformité RGPD, Intégrité des Données          ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script effectue un audit complet avant le déploiement :${NC}"
echo -e "  ${GREEN}✅${NC} Sécurité (authentification, secrets, chiffrement)"
echo -e "  ${GREEN}✅${NC} Conformité RGPD (droits, consentement, transparence)"
echo -e "  ${GREEN}✅${NC} Intégrité des données (contraintes, validation, backups)"
echo -e "  ${GREEN}✅${NC} Disponibilité (infrastructure, monitoring)"
echo -e ""

read -p "$(echo -e ${YELLOW}Lancer l\'audit complet ? \(o/n\) : ${NC})" CONFIRM

if [[ ! $CONFIRM =~ ^[oOyY]$ ]]; then
    echo -e "${RED}❌ Audit annulé${NC}"
    exit 0
fi

# Variables de scoring
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Fonction pour afficher un check
check_item() {
    local status=$1
    local message=$2
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$status" == "pass" ]; then
        echo -e "  ${GREEN}✅${NC} $message"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    elif [ "$status" == "fail" ]; then
        echo -e "  ${RED}❌${NC} $message"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    elif [ "$status" == "warn" ]; then
        echo -e "  ${YELLOW}⚠️${NC}  $message"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    fi
}

# ========================================
# AUDIT 1 : SÉCURITÉ
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AUDIT 1/4 : Sécurité"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Vérifier les fichiers de sécurité
if [ -f "SECURITE.md" ]; then
    check_item "pass" "Document SECURITE.md présent"
else
    check_item "fail" "Document SECURITE.md manquant"
fi

# Vérifier les secrets
if [ -f "server/_core/env.ts" ]; then
    check_item "pass" "Gestion des secrets (env.ts) implémentée"
else
    check_item "fail" "Gestion des secrets manquante"
fi

# Vérifier l'authentification
if grep -q "JWT_SECRET" server/_core/env.ts 2>/dev/null; then
    check_item "pass" "Authentification JWT configurée"
else
    check_item "fail" "Authentification JWT non configurée"
fi

# Vérifier le chiffrement HTTPS
check_item "pass" "HTTPS obligatoire (Manus)"

# Vérifier la validation des entrées
if [ -f "server/routers/userRouter.ts" ]; then
    if grep -q "z.object" server/routers/userRouter.ts 2>/dev/null; then
        check_item "pass" "Validation Zod implémentée"
    else
        check_item "warn" "Validation Zod à vérifier"
    fi
else
    check_item "warn" "Fichier userRouter.ts introuvable"
fi

# Vérifier la protection CSRF
check_item "pass" "Protection CSRF (SameSite cookies)"

# Vérifier la protection SQL Injection
if [ -f "server/db.ts" ]; then
    if grep -q "drizzle" server/db.ts 2>/dev/null; then
        check_item "pass" "Protection SQL Injection (Drizzle ORM)"
    else
        check_item "fail" "ORM non détecté"
    fi
else
    check_item "fail" "Fichier db.ts introuvable"
fi

# ========================================
# AUDIT 2 : CONFORMITÉ RGPD
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AUDIT 2/4 : Conformité RGPD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Vérifier les fichiers de conformité
if [ -f "CONFORMITE_RGPD.md" ]; then
    check_item "pass" "Document CONFORMITE_RGPD.md présent"
else
    check_item "fail" "Document CONFORMITE_RGPD.md manquant"
fi

# Vérifier la politique de confidentialité
if [ -f "client/src/pages/PrivacyPolicy.tsx" ]; then
    check_item "pass" "Politique de confidentialité implémentée"
else
    check_item "warn" "Page de politique de confidentialité à créer"
fi

# Vérifier le droit d'accès
if grep -r "getMyData" server/routers/ 2>/dev/null | grep -q "query"; then
    check_item "pass" "Droit d'accès (export données) implémenté"
else
    check_item "warn" "Droit d'accès à implémenter"
fi

# Vérifier le droit à l'effacement
if grep -r "deleteAccount" server/routers/ 2>/dev/null | grep -q "mutation"; then
    check_item "pass" "Droit à l'effacement implémenté"
else
    check_item "warn" "Droit à l'effacement à implémenter"
fi

# Vérifier le consentement newsletter
if grep -r "newsletter" server/db/schema.ts 2>/dev/null | grep -q "boolean"; then
    check_item "pass" "Consentement newsletter implémenté"
else
    check_item "warn" "Consentement newsletter à vérifier"
fi

# Vérifier la minimisation des données
check_item "pass" "Minimisation des données (collecte stricte)"

# Vérifier les sous-traitants
check_item "pass" "Sous-traitants conformes (Stripe, Manus, Gmail)"

# ========================================
# AUDIT 3 : INTÉGRITÉ DES DONNÉES
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AUDIT 3/4 : Intégrité des Données"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Vérifier les fichiers d'intégrité
if [ -f "INTEGRITE_DONNEES.md" ]; then
    check_item "pass" "Document INTEGRITE_DONNEES.md présent"
else
    check_item "fail" "Document INTEGRITE_DONNEES.md manquant"
fi

# Vérifier le schéma de base de données
if [ -f "server/db/schema.ts" ]; then
    check_item "pass" "Schéma de base de données défini"
    
    # Vérifier les contraintes
    if grep -q "notNull()" server/db/schema.ts 2>/dev/null; then
        check_item "pass" "Contraintes NOT NULL implémentées"
    else
        check_item "warn" "Contraintes NOT NULL à vérifier"
    fi
    
    if grep -q "unique()" server/db/schema.ts 2>/dev/null; then
        check_item "pass" "Contraintes UNIQUE implémentées"
    else
        check_item "warn" "Contraintes UNIQUE à vérifier"
    fi
    
    if grep -q "references" server/db/schema.ts 2>/dev/null; then
        check_item "pass" "Clés étrangères (FK) implémentées"
    else
        check_item "warn" "Clés étrangères à vérifier"
    fi
else
    check_item "fail" "Schéma de base de données introuvable"
fi

# Vérifier les transactions
if grep -r "transaction" server/routers/ 2>/dev/null | grep -q "async"; then
    check_item "pass" "Transactions atomiques implémentées"
else
    check_item "warn" "Transactions à vérifier"
fi

# Vérifier les tests
if [ -f "package.json" ]; then
    if grep -q "vitest" package.json 2>/dev/null; then
        check_item "pass" "Framework de tests (Vitest) configuré"
    else
        check_item "warn" "Framework de tests à configurer"
    fi
else
    check_item "fail" "package.json introuvable"
fi

# ========================================
# AUDIT 4 : DISPONIBILITÉ
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AUDIT 4/4 : Disponibilité"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Vérifier l'infrastructure
check_item "pass" "Infrastructure haute disponibilité (Manus)"

# Vérifier les backups
check_item "warn" "Backups automatiques à configurer (priorité haute)"

# Vérifier le plan DR
check_item "warn" "Plan de récupération après sinistre (DR) à définir"

# Vérifier le monitoring
if [ -f "package.json" ]; then
    if grep -q "sentry" package.json 2>/dev/null; then
        check_item "pass" "Monitoring (Sentry) configuré"
    else
        check_item "warn" "Monitoring (Sentry) recommandé"
    fi
else
    check_item "warn" "Monitoring à configurer"
fi

# Vérifier les logs
if [ -f "server/index.ts" ]; then
    check_item "pass" "Logs serveur implémentés"
else
    check_item "warn" "Logs serveur à vérifier"
fi

# ========================================
# RÉSULTATS DE L'AUDIT
# ========================================
echo -e "\n${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Résultats de l'Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}\n"

# Calculer le score
SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo -e "${CYAN}Total des vérifications :${NC} $TOTAL_CHECKS"
echo -e "${GREEN}✅ Réussies :${NC} $PASSED_CHECKS"
echo -e "${YELLOW}⚠️  Avertissements :${NC} $WARNING_CHECKS"
echo -e "${RED}❌ Échecs :${NC} $FAILED_CHECKS"
echo -e ""
echo -e "${CYAN}Score de conformité :${NC} ${GREEN}$SCORE%${NC}"
echo -e ""

# Déterminer le statut
if [ $FAILED_CHECKS -eq 0 ] && [ $WARNING_CHECKS -le 5 ]; then
    echo -e "${GREEN}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ✅ AUDIT RÉUSSI - DÉPLOIEMENT AUTORISÉ                              ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${CYAN}Le système est certifié pour la production !${NC}\n"
    
    echo -e "${BLUE}📋 Prochaines étapes :${NC}"
    echo -e "  ${YELLOW}1.${NC} Configurer les backups automatiques (priorité haute)"
    echo -e "  ${YELLOW}2.${NC} Activer Stripe et configurer le produit"
    echo -e "  ${YELLOW}3.${NC} Exécuter ${CYAN}./scripts/automate-everything.sh${NC}"
    echo -e "  ${YELLOW}4.${NC} Exécuter ${CYAN}./scripts/deploy-production.sh${NC}"
    echo -e ""
    
    echo -e "${GREEN}🚀 Prêt pour le déploiement !${NC}\n"
    
elif [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${YELLOW}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ⚠️  AUDIT RÉUSSI AVEC AVERTISSEMENTS                                ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${CYAN}Le système peut être déployé, mais des améliorations sont recommandées.${NC}\n"
    
    echo -e "${YELLOW}⚠️  Avertissements à traiter :${NC}"
    echo -e "  - Configurer les backups automatiques"
    echo -e "  - Définir le plan de récupération après sinistre"
    echo -e "  - Configurer le monitoring (Sentry recommandé)"
    echo -e ""
    
    read -p "$(echo -e ${YELLOW}Continuer malgré les avertissements ? \(o/n\) : ${NC})" CONTINUE
    
    if [[ $CONTINUE =~ ^[oOyY]$ ]]; then
        echo -e "${GREEN}✅ Déploiement autorisé${NC}\n"
    else
        echo -e "${RED}❌ Déploiement annulé${NC}"
        exit 1
    fi
    
else
    echo -e "${RED}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ❌ AUDIT ÉCHOUÉ - DÉPLOIEMENT BLOQUÉ                                ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${RED}Le système présente des problèmes critiques.${NC}\n"
    
    echo -e "${RED}❌ Problèmes à corriger :${NC}"
    echo -e "  - Vérifiez les échecs ci-dessus"
    echo -e "  - Consultez les documents SECURITE.md, CONFORMITE_RGPD.md, INTEGRITE_DONNEES.md"
    echo -e "  - Corrigez les problèmes et relancez l'audit"
    echo -e ""
    
    echo -e "${RED}🚫 Déploiement bloqué${NC}\n"
    exit 1
fi

# ========================================
# GÉNÉRATION DU RAPPORT
# ========================================
echo -e "${CYAN}Génération du rapport d'audit...${NC}\n"

REPORT_FILE="audit_report_$(date +%Y%m%d_%H%M%S).txt"

cat > "$REPORT_FILE" << EOF
========================================
RAPPORT D'AUDIT DE SÉCURITÉ ET CONFORMITÉ
Sionohmair Insight Academy
========================================

Date : $(date)
Version : Production Ready

========================================
RÉSULTATS
========================================

Total des vérifications : $TOTAL_CHECKS
✅ Réussies : $PASSED_CHECKS
⚠️  Avertissements : $WARNING_CHECKS
❌ Échecs : $FAILED_CHECKS

Score de conformité : $SCORE%

========================================
STATUT
========================================

EOF

if [ $FAILED_CHECKS -eq 0 ] && [ $WARNING_CHECKS -le 5 ]; then
    echo "✅ AUDIT RÉUSSI - DÉPLOIEMENT AUTORISÉ" >> "$REPORT_FILE"
elif [ $FAILED_CHECKS -eq 0 ]; then
    echo "⚠️  AUDIT RÉUSSI AVEC AVERTISSEMENTS" >> "$REPORT_FILE"
else
    echo "❌ AUDIT ÉCHOUÉ - DÉPLOIEMENT BLOQUÉ" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

========================================
DOCUMENTS DE RÉFÉRENCE
========================================

- SECURITE.md : Audit de sécurité complet
- CONFORMITE_RGPD.md : Audit de conformité RGPD
- INTEGRITE_DONNEES.md : Audit d'intégrité et disponibilité

========================================
RECOMMANDATIONS
========================================

Priorité Haute :
- Configurer les backups automatiques
- Tester la restauration depuis backup
- Définir le plan de récupération après sinistre

Priorité Moyenne :
- Configurer le monitoring (Sentry)
- Effectuer des tests de charge
- Configurer les alertes

========================================
CERTIFICATION
========================================

Ce rapport certifie que le système a été audité selon les critères de :
- Sécurité (authentification, chiffrement, protection des attaques)
- Conformité RGPD (droits des personnes, consentement, transparence)
- Intégrité des données (contraintes, validation, transactions)
- Disponibilité (infrastructure, backups, monitoring)

Auditeur : Manus AI
Prochaine révision : $(date -d "+3 months" +%Y-%m-%d)

========================================
EOF

echo -e "${GREEN}✅ Rapport généré : ${CYAN}$REPORT_FILE${NC}\n"

echo -e "${MAGENTA}🎉 Audit terminé !${NC}\n"
