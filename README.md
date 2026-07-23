# Bamel Enerji Web Sitesi

Modern B2B tekstil üretim ve terbiye hizmetleri için React + Vite ile hazırlanmış kurumsal web sitesi.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Site development server'da `http://localhost:5173` adresinde çalışır.

## 📦 Production Build

```bash
npm run build
```

Build sonrası `dist/` klasörü production-ready dosyaları içerir.

## 🌐 Hostinger Deployment

### Adım 1: Build
```bash
npm run build
npm run deploy:check
```

### Adım 2: Upload
`dist/` klasörünün tüm içeriğini Hostinger `public_html/` klasörüne yükleyin.

**Yöntemler:**
- **File Manager**: Hostinger hPanel → File Manager → public_html/
- **FTP**: FileZilla ile dist/ içinden tüm dosyaları upload edin
- **Detaylı talimatlar**: [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın

### Adım 3: Test
- Domain adresini ziyaret edin
- Navigation ve form testi yapın
- Mobile responsive kontrol edin

## 🛠️ Development

### Local Development (with API)
```bash
# Terminal 1 - API Server
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Preview Production Build
```bash
npm run build
npm run preview
```

## 📧 İletişim Bilgileri

- **E-posta**: info@bamelenerji.com
- **Konum**: Diyarbakır, Türkiye

## ⚠️ Canlıya Geçmeden Önce

- [ ] Telefon numarası doğrulansın
- [ ] E-posta adresi aktif olsun
- [ ] Görseller gerçek üretim fotoğraflarıyla değiştirilsin
- [ ] API endpoint'leri production ortama bağlansın
- [ ] KVKK ve gizlilik politikası eklensin
- [ ] SSL sertifikası aktif edilsin

## 📋 Teknoloji Stack

- **Frontend**: React 19, Vite 7, React Router 7
- **UI/UX**: Framer Motion, GSAP, Lenis (smooth scroll)
- **Icons**: Lucide React
- **Build**: Vite (ESBuild + Rollup)
- **API**: Node.js/Express (development only)

## 📁 Proje Yapısı

```
bamel-enerji-web/
├── src/              # React components ve styles
├── public/           # Static assets (.htaccess)
├── dist/            # Production build output
├── server/          # Express API (development)
└── package.json     # Dependencies ve scripts
```

## 🔧 Deployment Scripts

```bash
npm run deploy:hostinger  # Build + deployment talimatları
npm run deploy:check      # Build kontrolü
```

## 📄 Lisans

© 2026 Bamel Enerji - Tüm hakları saklıdır.

---

**Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) | **Strateji**: [Bamel-Enerji-Web-Sitesi-Strateji-Raporu.md](./Bamel-Enerji-Web-Sitesi-Strateji-Raporu.md)

