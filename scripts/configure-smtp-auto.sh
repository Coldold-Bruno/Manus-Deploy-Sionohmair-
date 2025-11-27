#!/bin/bash

# Script de configuration SMTP automatique
# Ce script configure les variables SMTP dans Manus Secrets

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        CONFIGURATION SMTP AUTOMATIQUE                      ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Variables SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="coldoldbruno@gmail.com"
SMTP_PASS="uiqq kpth pjdb oknb"

echo "✅ Configuration SMTP :"
echo "   - Host: $SMTP_HOST"
echo "   - Port: $SMTP_PORT"
echo "   - User: $SMTP_USER"
echo "   - Pass: ****"
echo ""

# Test de connexion SMTP
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test de connexion SMTP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Créer un script de test temporaire
cat > /tmp/test-smtp-connection.mjs << 'EOF'
import nodemailer from 'nodemailer';

const config = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

console.log('Configuration SMTP:', {
  host: config.host,
  port: config.port,
  secure: config.secure,
  user: config.auth.user,
});

const transporter = nodemailer.createTransport(config);

try {
  await transporter.verify();
  console.log('✅ Connexion SMTP réussie !');
  process.exit(0);
} catch (error) {
  console.error('❌ Erreur de connexion SMTP:', error.message);
  process.exit(1);
}
EOF

# Exécuter le test
export SMTP_HOST SMTP_PORT SMTP_SECURE SMTP_USER SMTP_PASS
if node /tmp/test-smtp-connection.mjs; then
  echo ""
  echo "✅ Test de connexion SMTP réussi !"
  echo ""
else
  echo ""
  echo "❌ Échec du test de connexion SMTP"
  echo "   Vérifiez vos identifiants Gmail"
  exit 1
fi

# Afficher les instructions pour Manus Secrets
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Instructions pour Manus Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ajoutez ces variables dans Manus Secrets :"
echo ""
echo "1. Allez sur : Dashboard Manus → Settings → Secrets"
echo ""
echo "2. Ajoutez les 5 variables suivantes :"
echo ""
echo "   SMTP_HOST"
echo "   Value: $SMTP_HOST"
echo ""
echo "   SMTP_PORT"
echo "   Value: $SMTP_PORT"
echo ""
echo "   SMTP_SECURE"
echo "   Value: $SMTP_SECURE"
echo ""
echo "   SMTP_USER"
echo "   Value: $SMTP_USER"
echo ""
echo "   SMTP_PASS"
echo "   Value: $SMTP_PASS"
echo ""
echo "3. Redémarrez le serveur (bouton Restart dans le dashboard)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Configuration SMTP terminée !"
echo ""
echo "Prochaine étape : Configuration CRON_SECRET"
echo ""
