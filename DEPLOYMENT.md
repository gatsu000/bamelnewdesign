# Bamel Enerji — Hostinger GitHub Deployment

## Birincil kurulum: Node.js Web App

Bu kurulum React sitesini ve `/api/quote` teklif servisini aynı uygulamada çalıştırır. Teklifler SMTP ile `info@bamelenerji.com` adresine iletilir, kullanıcıya onay e-postası gönderilir ve bir referans numarası döner.

1. Hostinger hPanel'de **Add Website → Deploy Web App → Import Git Repository** yolunu açın.
2. `gatsu000/bamelnewdesign` reposunu ve yayınlanacak branch'i seçin.
3. Uygulama tipi algılanmazsa **Other / Express.js** seçin.
4. Build command olarak `npm run build` kullanın.
5. Start command olarak `npm start`, entry file olarak `server/index.js` kullanın.
6. Node.js 20 veya 22 seçin.
7. **Environment Variables** bölümüne aşağıdaki değerleri ekleyin:

```dotenv
NODE_ENV=production
TRUST_PROXY_HOPS=1
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@bamelenerji.com
SMTP_PASS=HOSTINGER_POSTA_KUTUSU_PAROLASI
QUOTE_RECIPIENT=info@bamelenerji.com
MAIL_FROM_NAME=Bamel Enerji Web
```

`SMTP_PASS` GitHub'a veya herhangi bir takip edilen dosyaya yazılmamalıdır. Hostinger ortam değişkenlerinde tutulmalıdır. `SMTP_PORT`, 1 ile 65535 arasında bir tam sayı olmalıdır; yalnızca tanımlanmadığında `465` varsayılır. `TRUST_PROXY_HOPS` yalnızca negatif olmayan bir tam sayı olabilir: Hostinger'ın tek güvenilen ters proxy hop'u için `1`, doğrudan erişim için `0` kullanın. Geçersiz değer uygulamanın güvenli olmayan bir proxy güveniyle başlaması yerine başlangıçta hata verir.

Node sınırlayıcısı `/api/quote` endpoint'ine IP başına 15 dakikada 5 istek uygular. Varsayılan `MemoryStore` süreç başınadır; bu dağıtımı tek Node süreci olarak çalıştırın. Birden fazla süreç veya sunucu için paylaşımlı sayaç sağlamaz.

Express ve Apache yolları, aynı kaynaklara izin veren CSP kullanır: kendi kaynakları, veri/blob görselleri, aynı-origin API çağrıları ve Framer/Vanta'nın satır içi stilleri. `object-src 'none'` ve `frame-ancestors 'self'` aktif kalır.

## GitHub güncelleme akışı

Hostinger otomatik dağıtımı açıksa yayın akışı:

```bash
npm run build
git add .
git commit -m "Improve production quote flow"
git push
```

Push sonrasında hPanel → Deployments bölümünde build durumunu kontrol edin. Canlı kontrolde:

- `/api/health` yanıtında `ok: true` ve `mailConfigured: true` görünmeli. Bu değer SMTP kullanıcı adı ve parolasının tanımlı olduğunu gösterir; canlı SMTP bağlantısını ölçmez.
- `/teklif-al` üzerinden gerçek bir test talebi gönderilmeli.
- Hedef posta kutusuna teslim başarısızsa kullanıcı `502` alır ve yeniden deneyebilir. Hedef posta kutusu talebi kabul edip yalnızca kullanıcı onayı başarısız olursa kullanıcı `202` ile talebin ulaştığını ve onayın gönderilemediğini görür; bu durumda talebi yeniden göndermemelidir.

## Statik/PHP hosting yedeği

Hostinger kurulumu yalnızca `dist` klasörünü `public_html` içine yayınlıyorsa Vite, `public/api/quote.php`, `public/api/health.php` ve `.htaccess` dosyalarını `dist` içine kopyalar. `.htaccess`, `/api/quote` ve `/api/health` isteklerini PHP dosyalarına yönlendirir.

PHP, aynı JSON şekli ve durum kodlarıyla health ve quote endpoint'lerini sağlar. `mailConfigured`, yalnızca PHP `mail()` fonksiyonunun kullanılabilirliğidir. Quote bucket'ı aynı host üzerinde kilitli geçici dosyada tutulur ve IP başına 15 dakikada 5 istektir; hostlar arasında paylaşılmaz. Ekip `mail()` çağrısı başarısız olursa `502` döner; yalnızca kullanıcı onayı başarısız olursa `202` yanıtı talebin ulaştığını ve onayın gönderilemediğini açıkça bildirir. `mail()` kabulü posta kutusu teslimini garanti etmez.

PHP `mail()` teslimatı SMTP kadar gözlemlenebilir veya güvenilir değildir. Bu nedenle mümkün olduğunda yukarıdaki Node.js Web App ve SMTP kurulumu kullanılmalıdır. PHP bu `.env` SMTP değişkenlerini kullanmaz.

## Yerel doğrulama

```bash
npm install
npm run build
npm start
```

Uygulama varsayılan olarak `http://localhost:8787` adresinde açılır. SMTP bilgileri tanımlı değilse geliştirme ortamında form doğrulanır ancak e-posta gönderilmez.
