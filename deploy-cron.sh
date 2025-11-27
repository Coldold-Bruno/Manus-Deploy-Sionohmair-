#!/bin/bash

###############################################################################
# Script de Déploiement Automatique des Cron Jobs
# Système NFT de Gratitude Économique - Sionohmair Insight Academy
###############################################################################

set -e  # Exit on error

echo "🚀 Déploiement des Cron Jobs - Système NFT de Gratitude Économique"
echo "=================================================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "Erreur : package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

log_info "Répertoire du projet détecté : $(pwd)"
echo ""

# Demander la méthode de déploiement
echo "Choisissez la méthode de déploiement des cron jobs :"
echo "1) GitHub Actions (recommandé pour GitHub)"
echo "2) Vercel Cron (recommandé pour Vercel)"
echo "3) Crontab Linux (pour VPS/serveur dédié)"
echo ""
read -p "Votre choix (1-3) : " choice

case $choice in
    1)
        log_info "Déploiement via GitHub Actions sélectionné"
        echo ""
        
        # Vérifier si .github/workflows existe
        if [ ! -d ".github/workflows" ]; then
            log_warn ".github/workflows n'existe pas, création..."
            mkdir -p .github/workflows
        fi
        
        # Vérifier si le fichier existe déjà
        if [ -f ".github/workflows/honofication-cron.yml" ]; then
            log_warn "Le fichier honofication-cron.yml existe déjà"
            read -p "Voulez-vous le remplacer ? (y/n) : " replace
            if [ "$replace" != "y" ]; then
                log_info "Déploiement annulé"
                exit 0
            fi
        fi
        
        log_info "Fichier honofication-cron.yml déjà présent dans .github/workflows/"
        echo ""
        
        # Demander l'URL de l'application
        read -p "Entrez l'URL de votre application (ex: https://sionohmair.manus.space) : " app_url
        
        # Demander le secret CRON_SECRET
        read -p "Entrez un secret pour sécuriser les cron jobs (min 32 caractères) : " cron_secret
        
        if [ ${#cron_secret} -lt 32 ]; then
            log_error "Le secret doit contenir au moins 32 caractères"
            exit 1
        fi
        
        log_info "Configuration GitHub Actions terminée"
        echo ""
        echo "📋 Prochaines étapes :"
        echo "1. Ajoutez le secret CRON_SECRET dans GitHub :"
        echo "   - Allez dans Settings > Secrets and variables > Actions"
        echo "   - Cliquez sur 'New repository secret'"
        echo "   - Name: CRON_SECRET"
        echo "   - Value: $cron_secret"
        echo ""
        echo "2. Ajoutez le secret APP_URL dans GitHub :"
        echo "   - Name: APP_URL"
        echo "   - Value: $app_url"
        echo ""
        echo "3. Commitez et pushez le fichier .github/workflows/honofication-cron.yml"
        echo "4. Les cron jobs s'exécuteront automatiquement selon le planning défini"
        echo ""
        log_info "Déploiement GitHub Actions terminé ✅"
        ;;
        
    2)
        log_info "Déploiement via Vercel Cron sélectionné"
        echo ""
        
        # Créer vercel.json si inexistant
        if [ ! -f "vercel.json" ]; then
            log_warn "vercel.json n'existe pas, création..."
            cat > vercel.json << 'EOF'
{
  "crons": [
    {
      "path": "/api/trpc/cron.runDailyDetection",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/trpc/cron.runDailyReminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/trpc/cron.runDailyOverdueCheck",
      "schedule": "0 18 * * *"
    },
    {
      "path": "/api/trpc/cron.runWeeklyDetection",
      "schedule": "0 3 * * 1"
    },
    {
      "path": "/api/trpc/cron.runMonthlyReport",
      "schedule": "0 4 1 * *"
    }
  ]
}
EOF
            log_info "vercel.json créé avec succès"
        else
            log_warn "vercel.json existe déjà, ajoutez manuellement la section 'crons'"
        fi
        
        echo ""
        echo "📋 Prochaines étapes :"
        echo "1. Déployez votre application sur Vercel :"
        echo "   vercel --prod"
        echo ""
        echo "2. Les cron jobs seront automatiquement activés après le déploiement"
        echo ""
        echo "3. Vérifiez les logs dans Vercel Dashboard > Functions > Cron Jobs"
        echo ""
        log_info "Déploiement Vercel Cron terminé ✅"
        ;;
        
    3)
        log_info "Déploiement via Crontab Linux sélectionné"
        echo ""
        
        # Demander l'URL de l'application
        read -p "Entrez l'URL de votre application (ex: https://sionohmair.manus.space) : " app_url
        
        # Demander le secret CRON_SECRET
        read -p "Entrez un secret pour sécuriser les cron jobs (min 32 caractères) : " cron_secret
        
        if [ ${#cron_secret} -lt 32 ]; then
            log_error "Le secret doit contenir au moins 32 caractères"
            exit 1
        fi
        
        # Créer le fichier de cron jobs
        cat > /tmp/sionohmair-cron.txt << EOF
# Cron Jobs - Système NFT de Gratitude Économique
# Détections quotidiennes à 2h du matin
0 2 * * * curl -X POST -H "Authorization: Bearer $cron_secret" $app_url/api/trpc/cron.runDailyDetection

# Rappels quotidiens à 9h du matin
0 9 * * * curl -X POST -H "Authorization: Bearer $cron_secret" $app_url/api/trpc/cron.runDailyReminders

# Vérification des retards à 18h
0 18 * * * curl -X POST -H "Authorization: Bearer $cron_secret" $app_url/api/trpc/cron.runDailyOverdueCheck

# Détections hebdomadaires le lundi à 3h du matin
0 3 * * 1 curl -X POST -H "Authorization: Bearer $cron_secret" $app_url/api/trpc/cron.runWeeklyDetection

# Rapport mensuel le 1er du mois à 4h du matin
0 4 1 * * curl -X POST -H "Authorization: Bearer $cron_secret" $app_url/api/trpc/cron.runMonthlyReport
EOF
        
        log_info "Fichier de cron jobs créé : /tmp/sionohmair-cron.txt"
        echo ""
        
        # Demander si on doit installer automatiquement
        read -p "Voulez-vous installer automatiquement les cron jobs ? (y/n) : " install
        
        if [ "$install" = "y" ]; then
            # Sauvegarder le crontab actuel
            crontab -l > /tmp/crontab-backup-$(date +%Y%m%d-%H%M%S).txt 2>/dev/null || true
            
            # Ajouter les nouveaux cron jobs
            (crontab -l 2>/dev/null; cat /tmp/sionohmair-cron.txt) | crontab -
            
            log_info "Cron jobs installés avec succès"
            echo ""
            echo "📋 Cron jobs actifs :"
            crontab -l | grep -A 10 "Système NFT de Gratitude"
        else
            log_info "Installation manuelle requise"
            echo ""
            echo "📋 Pour installer manuellement :"
            echo "1. Ouvrez le crontab : crontab -e"
            echo "2. Ajoutez le contenu de /tmp/sionohmair-cron.txt"
            echo "3. Sauvegardez et quittez"
        fi
        
        echo ""
        echo "📋 Configuration de l'environnement :"
        echo "Ajoutez cette variable dans votre fichier .env :"
        echo "CRON_SECRET=$cron_secret"
        echo ""
        log_info "Déploiement Crontab Linux terminé ✅"
        ;;
        
    *)
        log_error "Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "=================================================================="
log_info "Déploiement terminé avec succès ! 🎉"
echo ""
echo "📊 Monitoring :"
echo "- Accédez à /admin/monitoring pour superviser les cron jobs"
echo "- Vérifiez les logs dans /admin/honofication"
echo ""
echo "🔐 Sécurité :"
echo "- Gardez le CRON_SECRET secret et sécurisé"
echo "- Ne le commitez jamais dans Git"
echo "- Changez-le régulièrement (tous les 3 mois)"
echo ""
