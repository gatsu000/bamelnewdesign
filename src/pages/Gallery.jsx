import { motion } from 'framer-motion'
import { services } from '../data'
import { MotionSection, PageHero, SpotlightCard } from '../components/shared'

export default function Gallery() {
  const images = [...services.map(service => [service.image,service.title]),['/images/textile/quality-control.webp','Kalite Kontrol'],['/images/textile/factory-floor.webp','Üretim Alanı'],['/images/textile/hero-textile.webp','Malzeme ve İşçilik']]
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Galeri" title={<>İşin içinden, <em>üretimin ritminden.</em></>} copy="Hizmetlerimizi ve üretim yaklaşımımızı görsel olarak temsil eden özgün bir seçki."/><MotionSection className="section"><div className="container gallery-next">{images.map(([src,label],index)=><motion.div key={label} initial={{ opacity:0,scale:.97 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }} transition={{ delay:(index%6)*.04 }} className="gallery-motion"><SpotlightCard as="figure" className="gallery-figure" spotlightColor="rgba(214,180,122,.12)"><img src={src} alt={`${label} sürecini temsil eden tekstil üretim görseli`} width="1536" height="1024" loading="lazy"/><figcaption>{label}</figcaption></SpotlightCard></motion.div>)}</div></MotionSection></main>
}
