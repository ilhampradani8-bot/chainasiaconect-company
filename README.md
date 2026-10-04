# PT CHAIN ASIA CONECT — Official Corporate Website

Official corporate web portal for **PT CHAIN ASIA CONECT**, built with [Astro](https://astro.build/) for high performance, comprehensive SEO, and multilingual accessibility (i18n).

---

## 🏢 Corporate Overview & Legalities

- **Company Name**: PT CHAIN ASIA CONECT
- **Legal Form**: PT Perorangan (SK Kemenkumham: `AHU-A117353.AH.01.30.Tahun 2026`)
- **NIB**: `0709260109599` (KBLI 62193 — Aktivitas Pengembangan Aplikasi Berbasis Teknologi Blockchain & Rantai Pasok)
- **NPWP**: `10.000.000.1-094.6336`
- **Director / Founder**: Ilham Pradani
- **Official Domain**: [https://www.chainasiaconect.company](https://www.chainasiaconect.company)
- **Email Inquiries**: `info@chainasiaconect.company` | `sales@chainasiaconect.company` | `hello@ilhampradani.me`
- **WhatsApp Support**: `+6288971071138`

---

## 🌐 Brand Philosophy

- **CHAIN (Rantai Pasok & Kemitraan)**: Melambangkan kekuatan rantai pasok yang terintegrasi, keandalan mutu layanan, serta komitmen kemitraan B2B strategis.
- **ASIA (Visi & Standar Profesional)**: Melambangkan penerapan standar operasional profesional dan kesiapan fasilitas melayani pasar domestik maupun internasional.
- **CONECT (Jembatan Solusi)**: Melambangkan peran perusahaan sebagai penyedia solusi komprehensif yang menghubungkan kebutuhan operasional riil dengan layanan fisik yang responsif.

---

## 🚀 Key Features

- **High-Performance Astro Framework**: Lightning-fast static rendering & optimized asset delivery.
- **Multilingual Support (i18n)**: English (`en`), Indonesian (`id`), Japanese (`ja`), Mandarin (`zh`), Arabic (`ar`).
- **Comprehensive SEO & GEO (Generative Engine Optimization)**:
  - Structured JSON-LD metadata for Google Rich Results.
  - Generative AI ready metadata (`public/llms.txt`, `robots.txt` configured for GPTBot, PerplexityBot, ClaudeBot, etc.).
  - Auto-generated XML Sitemap (`public/sitemap.xml`).
- **Pages Structure**:
  - `Home` (`/`)
  - `About Us` (`/about`)
  - `Business Lines & Real Economy Ecosystem` (`/business`)
  - `Supply Chain & Logistics` (`/scf`)
  - `Corporate Governance` (`/governance`)
  - `Investor Relations` (`/investor-relations`)
  - `Sustainability & ESG` (`/sustainability`)
  - `Newsroom` (`/newsroom`)
  - `Careers` (`/careers`)
  - `Contact Us` (`/contact`)

---

## 🛠️ Development & Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
# or with custom port & public binding:
npx astro dev --host 0.0.0.0 --port 4321
```

### 3. Production Build
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```text
├── public/
│   ├── docs/                   # Company legal documents & corporate whitepapers
│   ├── images/                 # Corporate logos & photography assets
│   ├── js/                     # Client-side i18n & interactive scripts
│   ├── favicon.ico             # Site favicons
│   ├── llms.txt                # Generative AI / LLM Context Guide
│   ├── robots.txt              # Search engine & AI crawler policies
│   ├── sitemap.xml             # XML Sitemap index
│   └── site.webmanifest        # PWA Manifest
├── src/
│   ├── components/             # Reusable Astro components (Header, Footer, Cards, etc.)
│   ├── i18n/                   # Translation dictionaries
│   ├── layouts/                # Base HTML layouts (Layout.astro)
│   ├── pages/                  # Route pages (index, about, business, contact, etc.)
│   └── styles/                 # Global styles & design system CSS
├── astro.config.mjs            # Astro configuration
└── package.json                # Project dependencies and npm scripts
```

---

© 2026 PT CHAIN ASIA CONECT. All Rights Reserved.
