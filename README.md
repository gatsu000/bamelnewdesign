# Bamel Enerji Web Sitesi

React 19 + Vite ile hazırlanmış B2B tekstil üretim sitesi. Teklif akışı, Hostinger üzerinde çalışan Express API ve SMTP e-posta teslimatı içerir.

## Yerel geliştirme

```bash
npm install
```

Frontend ve geliştirme API'si için iki terminal kullanın:

```bash
npm run server
npm run dev
```

Production uygulamasını yerelde çalıştırmak için:

```bash
npm run build
npm start
```

## Hostinger + GitHub deployment

Teklif formunun e-posta gönderebilmesi için projeyi Hostinger'da **Node.js Web App / Express** olarak dağıtın:

- Repository: `https://github.com/gatsu000/bamelnewdesign`
- Build command: `npm run build`
- Start command: `npm start`
- Entry file: `server/index.js`
- Node.js: 20 veya 22
- Ortam değişkenleri: [.env.example](./.env.example) içindeki anahtarlar

GitHub otomatik dağıtımı açıksa seçilen branch'e yapılan her push yeni build başlatır. Ayrıntılı kurulum ve statik PHP alternatifi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## E-posta yapılandırması

Hostinger ortam değişkenlerinde `SMTP_USER`, `SMTP_PASS` ve `QUOTE_RECIPIENT` tanımlanmalıdır. Parolayı GitHub reposuna veya takip edilen herhangi bir dosyaya eklemeyin.

Varsayılan hedef: `info@bamelenerji.com`

## Teknoloji

- React 19, Vite 7, React Router 7
- React Hook Form + Zod
- Framer Motion, GSAP, Lenis, Vanta
- Express + Nodemailer
- Hostinger Node.js Web App

## Canlıya geçiş kontrolü

- `npm run build` başarıyla tamamlanmalı.
- `/api/health` yanıtında `ok: true` ve `mailConfigured: true` görünmeli.
- `/teklif-al` üzerinden gerçek bir talep gönderilip iki e-posta doğrulanmalı.
- Telefon, tablet, yatay ekran ve masaüstü kontrol edilmeli.
