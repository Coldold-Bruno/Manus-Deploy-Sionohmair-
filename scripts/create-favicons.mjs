import sharp from 'sharp';

const inputPath = 'client/public/logo-sionohmair-academy.png';

console.log('🎨 Création des favicons...\n');

// Favicon 32x32
await sharp(inputPath)
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile('client/public/favicon-32x32.png');

// Favicon 16x16
await sharp(inputPath)
  .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile('client/public/favicon-16x16.png');

// Apple Touch Icon 180x180
await sharp(inputPath)
  .resize(180, 180, { fit: 'contain', background: { r: 10, g: 25, b: 41, alpha: 1 } })
  .toFile('client/public/apple-touch-icon.png');

// Android Chrome 192x192
await sharp(inputPath)
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile('client/public/android-chrome-192x192.png');

// Android Chrome 512x512
await sharp(inputPath)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile('client/public/android-chrome-512x512.png');

console.log('✅ Favicons créés avec succès!\n');
console.log('  - favicon-32x32.png');
console.log('  - favicon-16x16.png');
console.log('  - apple-touch-icon.png (180x180)');
console.log('  - android-chrome-192x192.png');
console.log('  - android-chrome-512x512.png');
