import { services } from '../data'
import { CtaBand, MotionSection, PageHero, ServiceCard, BlurText } from '../components/shared'
import TrueFocus from '../components/reactbits/TrueFocus'

export default function Services() {
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Hizmetler" title={<><BlurText text="Tekstilde üretim ve işleme ihtiyaçlarınızı" animateBy="words" delay={100} /> <br/><em><TrueFocus sentence="birlikte değerlendirelim." manualMode={false} borderColor="var(--copper)" glowColor="var(--copper-glow)" blurAmount={3} animationDuration={1.2} /></em></>} copy="Gömlek üretimi, nakış, kumaş boyama, yıkama, sıkma ve kurutma hizmetleri için talebinizi proje kapsamına göre ele alıyoruz."/><MotionSection className="section services-section"><div className="container"><div className="services-grid">{services.map((service,index)=><ServiceCard key={service.slug} service={service} index={index}/>)}</div></div></MotionSection><CtaBand/></main>
}
