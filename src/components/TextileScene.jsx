import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

let threeLock = Promise.resolve()

export default function TextileScene({ className = '' }) {
  const rootRef = useRef(null)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const compactViewport = window.matchMedia('(max-width: 767px)').matches
    if (!root || reduced || compactViewport) {
      setReady(false)
      return undefined
    }

    let effect
    let cancelled = false
    let threeAssigned = false
    let hasOriginalThree = false
    let originalThree = undefined
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const restoreThree = () => {
      if (threeAssigned) {
        if (hasOriginalThree) {
          window.THREE = originalThree
        } else {
          delete window.THREE
        }
        threeAssigned = false
      }
    }

    const loadScene = async () => {
      let releaseLock
      const nextLock = new Promise(resolve => { releaseLock = resolve })
      const previousLock = threeLock
      threeLock = nextLock

      try {
        await previousLock
        if (cancelled) return

        const THREE = await import('three')
        if (cancelled) return

        hasOriginalThree = Object.prototype.hasOwnProperty.call(window, 'THREE')
        originalThree = window.THREE
        window.THREE = THREE
        threeAssigned = true

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
        if (!cancelled) setReady(true)
      } catch {
        if (!cancelled) setReady(false)
      } finally {
        restoreThree()
        releaseLock()
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
