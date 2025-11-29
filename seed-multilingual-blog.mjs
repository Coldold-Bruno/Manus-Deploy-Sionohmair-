import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blogPosts } from './drizzle/schema.ts';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Charger les articles complets
const articlesData = JSON.parse(fs.readFileSync('./blog-articles-full.json', 'utf-8'));

const coverImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop', // AI
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop', // Data
  'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=600&fit=crop', // MLOps
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&h=600&fit=crop', // Deep Learning
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=600&fit=crop', // NLP
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop', // Computer Vision
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=600&fit=crop', // Python
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop', // Cloud
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop', // Career
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=600&fit=crop', // Future AI
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop', // Growth
  'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=1200&h=600&fit=crop', // Copywriting
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop', // Email
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop', // Automation
  'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=1200&h=600&fit=crop', // SEO
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop', // Analytics
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop', // Product
  'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&h=600&fit=crop', // Sales
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=600&fit=crop', // Customer Success
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop', // Entrepreneurship
];

const allPosts = [];

// Pour chaque article, créer 4 versions (FR, EN, ES, DE)
articlesData.forEach((article, idx) => {
  const baseDate = new Date('2025-01-15');
  baseDate.setDate(baseDate.getDate() - (idx * 3)); // Espacer les articles de 3 jours
  
  // Version FR
  allPosts.push({
    slug: `${article.slug}`,
    title: article.fr.title,
    excerpt: article.fr.excerpt,
    content: article.fr.content,
    coverImage: coverImages[idx],
    category: article.category,
    published: 'published',
    publishedAt: baseDate,
    language: 'fr',
  });
  
  // Version EN
  allPosts.push({
    slug: `${article.slug}-en`,
    title: article.en.title,
    excerpt: article.en.excerpt,
    content: article.en.content,
    coverImage: coverImages[idx],
    category: article.category,
    published: 'published',
    publishedAt: baseDate,
    language: 'en',
  });
  
  // Version ES
  allPosts.push({
    slug: `${article.slug}-es`,
    title: article.es.title,
    excerpt: article.es.excerpt,
    content: article.es.content,
    coverImage: coverImages[idx],
    category: article.category,
    published: 'published',
    publishedAt: baseDate,
    language: 'es',
  });
  
  // Version DE
  allPosts.push({
    slug: `${article.slug}-de`,
    title: article.de.title,
    excerpt: article.de.excerpt,
    content: article.de.content,
    coverImage: coverImages[idx],
    category: article.category,
    published: 'published',
    publishedAt: baseDate,
    language: 'de',
  });
});

console.log(`📝 Insertion de ${allPosts.length} articles (20 articles × 4 langues)...`);

try {
  // Supprimer les anciens articles
  await connection.execute('DELETE FROM blog_posts WHERE 1=1');
  console.log('✅ Anciens articles supprimés');
  
  // Insérer par lots de 10
  for (let i = 0; i < allPosts.length; i += 10) {
    const batch = allPosts.slice(i, i + 10);
    await db.insert(blogPosts).values(batch);
    console.log(`✅ Batch ${Math.floor(i/10) + 1}/${Math.ceil(allPosts.length/10)} inséré`);
  }
  
  console.log(`\n🎉 ${allPosts.length} articles insérés avec succès !`);
  console.log(`📊 Répartition :`);
  console.log(`   - 20 articles en français`);
  console.log(`   - 20 articles en anglais`);
  console.log(`   - 20 articles en espagnol`);
  console.log(`   - 20 articles en allemand`);
  
} catch (error) {
  console.error('❌ Erreur lors de l\'insertion:', error);
} finally {
  await connection.end();
}
