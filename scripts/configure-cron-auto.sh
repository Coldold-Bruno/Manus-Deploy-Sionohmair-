#!/bin/bash

# Script de configuration CRON_SECRET automatique
# Ce script configure CRON_SECRET dans GitHub Secrets et Manus Secrets

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        CONFIGURATION CRON_SECRET AUTOMATIQUE               ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Variables
CRON_SECRET="7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="
APP_URL="https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer"

echo "✅ Variables générées :"
echo "   - CRON_SECRET: $CRON_SECRET"
echo "   - APP_URL: $APP_URL"
echo ""

# Vérifier si GitHub CLI est installé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Vérification de GitHub CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v gh &> /dev/null; then
  echo "✅ GitHub CLI installé"
  
  # Vérifier l'authentification
  if gh auth status &> /dev/null; then
    echo "✅ GitHub CLI authentifié"
    
    # Détecter le repository
    if git remote get-url origin &> /dev/null; then
      REPO=$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')
      echo "✅ Repository détecté : $REPO"
      echo ""
      
      # Ajouter les secrets GitHub
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "  Configuration des GitHub Secrets"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      
      echo "Ajout de CRON_SECRET..."
      if echo "$CRON_SECRET" | gh secret set CRON_SECRET --repo "$REPO"; then
        echo "✅ CRON_SECRET ajouté dans GitHub Secrets"
      else
        echo "❌ Échec de l'ajout de CRON_SECRET"
      fi
      
      echo "Ajout de APP_URL..."
      if echo "$APP_URL" | gh secret set APP_URL --repo "$REPO"; then
        echo "✅ APP_URL ajouté dans GitHub Secrets"
      else
        echo "❌ Échec de l'ajout de APP_URL"
      fi
      
      echo ""
      echo "✅ GitHub Secrets configurés automatiquement !"
      echo ""
      
    else
      echo "⚠️  Aucun repository Git détecté"
      echo "   Configuration manuelle requise"
    fi
  else
    echo "⚠️  GitHub CLI non authentifié"
    echo "   Exécutez : gh auth login"
  fi
else
  echo "⚠️  GitHub CLI non installé"
  echo "   Installation automatique..."
  
  # Installer GitHub CLI
  if curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
     sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && \
     echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
     sudo apt update && \
     sudo apt install gh -y; then
    echo "✅ GitHub CLI installé"
    echo "   Authentifiez-vous avec : gh auth login"
  else
    echo "❌ Échec de l'installation de GitHub CLI"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Instructions pour GitHub Secrets (Manuel)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Si la configuration automatique a échoué, ajoutez manuellement :"
echo ""
echo "1. Allez sur : https://github.com/VOTRE_USERNAME/VOTRE_REPO/settings/secrets/actions"
echo ""
echo "2. Cliquez sur 'New repository secret'"
echo ""
echo "3. Ajoutez ces 2 secrets :"
echo ""
echo "   Name: CRON_SECRET"
echo "   Value: $CRON_SECRET"
echo ""
echo "   Name: APP_URL"
echo "   Value: $APP_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Instructions pour Manus Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ajoutez cette variable dans Manus Secrets :"
echo ""
echo "1. Allez sur : Dashboard Manus → Settings → Secrets"
echo ""
echo "2. Ajoutez :"
echo ""
echo "   CRON_SECRET"
echo "   Value: $CRON_SECRET"
echo ""
echo "3. Redémarrez le serveur"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Configuration CRON_SECRET terminée !"
echo ""
echo "Prochaine étape : Configuration Stripe Live"
echo ""
