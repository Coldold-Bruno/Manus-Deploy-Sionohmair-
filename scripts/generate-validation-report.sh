#!/bin/bash

# ============================================
# GÉNÉRATEUR DE RAPPORT DE VALIDATION DÉTAILLÉ
# ============================================
# Génère un rapport complet avec scoring,
# recommandations et plan d'action
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Variables
REPORT_FILE="VALIDATION_REPORT_$(date +%Y%m%d_%H%M%S).md"
SCORE=0
MAX_SCORE=100

# Catégories de vérification
declare -A CATEGORIES
CATEGORIES=(
    ["environment"]="Environnement"
    ["database"]="Base de données"
    ["secrets"]="Secrets & Configuration"
    ["email"]="Système d'emails"
    ["cron"]="Tâches planifiées"
    ["backup"]="Sauvegardes"
    ["tests"]="Tests"
    ["security"]="Sécurité"
    ["stripe"]="Stripe"
    ["documentation"]="Documentation"
)

declare -A CATEGORY_SCORES
declare -A CATEGORY_MAX_SCORES
declare -A CATEGORY_ISSUES

# ============================================
# FONCTIONS DE SCORING
# ============================================

add_score() {
    local category="$1"
    local points="$2"
    local max_points="$3"
    
    SCORE=$((SCORE + points))
    MAX_SCORE=$((MAX_SCORE + max_points))
    
    CATEGORY_SCORES[$category]=$((${CATEGORY_SCORES[$category]:-0} + points))
    CATEGORY_MAX_SCORES[$category]=$((${CATEGORY_MAX_SCORES[$category]:-0} + max_points))
}

add_issue() {
    local category="$1"
    local issue="$2"
    
    if [ -z "${CATEGORY_ISSUES[$category]}" ]; then
        CATEGORY_ISSUES[$category]="$issue"
    else
        CATEGORY_ISSUES[$category]="${CATEGORY_ISSUES[$category]}\n$issue"
    fi
}

# ============================================
# VÉRIFICATIONS PAR CATÉGORIE
# ============================================

check_environment() {
    local category="environment"
    
    # Node.js
    if command -v node &> /dev/null; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ Node.js non installé"
    fi
    
    # pnpm
    if command -v pnpm &> /dev/null; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ pnpm non installé"
    fi
    
    # node_modules
    if [ -d "node_modules" ]; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ Dépendances non installées (node_modules absent)"
    fi
}

check_database() {
    local category="database"
    
    # DATABASE_URL
    if [ -n "$DATABASE_URL" ]; then
        add_score "$category" 5 5
        
        # Test de connexion
        if pnpm drizzle-kit push --force &> /dev/null 2>&1; then
            add_score "$category" 10 10
        else
            add_score "$category" 0 10
            add_issue "$category" "❌ Impossible de se connecter à la base de données"
        fi
    else
        add_score "$category" 0 15
        add_issue "$category" "❌ DATABASE_URL non configurée"
    fi
}

check_secrets() {
    local category="secrets"
    
    # CRON_SECRET
    if [ -n "$CRON_SECRET" ] && [ ${#CRON_SECRET} -ge 32 ]; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ CRON_SECRET manquant ou trop court"
    fi
    
    # SMTP
    local smtp_complete=true
    for var in SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS; do
        if [ -z "${!var}" ]; then
            smtp_complete=false
            break
        fi
    done
    
    if [ "$smtp_complete" = true ]; then
        add_score "$category" 10 10
    else
        add_score "$category" 0 10
        add_issue "$category" "❌ Configuration SMTP incomplète"
    fi
    
    # Stripe
    if [ -n "$STRIPE_SECRET_KEY" ] && [ -n "$VITE_STRIPE_PUBLISHABLE_KEY" ] && [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
        if [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
            add_score "$category" 10 10
        else
            add_score "$category" 5 10
            add_issue "$category" "⚠️  Stripe en mode TEST (pas encore en production)"
        fi
    else
        add_score "$category" 0 10
        add_issue "$category" "❌ Configuration Stripe incomplète"
    fi
    
    # JWT
    if [ -n "$JWT_SECRET" ] && [ ${#JWT_SECRET} -ge 32 ]; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ JWT_SECRET manquant ou trop court"
    fi
}

check_email() {
    local category="email"
    
    # Templates d'emails
    local templates_ok=true
    for template in server/emailTemplates/*.ts; do
        if [ ! -f "$template" ]; then
            templates_ok=false
            break
        fi
    done
    
    if [ "$templates_ok" = true ]; then
        add_score "$category" 5 5
    else
        add_score "$category" 2 5
        add_issue "$category" "⚠️  Certains templates d'emails manquants"
    fi
    
    # Test d'envoi
    if [ -f "scripts/test-email.mjs" ]; then
        if node scripts/test-email.mjs &> /dev/null 2>&1; then
            add_score "$category" 5 5
        else
            add_score "$category" 0 5
            add_issue "$category" "❌ Échec du test d'envoi d'email"
        fi
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ Script de test d'email manquant"
    fi
}

check_cron() {
    local category="cron"
    
    # Workflow GitHub Actions
    if [ -f ".github/workflows/check-trial-expirations.yml" ]; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ Workflow GitHub Actions manquant"
    fi
    
    # Endpoint cron sécurisé
    if [ -f "server/cronRouter.ts" ] && grep -q "CRON_SECRET" server/cronRouter.ts; then
        add_score "$category" 5 5
    else
        add_score "$category" 2 5
        add_issue "$category" "⚠️  Endpoint cron non sécurisé"
    fi
}

check_backup() {
    local category="backup"
    
    # Script de backup
    if [ -f "/home/ubuntu/backups/backup-db.sh" ]; then
        add_score "$category" 5 5
        
        # Test de backup
        if /home/ubuntu/backups/backup-db.sh &> /dev/null 2>&1; then
            add_score "$category" 5 5
        else
            add_score "$category" 2 5
            add_issue "$category" "⚠️  Échec du test de backup"
        fi
    else
        add_score "$category" 0 10
        add_issue "$category" "❌ Script de backup non configuré"
    fi
    
    # Cron de backup
    if crontab -l 2>/dev/null | grep -q "backup-db.sh"; then
        add_score "$category" 5 5
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ Cron de backup non configuré"
    fi
}

check_tests() {
    local category="tests"
    
    # Configuration vitest
    if [ -f "vitest.config.ts" ]; then
        add_score "$category" 3 3
        
        # Exécution des tests
        if pnpm test &> /dev/null 2>&1; then
            add_score "$category" 7 7
        else
            add_score "$category" 3 7
            add_issue "$category" "⚠️  Certains tests échouent"
        fi
    else
        add_score "$category" 0 10
        add_issue "$category" "❌ Configuration vitest manquante"
    fi
}

check_security() {
    local category="security"
    
    # .gitignore
    if [ -f ".gitignore" ] && grep -q ".env" .gitignore; then
        add_score "$category" 3 3
    else
        add_score "$category" 0 3
        add_issue "$category" "❌ .env non protégé par .gitignore"
    fi
    
    # Pas de secrets hardcodés
    if ! grep -r "sk_live_" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v node_modules | grep -v ".git" &> /dev/null; then
        add_score "$category" 4 4
    else
        add_score "$category" 0 4
        add_issue "$category" "❌ Secrets hardcodés détectés dans le code"
    fi
    
    # HTTPS
    if [ -n "$APP_URL" ] && [[ "$APP_URL" == https://* ]]; then
        add_score "$category" 3 3
    else
        add_score "$category" 1 3
        add_issue "$category" "⚠️  APP_URL ne semble pas utiliser HTTPS"
    fi
}

check_stripe() {
    local category="stripe"
    
    # Produits configurés
    if [ -f "server/stripeRouter.ts" ] && grep -q "price_" server/stripeRouter.ts; then
        add_score "$category" 5 5
    else
        add_score "$category" 2 5
        add_issue "$category" "⚠️  Vérifiez la configuration des produits Stripe"
    fi
}

check_documentation() {
    local category="documentation"
    
    # Guides essentiels
    local guides=("START_HERE.md" "DEMARRAGE_RAPIDE.md" "GUIDE_AUTOMATISATION.md" "CERTIFICATION_FINALE.md")
    local guides_count=0
    
    for guide in "${guides[@]}"; do
        if [ -f "$guide" ]; then
            guides_count=$((guides_count + 1))
        fi
    done
    
    if [ $guides_count -eq 4 ]; then
        add_score "$category" 5 5
    elif [ $guides_count -ge 2 ]; then
        add_score "$category" 3 5
        add_issue "$category" "⚠️  Certains guides manquants ($guides_count/4)"
    else
        add_score "$category" 0 5
        add_issue "$category" "❌ Documentation insuffisante ($guides_count/4)"
    fi
}

# ============================================
# GÉNÉRATION DU RAPPORT
# ============================================

generate_report() {
    local percentage=$((SCORE * 100 / MAX_SCORE))
    
    cat > "$REPORT_FILE" << EOF
# 📊 RAPPORT DE VALIDATION COMPLET

**Date de génération** : $(date '+%d/%m/%Y à %H:%M:%S')  
**Score global** : **${SCORE}/${MAX_SCORE}** (${percentage}%)

---

## 🎯 RÉSULTAT GLOBAL

EOF

    # Badge de statut
    if [ $percentage -ge 90 ]; then
        cat >> "$REPORT_FILE" << EOF
<div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
  <h2 style="margin: 0; font-size: 24px;">✅ SYSTÈME PRÊT POUR LA PRODUCTION</h2>
  <p style="margin: 10px 0 0 0; font-size: 16px;">Score excellent : ${percentage}%</p>
</div>

Le système a passé toutes les vérifications critiques. Vous pouvez procéder au déploiement en production en toute confiance.

### 🚀 Prochaines étapes recommandées

1. **Exécutez le déploiement** : \`./scripts/deploy-production.sh\`
2. **Activez Stripe en mode Live** (si ce n'est pas déjà fait)
3. **Testez le flux complet** : inscription → paiement → accès
4. **Configurez le monitoring** : Sentry, Uptime Robot, etc.
5. **Annoncez le lancement** ! 🎉

EOF
    elif [ $percentage -ge 75 ]; then
        cat >> "$REPORT_FILE" << EOF
<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
  <h2 style="margin: 0; font-size: 24px;">⚠️  DÉPLOIEMENT POSSIBLE AVEC RÉSERVES</h2>
  <p style="margin: 10px 0 0 0; font-size: 16px;">Score correct : ${percentage}%</p>
</div>

Le système fonctionne mais certaines vérifications ont échoué ou généré des avertissements. Il est recommandé de corriger les erreurs critiques avant de déployer.

### 🔧 Actions recommandées

1. **Corrigez les erreurs critiques** listées ci-dessous
2. **Vérifiez les avertissements** et évaluez leur impact
3. **Exécutez à nouveau** ce script pour confirmer les corrections
4. **Procédez au déploiement** une fois le score ≥ 90%

EOF
    else
        cat >> "$REPORT_FILE" << EOF
<div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 20px 0;">
  <h2 style="margin: 0; font-size: 24px;">❌ DÉPLOIEMENT NON RECOMMANDÉ</h2>
  <p style="margin: 10px 0 0 0; font-size: 16px;">Score insuffisant : ${percentage}%</p>
</div>

Le système présente trop d'erreurs critiques pour être déployé en production. Veuillez corriger tous les problèmes avant de procéder.

### 🚨 Actions critiques requises

1. **Corrigez TOUTES les erreurs critiques** listées ci-dessous
2. **Configurez les secrets manquants** (SMTP, Stripe, Database, etc.)
3. **Testez chaque composant** individuellement
4. **Exécutez à nouveau** ce script jusqu'à obtenir un score ≥ 90%

EOF
    fi
    
    cat >> "$REPORT_FILE" << EOF
---

## 📈 SCORES PAR CATÉGORIE

| Catégorie | Score | Pourcentage | Statut |
|-----------|-------|-------------|--------|
EOF

    for category in "${!CATEGORIES[@]}"; do
        local cat_score=${CATEGORY_SCORES[$category]:-0}
        local cat_max=${CATEGORY_MAX_SCORES[$category]:-1}
        local cat_percentage=$((cat_score * 100 / cat_max))
        local cat_name="${CATEGORIES[$category]}"
        local status_icon
        
        if [ $cat_percentage -ge 90 ]; then
            status_icon="✅"
        elif [ $cat_percentage -ge 70 ]; then
            status_icon="⚠️"
        else
            status_icon="❌"
        fi
        
        echo "| $cat_name | $cat_score/$cat_max | $cat_percentage% | $status_icon |" >> "$REPORT_FILE"
    done
    
    cat >> "$REPORT_FILE" << EOF

---

## 🔍 DÉTAILS PAR CATÉGORIE

EOF

    for category in "${!CATEGORIES[@]}"; do
        local cat_name="${CATEGORIES[$category]}"
        local cat_score=${CATEGORY_SCORES[$category]:-0}
        local cat_max=${CATEGORY_MAX_SCORES[$category]:-1}
        local cat_percentage=$((cat_score * 100 / cat_max))
        
        cat >> "$REPORT_FILE" << EOF
### ${cat_name}

**Score** : ${cat_score}/${cat_max} (${cat_percentage}%)

EOF

        if [ -n "${CATEGORY_ISSUES[$category]}" ]; then
            echo -e "${CATEGORY_ISSUES[$category]}" >> "$REPORT_FILE"
        else
            echo "✅ Tous les tests de cette catégorie ont réussi." >> "$REPORT_FILE"
        fi
        
        echo "" >> "$REPORT_FILE"
    done
    
    cat >> "$REPORT_FILE" << EOF
---

## 📚 RESSOURCES ET DOCUMENTATION

### Guides de configuration

- **[START_HERE.md](./START_HERE.md)** : Guide de démarrage rapide
- **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** : Démarrage en 5 minutes
- **[GUIDE_AUTOMATISATION.md](./GUIDE_AUTOMATISATION.md)** : Automatisation complète
- **[CERTIFICATION_FINALE.md](./CERTIFICATION_FINALE.md)** : Certification de production

### Scripts de configuration

- **Configuration SMTP** : \`./scripts/setup-manus-secrets.sh\`
- **Configuration GitHub** : \`./scripts/setup-github-secrets.sh\`
- **Configuration Backups** : \`./scripts/setup-backups.sh\`
- **Test Email** : \`node scripts/test-email.mjs\`

### Commandes utiles

\`\`\`bash
# Vérifier la configuration
./scripts/validate-config.sh

# Tester la base de données
pnpm drizzle-kit push

# Exécuter les tests
pnpm test

# Créer un backup manuel
/home/ubuntu/backups/backup-db.sh

# Déployer en production (après validation)
./scripts/deploy-production.sh
\`\`\`

---

## 🎯 CHECKLIST FINALE AVANT DÉPLOIEMENT

EOF

    if [ $percentage -ge 90 ]; then
        cat >> "$REPORT_FILE" << EOF
- [x] Score global ≥ 90% (${percentage}%)
- [x] Base de données configurée et accessible
- [x] Secrets configurés (SMTP, Stripe, JWT, etc.)
- [x] Système d'emails fonctionnel
- [x] Backups configurés et testés
- [x] Tests unitaires passent
- [x] Sécurité validée (HTTPS, secrets, .gitignore)
- [ ] Stripe activé en mode LIVE
- [ ] Monitoring configuré (Sentry, Uptime Robot)
- [ ] Test complet du parcours utilisateur

**🚀 Vous êtes prêt à déployer !**
EOF
    else
        cat >> "$REPORT_FILE" << EOF
- [ ] Score global ≥ 90% (actuellement ${percentage}%)
- [ ] Corriger toutes les erreurs critiques
- [ ] Vérifier et résoudre les avertissements
- [ ] Exécuter à nouveau la validation
- [ ] Atteindre un score ≥ 90%

**⚠️  Corrections nécessaires avant le déploiement**
EOF
    fi
    
    cat >> "$REPORT_FILE" << EOF

---

## 📞 SUPPORT

Si vous rencontrez des difficultés :

1. **Consultez la documentation** dans les fichiers .md à la racine du projet
2. **Exécutez les scripts de configuration** pour automatiser la mise en place
3. **Vérifiez les logs** pour identifier les erreurs spécifiques
4. **Testez chaque composant** individuellement avant le déploiement global

---

*Rapport généré automatiquement le $(date '+%d/%m/%Y à %H:%M:%S')*
EOF

    echo "$REPORT_FILE"
}

# ============================================
# MAIN
# ============================================

main() {
    echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║                                                            ║${NC}"
    echo -e "${BOLD}${CYAN}║        GÉNÉRATION DU RAPPORT DE VALIDATION COMPLET        ║${NC}"
    echo -e "${BOLD}${CYAN}║                                                            ║${NC}"
    echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${CYAN}Analyse en cours...${NC}"
    echo ""
    
    # Exécuter toutes les vérifications
    check_environment
    check_database
    check_secrets
    check_email
    check_cron
    check_backup
    check_tests
    check_security
    check_stripe
    check_documentation
    
    # Générer le rapport
    local report_file=$(generate_report)
    
    # Afficher le résultat
    local percentage=$((SCORE * 100 / MAX_SCORE))
    
    echo -e "${BOLD}${GREEN}✅ Rapport généré avec succès !${NC}"
    echo ""
    echo -e "${BOLD}Score final : ${CYAN}${SCORE}/${MAX_SCORE}${NC} ${BOLD}(${percentage}%)${NC}"
    echo ""
    echo -e "${CYAN}Consultez le rapport détaillé :${NC}"
    echo -e "  ${BOLD}cat $report_file${NC}"
    echo ""
    
    if [ $percentage -ge 90 ]; then
        echo -e "${GREEN}${BOLD}✅ Système prêt pour la production !${NC}"
        exit 0
    elif [ $percentage -ge 75 ]; then
        echo -e "${YELLOW}${BOLD}⚠️  Corrections recommandées avant déploiement${NC}"
        exit 1
    else
        echo -e "${RED}${BOLD}❌ Corrections critiques requises${NC}"
        exit 1
    fi
}

main
