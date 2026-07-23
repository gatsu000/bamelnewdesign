import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import SpotlightCard from './SpotlightCard'
import BlurText from './BlurText'
import Aurora from './Aurora'
import Silk from './reactbits/Silk'
import GradientText from './reactbits/GradientText'
import Counter from './reactbits/Counter'
import TiltedCard from './reactbits/TiltedCard'
import DecryptedText from './reactbits/DecryptedText'
import Balatro from './reactbits/Balatro'

export { SpotlightCard, BlurText, Aurora, Silk, GradientText, Counter, TiltedCard, DecryptedText, Balatro }
export const reveal = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export function MotionSection({ children, className = '' }) {
  const reduced = useReducedMotion()
  return <motion.section className={className} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .16 }} variants={reveal} transition={{ duration: .45, ease: 'easeOut' }}>{children}</motion.section>
}

export function Eyebrow({ children, light = false }) { return <span className={`eyebrow${light ? ' light' : ''}`}><i />{children}</span> }

export function Button({ to, children, secondary = false, className = '', withIcon = true }) {
  return (
    <Link to={to} className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`}>
      {children}{withIcon && <ArrowRight size={17}/>}
    </Link>
  )
}

export function Faq({ question, answer }) { const reduced = useReducedMotion(); const [open,setOpen] = useState(false); return <article className={`faq ${open?'open':''}`}><button aria-expanded={open} onClick={()=>setOpen(!open)}><span>{question}</span><Plus/></button><AnimatePresence>{open && <motion.p initial={reduced ? false : { opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={reduced ? false : { opacity:0,height:0 }}>{answer}</motion.p>}</AnimatePresence></article> }

export function Field({ label, required, className='', children }) { return <label className={`field ${className}`}><span>{label} {required && <sup>*</sup>}</span>{children}</label> }

export function PageHero({ eyebrow, title, copy, useSilk = false, useBalatro = true }) {
  return <section className="page-hero-next">
    {useBalatro ? (
      <div className="balatro-bg" style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden' }}>
        <Balatro
          spinRotation={-2}
          spinSpeed={7}
          color1="#9c817f"
          color2="#000101"
          color3="#162325"
          contrast={3.5}
          lighting={0.4}
          spinAmount={0.25}
          pixelFilter={700}
        />
      </div>
    ) : useSilk
      ? <div className="silk-bg"><Silk speed={3} scale={1} color="#1a1520" noiseIntensity={1.2} rotation={0} /></div>
      : <Aurora colorStops={['#0a0a0f', '#c45820', '#0a0a0f']} blend={0.5} amplitude={1.0} speed={0.4} />
    }
    <div className="container"><Eyebrow light>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div>
  </section>
}

export function CtaBand() { return <section className="cta-next"><Aurora colorStops={['#050505', '#a64516', '#111111']} blend={0.4} amplitude={0.8} speed={0.3} /><div className="container cta-layout"><div><Eyebrow light>Üretim talebi</Eyebrow><h2>Projenizi üretim planına <em>dönüştürelim.</em></h2><p>Ürün, adet ve işlem ayrıntılarınızı paylaşın; uygun kapsamı birlikte değerlendirelim.</p></div><Button to="/teklif-al">Talebinizi iletin</Button></div></section> }

export function ServiceCard({ service, index }) {
  const Icon = service.icon
  const reduced = useReducedMotion()
  return (
    <motion.article style={{ height: '100%' }} initial={reduced ? false : { opacity:0, y:18 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:index*.06, duration:.35 }}>
      <SpotlightCard className="service-card-next" style={{ height: '100%' }}>
        <Link to={`/hizmetler/${service.slug}`} style={{ height: '100%' }}>
          <div className="service-icon"><Icon/></div><small>{service.label}</small><h3>{service.title}</h3><p>{service.summary}</p><span className="service-link">Detayları incele <ArrowRight size={17}/></span>
        </Link>
      </SpotlightCard>
    </motion.article>
  )
}

export function NotFound() { return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Sayfa bulunamadı" title={<>Aradığınız sayfa <em>burada değil.</em></>} copy="Bağlantı değişmiş veya sayfa henüz oluşturulmamış olabilir."/><section className="section"><div className="container"><Button to="/">Ana sayfaya dön</Button></div></section></main> }
