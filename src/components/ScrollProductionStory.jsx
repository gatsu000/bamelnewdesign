import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDownRight } from 'lucide-react'
import { Eyebrow } from './shared'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProductionStory({ steps }) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return undefined

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 1024px)', () => {
        const cards = gsap.utils.toArray('.story-card', root)
        const stage = root.querySelector('.story-stage')
        const progress = root.querySelector('.story-progress span')
        gsap.set(cards.slice(1), { yPercent: 112, scale: .9, opacity: 0 })

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: `+=${Math.max(2100, cards.length * 620)}`,
            pin: stage,
            pinSpacing: true,
            scrub: .8,
            invalidateOnRefresh: true,
            onUpdate: self => gsap.set(progress, { scaleX: self.progress })
          }
        })

        cards.slice(1).forEach((card, index) => {
          const previous = cards[index]
          const position = index + .7
          timeline
            .to(previous, { yPercent: -18, scale: .92, opacity: .28, duration: .65 }, position)
            .to(card, { yPercent: 0, scale: 1, opacity: 1, duration: .75 }, position)
        })
      })
    }, root)

    return () => {
      media.revert()
      context.revert()
    }
  }, [reduced, steps.length])

  return (
    <section ref={rootRef} className="scroll-story" aria-labelledby="story-title">
      <div className="story-stage">
        <div className="container story-layout">
          <div className="story-intro">
            <Eyebrow light>Üretim koreografisi</Eyebrow>
            <h2 id="story-title">Bir fikir, <em>kontrollü bir akışa</em> dönüşür.</h2>
            <p>Kaydırdıkça üretim planının katmanlarını görün. Her adım, bir sonrakinin doğru kurulmasını sağlar.</p>
            <div className="story-scroll-cue" aria-hidden="true"><ArrowDownRight /> Kaydırarak keşfedin</div>
            <div className="story-progress" aria-hidden="true"><span /></div>
          </div>
          <div className="story-card-stack">
            {steps.map(([number, title, text], index) => (
              <article className="story-card" key={number} style={{ '--story-index': index }}>
                <div className="story-card-top"><span>{number}</span><small>0{steps.length}</small></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <strong aria-hidden="true">{title.split(' ')[0]}</strong>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
