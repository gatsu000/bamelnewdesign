import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const compactViewport = window.matchMedia('(max-width: 767px)').matches
    if (reduced || !finePointer || compactViewport) return undefined

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -92 },
      stopInertiaOnNavigate: true
    })
    const updateScrollTrigger = () => ScrollTrigger.update()
    const tick = time => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.dataset.smoothScroll = 'true'
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      gsap.ticker.remove(tick)
      delete document.documentElement.dataset.smoothScroll
    }
  }, [reduced])

  return null
}
