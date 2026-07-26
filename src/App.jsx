import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { services } from './data'
import { NotFound } from './components/shared'
import Home from './pages/Home'
import logo from './assets/bamel-logo-mark.png'

const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Quality = lazy(() => import('./pages/Quality'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Quote = lazy(() => import('./pages/Quote'))

const navigation = [
  ['/', 'Ana Sayfa'],
  ['/hizmetler', 'Hizmetler'],
  ['/uretim-ve-kalite', 'Üretim ve Kalite'],
  ['/galeri', 'Galeri'],
  ['/iletisim', 'İletişim']
]

const PageFallback = () => <div style={{ minHeight: '60vh' }} aria-busy="true" />

function App() {
  const location = useLocation()
  const showMobileActions = location.pathname !== '/teklif-al'
  return (
    <>
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <Header />
      <PageTransition>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<><Helmet><title>Bamel Enerji | B2B Tekstil Üretim Ortağı</title><meta name="description" content="Gömlek üretimi, nakış ve tekstil hizmetleri için Diyarbakır merkezli üretim ortağı."/></Helmet><Home /></>} />
            <Route path="/hizmetler" element={<><Helmet><title>Hizmetler | Bamel Enerji</title><meta name="description" content="Üretim ihtiyaçlarınıza uygun gömlek üretimi, nakış, boyama ve yıkama hizmetleri."/></Helmet><Services /></>} />
            <Route path="/hizmetler/:slug" element={<><Helmet><title>Hizmet Detayı | Bamel Enerji</title></Helmet><ServiceDetail /></>} />
            <Route path="/uretim-ve-kalite" element={<><Helmet><title>Üretim ve Kalite | Bamel Enerji</title><meta name="description" content="Bamel Enerji üretim standartları ve kalite kontrol süreçleri."/></Helmet><Quality /></>} />
            <Route path="/galeri" element={<><Helmet><title>Galeri | Bamel Enerji</title><meta name="description" content="Bamel Enerji üretim tesisinden ve projelerden görseller."/></Helmet><Gallery /></>} />
            <Route path="/iletisim" element={<><Helmet><title>İletişim | Bamel Enerji</title><meta name="description" content="Üretim talepleriniz ve sorularınız için bize ulaşın."/></Helmet><Contact /></>} />
            <Route path="/teklif-al" element={<><Helmet><title>Teklif Al | Bamel Enerji</title><meta name="description" content="Üretim talebinizi ürün, adet ve teknik ayrıntılarla iletin."/></Helmet><Quote /></>} />
            <Route path="*" element={<><Helmet><title>Sayfa Bulunamadı | Bamel Enerji</title></Helmet><NotFound /></>} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Footer />
      {showMobileActions && <div className="mobile-actions" aria-label="Hızlı işlemler"><Link className="button button-secondary" to="/iletisim">İletişim</Link><Link className="button button-primary" to="/teklif-al">Teklif Al</Link></div>}
    </>
  )
}

function PageTransition({ children }) {
  const location = useLocation()
  const reduced = useReducedMotion()

  // Instant scroll on route change — positional form ignores CSS scroll-behavior.
  useEffect(() => {
    window.scrollTo(0, 0)
    const frame = window.requestAnimationFrame(() => document.querySelector('#main-content')?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{ position: 'relative' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const navRef = useRef(null)
  const location = useLocation()
  const reduced = useReducedMotion()
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        window.requestAnimationFrame(() => toggleRef.current?.focus())
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])
  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => navRef.current?.querySelector('a')?.focus())
      return () => window.cancelAnimationFrame(frame)
    }
    return undefined
  }, [open])
  const closeMenu = () => { setOpen(false); toggleRef.current?.focus() }

  return <>
    <header className="header">
      <div className="container nav">
        <Link className="brand" to="/" aria-label="Bamel Enerji ana sayfa">
          <span className="brand-mark"><img src={logo} alt="" width={40} height={40} /></span>
          <strong>BAMEL ENERJİ</strong>
        </Link>
        <nav className="desktop-nav" aria-label="Ana menü">
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
          ))}
        </nav>
        <div className="header-right">
          <Link className="text-link desktop-quote" to="/teklif-al">Teklif Al <ArrowRight size={14}/></Link>
          <button ref={toggleRef} className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}>{open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {open && (
        <motion.div ref={navRef} id="mobile-navigation" className="mobile-nav" role="dialog" aria-label="Mobil menü" initial={reduced ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={reduced ? undefined : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}>
          <nav aria-label="Ana menü">
            {navigation.map(([to, label], i) => (
              <motion.div key={to} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : i * 0.035 + 0.04 }}>
                <NavLink to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
              </motion.div>
            ))}
            <motion.div initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.2 }} className="mobile-nav-cta">
              <Link className="button button-primary" to="/teklif-al" onClick={() => setOpen(false)}>Üretim Talebinizi İletin <ArrowRight size={14}/></Link>
            </motion.div>
          </nav>
          <button className="mobile-nav-close" type="button" onClick={closeMenu}>Menüyü kapat</button>
        </motion.div>
      )}
    </AnimatePresence>
  </>
}

function Footer() { return <footer className="footer-next"><div className="container footer-layout"><div><Link className="brand inverse" to="/"><span className="brand-mark"><img src={logo} alt="" width={40} height={40} /></span><strong>BAMEL ENERJİ</strong></Link><p>Tekstil üretimi ve tamamlayıcı işlemlerde B2B müşteriler için planlı, anlaşılır ve kontrollü süreç yaklaşımı.</p></div><div><small>HIZLI BAĞLANTILAR</small>{navigation.slice(1).map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div><div><small>HİZMETLER</small>{services.slice(0,4).map(service=><Link key={service.slug} to={`/hizmetler/${service.slug}`}>{service.title}</Link>)}</div><div><small>İLETİŞİM</small><a href="mailto:info@bamelenerji.com" className="footer-contact">info@bamelenerji.com</a><small className="footer-note">Diyarbakır, Türkiye</small></div></div><div className="container footer-bottom">© {new Date().getFullYear()} Bamel Enerji <span>Kurumsal web deneyimi</span></div></footer> }

export default App
