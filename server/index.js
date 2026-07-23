import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 8787

app.use(express.json({ limit: '1mb' }))

// API routes
app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'bamel-enerji-api' })
})

app.post('/api/quote', (request, response) => {
  const { name, company, email, phone, services, quantity, details, sample, privacy } = request.body ?? {}

  if (!name || !company || !email || !phone || !Array.isArray(services) || services.length === 0 || !quantity || !details || !sample || !privacy) {
    return response.status(400).json({ message: 'Lütfen zorunlu teklif alanlarını doldurun.' })
  }

  return response.status(202).json({
    message: 'Talebiniz alındı. Ekibimiz kapsamı değerlendirecektir.'
  })
})

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, '../dist')))

// SPA routing - serve index.html for all non-API routes
app.use((request, response) => {
  response.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(port, () => {
  console.log(`Bamel Enerji API http://localhost:${port}`)
})
