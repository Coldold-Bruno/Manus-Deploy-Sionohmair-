#!/bin/bash

# Script de configuration SMTP pour Sionohmair Insight Academy
# Ce script vous aide à configurer l'envoi d'emails automatiques

set -e

echo "========================================="
echo "  Configuration SMTP - Sionohmair"
echo "========================================="
echo ""

# Fonction pour afficher les instructions
show_instructions() {
    echo "Ce script va vous aider à configurer l'envoi d'emails."
    echo "Vous devez choisir l'un des 3 fournisseurs SMTP :"
    echo ""
    echo "1. Gmail (Gratuit, Simple) ⭐ RECOMMANDÉ"
    echo "2. SendGrid (Professionnel, 100 emails/jour gratuits)"
    echo "3. Brevo (ex-Sendinblue) (300 emails/jour gratuits)"
    echo ""
}

# Afficher les instructions
show_instructions

# Demander le choix
read -p "Choisissez votre fournisseur SMTP (1, 2 ou 3) : " choice

case $choice in
    1)
        echo ""
        echo "========================================="
        echo "  Configuration Gmail"
        echo "========================================="
        echo ""
        echo "Étapes à suivre :"
        echo ""
        echo "1. Créez un compte Gmail dédié (ex: noreply.sionohmair@gmail.com)"
        echo "   https://accounts.google.com/signup"
        echo ""
        echo "2. Activez l'authentification à 2 facteurs :"
        echo "   https://myaccount.google.com/security"
        echo ""
        echo "3. Générez un mot de passe d'application :"
        echo "   https://myaccount.google.com/apppasswords"
        echo "   - Sélectionnez 'Autre (nom personnalisé)'"
        echo "   - Entrez : 'Sionohmair Insight Academy'"
        echo "   - Copiez le mot de passe (16 caractères)"
        echo ""
        
        read -p "Appuyez sur Entrée quand vous avez terminé..."
        echo ""
        
        read -p "Entrez votre adresse Gmail : " gmail_user
        read -p "Entrez le mot de passe d'application (16 caractères) : " gmail_pass
        
        echo ""
        echo "Configuration Gmail :"
        echo "-------------------"
        echo "SMTP_HOST=smtp.gmail.com"
        echo "SMTP_PORT=587"
        echo "SMTP_USER=$gmail_user"
        echo "SMTP_PASS=$gmail_pass"
        echo "SMTP_FROM=$gmail_user"
        echo ""
        echo "✅ Copiez ces valeurs dans Manus → Settings → Secrets"
        ;;
        
    2)
        echo ""
        echo "========================================="
        echo "  Configuration SendGrid"
        echo "========================================="
        echo ""
        echo "Étapes à suivre :"
        echo ""
        echo "1. Créez un compte SendGrid :"
        echo "   https://sendgrid.com"
        echo ""
        echo "2. Créez une clé API :"
        echo "   Settings → API Keys → Create API Key"
        echo "   - Nom : 'Sionohmair Insight Academy'"
        echo "   - Permissions : Full Access"
        echo "   - Copiez la clé API (commence par 'SG.')"
        echo ""
        
        read -p "Appuyez sur Entrée quand vous avez terminé..."
        echo ""
        
        read -p "Entrez votre clé API SendGrid : " sendgrid_key
        read -p "Entrez votre adresse email FROM (ex: noreply@votre-domaine.com) : " sendgrid_from
        
        echo ""
        echo "Configuration SendGrid :"
        echo "----------------------"
        echo "SMTP_HOST=smtp.sendgrid.net"
        echo "SMTP_PORT=587"
        echo "SMTP_USER=apikey"
        echo "SMTP_PASS=$sendgrid_key"
        echo "SMTP_FROM=$sendgrid_from"
        echo ""
        echo "✅ Copiez ces valeurs dans Manus → Settings → Secrets"
        ;;
        
    3)
        echo ""
        echo "========================================="
        echo "  Configuration Brevo"
        echo "========================================="
        echo ""
        echo "Étapes à suivre :"
        echo ""
        echo "1. Créez un compte Brevo :"
        echo "   https://brevo.com"
        echo ""
        echo "2. Créez une clé SMTP :"
        echo "   Settings → SMTP & API → Generate a new SMTP key"
        echo "   - Nom : 'Sionohmair Insight Academy'"
        echo "   - Copiez la clé SMTP"
        echo ""
        
        read -p "Appuyez sur Entrée quand vous avez terminé..."
        echo ""
        
        read -p "Entrez votre email Brevo : " brevo_user
        read -p "Entrez votre clé SMTP Brevo : " brevo_pass
        read -p "Entrez votre adresse email FROM (ex: noreply@votre-domaine.com) : " brevo_from
        
        echo ""
        echo "Configuration Brevo :"
        echo "-------------------"
        echo "SMTP_HOST=smtp-relay.brevo.com"
        echo "SMTP_PORT=587"
        echo "SMTP_USER=$brevo_user"
        echo "SMTP_PASS=$brevo_pass"
        echo "SMTP_FROM=$brevo_from"
        echo ""
        echo "✅ Copiez ces valeurs dans Manus → Settings → Secrets"
        ;;
        
    *)
        echo "❌ Choix invalide. Veuillez relancer le script."
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo "  Configuration terminée !"
echo "========================================="
echo ""
echo "Prochaines étapes :"
echo "1. Allez dans Manus → Votre projet → Settings → Secrets"
echo "2. Ajoutez les 5 variables ci-dessus"
echo "3. Redémarrez le serveur"
echo "4. Testez l'envoi d'emails"
echo ""
