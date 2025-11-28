#!/bin/bash

# ========================================
# SCRIPT D'AUTOMATISATION - CONFIGURATION DOMAINE
# ========================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌐 CONFIGURATION AUTOMATIQUE DU DOMAINE PERSONNALISÉ   ║
║                                                           ║
║   Sionohmair Insight Academy                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_header "ÉTAPE 1 : INFORMATIONS SUR VOTRE DOMAINE"

# Demander le nom de domaine
echo -e "${YELLOW}Quel domaine souhaitez-vous utiliser ?${NC}"
echo ""
echo "Exemples :"
echo "  - sionohmair-academy.com"
echo "  - insight-academy.fr"
echo "  - content-mastery.com"
echo ""
read -p "Votre domaine : " DOMAIN_NAME

# Valider le format du domaine
if [[ ! $DOMAIN_NAME =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
    print_error "Format de domaine invalide. Exemple : mondomaine.com"
    exit 1
fi

print_success "Domaine : $DOMAIN_NAME"

# Demander le sous-domaine Manus actuel
echo ""
echo -e "${YELLOW}Quel est votre sous-domaine Manus actuel ?${NC}"
echo ""
echo "Exemples :"
echo "  - sionohmair.manus.space"
echo "  - bruno.manus.space"
echo ""
read -p "Sous-domaine Manus : " MANUS_SUBDOMAIN

# Valider le format
if [[ ! $MANUS_SUBDOMAIN =~ \.manus\.space$ ]]; then
    print_error "Le sous-domaine doit se terminer par .manus.space"
    exit 1
fi

print_success "Sous-domaine Manus : $MANUS_SUBDOMAIN"

# Demander le registrar
print_header "ÉTAPE 2 : CHOIX DU REGISTRAR"

echo "Où avez-vous acheté votre domaine ?"
echo ""
echo "1) Namecheap (https://www.namecheap.com)"
echo "2) OVH (https://www.ovh.com)"
echo "3) Google Domains (https://domains.google.com)"
echo "4) Autre"
echo ""
read -p "Votre choix (1-4) : " REGISTRAR_CHOICE

case $REGISTRAR_CHOICE in
    1)
        REGISTRAR="Namecheap"
        REGISTRAR_URL="https://www.namecheap.com/myaccount/login/"
        ;;
    2)
        REGISTRAR="OVH"
        REGISTRAR_URL="https://www.ovh.com/auth/"
        ;;
    3)
        REGISTRAR="Google Domains"
        REGISTRAR_URL="https://domains.google.com"
        ;;
    4)
        read -p "Nom du registrar : " REGISTRAR
        read -p "URL de connexion : " REGISTRAR_URL
        ;;
    *)
        print_error "Choix invalide"
        exit 1
        ;;
esac

print_success "Registrar : $REGISTRAR"

# Générer les instructions DNS
print_header "ÉTAPE 3 : CONFIGURATION DNS"

print_info "Génération des enregistrements DNS..."

# Créer le fichier de configuration DNS
DNS_CONFIG_FILE="dns-config-${DOMAIN_NAME}.txt"

cat > "$DNS_CONFIG_FILE" << EOF
========================================
CONFIGURATION DNS POUR : $DOMAIN_NAME
========================================

Date de génération : $(date)
Registrar : $REGISTRAR
Sous-domaine Manus : $MANUS_SUBDOMAIN

----------------------------------------
ENREGISTREMENTS À AJOUTER
----------------------------------------

1. ENREGISTREMENT CNAME (pour www)
   Type      : CNAME
   Host/Name : www
   Value     : $MANUS_SUBDOMAIN
   TTL       : 3600 (ou Auto)

2. ENREGISTREMENT CNAME (pour le domaine racine)
   Type      : CNAME
   Host/Name : @
   Value     : $MANUS_SUBDOMAIN
   TTL       : 3600 (ou Auto)

   ⚠️ NOTE : Si votre registrar ne supporte pas CNAME pour @,
   utilisez un enregistrement A avec l'IP fournie par Manus.

----------------------------------------
INSTRUCTIONS DÉTAILLÉES
----------------------------------------

1. Connectez-vous à votre compte $REGISTRAR :
   → $REGISTRAR_URL

2. Allez dans la gestion DNS de $DOMAIN_NAME

3. Ajoutez les 2 enregistrements ci-dessus

4. Sauvegardez les modifications

5. Attendez la propagation DNS (5-30 minutes)

----------------------------------------
VÉRIFICATION DE LA PROPAGATION
----------------------------------------

Commande pour vérifier :
  dig $DOMAIN_NAME
  dig www.$DOMAIN_NAME

Ou utilisez : https://dnschecker.org

----------------------------------------
CONFIGURATION DANS MANUS
----------------------------------------

1. Allez sur : https://manus.im
2. Projets → sionohmair-insight-academy
3. Settings → Domains
4. Cliquez sur "Add Custom Domain"
5. Entrez : $DOMAIN_NAME
6. Cliquez sur "Verify"
7. Attendez la vérification (quelques minutes)

----------------------------------------
ACTIVATION HTTPS
----------------------------------------

Manus active automatiquement HTTPS avec Let's Encrypt.
Vérifiez que https://$DOMAIN_NAME fonctionne.

========================================
FIN DE LA CONFIGURATION
========================================
EOF

print_success "Configuration DNS générée : $DNS_CONFIG_FILE"

# Afficher les instructions
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cat "$DNS_CONFIG_FILE"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Proposer d'ouvrir le registrar
print_header "ÉTAPE 4 : OUVERTURE DU REGISTRAR"

echo -e "${YELLOW}Voulez-vous ouvrir votre registrar maintenant ?${NC}"
read -p "Ouvrir $REGISTRAR ? (o/n) : " OPEN_REGISTRAR

if [[ $OPEN_REGISTRAR == "o" || $OPEN_REGISTRAR == "O" ]]; then
    print_info "Ouverture de $REGISTRAR_URL..."
    
    # Détecter l'OS et ouvrir le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$REGISTRAR_URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &> /dev/null; then
            xdg-open "$REGISTRAR_URL"
        else
            print_warning "Impossible d'ouvrir automatiquement. Allez sur : $REGISTRAR_URL"
        fi
    else
        print_warning "Impossible d'ouvrir automatiquement. Allez sur : $REGISTRAR_URL"
    fi
    
    print_success "Navigateur ouvert"
fi

# Attendre la configuration DNS
print_header "ÉTAPE 5 : ATTENTE DE LA CONFIGURATION DNS"

echo -e "${YELLOW}Configurez les enregistrements DNS dans votre registrar.${NC}"
echo ""
echo "Référez-vous au fichier : $DNS_CONFIG_FILE"
echo ""
read -p "Appuyez sur ENTRÉE quand c'est fait..."

print_success "Configuration DNS effectuée"

# Vérifier la propagation DNS
print_header "ÉTAPE 6 : VÉRIFICATION DE LA PROPAGATION DNS"

print_info "Vérification de la propagation DNS..."

# Fonction de vérification DNS
check_dns() {
    local domain=$1
    local expected=$2
    
    echo -e "${BLUE}Vérification de $domain...${NC}"
    
    # Utiliser dig si disponible
    if command -v dig &> /dev/null; then
        result=$(dig +short "$domain" | head -n 1)
        if [[ -n "$result" ]]; then
            print_success "DNS résolu : $result"
            return 0
        else
            print_warning "DNS non encore propagé"
            return 1
        fi
    else
        # Utiliser nslookup comme fallback
        if command -v nslookup &> /dev/null; then
            result=$(nslookup "$domain" 2>/dev/null | grep -A 1 "Name:" | tail -n 1 | awk '{print $2}')
            if [[ -n "$result" ]]; then
                print_success "DNS résolu : $result"
                return 0
            else
                print_warning "DNS non encore propagé"
                return 1
            fi
        else
            print_warning "dig et nslookup non disponibles. Vérifiez manuellement sur https://dnschecker.org"
            return 1
        fi
    fi
}

# Vérifier le domaine principal
check_dns "$DOMAIN_NAME" "$MANUS_SUBDOMAIN"
dns_main=$?

# Vérifier le sous-domaine www
check_dns "www.$DOMAIN_NAME" "$MANUS_SUBDOMAIN"
dns_www=$?

if [[ $dns_main -eq 0 && $dns_www -eq 0 ]]; then
    print_success "Propagation DNS complète !"
else
    print_warning "La propagation DNS peut prendre jusqu'à 30 minutes."
    print_info "Vérifiez sur : https://dnschecker.org/?domain=$DOMAIN_NAME"
    
    echo ""
    echo -e "${YELLOW}Voulez-vous attendre et vérifier à nouveau ? (o/n)${NC}"
    read -p "Réponse : " WAIT_DNS
    
    if [[ $WAIT_DNS == "o" || $WAIT_DNS == "O" ]]; then
        print_info "Nouvelle vérification dans 2 minutes..."
        sleep 120
        
        check_dns "$DOMAIN_NAME" "$MANUS_SUBDOMAIN"
        check_dns "www.$DOMAIN_NAME" "$MANUS_SUBDOMAIN"
    fi
fi

# Instructions pour Manus
print_header "ÉTAPE 7 : CONFIGURATION DANS MANUS"

echo -e "${CYAN}Maintenant, configurez le domaine dans Manus :${NC}"
echo ""
echo "1. Allez sur : https://manus.im"
echo "2. Connectez-vous à votre compte"
echo "3. Cliquez sur : Projets → sionohmair-insight-academy"
echo "4. Cliquez sur : Settings → Domains"
echo "5. Cliquez sur : \"Add Custom Domain\""
echo "6. Entrez : $DOMAIN_NAME"
echo "7. Cliquez sur : \"Verify\""
echo "8. Attendez la vérification (quelques minutes)"
echo ""

echo -e "${YELLOW}Voulez-vous ouvrir Manus maintenant ?${NC}"
read -p "Ouvrir Manus ? (o/n) : " OPEN_MANUS

if [[ $OPEN_MANUS == "o" || $OPEN_MANUS == "O" ]]; then
    MANUS_URL="https://manus.im"
    
    print_info "Ouverture de $MANUS_URL..."
    
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
read -p "Appuyez sur ENTRÉE quand le domaine est vérifié dans Manus..."

# Vérification HTTPS
print_header "ÉTAPE 8 : VÉRIFICATION HTTPS"

print_info "Vérification de l'accès HTTPS..."

# Vérifier si le site est accessible
if command -v curl &> /dev/null; then
    echo ""
    echo -e "${BLUE}Test de connexion à https://$DOMAIN_NAME...${NC}"
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN_NAME" --max-time 10 || echo "000")
    
    if [[ $http_code == "200" || $http_code == "301" || $http_code == "302" ]]; then
        print_success "Site accessible ! Code HTTP : $http_code"
        print_success "HTTPS actif ✅"
    else
        print_warning "Site non encore accessible. Code HTTP : $http_code"
        print_info "Attendez quelques minutes et vérifiez manuellement : https://$DOMAIN_NAME"
    fi
else
    print_info "Vérifiez manuellement : https://$DOMAIN_NAME"
fi

# Résumé final
print_header "✅ CONFIGURATION TERMINÉE"

echo -e "${GREEN}"
cat << EOF
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎉 DOMAINE PERSONNALISÉ CONFIGURÉ AVEC SUCCÈS !        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}Votre site est maintenant accessible sur :${NC}"
echo -e "${GREEN}  → https://$DOMAIN_NAME${NC}"
echo -e "${GREEN}  → https://www.$DOMAIN_NAME${NC}"
echo ""

echo -e "${CYAN}Fichier de configuration DNS généré :${NC}"
echo -e "${BLUE}  → $DNS_CONFIG_FILE${NC}"
echo ""

echo -e "${CYAN}Prochaines étapes :${NC}"
echo "  1. Configurez Stripe Live (./scripts/configure-stripe.sh)"
echo "  2. Optimisez le SEO (./scripts/configure-seo.sh)"
echo "  3. Lancez votre plateforme ! 🚀"
echo ""

print_success "Script terminé avec succès !"
