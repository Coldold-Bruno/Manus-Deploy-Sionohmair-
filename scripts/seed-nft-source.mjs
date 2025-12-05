import mysql from 'mysql2/promise';

/**
 * Script de Seed Data pour initialiser le NFT Source "Correcteur Universel"
 * 
 * Ce script crée le NFT Source principal qui sera utilisé pour toutes les corrections
 * effectuées via le Correcteur Universel. Tous les bénéficiaires qui utilisent
 * le correcteur seront automatiquement liés à ce NFT Source.
 * 
 * Usage: node scripts/seed-nft-source.mjs
 */

async function main() {
  console.log('🌱 Démarrage du seed data pour NFT Source...\n');

  // Connexion à la base de données
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'sionohmair_insight_academy',
  });

  // Pas besoin de drizzle pour ce script simple

  try {
    // Vérifier si le NFT Source existe déjà
    const [existingSource] = await connection.execute(
      'SELECT * FROM nft_sources WHERE source_name = ?',
      ['Correcteur Universel de Contenu']
    );

    if (existingSource.length > 0) {
      console.log('✅ NFT Source "Correcteur Universel" existe déjà (ID:', existingSource[0].id, ')');
      console.log('   Aucune action nécessaire.\n');
      await connection.end();
      return;
    }

    // Créer le NFT Source "Correcteur Universel"
    const [result] = await connection.execute(`
      INSERT INTO nft_sources (
        source_name,
        source_description,
        source_category,
        base_royalty_percentage,
        enrichment_factor,
        total_value,
        total_beneficiaries,
        total_contributions,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Correcteur Universel de Contenu',
      'Service de correction automatique de tout type de contenu (texte, bilan prévisionnel, site web) avec analyse PFPMA, détection des frictions, et génération de version corrigée. Gratuit au départ, redevabilité proportionnelle aux bénéfices générés (3-10%).',
      'service',
      5.0, // Base royalty: 5% (moyenne entre 3% et 10%)
      22.67, // Facteur Alpha (α) d'enrichissement
      0.0, // Valeur initiale
      0, // Aucun bénéficiaire au départ
      0, // Aucune contribution au départ
    ]);

    const sourceId = result.insertId;

    console.log('✅ NFT Source "Correcteur Universel" créé avec succès !');
    console.log('   ID:', sourceId);
    console.log('   Nom:', 'Correcteur Universel de Contenu');
    console.log('   Catégorie:', 'service');
    console.log('   Redevabilité de base:', '5%');
    console.log('   Facteur d\'enrichissement:', '×22.67');
    console.log('\n📊 Statistiques initiales:');
    console.log('   Valeur totale:', '0 €');
    console.log('   Bénéficiaires:', '0');
    console.log('   Contributions:', '0');
    console.log('\n🎯 Prochaines étapes:');
    console.log('   1. Les utilisateurs peuvent maintenant utiliser /correcteur');
    console.log('   2. Chaque correction sera automatiquement liée à ce NFT Source');
    console.log('   3. Les redevances seront calculées selon les bénéfices générés');
    console.log('   4. Le NFT s\'enrichira avec chaque contribution (×22.67)');

    // Créer également le NFT Source "Formation Sprint de Clarté" (bonus)
    const [formationResult] = await connection.execute(`
      INSERT INTO nft_sources (
        source_name,
        source_description,
        source_category,
        base_royalty_percentage,
        enrichment_factor,
        total_value,
        total_beneficiaries,
        total_contributions,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Formation Sprint de Clarté',
      'Formation interactive en 3 étapes pour transformer la communication d\'un art subjectif en une science de la performance. Diagnostic PFPMA + Méthode en 3 étapes + 310 pages de méthodologie. Gratuite au départ, redevabilité selon gains réalisés.',
      'formation',
      7.0, // Base royalty: 7% (formation premium)
      22.67,
      0.0,
      0,
      0,
    ]);

    const formationId = formationResult.insertId;

    console.log('\n✅ NFT Source "Formation Sprint de Clarté" créé avec succès !');
    console.log('   ID:', formationId);
    console.log('   Redevabilité de base:', '7%');

    // Créer le NFT Source "Coaching Zoom Personnalisé" (bonus)
    const [coachingResult] = await connection.execute(`
      INSERT INTO nft_sources (
        source_name,
        source_description,
        source_category,
        base_royalty_percentage,
        enrichment_factor,
        total_value,
        total_beneficiaries,
        total_contributions,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      'Coaching Zoom Personnalisé',
      'Séances de coaching individuel via Zoom pour appliquer la méthodologie Sionohmair Insight à votre projet spécifique. Diagnostic personnalisé + Plan d\'action + Suivi. Gratuit au départ, redevabilité selon résultats obtenus.',
      'coaching',
      10.0, // Base royalty: 10% (service premium personnalisé)
      22.67,
      0.0,
      0,
      0,
    ]);

    const coachingId = coachingResult.insertId;

    console.log('\n✅ NFT Source "Coaching Zoom Personnalisé" créé avec succès !');
    console.log('   ID:', coachingId);
    console.log('   Redevabilité de base:', '10%');

    console.log('\n🎉 Seed data terminé avec succès !');
    console.log('   3 NFT Sources créés au total.');

  } catch (error) {
    console.error('❌ Erreur lors du seed data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main()
  .then(() => {
    console.log('\n✅ Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
