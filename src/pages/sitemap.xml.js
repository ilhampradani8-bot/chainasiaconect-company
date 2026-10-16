import { fetchAllNews, formatImageUrl, parseDateToISO } from '../lib/news';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const { news } = await fetchAllNews();
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    {
      loc: 'https://www.chainasiaconnect.co.id/',
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
      images: [
        { loc: 'https://www.chainasiaconnect.co.id/images/CAC-LOGO.jpg', title: 'PT CHAIN ASIA CONECT Corporate Logo' },
        { loc: 'https://www.chainasiaconnect.co.id/images/hero-owner.png', title: 'Ilham Pradani, S.H. (Cand.) - President Director' }
      ]
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/about',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/business',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.95',
      images: [
        { loc: 'https://www.chainasiaconnect.co.id/images/visualization-tutorial-data-loading-and-3d-visualization.png', title: 'Medical Diagnostic PACS Cloud Software Licensing 3D System' }
      ]
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/investor-relations',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/governance',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.85',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/sustainability',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.85',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/newsroom',
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/careers',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/contact',
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.85',
      images: []
    },
    {
      loc: 'https://www.chainasiaconnect.co.id/docs/sk-kemenkumham-ahu.pdf',
      lastmod: '2026-08-29',
      changefreq: 'never',
      priority: '0.7',
      images: []
    }
  ];

  const newsUrls = news.map((article) => {
    const imgUrl = formatImageUrl(article.imageUrl);
    const images = imgUrl
      ? [{ loc: imgUrl, title: escapeXml(article.title) }]
      : [];

    const articleDate = parseDateToISO(article.date).split('T')[0] || today;

    return {
      loc: `https://www.chainasiaconnect.co.id/newsroom/${article.slug}`,
      lastmod: articleDate,
      changefreq: 'weekly',
      priority: '0.85',
      images
    };
  });

  const allUrls = [...staticUrls, ...newsUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.images
  .map(
    (img) => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
