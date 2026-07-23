# Bamel Enerji — Hostinger GitHub Deployment

## Önerilen kurulum: Node.js Web App

Bu kurulum React sitesini ve `/api/quote` teklif servisini aynı uygulamada çalıştırır. Teklifler SMTP ile `info@bamelenerji.com` adresine iletilir ve kullanıcıya bir referans numarası döner.

1. Hostinger hPanel'de **Add Website → Deploy Web App → Import Git Repository** yolunu açın.
2. `gatsu000/bamelnewdesign` reposunu ve yayınlanacak branch'i seçin.
3. Uygulama tipi algılanmazsa **Other / Express.js** seçin.
4. Build command olarak `npm run build` kullanın.
5. Start command olarak `npm start`, entry file olarak `server/index.js` kullanın.
6. Node.js 20 veya 22 seçin.
7. **Environment Variables** bölümüne aşağıdaki değerleri ekleyin:

```dotenv
NODE_ENV=production
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@bamelenerji.com
SMTP_PASS=HOSTINGER_POSTA_KUTUSU_PAROLASI
QUOTE_RECIPIENT=info@bamelenerji.com
MAIL_FROM_NAME=Bamel Enerji Web
```

`SMTP_PASS` GitHub'a veya herhangi bir takip edilen dosyaya yazılmamalıdır. Hostinger ortam değişkenlerinde tutulmalıdır.

## GitHub güncelleme akışı

Hostinger otomatik dağıtımı açıksa yayın akışı:

```bash
npm run build
git add .
git commit -m "Improve production quote flow"
git push
```

Push sonrasında hPanel → Deployments bölümünde build durumunu kontrol edin. Canlı kontrolde:

- `/api/health` yanıtında `ok: true` ve `mailConfigured: true` görünmeli.
- `/teklif-al` üzerinden gerçek bir test talebi gönderilmeli.
- Talep hem hedef posta kutusuna hem de kullanıcıya onay e-postası olarak ulaşmalı.

## Statik/PHP hosting alternatifi

Hostinger kurulumu yalnızca `dist` klasörünü `public_html` içine yayınlıyorsa `public/api/quote.php` build sırasında `dist/api/quote.php` olarak kopyalanır. `.htaccess`, `/api/quote` isteğini bu dosyaya yönlendirir.

PHP `mail()` teslimatı SMTP kadar güvenilir değildir. Bu nedenle mümkün olduğunda yukarıdaki Node.js Web App ve SMTP kurulumu kullanılmalıdır.

## Yerel doğrulama

```bash
npm install
npm run build
npm start
```

Uygulama varsayılan olarak `http://localhost:8787` adresinde açılır. SMTP bilgileri tanımlı değilse geliştirme ortamında form doğrulanır ancak e-posta gönderilmez.
