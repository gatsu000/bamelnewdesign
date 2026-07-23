import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ClipboardList, Clock3, Layers3, Loader2, MailCheck, PackageCheck, Send, ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { services } from '../data'
import { Field, MotionSection, PageHero } from '../components/shared'

const cleanText = (label, minimum = 1, maximum = 120) => z.string().trim().min(minimum, `${label} zorunludur`).max(maximum, `${label} çok uzun`)
const schema = z.object({
  name: cleanText('Ad soyad', 2, 80),
  company: cleanText('Firma adı', 2, 120),
  phone: cleanText('Telefon', 10, 30).regex(/^[+\d\s().-]+$/, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().trim().email('Geçerli bir e-posta giriniz').max(160, 'E-posta çok uzun'),
  services: z.array(z.string()).min(1, 'En az bir hizmet seçmelisiniz').max(services.length),
  product: cleanText('Ürün veya kumaş türü', 2, 120),
  quantity: cleanText('Tahmini adet', 1, 60),
  timeline: cleanText('Hedef zaman', 1, 60),
  sample: cleanText('Numune tercihi', 1, 40),
  details: cleanText('Proje ayrıntısı', 20, 2000),
  privacy: z.boolean().refine(Boolean, 'KVKK onaylanmalıdır'),
  website: z.string().max(0).optional()
})

const steps = [
  ['01', 'Firma ve ihtiyaç'],
  ['02', 'Üretim brifi'],
  ['03', 'Kontrol ve gönder']
]
const timelines = ['2–4 hafta', '1–2 ay', '2–3 ay', 'Esnek / planlayalım']
const ErrorText = ({ id, children }) => children ? <small id={id} className="field-error" role="alert">{children}</small> : null
const SummaryLine = ({ icon: Icon, label, value }) => <div className="quote-summary-line"><Icon aria-hidden="true"/><span><small>{label}</small><strong>{value || 'Henüz belirtilmedi'}</strong></span></div>

export default function Quote() {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [searchParams] = useSearchParams()
  const startedAt = useRef(Date.now())
  const headingRef = useRef(null)
  const reduced = useReducedMotion()
  const { register, handleSubmit, watch, setValue, trigger, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', company: '', phone: '', email: '', services: [], product: '', quantity: '', timeline: '', sample: '', details: '', privacy: false, website: '' },
    mode: 'onTouched'
  })
  const values = watch()
  const selectedServices = values.services || []

  useEffect(() => {
    const requested = searchParams.get('hizmet')
    const service = services.find(item => item.slug === requested)
    if (service) setValue('services', [service.title], { shouldDirty: false })
  }, [searchParams, setValue])

  const focusStep = () => window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))
  const moveTo = nextStep => { setStatus(null); setStep(nextStep); focusStep() }
  const toggleService = title => setValue('services', selectedServices.includes(title) ? selectedServices.filter(item => item !== title) : [...selectedServices, title], { shouldValidate: true, shouldDirty: true })
  const next = async () => {
    const fields = step === 1 ? ['name', 'company', 'phone', 'email', 'services'] : ['product', 'quantity', 'timeline', 'sample', 'details']
    if (await trigger(fields, { shouldFocus: true })) moveTo(step + 1)
  }
  const onSubmit = async data => {
    setSubmitAttempted(true)
    setStatus(null)
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, startedAt: startedAt.current })
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Talep şu anda gönderilemedi. Lütfen tekrar deneyin.')
      setStatus({ type: 'success', message: result.message, requestId: result.requestId })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Talep şu anda gönderilemedi. Lütfen tekrar deneyin.' })
    }
  }
  const startAgain = () => {
    reset()
    startedAt.current = Date.now()
    setSubmitAttempted(false)
    setStatus(null)
    moveTo(1)
  }
  const fade = reduced ? false : { opacity: 0, y: 8 }

  return (
    <main id="main-content" className="quote-page" tabIndex="-1">
      <PageHero eyebrow="Üretim brifi" title={<>İhtiyacınızı anlatın, <em>doğru planla başlayalım.</em></>} copy="Kısa üretim brifinizi iletin. Ekibimiz kapsamı inceler ve sonraki adım için sizinle doğrudan iletişime geçer."/>
      <MotionSection className="section quote-section">
        <div className="container quote-shell">
          <form className="quote-form" onSubmit={handleSubmit(onSubmit, () => setSubmitAttempted(true))} noValidate>
            {status?.type === 'success' ? (
              <motion.div className="quote-success" initial={fade} animate={{ opacity: 1, y: 0 }}>
                <span className="quote-success-icon"><MailCheck aria-hidden="true"/></span>
                <small>ÜRETİM BRİFİ ALINDI</small>
                <h2>Talebiniz değerlendirme sırasına eklendi.</h2>
                <p>{status.message}</p>
                {status.requestId && <div className="quote-reference"><span>Talep referansı</span><strong>{status.requestId}</strong></div>}
                <button type="button" className="button button-secondary" onClick={startAgain}>Yeni talep oluştur</button>
              </motion.div>
            ) : (
              <>
                <div className="quote-progress" aria-label="Teklif formu ilerlemesi">
                  {steps.map(([number, label], index) => <div key={number} className={`${step === index + 1 ? 'active' : ''}${step > index + 1 ? ' complete' : ''}`} aria-current={step === index + 1 ? 'step' : undefined}><b>{step > index + 1 ? <Check aria-hidden="true"/> : number}</b><span>{label}</span></div>)}
                </div>
                <div className="quote-step-heading" ref={headingRef} tabIndex="-1">
                  <span>ADIM {String(step).padStart(2, '0')} / 03</span>
                  <h2>{step === 1 ? 'Kiminle ve hangi ihtiyaç için görüşeceğiz?' : step === 2 ? 'Üretim kapsamını birlikte çerçeveleyelim.' : 'Brifinizi son kez kontrol edin.'}</h2>
                  <p>{step === 1 ? 'İletişim bilgilerinizi ve ilgilendiğiniz hizmetleri belirtin.' : step === 2 ? 'Kesinleşmemiş bilgiler için en yakın tahmini paylaşmanız yeterli.' : 'Gönderimden önce kapsamı ve iletişim bilgilerinizi gözden geçirin.'}</p>
                </div>
                <input className="quote-honeypot" type="text" tabIndex="-1" autoComplete="off" hidden {...register('website')}/>
                <AnimatePresence mode="popLayout" initial={false}>
                  {step === 1 && (
                    <motion.div key="contact" initial={fade} animate={{ opacity: 1, y: 0 }} exit={fade} transition={{ duration: .16 }} className="form-grid">
                      <Field label="Ad Soyad" required><input {...register('name')} id="name" autoComplete="name" placeholder="Adınız ve soyadınız" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined}/><ErrorText id="name-error">{errors.name?.message}</ErrorText></Field>
                      <Field label="Firma Adı" required><input {...register('company')} id="company" autoComplete="organization" placeholder="Firma veya marka adı" aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? 'company-error' : undefined}/><ErrorText id="company-error">{errors.company?.message}</ErrorText></Field>
                      <Field label="Telefon" required><input {...register('phone')} id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+90 5__ ___ __ __" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined}/><ErrorText id="phone-error">{errors.phone?.message}</ErrorText></Field>
                      <Field label="Kurumsal E-posta" required><input {...register('email')} id="email" type="email" inputMode="email" autoComplete="email" placeholder="ad@firma.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined}/><ErrorText id="email-error">{errors.email?.message}</ErrorText></Field>
                      <fieldset className="field full" aria-invalid={Boolean(errors.services)} aria-describedby={errors.services ? 'services-error' : 'services-help'}>
                        <legend>İhtiyaç duyduğunuz hizmet <sup>*</sup></legend><small id="services-help">Bir veya birden fazla hizmet seçebilirsiniz.</small>
                        <div className="service-choices">{services.map(service => <label key={service.slug}><input type="checkbox" name="service-choice" checked={selectedServices.includes(service.title)} onChange={() => toggleService(service.title)}/><span>{service.title}</span></label>)}</div>
                        <ErrorText id="services-error">{errors.services?.message}</ErrorText>
                      </fieldset>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="brief" initial={fade} animate={{ opacity: 1, y: 0 }} exit={fade} transition={{ duration: .16 }} className="form-grid">
                      <Field label="Ürün veya kumaş türü" required><input {...register('product')} id="product" placeholder="Örn. poplin gömlek, örme kumaş" aria-invalid={Boolean(errors.product)} aria-describedby={errors.product ? 'product-error' : undefined}/><ErrorText id="product-error">{errors.product?.message}</ErrorText></Field>
                      <Field label="Tahmini adet" required><input {...register('quantity')} id="quantity" inputMode="numeric" placeholder="Örn. 500 adet" aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? 'quantity-error' : undefined}/><ErrorText id="quantity-error">{errors.quantity?.message}</ErrorText></Field>
                      <fieldset className="field" aria-invalid={Boolean(errors.timeline)} aria-describedby={errors.timeline ? 'timeline-error' : undefined}>
                        <legend>Hedef zaman <sup>*</sup></legend><div className="radio-group">{timelines.map(choice => <label key={choice}><input type="radio" value={choice} {...register('timeline')}/><span>{choice}</span></label>)}</div><ErrorText id="timeline-error">{errors.timeline?.message}</ErrorText>
                      </fieldset>
                      <fieldset className="field" aria-invalid={Boolean(errors.sample)} aria-describedby={errors.sample ? 'sample-error' : undefined}>
                        <legend>Numune ihtiyacı <sup>*</sup></legend><div className="radio-group">{['Evet', 'Hayır', 'Birlikte değerlendirelim'].map(choice => <label key={choice}><input type="radio" value={choice} {...register('sample')}/><span>{choice}</span></label>)}</div><ErrorText id="sample-error">{errors.sample?.message}</ErrorText>
                      </fieldset>
                      <Field label="Projenizi açıklayın" required className="full"><textarea {...register('details')} id="details" maxLength="2000" placeholder="Kumaş, renk, model, baskı veya nakış bilgisi, teslim yeri ve bildiğiniz diğer teknik ayrıntılar…" aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? 'details-error' : 'details-help'}/><div className="field-meta"><small id="details-help">En az 20 karakter</small><small>{values.details?.length || 0} / 2000</small></div><ErrorText id="details-error">{errors.details?.message}</ErrorText></Field>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="review" initial={fade} animate={{ opacity: 1, y: 0 }} exit={fade} transition={{ duration: .16 }} className="quote-review">
                      <div className="quote-review-card"><span><ClipboardList aria-hidden="true"/> İletişim</span><strong>{values.name}</strong><p><span>{values.company}</span><span>{values.email}</span><span>{values.phone}</span></p><button type="button" onClick={() => moveTo(1)}>Düzenle</button></div>
                      <div className="quote-review-card"><span><Layers3 aria-hidden="true"/> Üretim kapsamı</span><strong>{values.product}</strong><p><span>{selectedServices.join(', ')}</span><span>{values.quantity} · {values.timeline}</span><span>Numune: {values.sample}</span></p><button type="button" onClick={() => moveTo(2)}>Düzenle</button></div>
                      <div className="quote-review-detail"><small>PROJE NOTU</small><p>{values.details}</p></div>
                      <div className="consent-group">
                        <label className="consent"><input type="checkbox" {...register('privacy')} aria-invalid={submitAttempted && Boolean(errors.privacy)} aria-describedby={submitAttempted && errors.privacy ? 'privacy-error' : undefined}/><span>KVKK aydınlatma metnini okudum. Talebimin değerlendirilmesi ve benimle iletişime geçilmesi için bilgilerimin işlenmesini kabul ediyorum. <sup>*</sup></span></label>
                        <ErrorText id="privacy-error">{submitAttempted ? errors.privacy?.message : null}</ErrorText>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {status?.type === 'error' && <p className="form-status error" role="alert">{status.message}</p>}
                <div className="form-actions">
                  {step > 1 && <button type="button" className="button button-secondary" onClick={() => moveTo(step - 1)}><ArrowLeft aria-hidden="true"/> Geri</button>}
                  {step < 3 ? <button type="button" className="button button-primary" onClick={next}>Devam et <ArrowRight aria-hidden="true"/></button> : <button type="submit" className="button button-primary" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="spin" aria-hidden="true"/> Gönderiliyor…</> : <>Üretim brifini gönder <Send aria-hidden="true"/></>}</button>}
                </div>
                <p className="quote-form-note"><ShieldCheck aria-hidden="true"/> Bilgileriniz yalnızca talebinizi değerlendirmek için kullanılır.</p>
              </>
            )}
          </form>
          <aside className="quote-summary" aria-label="Talep özeti">
            <span className="eyebrow"><i/>Canlı talep özeti</span>
            <h2>Brifiniz netleştikçe plan görünür olur.</h2>
            <SummaryLine icon={Layers3} label="Hizmet" value={selectedServices.length ? `${selectedServices.length} hizmet seçildi` : ''}/>
            <SummaryLine icon={PackageCheck} label="Ürün ve adet" value={[values.product, values.quantity].filter(Boolean).join(' · ')}/>
            <SummaryLine icon={Clock3} label="Hedef zaman" value={values.timeline}/>
            <div className="quote-expectation"><strong>Gönderimden sonra ne olur?</strong><ol><li>Talep kapsamı incelenir.</li><li>Eksik teknik bilgiler netleştirilir.</li><li>Uygun üretim ve numune akışı paylaşılır.</li></ol></div>
          </aside>
        </div>
      </MotionSection>
    </main>
  )
}
