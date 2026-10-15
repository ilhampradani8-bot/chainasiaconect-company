// Utility for fetching and parsing news directly and dynamically from Google Sheets
// Zero hardcoded/static dummy data - 100% live Google Sheets data.

export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa2Ih5iXjRYbgKJsIFlUTwPw4hl0xDIRn5MCTWd6g7UecdJi8jQLj8qKO_GvBG-JWIQ7n5pju2ZG47/pub?gid=0&single=true&output=csv";

// Helper untuk membuat slug SEO dari judul rilis
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper untuk memastikan format URL gambar (termasuk direct link Google Drive)
export function formatImageUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();

  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  return trimmed;
}

// RFC 4180 compliant CSV parser yang mendukung baris baru di dalam tanda kutip sel
export function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      currentRow.push(cur.trim());
      cur = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && text[i + 1] === '\n') {
        i++;
      }
      currentRow.push(cur.trim());
      cur = '';
      if (currentRow.some(val => val.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      cur += c;
    }
  }
  if (cur.length > 0 || currentRow.length > 0) {
    currentRow.push(cur.trim());
    if (currentRow.some(val => val.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/[\s\-_]+/g, ''));
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i];
    if (values.every(v => v === '')) continue;
    const entry = {};
    headers.forEach((h, idx) => {
      entry[h] = values[idx] || '';
    });
    result.push(entry);
  }

  return result;
}

// Fetch 100% live dari Google Sheets tanpa ada fallback statis
export async function fetchAllNews() {
  try {
    const cacheBusterUrl = `${GOOGLE_SHEET_CSV_URL}&_t=${Date.now()}`;
    const res = await fetch(cacheBusterUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (res.ok) {
      const csvData = await res.text();
      if (csvData && csvData.trim().length > 0) {
        const parsedRows = parseCSV(csvData);
        if (parsedRows.length > 0) {
          const items = parsedRows
            .map((r, idx) => {
              const rawStatus = (r.status || 'published').toLowerCase().trim();
              if (rawStatus === 'draft') return null;

              const titleVal = (r.judul || r.title || '').trim();
              if (!titleVal) return null;

              const contentVal = (r.isiberita || r.isi || r.content || r.ringkasan || r.excerpt || '').trim();
              const excerptVal = (r.ringkasan || r.excerpt || r.deskripsi || (contentVal.length > 150 ? contentVal.substring(0, 150) + '...' : contentVal)).trim();
              
              const rawImg = (r.gambarurl || r.gambar || r.foto || r.imageurl || r.image || r.linkgambar || '').trim();
              const imgVal = formatImageUrl(rawImg) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
              
              const linkVal = (r.link || r.url || (contentVal.startsWith('http') ? contentVal : '')).trim();
              const rawId = (r.id && r.id.trim()) || String(idx + 1);
              const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '') || String(idx + 1);
              const generatedSlug = slugify(titleVal) || cleanId;

              return {
                id: cleanId,
                slug: generatedSlug,
                tag: (r.kategori || r.tag || r.category || 'PRESS RELEASE').toUpperCase(),
                date: (r.tanggal || r.date || 'TERBARU').toUpperCase(),
                title: titleVal,
                excerpt: excerptVal,
                content: contentVal,
                imageUrl: imgVal,
                link: linkVal,
                status: rawStatus,
                readTime: '3 min baca'
              };
            })
            .filter(Boolean);

          // Urutkan: ID nomor terbesar adalah yang terbaru
          items.sort((a, b) => {
            const numA = parseFloat(a.id);
            const numB = parseFloat(b.id);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numB - numA;
            }
            return b.id.localeCompare(a.id, undefined, { numeric: true });
          });

          return { news: items, isLive: true };
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Google Sheets CSV live:', err);
  }

  // Jika gagal atau kosong, return array kosong (TIDAK ADA DATA STATIS/PALSU)
  return { news: [], isLive: false };
}
