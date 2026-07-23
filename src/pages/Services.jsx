import { services } from '../data'
import { CtaBand, MotionSection, PageHero, ServiceCard } from '../components/shared'

export default function Services() {
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="Hizmetler" title={<>Tekstilde üretim ve işleme ihtiyaçlarınızı <em>birlikte değerlendirelim.</em></>} copy="Gömlek üretimi, nakış, kumaş boyama, yıkama, sıkma ve kurutma hizmetleri için talebinizi proje kapsamına göre ele alıyoruz."/><MotionSection className="section services-section"><div className="container"><h2 className="sr-only">Tekstil üretim hizmetleri</h2><div className="services-grid">{services.map((service,index)=><ServiceCard key={service.slug} service={service} index={index}/>)}</div></div></MotionSection><CtaBand/></main>
}
