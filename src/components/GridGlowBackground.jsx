import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const defaultGlowColors = ['rgba(214,180,122,.18)', 'rgba(118,207,150,.08)', 'rgba(243,227,198,.11)']

// Adapted from the 21st.dev GridGlowBackground pattern for Bamel's textile-grid language.
export default function GridGlowBackground({
  className = '',
  gridColor = 'rgba(246,242,233,.055)',
  gridSize = 64,
  glowColors = defaultGlowColors,
  glowCount = 6
}) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!root || !canvas || !context) return undefined

    let width = 0
    let height = 0
    let frameId = 0
    let visible = true
    let pageVisible = !document.hidden
    let glows = []

    const makeGlow = index => {
      const column = index % Math.max(1, Math.floor(width / gridSize))
      const row = Math.floor(index / Math.max(1, Math.floor(width / gridSize)))
      return {
        x: column * gridSize,
        y: row * gridSize,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        radius: Math.min(width, height) * (.12 + Math.random() * .12),
        speed: .0025 + Math.random() * .0035,
        color: glowColors[index % glowColors.length],
        alpha: 0
      }
    }

    const setTarget = glow => {
      glow.targetX = Math.round((Math.random() * width) / gridSize) * gridSize
      glow.targetY = Math.round((Math.random() * height) / gridSize) * gridSize
    }

    const drawGrid = () => {
      context.strokeStyle = gridColor
      context.lineWidth = 1
      context.beginPath()
      for (let x = .5; x < width; x += gridSize) {
        context.moveTo(x, 0)
        context.lineTo(x, height)
      }
      for (let y = .5; y < height; y += gridSize) {
        context.moveTo(0, y)
        context.lineTo(width, y)
      }
      context.stroke()
    }

    const drawGlow = glow => {
      const gradient = context.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius)
      gradient.addColorStop(0, glow.color)
      gradient.addColorStop(.35, glow.color)
      gradient.addColorStop(1, 'transparent')
      context.globalAlpha = glow.alpha
      context.fillStyle = gradient
      context.beginPath()
      context.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2)
      context.fill()
      context.globalAlpha = 1
    }

    const draw = animate => {
      context.clearRect(0, 0, width, height)
      drawGrid()
      glows.forEach(glow => {
        if (animate) {
          glow.x += (glow.targetX - glow.x) * glow.speed
          glow.y += (glow.targetY - glow.y) * glow.speed
          glow.alpha = Math.min(.9, glow.alpha + .008)
          if (Math.abs(glow.targetX - glow.x) < 2 && Math.abs(glow.targetY - glow.y) < 2) setTarget(glow)
        } else {
          glow.alpha = .55
        }
        drawGlow(glow)
      })
    }

    const animate = () => {
      if (!visible || !pageVisible || reduced) return
      draw(true)
      frameId = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      const rect = root.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      glows = Array.from({ length: glowCount }, (_, index) => makeGlow(index))
      draw(!reduced)
    }

    const restart = () => {
      window.cancelAnimationFrame(frameId)
      if (visible && pageVisible && !reduced) frameId = window.requestAnimationFrame(animate)
      else draw(false)
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      restart()
    }, { rootMargin: '120px' })
    const handleVisibility = () => {
      pageVisible = !document.hidden
      restart()
    }

    resizeObserver.observe(root)
    visibilityObserver.observe(root)
    document.addEventListener('visibilitychange', handleVisibility)
    resize()
    restart()

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [glowColors, glowCount, gridColor, gridSize, reduced])

  return <div ref={rootRef} className={`grid-glow-background ${className}`} aria-hidden="true"><canvas ref={canvasRef} /></div>
}
