import { Request, Response } from 'express';
import { getDb } from './db';
import { blogPosts } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://sionohmair-insight-academy.manus.space';

export async function generateSitemap(req: Request, res: Response) {
  try {
    const db = await getDb();
    
    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/sprint-clarte', changefreq: 'weekly', priority: 0.9 },
      { url: '/theoreme', changefreq: 'monthly', priority: 0.8 },
      { url: '/services', changefreq: 'weekly', priority: 0.9 },
      { url: '/niveau1', changefreq: 'monthly', priority: 0.7 },
      { url: '/niveau2', changefreq: 'monthly', priority: 0.7 },
      { url: '/niveau3', changefreq: 'monthly', priority: 0.7 },
      { url: '/ressources', changefreq: 'weekly', priority: 0.8 },
      { url: '/automatisation-ia', changefreq: 'monthly', priority: 0.7 },
      { url: '/calculateur', changefreq: 'monthly', priority: 0.8 },
      { url: '/blog', changefreq: 'daily', priority: 0.9 },
      { url: '/about', changefreq: 'monthly', priority: 0.6 },
      { url: '/contact', changefreq: 'monthly', priority: 0.6 },
    ];

    // Dynamic blog posts
    let blogPages: any[] = [];
    if (db) {
      const posts = await db
        .select({
          slug: blogPosts.slug,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .where(eq(blogPosts.published, 'published'));

      blogPages = posts.map(post => ({
        url: `/blog/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: post.updatedAt.toISOString().split('T')[0],
      }));
    }

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${blogPages
  .map(
    page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}
