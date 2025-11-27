#!/bin/bash

# ============================================
# VALIDATEUR DE CONFIGURATION AVANCÉ
# ============================================
# Valide en profondeur toutes les configurations
# critiques du système
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
VALIDATION_REPORT="validation-report-$(date +%Y%m%d-%H%M%S).json"
ISSUES=()

# ============================================
# VALIDATION SMTP
# ============================================

validate_smtp() {
    echo -e "${CYAN}Validation SMTP...${NC}"
    
    local smtp_valid=true
    local smtp_details=()
    
    # Vérifier toutes les variables
    if [ -z "$SMTP_HOST" ]; then
        smtp_valid=false
        ISSUES+=("SMTP_HOST manquant")
    else
        smtp_details+=("Host: $SMTP_HOST")
    fi
    
    if [ -z "$SMTP_PORT" ]; then
        smtp_valid=false
        ISSUES+=("SMTP_PORT manquant")
    else
        smtp_details+=("Port: $SMTP_PORT")
        
        # Vérifier que le port est valide
        if ! [[ "$SMTP_PORT" =~ ^[0-9]+$ ]] || [ "$SMTP_PORT" -lt 1 ] || [ "$SMTP_PORT" -gt 65535 ]; then
            smtp_valid=false
            ISSUES+=("SMTP_PORT invalide (doit être entre 1 et 65535)")
        fi
    fi
    
    if [ -z "$SMTP_USER" ]; then
        smtp_valid=false
        ISSUES+=("SMTP_USER manquant")
    else
        # Masquer une partie de l'email
        local masked_user=$(echo "$SMTP_USER" | sed 's/\(.\{3\}\).*@/\1***@/')
        smtp_details+=("User: $masked_user")
    fi
    
    if [ -z "$SMTP_PASS" ]; then
        smtp_valid=false
        ISSUES+=("SMTP_PASS manquant")
    else
        smtp_details+=("Password: ********")
    fi
    
    # Vérifier SMTP_SECURE
    if [ -n "$SMTP_SECURE" ]; then
        if [ "$SMTP_SECURE" = "true" ] || [ "$SMTP_SECURE" = "false" ]; then
            smtp_details+=("Secure: $SMTP_SECURE")
        else
            smtp_valid=false
            ISSUES+=("SMTP_SECURE doit être 'true' ou 'false'")
        fi
    fi
    
    if [ "$smtp_valid" = true ]; then
        echo -e "${GREEN}✅ Configuration SMTP valide${NC}"
        for detail in "${smtp_details[@]}"; do
            echo -e "   $detail"
        done
        return 0
    else
        echo -e "${RED}❌ Configuration SMTP invalide${NC}"
        return 1
    fi
}

# ============================================
# VALIDATION STRIPE
# ============================================

validate_stripe() {
    echo -e "${CYAN}Validation Stripe...${NC}"
    
    local stripe_valid=true
    local stripe_mode="UNKNOWN"
    
    # Vérifier STRIPE_SECRET_KEY
    if [ -z "$STRIPE_SECRET_KEY" ]; then
        stripe_valid=false
        ISSUES+=("STRIPE_SECRET_KEY manquant")
    else
        # Déterminer le mode
        if [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
            stripe_mode="LIVE"
            echo -e "   Mode: ${GREEN}${BOLD}LIVE${NC} (Production)"
        elif [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
            stripe_mode="TEST"
            echo -e "   Mode: ${YELLOW}${BOLD}TEST${NC} (Développement)"
        else
            stripe_valid=false
            ISSUES+=("STRIPE_SECRET_KEY format invalide")
        fi
    fi
    
    # Vérifier VITE_STRIPE_PUBLISHABLE_KEY
    if [ -z "$VITE_STRIPE_PUBLISHABLE_KEY" ]; then
        stripe_valid=false
        ISSUES+=("VITE_STRIPE_PUBLISHABLE_KEY manquant")
    else
        if [[ "$VITE_STRIPE_PUBLISHABLE_KEY" == pk_live_* ]]; then
            if [ "$stripe_mode" != "LIVE" ]; then
                stripe_valid=false
                ISSUES+=("Incohérence : clé publique LIVE mais clé secrète TEST")
            fi
        elif [[ "$VITE_STRIPE_PUBLISHABLE_KEY" == pk_test_* ]]; then
            if [ "$stripe_mode" != "TEST" ]; then
                stripe_valid=false
                ISSUES+=("Incohérence : clé publique TEST mais clé secrète LIVE")
            fi
        else
            stripe_valid=false
            ISSUES+=("VITE_STRIPE_PUBLISHABLE_KEY format invalide")
        fi
    fi
    
    # Vérifier STRIPE_WEBHOOK_SECRET
    if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
        stripe_valid=false
        ISSUES+=("STRIPE_WEBHOOK_SECRET manquant")
    else
        if [[ "$STRIPE_WEBHOOK_SECRET" == whsec_* ]]; then
            echo -e "   Webhook: ${GREEN}Configuré${NC}"
        else
            stripe_valid=false
            ISSUES+=("STRIPE_WEBHOOK_SECRET format invalide (doit commencer par whsec_)")
        fi
    fi
    
    if [ "$stripe_valid" = true ]; then
        echo -e "${GREEN}✅ Configuration Stripe valide${NC}"
        return 0
    else
        echo -e "${RED}❌ Configuration Stripe invalide${NC}"
        return 1
    fi
}

# ============================================
# VALIDATION DATABASE
# ============================================

validate_database() {
    echo -e "${CYAN}Validation Base de données...${NC}"
    
    local db_valid=true
    
    # Vérifier DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        db_valid=false
        ISSUES+=("DATABASE_URL manquant")
        echo -e "${RED}❌ DATABASE_URL non configurée${NC}"
        return 1
    fi
    
    # Extraire les informations de la chaîne de connexion
    if [[ "$DATABASE_URL" =~ ^(mysql|postgresql):// ]]; then
        local protocol="${BASH_REMATCH[1]}"
        echo -e "   Protocole: $protocol"
        
        # Tester la connexion
        echo -e "   Test de connexion..."
        if pnpm drizzle-kit push --force &> /dev/null; then
            echo -e "   ${GREEN}✅ Connexion réussie${NC}"
        else
            db_valid=false
            ISSUES+=("Impossible de se connecter à la base de données")
            echo -e "   ${RED}❌ Connexion échouée${NC}"
        fi
    else
        db_valid=false
        ISSUES+=("DATABASE_URL format invalide (doit commencer par mysql:// ou postgresql://)")
        echo -e "${RED}❌ Format DATABASE_URL invalide${NC}"
    fi
    
    if [ "$db_valid" = true ]; then
        echo -e "${GREEN}✅ Configuration base de données valide${NC}"
        return 0
    else
        return 1
    fi
}

# ============================================
# VALIDATION GITHUB SECRETS
# ============================================

validate_github_secrets() {
    echo -e "${CYAN}Validation GitHub Secrets...${NC}"
    
    local github_valid=true
    
    # Vérifier CRON_SECRET
    if [ -z "$CRON_SECRET" ]; then
        github_valid=false
        ISSUES+=("CRON_SECRET manquant")
    else
        # Vérifier la longueur (doit être suffisamment long)
        if [ ${#CRON_SECRET} -lt 32 ]; then
            github_valid=false
            ISSUES+=("CRON_SECRET trop court (minimum 32 caractères recommandé)")
        else
            echo -e "   CRON_SECRET: ${GREEN}Configuré${NC} (${#CRON_SECRET} caractères)"
        fi
    fi
    
    # Vérifier APP_URL
    if [ -z "$APP_URL" ]; then
        github_valid=false
        ISSUES+=("APP_URL manquant")
    else
        if [[ "$APP_URL" == https://* ]]; then
            echo -e "   APP_URL: ${GREEN}$APP_URL${NC}"
        else
            github_valid=false
            ISSUES+=("APP_URL doit commencer par https://")
        fi
    fi
    
    if [ "$github_valid" = true ]; then
        echo -e "${GREEN}✅ GitHub Secrets valides${NC}"
        return 0
    else
        echo -e "${RED}❌ GitHub Secrets invalides${NC}"
        return 1
    fi
}

# ============================================
# VALIDATION JWT
# ============================================

validate_jwt() {
    echo -e "${CYAN}Validation JWT...${NC}"
    
    local jwt_valid=true
    
    if [ -z "$JWT_SECRET" ]; then
        jwt_valid=false
        ISSUES+=("JWT_SECRET manquant")
    else
        # Vérifier la longueur
        if [ ${#JWT_SECRET} -lt 32 ]; then
            jwt_valid=false
            ISSUES+=("JWT_SECRET trop court (minimum 32 caractères recommandé)")
        else
            echo -e "   JWT_SECRET: ${GREEN}Configuré${NC} (${#JWT_SECRET} caractères)"
        fi
    fi
    
    if [ "$jwt_valid" = true ]; then
        echo -e "${GREEN}✅ JWT valide${NC}"
        return 0
    else
        echo -e "${RED}❌ JWT invalide${NC}"
        return 1
    fi
}

# ============================================
# VALIDATION OAUTH
# ============================================

validate_oauth() {
    echo -e "${CYAN}Validation OAuth...${NC}"
    
    local oauth_valid=true
    
    # Vérifier les variables OAuth
    local oauth_vars=("VITE_APP_ID" "OAUTH_SERVER_URL" "VITE_OAUTH_PORTAL_URL" "OWNER_OPEN_ID" "OWNER_NAME")
    
    for var in "${oauth_vars[@]}"; do
        if [ -z "${!var}" ]; then
            oauth_valid=false
            ISSUES+=("$var manquant")
        else
            echo -e "   $var: ${GREEN}Configuré${NC}"
        fi
    done
    
    if [ "$oauth_valid" = true ]; then
        echo -e "${GREEN}✅ OAuth valide${NC}"
        return 0
    else
        echo -e "${RED}❌ OAuth invalide${NC}"
        return 1
    fi
}

# ============================================
# VALIDATION COMPLÈTE
# ============================================

validate_all() {
    echo -e "${BOLD}${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${PURPLE}║                                                            ║${NC}"
    echo -e "${BOLD}${PURPLE}║          VALIDATION AVANCÉE DES CONFIGURATIONS            ║${NC}"
    echo -e "${BOLD}${PURPLE}║                                                            ║${NC}"
    echo -e "${BOLD}${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    local total_checks=0
    local passed_checks=0
    
    # SMTP
    echo -e "${BOLD}${BLUE}[1/6] SMTP${NC}"
    total_checks=$((total_checks + 1))
    if validate_smtp; then
        passed_checks=$((passed_checks + 1))
    fi
    echo ""
    
    # Stripe
    echo -e "${BOLD}${BLUE}[2/6] Stripe${NC}"
    total_checks=$((total_checks + 1))
    if validate_stripe; then
        passed_checks=$((passed_checks + 1))
    fi
    echo ""
    
    # Database
    echo -e "${BOLD}${BLUE}[3/6] Base de données${NC}"
    total_checks=$((total_checks + 1))
    if validate_database; then
        passed_checks=$((passed_checks + 1))
    fi
    echo ""
    
    # GitHub Secrets
    echo -e "${BOLD}${BLUE}[4/6] GitHub Secrets${NC}"
    total_checks=$((total_checks + 1))
    if validate_github_secrets; then
        passed_checks=$((passed_checks + 1))
    fi
    echo ""
    
    # JWT
    echo -e "${BOLD}${BLUE}[5/6] JWT${NC}"
    total_checks=$((total_checks + 1))
    if validate_jwt; then
        passed_checks=$((passed_checks + 1))
    fi
    echo ""
    
    # OAuth
    echo -e "${BOLD}${BLUE}[6/6] OAuth${NC}"
    total_checks=$((total_checks + 1))
    if validate_oauth; then
        passed_checks=$((passed_checks + 1))
    fi
    echo ""
    
    # Résultat final
    echo -e "${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}RÉSULTAT : ${passed_checks}/${total_checks} validations réussies${NC}"
    echo -e "${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if [ ${#ISSUES[@]} -gt 0 ]; then
        echo -e "${RED}${BOLD}Problèmes détectés (${#ISSUES[@]}) :${NC}"
        for issue in "${ISSUES[@]}"; do
            echo -e "  ${RED}❌${NC} $issue"
        done
        echo ""
    fi
    
    if [ $passed_checks -eq $total_checks ]; then
        echo -e "${GREEN}${BOLD}✅ Toutes les configurations sont valides !${NC}"
        return 0
    else
        echo -e "${RED}${BOLD}❌ Certaines configurations nécessitent des corrections.${NC}"
        return 1
    fi
}

# ============================================
# MAIN
# ============================================

main() {
    if validate_all; then
        exit 0
    else
        exit 1
    fi
}

main
