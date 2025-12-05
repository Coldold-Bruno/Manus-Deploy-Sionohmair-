#!/usr/bin/env node

/**
 * Script d'automatisation du webhook Stripe
 * 
 * Ce script configure automatiquement le webhook Stripe en production
 * sans intervention manuelle de l'utilisateur.
 * 
 * Fonctionnalités :
 * - Détecte automatiquement l'URL de production du site
 * - Crée le webhook endpoint sur Stripe
 * - Configure les événements à écouter
 * - Sauvegarde le webhook secret dans les variables d'environnement
 */

import Stripe from 'stripe';
import { config } from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
config({ path: join(__dirname, '../.env') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PRODUCTION_URL = process.env.VITE_APP_URL || 'https://sionohmair-insight-academy.manus.space';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupStripeWebhook() {
  try {
    log('\n🚀 Démarrage de l\'automatisation du webhook Stripe...', 'cyan');
    
    // Vérifier que la clé Stripe est configurée
    if (!STRIPE_SECRET_KEY) {
      log('❌ Erreur : STRIPE_SECRET_KEY non trouvée dans .env', 'red');
      log('💡 Veuillez configurer votre clé Stripe dans Settings → Secrets', 'yellow');
      process.exit(1);
    }

    // Initialiser Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });

    log('✅ Connexion à Stripe réussie', 'green');

    // URL du webhook
    const webhookUrl = `${PRODUCTION_URL}/api/stripe/webhook`;
    log(`📍 URL du webhook : ${webhookUrl}`, 'blue');

    // Vérifier si un webhook existe déjà pour cette URL
    log('\n🔍 Vérification des webhooks existants...', 'cyan');
    const existingWebhooks = await stripe.webhookEndpoints.list();
    
    const existingWebhook = existingWebhooks.data.find(
      wh => wh.url === webhookUrl
    );

    let webhookEndpoint;

    if (existingWebhook) {
      log('⚠️  Un webhook existe déjà pour cette URL', 'yellow');
      log(`   ID : ${existingWebhook.id}`, 'yellow');
      
      // Mettre à jour le webhook existant
      webhookEndpoint = await stripe.webhookEndpoints.update(
        existingWebhook.id,
        {
          enabled_events: [
            'checkout.session.completed',
            'payment_intent.succeeded',
            'payment_intent.payment_failed',
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
          ],
        }
      );
      
      log('✅ Webhook existant mis à jour', 'green');
    } else {
      // Créer un nouveau webhook
      log('📝 Création d\'un nouveau webhook...', 'cyan');
      
      webhookEndpoint = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: [
          'checkout.session.completed',
          'payment_intent.succeeded',
          'payment_intent.payment_failed',
          'customer.subscription.created',
          'customer.subscription.updated',
          'customer.subscription.deleted',
        ],
        description: 'Webhook automatique Sionohmair Insight Academy',
      });
      
      log('✅ Nouveau webhook créé avec succès', 'green');
    }

    // Afficher les informations du webhook
    log('\n📋 Informations du webhook :', 'cyan');
    log(`   ID : ${webhookEndpoint.id}`, 'blue');
    log(`   URL : ${webhookEndpoint.url}`, 'blue');
    log(`   Status : ${webhookEndpoint.status}`, 'blue');
    log(`   Secret : ${webhookEndpoint.secret}`, 'blue');

    // Sauvegarder le webhook secret dans .env
    log('\n💾 Sauvegarde du webhook secret...', 'cyan');
    
    const envPath = join(__dirname, '../.env');
    let envContent = '';
    
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf-8');
    }

    // Vérifier si STRIPE_WEBHOOK_SECRET existe déjà
    if (envContent.includes('STRIPE_WEBHOOK_SECRET=')) {
      // Remplacer la valeur existante
      envContent = envContent.replace(
        /STRIPE_WEBHOOK_SECRET=.*/,
        `STRIPE_WEBHOOK_SECRET=${webhookEndpoint.secret}`
      );
      log('✅ STRIPE_WEBHOOK_SECRET mis à jour dans .env', 'green');
    } else {
      // Ajouter la nouvelle variable
      envContent += `\n# Stripe Webhook Secret (généré automatiquement)\nSTRIPE_WEBHOOK_SECRET=${webhookEndpoint.secret}\n`;
      log('✅ STRIPE_WEBHOOK_SECRET ajouté à .env', 'green');
    }

    writeFileSync(envPath, envContent);

    // Résumé final
    log('\n✨ Configuration du webhook Stripe terminée !', 'green');
    log('\n📌 Prochaines étapes :', 'cyan');
    log('   1. Redémarrez votre serveur pour charger le nouveau secret', 'blue');
    log('   2. Testez un paiement pour vérifier que le webhook fonctionne', 'blue');
    log('   3. Vérifiez les logs dans le dashboard Stripe', 'blue');
    
    log('\n🎉 Le webhook est maintenant configuré automatiquement !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors de la configuration du webhook :', 'red');
    log(error.message, 'red');
    
    if (error.type === 'StripeAuthenticationError') {
      log('\n💡 Vérifiez que votre clé Stripe est valide', 'yellow');
    }
    
    process.exit(1);
  }
}

// Exécuter le script
setupStripeWebhook();
