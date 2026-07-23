import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import SpotlightCard from './SpotlightCard'
import Counter from './reactbits/Counter'

function AnimatedFact({ label, value, index, reduced }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, amount: .5 })
  const target = Number(value)
  return <motion.div ref={ref} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08, duration: .42 }}><dt>{label}</dt><dd><Counter value={reduced || visible ? target : 0} places={[10,1]} fontSize={46} gap={0} horizontalPadding={0} gradientHeight={14} gradientFrom="var(--ink)" gradientTo="transparent" accessibleLabel={value} /></dd></motion.div>
}

export default function BoldStats({ serviceCount, image }) {
  const reduced = useReducedMotion()
  const formattedCount = String(serviceCount).padStart(2, '0')
  return (
    <section className="capability-proof" aria-labelledby="capability-title">
      <div className="capability-feature">
        <motion.div className="capability-number" aria-hidden="true" initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .65, ease: [0.16, 1, 0.3, 1] }}>{formattedCount}</motion.div>
        <div className="capability-copy">
          <span className="eyebrow"><i />Üretim kapsamı</span>
          <h2 id="capability-title">Tek ihtiyaç, <em>birbiriyle konuşan hizmetler.</em></h2>
          <p>Gömlek üretiminden tamamlayıcı işlemlere kadar her başlık, aynı teknik değerlendirme ve iletişim akışında ele alınır.</p>
        </div>
        <SpotlightCard className="capability-image" spotlightColor="rgba(214,180,122,.15)"><img src={image} alt="Tekstil üretiminde kumaş ve işçilik detayı" width="960" height="640" loading="lazy" /></SpotlightCard>
      </div>
      <dl className="capability-facts">
        {[['Hizmet başlığı', formattedCount], ['Görünür süreç adımı', '04'], ['Üretim yaklaşımı', '01']].map(([label, value], index) => <AnimatedFact key={label} label={label} value={value} index={index} reduced={reduced} />)}
      </dl>
    </section>
  )
}
