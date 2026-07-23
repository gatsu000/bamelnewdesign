import { useParams } from 'react-router-dom'
import { services } from '../data'
import { Button, CtaBand, Eyebrow, MotionSection, NotFound, PageHero, SpotlightCard } from '../components/shared'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find(item => item.slug === slug)
  if (!service) return <NotFound/>
  const Icon = service.icon
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow={`Hizmetler / ${service.title}`} title={service.title} copy={service.summary}/><MotionSection className="section"><div className="container service-detail-layout"><div><img className="detail-image" src={service.image} alt={`${service.title} için temsili tekstil üretim görseli`}/><Eyebrow>Hizmet kapsamı</Eyebrow><h2>Teknik ayrıntıları, <em>doğru sırayla</em> ele alıyoruz.</h2><p className="lead">Bu hizmette ilk amaç, ürünün ve sürecin net çerçevesini kurmaktır. Malzeme bilgisi, işlem sırası ve hedef beklenti birlikte değerlendirilir.</p><p>Kesin fiyat, termin veya sonuç; ürün, adet, malzeme ve mevcut üretim akışı görülmeden verilmez. Böylece varsayımlar yerine uygulanabilir bir çalışma zemini kurulur.</p></div><SpotlightCard className="service-steps" style={{ height: 'max-content' }}><div className="service-icon large"><Icon/></div><small>ÜRETİM ADIMLARI</small>{service.steps.map((step,index)=><div className="mini-step" key={step}><span>0{index+1}</span><p>{step}</p></div>)}<Button to="/teklif-al">Talebinizi iletin</Button></SpotlightCard></div></MotionSection><CtaBand/></main>
}
