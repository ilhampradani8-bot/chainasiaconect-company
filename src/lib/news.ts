// Utility for fetching and parsing news from Google Sheets or default fallback

export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQa2Ih5iXjRYbgKJsIFlUTwPw4hl0xDIRn5MCTWd6g7UecdJi8jQLj8qKO_GvBG-JWIQ7n5pju2ZG47/pub?gid=0&single=true&output=csv";

export interface NewsItem {
  id: string;
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
    tag: "PRESS RELEASE",
    date: "14 OKTOBER 2026",
    title: "PT CHAIN ASIA CONECT Memperluas Jaringan Rantai Pasok Terintegrasi di Wilayah Krui",
    excerpt: "Langkah transformasi strategis berorientasi pada keberlanjutan sektor riil guna memperkuat keandalan rantai pasok dan kemitraan B2B di Pesisir Barat.",
    content: "Keputusan strategis PT CHAIN ASIA CONECT untuk merambah sektor bisnis riil di kawasan Krui, Pesisir Barat, merupakan langkah transformasi usaha yang terukur dan berorientasi pada keberlanjutan.\n\nBerbeda dengan model bisnis spekulatif, operasional bisnis fisik di kawasan potensial ini memberikan fondasi yang kokoh melalui arus kas harian yang stabil (real cash flow), ketersediaan aset terwujud, serta pangsa pasar yang terukur secara riil.\n\nKata 'Chain' direorientasikan secara profesional untuk merepresentasikan keandalan Rantai Pasok (Supply Chain) serta integrasi Rantai Nilai Usaha yang saling menguatkan dalam ekosistem bisnis lokal maupun regional bersama para mitra akomodasi, perhotelan, dan industri pendukung.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    link: "#",
    status: "published",
    readTime: "3 min baca"
  },
  {
    id: "2",
    tag: "CORPORATE MILESTONE",
    date: "1 SEPTEMBER 2026",
    title: "Legalitas Badan Hukum Resmi Disahkan Melalui SK Kemenkumham RI AHU-A117353",
    excerpt: "PT CHAIN ASIA CONECT resmi terdaftar sebagai entitas Perseroan Perorangan berbadan hukum sah dengan NIB 0709260109599 dan KBLI 62193.",
    content: "PT CHAIN ASIA CONECT telah terdaftar resmi sebagai PT Perorangan berbadan hukum sah pada 1 September 2026 dengan Nomor Keputusan Menteri Hukum dan HAM RI: AHU-A117353.AH.01.30.Tahun 2026 yang ditetapkan di Jakarta pada tanggal 29 Agustus 2026.\n\nSelain itu, perusahaan juga telah mengantongi Nomor Induk Berusaha (NIB) 0709260109599 pada sistem Online Single Submission (OSS BKPM) dengan klasifikasi KBLI 62193 (Aktivitas Pengembangan Aplikasi Berbasis Teknologi Blockchain & Sistem Terintegrasi).\n\nLegalitas ini mempertegas kepatuhan hukum penuh dan memberikan jaminan kredibilitas tertinggi bagi seluruh mitra korporasi, perbankan, dan pemangku kepentingan strategis.",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    link: "#",
    status: "published",
    readTime: "2 min baca"
  },
  {
    id: "3",
    tag: "PARTNERSHIP",
    date: "25 SEPTEMBER 2026",
    title: "Kemitraan Lisensi Perangkat Lunak Diagnostik Cloud & Standar DICOM PACS Regional",
    excerpt: "Penguatan kemitraan strategis lisensi perangkat lunak imaging diagnostik PACS untuk mempercepat digitalisasi fasilitas layanan medis regional.",
    content: "Sebagai bagian dari pilar inovasi teknologi, PT CHAIN ASIA CONECT mengumumkan perluasan implementasi lisensi perangkat lunak sistem PACS (Picture Archiving and Communication System) berbasis cloud dengan standar internasional DICOM.\n\nInisiatif ini dirancang guna memfasilitasi transmisi, penyimpanan, dan analisis citra medis diagnostik beresolusi tinggi antar fasilitas kesehatan di daerah, menghubungkan sentra diagnostik perifer dengan tenaga ahli secara real-time dan aman.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    link: "#",
    status: "published",
    readTime: "4 min baca"
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
              
              // Ambil gambar persis dari kolom Google Sheets dan format secara dinamis
              const rawImg = r.gambarurl || r.gambar || r.foto || r.imageurl || r.image || r.linkgambar || '';
              const imgVal = formatImageUrl(rawImg) || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
              
              const linkVal = r.link || r.url || (contentVal.startsWith('http') ? contentVal : '');

              return {
                id: (r.id && r.id.trim()) || String(idx + 1),
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

          if (items.length > 0) {
            return { news: items, isLive: true };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to fetch Google Sheets CSV, using fallback news.', err);
  }

  return { news: fallbackNews, isLive: false };
}
