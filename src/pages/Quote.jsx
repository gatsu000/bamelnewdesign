import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from 'lucide-react'
import { services } from '../data'
import { Field, MotionSection, PageHero } from '../components/shared'
import TrueFocus from '../components/reactbits/TrueFocus'

const schema = z.object({
  name: z.string().min(1, 'Ad soyad zorunludur'),
  company: z.string().min(1, 'Firma adı zorunludur'),
  phone: z.string().min(1, 'Telefon zorunludur'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  services: z.array(z.string()).min(1, 'En az bir hizmet seçmelisiniz'),
  quantity: z.string().min(1, 'Adet zorunludur'),
  sample: z.string().min(1, 'Numune tercihi zorunludur'),
  details: z.string().min(1, 'Detay zorunludur'),
  privacy: z.boolean().refine(val => val === true, 'KVKK onaylanmalıdır')
})

export default function Quote() {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState(null)
  const reduced = useReducedMotion()

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { services: [], privacy: false }
  })

  const selectedServices = watch('services') || []

  const toggleService = (title) => {
    const current = selectedServices.includes(title) 
      ? selectedServices.filter(s => s !== title) 
      : [...selectedServices, title]
    setValue('services', current, { shouldValidate: true })
  }

  const next = async () => {
    const valid = await trigger(['name', 'company', 'phone', 'email', 'services'])
    if (valid) setStep(2)
  }

  const onSubmit = async (data) => {
    setStatus(null)
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const text = await response.text()
      let result
      try {
        result = JSON.parse(text)
      } catch (e) {
        console.error(e)
        throw new Error('Sunucu yanıtı işlenemedi. Lütfen daha sonra tekrar deneyin.')
      }

      if (!response.ok) throw new Error(result.message || 'Hata oluştu')
      setStatus({ type: 'success', message: result.message })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Talebiniz gönderilemedi.' })
    }
  }

  const fade = reduced ? false : { opacity: 0 }
  const visible = { opacity: 1 }
  const errStyle = { color: 'var(--danger)', marginTop: '.25rem', display: 'block' }

  return (
    <main id="main-content" tabIndex="-1">
      <PageHero 
        eyebrow="Teklif al" 
        title={<>Projenizi, üretim planına <br/><em><TrueFocus sentence="dönüştürelim." manualMode={false} borderColor="var(--copper)" glowColor="var(--copper-glow)" blurAmount={3} animationDuration={1.2} /></em></>} 
        copy="Ürün, adet ve teknik ayrıntıları paylaşın. Uygun kapsam firma ekibi tarafından değerlendirilecektir."
      />
      <MotionSection className="section quote-section">
        <div className="container">
          <form className="quote-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="quote-progress">
              <span className={step === 1 ? 'active' : ''}><b>01</b> İletişim ve ihtiyaç</span>
              <span className={step === 2 ? 'active' : ''}><b>02</b> Teknik ayrıntılar</span>
            </div>
            
            <AnimatePresence mode="popLayout" initial={false}>
              {step === 1 ? (
                <motion.div key="one" initial={fade} animate={visible} exit={fade} transition={{ duration: 0.15 }} className="form-grid">
                  <Field label="Ad Soyad" required>
                    <input {...register('name')} autoComplete="name"/>
                    {errors.name && <small style={errStyle}>{errors.name.message}</small>}
                  </Field>
                  <Field label="Firma Adı" required>
                    <input {...register('company')} autoComplete="organization"/>
                    {errors.company && <small style={errStyle}>{errors.company.message}</small>}
                  </Field>
                  <Field label="Telefon" required>
                    <input {...register('phone')} type="tel" inputMode="tel" autoComplete="tel"/>
                    {errors.phone && <small style={errStyle}>{errors.phone.message}</small>}
                  </Field>
                  <Field label="Kurumsal E-posta" required>
                    <input {...register('email')} type="email" inputMode="email" autoComplete="email"/>
                    {errors.email && <small style={errStyle}>{errors.email.message}</small>}
                  </Field>
                  <fieldset className="field full">
                    <legend>İhtiyaç duyduğunuz hizmet <sup>*</sup></legend>
                    <small>Bir veya birden fazla seçebilirsiniz.</small>
                    <div className="service-choices">
                      {services.map(service => (
                        <label key={service.slug}>
                          <input 
                            type="checkbox" 
                            checked={selectedServices.includes(service.title)} 
                            onChange={() => toggleService(service.title)}
                          />
                          <span>{service.title}</span>
                        </label>
                      ))}
                    </div>
                    {errors.services && <small style={errStyle}>{errors.services.message}</small>}
                  </fieldset>
                  <div className="form-actions full">
                    <button type="button" className="button button-primary" onClick={next} aria-label="İkinci adıma devam et">
                      Devam Et <ArrowRight size={17} aria-hidden="true"/>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="two" initial={fade} animate={visible} exit={fade} transition={{ duration: 0.15 }} className="form-grid">
                  <Field label="Tahmini Adet" required>
                    <input {...register('quantity')} inputMode="numeric" placeholder="Örn. 500"/>
                    {errors.quantity && <small style={errStyle}>{errors.quantity.message}</small>}
                  </Field>
                  <fieldset className="field">
                    <legend>Numune ihtiyacınız var mı? <sup>*</sup></legend>
                    <div className="radio-group">
                      {['Evet', 'Hayır', 'Değerlendirelim'].map(choice => (
                        <label key={choice}>
                          <input 
                            type="radio" 
                            value={choice}
                            {...register('sample')}
                          />
                          {choice}
                        </label>
                      ))}
                    </div>
                    {errors.sample && <small style={errStyle}>{errors.sample.message}</small>}
                  </fieldset>
                  <Field label="Talebinizi açıklayın" required className="full">
                    <textarea {...register('details')} placeholder="Ürün, kumaş, renk, işlem ve hedef tarihe ilişkin bildiklerinizi paylaşın."/>
                    {errors.details && <small style={errStyle}>{errors.details.message}</small>}
                  </Field>
                  <label className="consent full">
                    <input type="checkbox" {...register('privacy')}/>
                    <span>KVKK aydınlatma metnini okudum. Talebimin değerlendirilmesi için bilgilerimin işlenmesini kabul ediyorum. <sup>*</sup></span>
                    {errors.privacy && <small style={errStyle}>{errors.privacy.message}</small>}
                  </label>
                  <div className="form-actions full">
                    <button type="button" className="button button-secondary" onClick={() => setStep(1)} aria-label="Birinci adıma dön">
                      <ArrowLeft size={17} aria-hidden="true"/> Geri
                    </button>
                    <button type="submit" className="button button-primary" disabled={isSubmitting} aria-live="polite">
                      {isSubmitting ? <><Loader2 size={17} className="spin" aria-hidden="true"/> Gönderiliyor...</> : <>Talebi Gönder <Send size={17} aria-hidden="true"/></>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {status && (
              <p className={`form-status ${status.type}`} role="status">
                {status.type === 'success' && <Check size={18}/>} {status.message}
              </p>
            )}
          </form>
        </div>
      </MotionSection>
    </main>
  )
}
