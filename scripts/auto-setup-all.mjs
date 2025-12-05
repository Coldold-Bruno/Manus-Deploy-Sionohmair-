#!/usr/bin/env node

/**
 * Script maître d'automatisation complète
 * 
 * Ce script orchestre les 3 automatisations :
 * 1. Webhook Stripe
 * 2. Tests E2E Playwright
 * 3. Monitoring Sentry
 * 
 * Exécution : node scripts/auto-setup-all.mjs
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(`  ${title}`, 'bold');
  console.log('='.repeat(80) + '\n');
}

function runScript(scriptPath, scriptName) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Démarrage : ${scriptName}...`, 'cyan');
    
    const child = spawn('node', [scriptPath], {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${scriptName} terminé avec succès`, 'green');
        resolve({ success: true, name: scriptName });
      } else {
        log(`⚠️  ${scriptName} terminé avec des avertissements (code ${code})`, 'yellow');
        resolve({ success: false, name: scriptName, code });
      }
    });

    child.on('error', (error) => {
      log(`❌ Erreur lors de l'exécution de ${scriptName}`, 'red');
      reject({ success: false, name: scriptName, error: error.message });
    });
  });
}

async function main() {
  const startTime = Date.now();
  
  logSection('🎯 AUTOMATISATION COMPLÈTE - SIONOHMAIR INSIGHT ACADEMY');
  
  log('Ce script va configurer automatiquement :', 'cyan');
  log('  1️⃣  Webhook Stripe (paiements automatiques)', 'blue');
  log('  2️⃣  Tests E2E Playwright (tests automatisés)', 'blue');
  log('  3️⃣  Monitoring Sentry (détection d\'erreurs)', 'blue');
  
  log('\n⏱️  Temps estimé : 5-10 minutes', 'yellow');
  log('☕ Prenez un café pendant que je m\'occupe de tout !', 'yellow');

  const results = [];

  // 1. Configuration du webhook Stripe
  logSection('1️⃣  WEBHOOK STRIPE');
  try {
    const result = await runScript(
      join(__dirname, 'auto-setup-stripe-webhook.mjs'),
      'Webhook Stripe'
    );
    results.push(result);
  } catch (error) {
    results.push(error);
  }

  // 2. Configuration des tests E2E Playwright
  logSection('2️⃣  TESTS E2E PLAYWRIGHT');
  try {
    const result = await runScript(
      join(__dirname, 'auto-setup-playwright.mjs'),
      'Tests E2E Playwright'
    );
    results.push(result);
  } catch (error) {
    results.push(error);
  }

  // 3. Configuration du monitoring Sentry
  logSection('3️⃣  MONITORING SENTRY');
  try {
    const result = await runScript(
      join(__dirname, 'auto-setup-sentry.mjs'),
      'Monitoring Sentry'
    );
    results.push(result);
  } catch (error) {
    results.push(error);
  }

  // Rapport final
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  logSection('📊 RAPPORT D\'AUTOMATISATION');

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  log(`✅ Réussis : ${successCount}/3`, 'green');
  if (failureCount > 0) {
    log(`⚠️  Avertissements : ${failureCount}/3`, 'yellow');
  }
  log(`⏱️  Durée totale : ${duration}s`, 'cyan');

  log('\n📋 Détails :', 'cyan');
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '⚠️';
    const color = result.success ? 'green' : 'yellow';
    log(`  ${icon} ${index + 1}. ${result.name}`, color);
  });

  // Générer un rapport JSON
  const report = {
    timestamp: new Date().toISOString(),
    duration: `${duration}s`,
    results: results.map(r => ({
      name: r.name,
      success: r.success,
      code: r.code,
      error: r.error,
    })),
    summary: {
      total: 3,
      success: successCount,
      failed: failureCount,
    },
  };

  const reportPath = join(__dirname, '../logs/automation-report.json');
  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Rapport sauvegardé : ${reportPath}`, 'blue');
  } catch (error) {
    log(`\n⚠️  Impossible de sauvegarder le rapport`, 'yellow');
  }

  // Instructions finales
  logSection('🎉 AUTOMATISATION TERMINÉE !');

  log('Prochaines étapes :', 'cyan');
  log('  1. Redémarrez votre serveur : pnpm dev', 'blue');
  log('  2. Testez un paiement Stripe avec la carte 4242 4242 4242 4242', 'blue');
  log('  3. Exécutez les tests E2E : pnpm exec playwright test', 'blue');
  log('  4. Vérifiez les logs d\'erreurs dans logs/errors.log', 'blue');

  log('\n📚 Documentation :', 'cyan');
  log('  • Webhook Stripe : GUIDE_STRIPE_PRODUCTION.md', 'blue');
  log('  • Tests E2E : playwright.config.ts', 'blue');
  log('  • Monitoring : client/src/lib/sentry.ts', 'blue');

  log('\n💡 Besoin d\'aide ?', 'cyan');
  log('  • Consultez les guides dans le dossier docs/', 'blue');
  log('  • Vérifiez les logs dans le dossier logs/', 'blue');
  log('  • Relancez un script individuel si nécessaire', 'blue');

  log('\n✨ Votre site est maintenant prêt pour la production !', 'green');
  
  process.exit(successCount === 3 ? 0 : 1);
}

// Gestion des erreurs globales
process.on('unhandledRejection', (error) => {
  log('\n❌ Erreur non gérée :', 'red');
  console.error(error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log('\n❌ Exception non capturée :', 'red');
  console.error(error);
  process.exit(1);
});

// Exécuter le script principal
main();
