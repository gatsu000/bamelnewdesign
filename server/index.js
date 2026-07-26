import crypto from 'crypto'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
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
const smtpPortValue = process.env.SMTP_PORT
if (smtpPortValue !== undefined && !/^\d+$/.test(smtpPortValue)) throw new Error('SMTP_PORT must be an integer from 1 through 65535.')
const smtpPort = smtpPortValue === undefined ? 465 : Number(smtpPortValue)
if (!Number.isSafeInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) throw new Error('SMTP_PORT must be an integer from 1 through 65535.')
const trustProxyHopsValue = process.env.TRUST_PROXY_HOPS
if (trustProxyHopsValue !== undefined && !/^\d+$/.test(trustProxyHopsValue)) throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.')
const trustProxyHops = trustProxyHopsValue === undefined ? (isProduction ? 1 : 0) : Number(trustProxyHopsValue)
if (!Number.isSafeInteger(trustProxyHops)) throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.')
const contentSecurityPolicy = "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: blob:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'"
const quoteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: 'Kısa sürede çok fazla talep gönderildi. Lütfen 15 dakika sonra tekrar deneyin.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false
})

app.set('trust proxy', trustProxyHops === 0 ? false : trustProxyHops)
app.disable('x-powered-by')
app.use((_request, response, next) => {
  response.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': contentSecurityPolicy
  })
  next()
})
app.use(express.json({ limit: '64kb', type: 'application/json' }))

const line = (value, max = 160) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
const paragraph = (value, max = 2000) => String(value ?? '').trim().slice(0, max)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d\s().-]{10,30}$/
const createRequestId = () => `BML-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
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
  port: smtpPort,
  secure: smtpPort === 465,
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

const quotePreflight = (request, response, next) => {
  if (!request.is('application/json')) return response.status(415).json({ message: 'JSON içerik türü bekleniyor.' })
  const requestId = createRequestId()
  const website = line(request.body?.website, 120)
  const startedAt = Number(request.body?.startedAt) || 0
  if (website || (startedAt && Date.now() - startedAt < 1500)) return response.status(202).json({ message: 'Talebiniz alındı. Ekibimiz kapsamı değerlendirecektir.', requestId })
  return next()
}

app.post('/api/quote', quotePreflight, quoteRateLimiter, async (request, response) => {
  const quote = normalizeQuote(request.body ?? {})
  const requestId = createRequestId()

  const validationError = validateQuote(quote)
  if (validationError) return response.status(400).json({ message: validationError })

  if (!mailConfigured) {
    if (isProduction) return response.status(503).json({ message: 'Teklif servisi yapılandırılıyor. Lütfen info@bamelenerji.com adresinden bize ulaşın.' })
    console.info(`[quote:development] ${requestId} ${quote.company} <${quote.email}>`)
    return response.status(202).json({ message: 'Talebiniz geliştirme ortamında doğrulandı.', requestId })
  }

  const transport = createTransport()
  const from = `"${process.env.MAIL_FROM_NAME || 'Bamel Enerji Web'}" <${process.env.SMTP_USER}>`
  try {
    await transport.sendMail({
      from,
      to: quoteRecipient,
      replyTo: quote.email,
      subject: `[${requestId}] Üretim brifi — ${quote.company}`,
      text: quoteText(quote, requestId)
    })
  } catch (error) {
    console.error(`[quote:delivery-failed] ${requestId}`, error?.message)
    return response.status(502).json({ message: 'Talep şu anda iletilemedi. Lütfen tekrar deneyin veya info@bamelenerji.com adresinden bize ulaşın.' })
  }

  try {
    await transport.sendMail({
      from,
      to: quote.email,
      replyTo: quoteRecipient,
      subject: `Üretim talebinizi aldık — ${requestId}`,
      text: [`Merhaba ${quote.name},`, '', 'Üretim brifiniz Bamel Enerji ekibine ulaştı. Kapsam incelendikten sonra paylaştığınız iletişim bilgileri üzerinden sizinle bağlantı kurulacaktır.', '', `Talep referansı: ${requestId}`, '', 'Bamel Enerji', quoteRecipient].join('\n')
    })
  } catch {
    console.error(`[quote:confirmation-failed] ${requestId}`)
    return response.status(202).json({ message: 'Üretim brifiniz ekibimize ulaştı; ancak onay e-postası şu anda gönderilemedi.', requestId })
  }
  return response.status(202).json({ message: 'Üretim brifiniz ekibimize ulaştı. Referans numaranızı e-posta adresinize de gönderdik.', requestId })
})

app.use((error, request, response, next) => {
  if (request.method !== 'POST' || !/^\/api\/quote\/?$/.test(request.path)) return next(error)
  if (error?.type === 'entity.too.large') return response.status(413).json({ message: 'İstek gövdesi çok büyük.' })
  if (error?.type === 'entity.parse.failed') return response.status(400).json({ message: 'Geçersiz istek gövdesi.' })
  return next(error)
})

app.use('/api', (_request, response) => response.status(404).json({ message: 'API adresi bulunamadı.' }))
app.use(express.static(path.join(__dirname, '../dist')))
app.use((_request, response) => response.sendFile(path.join(__dirname, '../dist/index.html')))

app.listen(port, () => console.log(`Bamel Enerji http://localhost:${port}`))
