import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function TextileScene({ className = '' }) {
  const rootRef = useRef(null)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const compactViewport = window.matchMedia('(max-width: 767px)').matches
    if (!root || reduced || compactViewport) return undefined

    let effect
    let cancelled = false
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const loadScene = async () => {
      try {
        const THREE = await import('three')
        window.THREE = THREE
        const { default: WAVES } = await import('vanta/dist/vanta.waves.min')
        if (cancelled || !root) return
        effect = WAVES({
          el: root,
          THREE,
          mouseControls: finePointer,
          touchControls: false,
          gyroControls: false,
          minHeight: 320,
          minWidth: 320,
          scale: 1,
          scaleMobile: 1,
          color: 0x172019,
          backgroundColor: 0x070908,
          shininess: 34,
          waveHeight: 17,
          waveSpeed: 0.52,
          zoom: 0.86
        })
        setReady(true)
      } catch {
        setReady(false)
      }
    }

    const timer = window.setTimeout(loadScene, 120)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      effect?.destroy()
    }
  }, [reduced])

  return <div ref={rootRef} className={`textile-scene ${ready ? 'is-ready' : ''} ${className}`} aria-hidden="true" />
}
