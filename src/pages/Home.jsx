import { motion, useReducedMotion } from 'framer-motion'
import { Check, CircleCheck, MapPin } from 'lucide-react'
import { faqs, processSteps, services } from '../data'
import { Button, CtaBand, Eyebrow, Faq, MotionSection, ServiceCard, reveal, BlurText, Silk, Counter, TiltedCard, DecryptedText } from '../components/shared'
import TrueFocus from '../components/reactbits/TrueFocus'

const heroImg = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1024&q=80'

export default function Home() {
  const reduced = useReducedMotion()
  return <main id="main-content" tabIndex="-1">
    <section className="hero-next">
      <div className="silk-bg"><Silk speed={5} scale={1} color="#1a1520" noiseIntensity={1.5} rotation={0} /></div>
      <div className="container hero-layout">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .12 } } }}>
          <motion.div variants={reveal}><Eyebrow light><DecryptedText text="B2B tekstil üretim ortağı" animateOn="view" speed={60} maxIterations={12} characters="B2BXYZ0101#@!" /></Eyebrow></motion.div>
          <motion.h1 variants={reveal}><BlurText text="Üretimin ritmi," animateBy="words" delay={100} /><br/><em><TrueFocus sentence="işinizin akışında." manualMode={false} borderColor="var(--copper)" glowColor="var(--copper-glow)" blurAmount={3} animationDuration={1.2} pauseBetweenAnimations={2} /></em></motion.h1>
          <motion.p variants={reveal}>Gömlek üretimi, nakış ve tekstil hizmetleri için; teknik ayrıntıları anlaşılır bir üretim planına dönüştürelim.</motion.p>
          <motion.div className="button-row" variants={reveal}><Button to="/teklif-al">Üretim Talebinizi İletin</Button><Button to="/hizmetler" secondary>Hizmetleri İnceleyin</Button></motion.div>
          <motion.div className="hero-footnote" variants={reveal}><MapPin size={17}/> Diyarbakır merkezli üretim yaklaşımı</motion.div>
        </motion.div>
        <motion.div className="hero-visual" initial={reduced ? false : { opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}>
          <div className="hero-visual-wrapper">
            <TiltedCard
              imageSrc={heroImg}
              altText="Bamel Enerji Tekstil Üretimi"
              captionText="Kaliteli Kumaş İşçiliği"
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.03}
              showTooltip={true}
              showMobileWarning={false}
              displayOverlayContent={true}
              overlayContent={
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(10,10,15,0.75)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--white)', border: '1px solid var(--line)', backdropFilter: 'blur(10px)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--copper)' }}>Uzman İşçilik</span>
                    <strong style={{ display: 'block', fontSize: '1rem', marginTop: '0.2rem' }}>Yüksek Standartlar</strong>
                  </div>
                </div>
              }
            />
          </div>
        </motion.div>
      </div>
    </section>

    <section className="trust-marquee" aria-label="Bamel Enerji yaklaşımı"><div className="trust-row"><span><CircleCheck/> B2B üretim</span><span><CircleCheck/> Entegre süreç</span><span><CircleCheck/> Kontrollü kalite</span><span><CircleCheck/> Açık iletişim</span><span><CircleCheck/> Numune odaklı yaklaşım</span><span aria-hidden="true"><CircleCheck/> B2B üretim</span><span aria-hidden="true"><CircleCheck/> Entegre süreç</span><span aria-hidden="true"><CircleCheck/> Kontrollü kalite</span><span aria-hidden="true"><CircleCheck/> Açık iletişim</span><span aria-hidden="true"><CircleCheck/> Numune odaklı yaklaşım</span></div></section>

    <MotionSection className="section stats-section">
      <div className="container">
        <Eyebrow><DecryptedText text="Bamel Enerji" animateOn="view" speed={60} /></Eyebrow>
        <h2>Rakamlarla <em>Üretim Gücümüz</em></h2>
        <div className="stats-grid">
          <div className="stat-item"><span className="stat-value"><Counter value={15} fontSize={56} gradientFrom="var(--ink)" gradientTo="transparent" textColor="var(--copper)" fontWeight={700} />+</span><span className="stat-label">Yıllık Deneyim</span></div>
          <div className="stat-item"><span className="stat-value"><Counter value={6} fontSize={56} gradientFrom="var(--ink)" gradientTo="transparent" textColor="var(--copper)" fontWeight={700} /></span><span className="stat-label">Üretim Hizmeti</span></div>
          <div className="stat-item"><span className="stat-value"><Counter value={500} fontSize={56} places={[100,10,1]} gradientFrom="var(--ink)" gradientTo="transparent" textColor="var(--copper)" fontWeight={700} />+</span><span className="stat-label">B2B Müşteri</span></div>
          <div className="stat-item"><span className="stat-value"><Counter value={100} fontSize={56} places={[100,10,1]} gradientFrom="var(--ink)" gradientTo="transparent" textColor="var(--copper)" fontWeight={700} />K+</span><span className="stat-label">Aylık Üretim Kapasitesi</span></div>
        </div>
      </div>
    </MotionSection>

    <MotionSection className="section intro-section"><div className="container intro-layout"><div><Eyebrow><DecryptedText text="Üretime yaklaşım" animateOn="view" speed={60} /></Eyebrow><h2>Farklı aşamalar, <em>tek bir net akış.</em></h2><p className="lead">Bamel Enerji; üretim talebinizi ürün, adet, kumaş, işlem ve hedef tarih gibi kararlarla birlikte değerlendirir. Teknik gereksinimler netleştikçe, doğru üretim adımı da görünür hâle gelir.</p><Button to="/uretim-ve-kalite" secondary>Kalite yaklaşımını görün</Button></div><aside className="signal-card"><span className="signal-dot"/><small>ÜRETİM SİNYALİ</small><strong>Talep → teknik değerlendirme → planlama</strong><p>Kesin olmayan noktaları da paylaşabilirsiniz. Doğru sorularla kapsamı birlikte oluştururuz.</p></aside></div></MotionSection>

    <MotionSection className="section services-section"><div className="container"><Eyebrow><DecryptedText text="Hizmetler" animateOn="view" speed={60} /></Eyebrow><div className="section-heading"><h2>İhtiyacınıza uygun üretim adımını <em>birlikte planlayalım.</em></h2><p>Her süreç, ürünün ve iş akışının kendi gereksinimlerine göre ele alınır.</p></div><div className="services-grid">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index}/>)}</div></div></MotionSection>

    <MotionSection className="section process-section"><div className="container"><div className="process-top"><div><Eyebrow light><DecryptedText text="Üretim ritmi" animateOn="view" speed={60} /></Eyebrow><h2>Talebiniz, görünür adımlarla ilerler.</h2></div><p>Her projeye aynı kalıp uygulanmaz. Bilgiyi doğru zamanda toplar, süreci buna göre kurarız.</p></div><div className="process-line">{processSteps.map(([number,title,text])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></MotionSection>

    <MotionSection className="section quality-feature"><div className="container quality-layout"><div className="quality-image-wrap"><img src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=85" alt="Kumaş dokusunun yakından görünümü" loading="lazy"/><div className="image-label">KUMAŞ · RENK · İŞÇİLİK</div></div><div><Eyebrow><DecryptedText text="Üretim ve kalite" animateOn="view" speed={60} /></Eyebrow><h2>Kontrol, işin sonunda değil, <em>her aşamasında.</em></h2><p className="lead">Kumaş, renk, ölçü, dikiş, nakış, parti görünümü ve paketleme; hizmetin kapsamına göre izlenen kontrol noktalarıdır.</p><ul className="check-list"><li><Check/> Kumaş ve görünür uygunluk kontrolü</li><li><Check/> Renk ve parti yaklaşımı</li><li><Check/> Dikiş, nakış ve ölçü kontrolleri</li><li><Check/> Son ürün ve paketleme kontrolü</li></ul><Button to="/uretim-ve-kalite" secondary>Kalite yaklaşımını inceleyin</Button></div></div></MotionSection>

    <MotionSection className="section faq-section"><div className="container faq-layout"><div><Eyebrow><DecryptedText text="Net başlangıç" animateOn="view" speed={60} /></Eyebrow><h2>İlk görüşmeden önce <em>merak edilenler.</em></h2><p className="lead">Talebiniz netleştikçe, doğru planlama için gereken bilgiler de görünür hâle gelir.</p></div><div className="faq-list">{faqs.map(([question,answer])=><Faq key={question} question={question} answer={answer}/>)}</div></div></MotionSection>

    <CtaBand/>
  </main>
}
