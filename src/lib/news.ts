// Utility for fetching and parsing news from Google Sheets or default fallback

export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa2Ih5iXjRYbgKJsIFlUTwPw4hl0xDIRn5MCTWd6g7UecdJi8jQLj8qKO_GvBG-JWIQ7n5pju2ZG47/pub?gid=0&single=true&output=csv";

export interface NewsItem {
  id: string;
  slug: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  link?: string;
  status: string;
  readTime?: string;
}

// Helper untuk membuat slug SEO ramah mesin pencari dari judul rilis
export function slugify(text: string): string {
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
    .replace(/[^\w\s-]/g, '') // hapus karakter selain huruf, angka, spasi, dash
    .replace(/[\s_-]+/g, '-') // ganti spasi & underscore jadi 1 dash
    .replace(/^-+|-+$/g, ''); // bersihkan dash di awal/akhir
}

// Helper untuk memastikan format URL gambar (termasuk direct link dari Google Drive atau CDN)
export function formatImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Jika URL adalah link share Google Drive, ubah menjadi direct stream image URL
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

export const fallbackNews: NewsItem[] = [
  {
    id: "1",
    slug: "pt-chain-asia-conect-perluas-jaringan-rantai-pasok-di-wilayah-krui",
    tag: "PRESS RELEASE",
    date: "14 OKTOBER 2026",
    title: "PT CHAIN ASIA CONECT Memperluas Jaringan Rantai Pasok Terintegrasi di Wilayah Krui",
    excerpt: "Langkah transformasi strategis berorientasi pada keberlanjutan sektor riil guna memperkuat keandalan rantai pasok dan kemitraan B2B di Pesisir Barat.",
    content: "Keputusan strategis PT CHAIN ASIA CONECT untuk merambah sektor bisnis riil di kawasan Krui, Pesisir Barat, merupakan langkah transformasi usaha yang terukur dan berorientasi pada keberlanjutan.\n\nBerbeda dengan model bisnis spekulatif, operasional bisnis fisik di kawasan potensial ini memberikan fondasi yang kokoh melalui arus kas harian yang stabil (real cash flow), ketersediaan aset terwujud, serta pangsa pasar yang terukur secara riil.\n\nKata 'Chain' direorientasikan secara profesional untuk merepresentasikan keandalan Rantai Pasok (Supply Chain) serta integrasi Rantai Nilai Usaha yang saling menguatkan dalam ekosistem bisnis lokal maupun regional bersama para mitra akomodasi, perhotelan, dan industri pendukung.",
    imageUrl: "https://asset.kompas.com/crops/NV9tIhkK0pHK_HOeriHqeHM2egM=/88x0:931x562/1200x800/data/photo/2020/02/27/5e57c7cccd49e.jpg",
    link: "#",
    status: "published",
    readTime: "3 min baca"
  },
  {
    id: "2",
    slug: "ekspansi-lisensi-perangkat-lunak-diagnostik-pacs-cloud-medis",
    tag: "PARTNERSHIP",
    date: "10 OKTOBER 2026",
    title: "Ekspansi Lisensi Perangkat Lunak Diagnostik PACS & Cloud Medis",
    excerpt: "Penyediaan lisensi perangkat lunak DICOM PACS untuk fasilitas kesehatan dan laboratorium rujukan regional.",
    content: "Perusahaan berhasil bernegosiasi dengan perusahaan mitra untuk pembelian DICOMS PACS tingkat tinggi untuk keperluan universitas dan pemenuhan fasilitas.\n\nSebagai bagian dari pilar inovasi teknologi, implementasi lisensi perangkat lunak sistem PACS (Picture Archiving and Communication System) berbasis cloud dengan standar internasional DICOM memfasilitasi transmisi, penyimpanan, dan analisis citra medis diagnostik beresolusi tinggi antar fasilitas kesehatan di daerah.",
    imageUrl: "https://media.istockphoto.com/id/2190098690/id/foto/pemandangan-sudut-rendah-pada-gedung-perkantoran-modern-dengan-jendela-kaca-biru.jpg?s=1024x1024&w=is&k=20&c=Ez-60nlXTo1QWZiGVRNjgCZaltrMlM6E0S6P5qISuZk=",
    link: "#",
    status: "published",
    readTime: "3 min baca"
  },
  {
    id: "3",
    slug: "rencana-peluncuran-layanan-baru-kuartal-iv-2026",
    tag: "CORPORATE MILESTONE",
    date: "20 OKTOBER 2026",
    title: "Rencana Peluncuran Layanan Baru Kuartal IV 2026",
    excerpt: "Rencana ekspansi layanan pendukung operasional tahap kedua.",
    content: "Berita ini merupakan bagian dari roadmap pengembangan usaha PT CHAIN ASIA CONECT untuk memperkuat kehadiran jaringan operasional riil di kawasan regional.",
    imageUrl: "https://media.istockphoto.com/id/2190098690/id/foto/pemandangan-sudut-rendah-pada-gedung-perkantoran-modern-dengan-jendela-kaca-biru.jpg?s=1024x1024&w=is&k=20&c=Ez-60nlXTo1QWZiGVRNjgCZaltrMlM6E0S6P5qISuZk=",
    link: "#",
    status: "published",
    readTime: "2 min baca"
  }
];

export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseRow = (row: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"') {
        if (inQuotes && row[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[\s\-_]+/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.every(v => v === '')) continue;
    const entry: Record<string, string> = {};
    headers.forEach((h, idx) => {
      entry[h] = values[idx] || '';
    });
    rows.push(entry);
  }

  return rows;
}

export async function fetchAllNews(): Promise<{ news: NewsItem[]; isLive: boolean }> {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' });
    if (res.ok) {
      const csvData = await res.text();
      if (csvData && csvData.trim().length > 0) {
        const parsedRows = parseCSV(csvData);
        if (parsedRows.length > 0) {
          const items: NewsItem[] = parsedRows
            .map((r, idx) => {
              const rawStatus = (r.status || 'published').toLowerCase().trim();
              if (rawStatus === 'draft') return null;

              const titleVal = r.judul || r.title || '';
              if (!titleVal.trim()) return null;

              const contentVal = r.isiberita || r.isi || r.content || r.ringkasan || r.excerpt || '';
              const excerptVal = r.ringkasan || r.excerpt || r.deskripsi || (contentVal.length > 150 ? contentVal.substring(0, 150) + '...' : contentVal);
              
              const rawImg = r.gambarurl || r.gambar || r.foto || r.imageurl || r.image || r.linkgambar || '';
              const imgVal = formatImageUrl(rawImg) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
              
              const linkVal = r.link || r.url || (contentVal.startsWith('http') ? contentVal : '');
              const cleanId = (r.id && r.id.trim()) || String(idx + 1);
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
            .filter((item): item is NewsItem => item !== null);

          // Urutkan berita: ID nomor terbesar adalah yang paling baru (di posisi paling atas)
          items.sort((a, b) => {
            const numA = parseFloat(a.id);
            const numB = parseFloat(b.id);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numB - numA;
            }
            return b.id.localeCompare(a.id, undefined, { numeric: true });
          });

          if (items.length > 0) {
            return { news: items, isLive: true };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to fetch Google Sheets CSV, using fallback news.', err);
  }

  const sortedFallback = [...fallbackNews].sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
  return { news: sortedFallback, isLive: false };
}
