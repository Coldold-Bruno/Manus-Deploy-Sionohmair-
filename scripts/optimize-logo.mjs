import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

const inputPath = 'client/public/logo-sionohmair-academy.png';
const outputWebP = 'client/public/logo-sionohmair-academy.webp';
const outputPngOptimized = 'client/public/logo-sionohmair-academy-optimized.png';

console.log('🖼️  Optimisation du logo en cours...\n');

// Optimiser en WebP (meilleure compression)
await sharp(inputPath)
  .webp({ quality: 90, effort: 6 })
  .toFile(outputWebP);

// Optimiser en PNG (fallback)
await sharp(inputPath)
  .png({ compressionLevel: 9, quality: 90 })
  .toFile(outputPngOptimized);

// Afficher les tailles
const originalSize = readFileSync(inputPath).length;
const webpSize = readFileSync(outputWebP).length;
const pngSize = readFileSync(outputPngOptimized).length;

console.log('✅ Optimisation terminée!\n');
console.log(`Original PNG:     ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`WebP optimisé:    ${(webpSize / 1024).toFixed(2)} KB (${((1 - webpSize/originalSize) * 100).toFixed(1)}% de réduction)`);
console.log(`PNG optimisé:     ${(pngSize / 1024).toFixed(2)} KB (${((1 - pngSize/originalSize) * 100).toFixed(1)}% de réduction)`);
