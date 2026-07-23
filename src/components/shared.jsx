import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import SpotlightCard from './SpotlightCard'
import BlurText from './BlurText'
import GridGlowBackground from './GridGlowBackground'
import Magnet from './Magnet'

export { SpotlightCard, BlurText }
export const reveal = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const ctaGlowColors = ['rgba(255,241,214,.18)', 'rgba(214,180,122,.15)']

export function MotionSection({ children, className = '' }) {
  const reduced = useReducedMotion()
  return <motion.section className={className} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: .16 }} variants={reveal} transition={{ duration: .45, ease: 'easeOut' }}>{children}</motion.section>
}

export function Eyebrow({ children, light = false }) { return <span className={`eyebrow${light ? ' light' : ''}`}><i />{children}</span> }

export function Button({ to, children, secondary = false, className = '', withIcon = true, magnetic = false }) {
  const link = (
    <Link to={to} className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`}>
      {children}{withIcon && <ArrowRight size={17}/>}
    </Link>
  )
  return magnetic ? <Magnet wrapperClassName="magnet-button" padding={42} magnetStrength={5}>{link}</Magnet> : link
}

export function Faq({ question, answer }) { const reduced = useReducedMotion(); const [open,setOpen] = useState(false); return <article className={`faq ${open?'open':''}`}><button aria-expanded={open} onClick={()=>setOpen(!open)}><span>{question}</span><Plus/></button><AnimatePresence>{open && <motion.p initial={reduced ? false : { opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={reduced ? false : { opacity:0,height:0 }}>{answer}</motion.p>}</AnimatePresence></article> }

export function Field({ label, required, className='', children }) { return <label className={`field ${className}`}><span>{label} {required && <sup>*</sup>}</span>{children}</label> }

export function PageHero({ eyebrow, title, copy }) {
  return <section className="page-hero-next">
    <GridGlowBackground className="page-grid-glow" glowCount={4} gridSize={72} />
    <div className="page-hero-art" aria-hidden="true"><span/><span/><span/></div>
    <div className="container"><Eyebrow light>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div>
  </section>
}

export function CtaBand() { return <section className="cta-next"><GridGlowBackground className="cta-grid-glow" glowCount={3} gridSize={56} gridColor="rgba(255,255,255,.07)" glowColors={ctaGlowColors}/><div className="container cta-layout"><div><Eyebrow light>Üretim talebi</Eyebrow><h2>Projenizi üretim planına <em>dönüştürelim.</em></h2><p>Ürün, adet ve işlem ayrıntılarınızı paylaşın; uygun kapsamı birlikte değerlendirelim.</p></div><Button to="/teklif-al">Talebinizi iletin</Button></div></section> }

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
