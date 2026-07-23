import { motion, useReducedMotion } from 'framer-motion'
import { Check, CircleCheck, MapPin } from 'lucide-react'
import { faqs, processSteps, services } from '../data'
import { Button, CtaBand, Eyebrow, Faq, MotionSection, ServiceCard, reveal, BlurText } from '../components/shared'
import BoldStats from '../components/BoldStats'
import TextileScene from '../components/TextileScene'
import ScrollProductionStory from '../components/ScrollProductionStory'
import DecryptedText from '../components/reactbits/DecryptedText'
import GradientText from '../components/reactbits/GradientText'
import TiltedCard from '../components/reactbits/TiltedCard'

const heroImg = '/images/textile/hero-textile.webp'

export default function Home() {
  const reduced = useReducedMotion()
  return <main id="main-content" tabIndex="-1">
    <section className="hero-next">
      <TextileScene className="hero-vanta" />
      <div className="hero-weave-grid" aria-hidden="true" />
      <div className="hero-atmosphere" aria-hidden="true"><span/><span/></div>
      <div className="container hero-layout">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .12 } } }}>
          <motion.div variants={reveal}><Eyebrow light><DecryptedText text="B2B tekstil üretim ortağı" animateOn="view" sequential speed={26} revealDirection="start" characters="BAMEL0123456789·/" /></Eyebrow></motion.div>
          <motion.h1 variants={reveal}><BlurText text="Üretimin ritmi," animateBy="words" delay={90} /><br/><em><GradientText colors={['#b98a49','#f3e3c6','#d6b47a']} animationSpeed={9} pauseOnHover>işinizin akışında.</GradientText></em></motion.h1>
          <motion.p variants={reveal}>Gömlek üretimi, nakış ve tekstil hizmetleri için; teknik ayrıntıları anlaşılır bir üretim planına dönüştürelim.</motion.p>
          <motion.div className="button-row" variants={reveal}><Button to="/teklif-al" magnetic>Üretim Talebinizi İletin</Button><Button to="/hizmetler" secondary>Hizmetleri İnceleyin</Button></motion.div>
          <motion.div className="hero-footnote" variants={reveal}><MapPin size={17}/> Diyarbakır merkezli üretim yaklaşımı</motion.div>
        </motion.div>
        <motion.div className="hero-visual" initial={reduced ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}>
          <TiltedCard imageSrc={heroImg} altText="Endüstriyel dikiş makinesinde işlenen doğal kumaş" className="hero-media" fetchPriority="high" loading="eager" overlayContent={<><div className="hero-card-code" aria-hidden="true">BML / 01</div><figcaption className="hero-card-caption"><span>Üretim odağı</span><strong>Malzeme · işçilik · akış</strong></figcaption></>} />
        </motion.div>
      </div>
    </section>

    <section className="trust-strip" aria-label="Bamel Enerji yaklaşımı"><div className="container trust-row"><span><CircleCheck/> B2B üretim</span><span><CircleCheck/> Entegre süreç</span><span><CircleCheck/> Kontrollü kalite</span><span><CircleCheck/> Açık iletişim</span></div></section>

    <MotionSection className="section stats-section">
      <div className="container">
        <BoldStats serviceCount={services.length} image="/images/textile/factory-floor.webp" />
      </div>
    </MotionSection>

    <MotionSection className="section intro-section"><div className="container intro-layout"><div><Eyebrow>Üretime yaklaşım</Eyebrow><h2>Farklı aşamalar, <em>tek bir net akış.</em></h2><p className="lead">Bamel Enerji; üretim talebinizi ürün, adet, kumaş, işlem ve hedef tarih gibi kararlarla birlikte değerlendirir. Teknik gereksinimler netleştikçe, doğru üretim adımı da görünür hâle gelir.</p><Button to="/uretim-ve-kalite" secondary>Kalite yaklaşımını görün</Button></div><aside className="signal-card"><span className="signal-dot"/><small>ÜRETİM SİNYALİ</small><strong>Talep → teknik değerlendirme → planlama</strong><p>Kesin olmayan noktaları da paylaşabilirsiniz. Doğru sorularla kapsamı birlikte oluştururuz.</p></aside></div></MotionSection>

    <MotionSection className="section services-section"><div className="container"><Eyebrow>Hizmetler</Eyebrow><div className="section-heading"><h2>İhtiyacınıza uygun üretim adımını <em>birlikte planlayalım.</em></h2><p>Her süreç, ürünün ve iş akışının kendi gereksinimlerine göre ele alınır.</p></div><div className="services-grid">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index}/>)}</div></div></MotionSection>

    <ScrollProductionStory steps={processSteps} />

    <MotionSection className="section quality-feature"><div className="container quality-layout"><div className="quality-image-wrap"><img src="/images/textile/quality-control.webp" alt="Işıklı kontrol masasında kumaş dokusunu inceleyen kalite uzmanı" width="1536" height="1024" loading="lazy"/><div className="image-label">KUMAŞ · RENK · İŞÇİLİK</div></div><div><Eyebrow>Üretim ve kalite</Eyebrow><h2>Kontrol, işin sonunda değil, <em>her aşamasında.</em></h2><p className="lead">Kumaş, renk, ölçü, dikiş, nakış, parti görünümü ve paketleme; hizmetin kapsamına göre izlenen kontrol noktalarıdır.</p><ul className="check-list"><li><Check/> Kumaş ve görünür uygunluk kontrolü</li><li><Check/> Renk ve parti yaklaşımı</li><li><Check/> Dikiş, nakış ve ölçü kontrolleri</li><li><Check/> Son ürün ve paketleme kontrolü</li></ul><Button to="/uretim-ve-kalite" secondary>Kalite yaklaşımını inceleyin</Button></div></div></MotionSection>

    <MotionSection className="section faq-section"><div className="container faq-layout"><div><Eyebrow>Net başlangıç</Eyebrow><h2>İlk görüşmeden önce <em>merak edilenler.</em></h2><p className="lead">Talebiniz netleştikçe, doğru planlama için gereken bilgiler de görünür hâle gelir.</p></div><div className="faq-list">{faqs.map(([question,answer])=><Faq key={question} question={question} answer={answer}/>)}</div></div></MotionSection>

    <CtaBand/>
  </main>
}
