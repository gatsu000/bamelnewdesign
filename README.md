# Bamel Enerji Web Sitesi

React 19 + Vite ile hazırlanmış B2B tekstil üretim sitesi. Teklif akışında birincil yol Hostinger Node.js Web App üzerindeki Express + SMTP servisidir; Apache/PHP yol yalnızca statik hosting için yedektir.

## Yerel geliştirme

```bash
npm install
```

Frontend ve geliştirme API'si için iki terminal kullanın:

```bash
npm run server
npm run dev
```

Yerel sunucu, `TRUST_PROXY_HOPS` tanımlı değilse doğrudan istemci adresini kullanır (`0` hop). Production'da varsayılan bir güvenilen proxy hop'udur; ayrıntı için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

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
- Ortam değişkenleri: [.env.example](./.env.example) içindeki anahtarlar, özellikle `TRUST_PROXY_HOPS=1`

GitHub otomatik dağıtımı açıksa seçilen branch'e yapılan her push yeni build başlatır. Ayrıntılı kurulum ve statik PHP alternatifi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## E-posta yapılandırması

Hostinger ortam değişkenlerinde `SMTP_USER`, `SMTP_PASS`, `QUOTE_RECIPIENT` ve doğru `TRUST_PROXY_HOPS` tanımlanmalıdır. Parolayı GitHub reposuna veya takip edilen herhangi bir dosyaya eklemeyin. SMTP değişkenleri yalnızca Node birincil yolu içindir.

Varsayılan hedef: `info@bamelenerji.com`

## API davranışı

- `GET /api/health`, her iki dağıtım yolunda da `{ ok, service, mailConfigured }` döner. Node'da `mailConfigured`, SMTP kullanıcı adı ve parolasının tanımlı olduğunu; PHP'de ise `mail()` fonksiyonunun kullanılabilir olduğunu gösterir. Hiçbiri posta kutusuna teslim garantisi değildir.
- `POST /api/quote`, yalnızca bu endpoint'te IP başına 15 dakikada 5 istekle sınırlıdır. Node, standart `RateLimit` başlıklarını gönderir ve eski `X-RateLimit-*` başlıklarını göndermez.
- Node sınırlayıcısının varsayılan `MemoryStore`u süreç başınadır. Production dağıtımı tek Node süreciyle çalışmalıdır; birden fazla süreç veya sunucu arasında sayaç paylaşılmaz.
- Ekip/alıcının kabulü yetkili teslimat sonucudur: başarısız olursa `502` döner ve yeniden deneme gerekir. Başvuran onayı tek başına başarısız olursa istek yine `202` döner; mesaj, ekibin talebi aldığını ve onayın gönderilemediğini açıkça bildirir. PHP `mail()` kabulü gerçek posta kutusu teslimini garanti etmez.

## Teknoloji

- React 19, Vite 7, React Router 7
- React Hook Form + Zod
- Framer Motion, GSAP, Vanta
- Express + Nodemailer
- Hostinger Node.js Web App

## Canlıya geçiş kontrolü

- `npm run build` başarıyla tamamlanmalı.
- Aktif yolun `/api/health` yanıtında `ok: true` görünmeli; Node yolunda `mailConfigured: true` SMTP değişkenlerini doğrular.
- `/teklif-al` üzerinden gerçek bir talep gönderilip ekip ve başvuran onay e-postaları doğrulanmalı.
- Telefon, tablet, yatay ekran ve masaüstü kontrol edilmeli.
