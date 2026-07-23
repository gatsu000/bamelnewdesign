import crypto from 'crypto'
import express from 'express'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = Number(process.env.PORT) || 8787
const isProduction = process.env.NODE_ENV === 'production'
const mailConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
const quoteRecipient = process.env.QUOTE_RECIPIENT || 'info@bamelenerji.com'
const rateWindowMs = 15 * 60 * 1000
const rateLimit = 5
const requestBuckets = new Map()

app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(express.json({ limit: '64kb', type: 'application/json' }))
app.use((_request, response, next) => {
  response.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  })
  next()
})

const line = (value, max = 160) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
const paragraph = (value, max = 2000) => String(value ?? '').trim().slice(0, max)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d\s().-]{10,30}$/
const createRequestId = () => `BML-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
const checkRate = ip => {
  const now = Date.now()
  const recent = (requestBuckets.get(ip) || []).filter(timestamp => now - timestamp < rateWindowMs)
  if (recent.length >= rateLimit) return false
  requestBuckets.set(ip, [...recent, now])
  return true
}
const normalizeQuote = body => ({
  name: line(body.name, 80),
  company: line(body.company, 120),
  phone: line(body.phone, 30),
  email: line(body.email, 160).toLowerCase(),
  services: Array.isArray(body.services) ? [...new Set(body.services.map(item => line(item, 80)).filter(Boolean))].slice(0, 8) : [],
  product: line(body.product, 120),
  quantity: line(body.quantity, 60),
  timeline: line(body.timeline, 60),
  sample: line(body.sample, 40),
  details: paragraph(body.details),
  privacy: body.privacy === true,
  website: line(body.website, 120),
  startedAt: Number(body.startedAt) || 0
})
const validateQuote = quote => {
  if (!quote.name || !quote.company || !quote.phone || !quote.email || !quote.services.length || !quote.product || !quote.quantity || !quote.timeline || !quote.sample || quote.details.length < 20 || !quote.privacy) return 'Lütfen zorunlu teklif alanlarını doldurun.'
  if (!emailPattern.test(quote.email)) return 'Geçerli bir e-posta adresi girin.'
  if (!phonePattern.test(quote.phone)) return 'Geçerli bir telefon numarası girin.'
  return null
}
const createTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (Number(process.env.SMTP_PORT) || 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
})
const quoteText = (quote, requestId) => [
  `Yeni üretim brifi — ${requestId}`,
  '',
  `Ad Soyad       : ${quote.name}`,
  `Firma          : ${quote.company}`,
  `E-posta        : ${quote.email}`,
  `Telefon        : ${quote.phone}`,
  '',
  `Hizmetler      : ${quote.services.join(', ')}`,
  `Ürün / kumaş   : ${quote.product}`,
  `Tahmini adet   : ${quote.quantity}`,
  `Hedef zaman    : ${quote.timeline}`,
  `Numune ihtiyacı: ${quote.sample}`,
  '',
  'Proje notu:',
  quote.details
].join('\n')

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'bamel-enerji-api', mailConfigured })
})

app.post('/api/quote', async (request, response) => {
  const quote = normalizeQuote(request.body ?? {})
  const requestId = createRequestId()

  // Bots receive a neutral response without triggering mail.
  if (quote.website || (quote.startedAt && Date.now() - quote.startedAt < 1500)) {
    return response.status(202).json({ message: 'Talebiniz alındı. Ekibimiz kapsamı değerlendirecektir.', requestId })
  }
  if (!checkRate(request.ip || request.socket.remoteAddress || 'unknown')) {
    return response.status(429).json({ message: 'Kısa sürede çok fazla talep gönderildi. Lütfen 15 dakika sonra tekrar deneyin.' })
  }
  const validationError = validateQuote(quote)
  if (validationError) return response.status(400).json({ message: validationError })

  if (!mailConfigured) {
    if (isProduction) return response.status(503).json({ message: 'Teklif servisi yapılandırılıyor. Lütfen info@bamelenerji.com adresinden bize ulaşın.' })
    console.info(`[quote:development] ${requestId} ${quote.company} <${quote.email}>`)
    return response.status(202).json({ message: 'Talebiniz geliştirme ortamında doğrulandı.', requestId })
  }

  try {
    const transport = createTransport()
    const from = `"${process.env.MAIL_FROM_NAME || 'Bamel Enerji Web'}" <${process.env.SMTP_USER}>`
    await transport.sendMail({
      from,
      to: quoteRecipient,
      replyTo: quote.email,
      subject: `[${requestId}] Üretim brifi — ${quote.company}`,
      text: quoteText(quote, requestId)
    })
    await transport.sendMail({
      from,
      to: quote.email,
      replyTo: quoteRecipient,
      subject: `Üretim talebinizi aldık — ${requestId}`,
      text: [`Merhaba ${quote.name},`, '', 'Üretim brifiniz Bamel Enerji ekibine ulaştı. Kapsam incelendikten sonra paylaştığınız iletişim bilgileri üzerinden sizinle bağlantı kurulacaktır.', '', `Talep referansı: ${requestId}`, '', 'Bamel Enerji', quoteRecipient].join('\n')
    })
    return response.status(202).json({ message: 'Üretim brifiniz ekibimize ulaştı. Referans numaranızı e-posta adresinize de gönderdik.', requestId })
  } catch (error) {
    console.error(`[quote:delivery-failed] ${requestId}`, error?.message)
    return response.status(502).json({ message: 'Talep şu anda iletilemedi. Lütfen tekrar deneyin veya info@bamelenerji.com adresinden bize ulaşın.' })
  }
})

app.use('/api', (_request, response) => response.status(404).json({ message: 'API adresi bulunamadı.' }))
app.use(express.static(path.join(__dirname, '../dist')))
app.use((_request, response) => response.sendFile(path.join(__dirname, '../dist/index.html')))

app.listen(port, () => console.log(`Bamel Enerji http://localhost:${port}`))
