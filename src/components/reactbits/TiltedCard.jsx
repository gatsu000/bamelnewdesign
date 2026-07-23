import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const spring = { damping: 24, stiffness: 190, mass: .7 }

export default function TiltedCard({
  imageSrc,
  altText,
  className = '',
  rotateAmplitude = 7,
  scaleOnHover = 1.018,
  overlayContent,
  fetchPriority = 'auto',
  loading = 'lazy'
}) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()
  const rotateX = useSpring(useMotionValue(0), spring)
  const rotateY = useSpring(useMotionValue(0), spring)
  const scale = useSpring(1, spring)

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  const handlePointerMove = event => {
    const root = rootRef.current
    if (!root || reduced || event.pointerType === 'touch') return
    const rect = root.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    rotateX.set(y * rotateAmplitude * -2)
    rotateY.set(x * rotateAmplitude * 2)
    scale.set(scaleOnHover)
    root.style.setProperty('--tilt-x', `${event.clientX - rect.left}px`)
    root.style.setProperty('--tilt-y', `${event.clientY - rect.top}px`)
  }

  return (
    <figure ref={rootRef} className={`tilted-card ${className}`} onPointerMove={handlePointerMove} onPointerLeave={reset}>
      <motion.div className="tilted-card-inner" style={reduced ? undefined : { rotateX, rotateY, scale }}>
        <img className="tilted-card-image" src={imageSrc} alt={altText} fetchPriority={fetchPriority} loading={loading} />
        <div className="tilted-card-shine" aria-hidden="true" />
        {overlayContent && <div className="tilted-card-overlay">{overlayContent}</div>}
      </motion.div>
    </figure>
  )
}
