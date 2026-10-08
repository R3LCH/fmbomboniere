import { useLayoutEffect, useRef, useState } from 'react'
import { label, photos, presentCollections, type Collection } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { Flip, gsap, reducedMotion, ScrollTrigger, sectionReveals, useMotion } from '../motion.ts'
import Lightbox from './Lightbox.tsx'
import { Img, SplitHeading } from './ui.tsx'

export type Filter = Collection | 'all'

export default function Gallery({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const grid = useRef<HTMLUListElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  useMotion(ref, sectionReveals)

  const shown = filter === 'all' ? photos : photos.filter((p) => p.collection === filter)

  const choose = (f: Filter) => {
    if (f === filter) return
    if (grid.current && !reducedMotion()) flipState.current = Flip.getState(grid.current.querySelectorAll('[data-tile]'))
    setFilter(f)
  }

  // Animate from the captured pre-filter layout once React has committed the new tiles.
  useLayoutEffect(() => {
    const state = flipState.current
    flipState.current = null
    if (!state || !grid.current) {
      ScrollTrigger.refresh()
      return
    }
    const tl = Flip.from(state, {
      targets: grid.current.querySelectorAll('[data-tile]'),
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.inOut' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }),
      onComplete: () => ScrollTrigger.refresh(),
    })
    return () => {
      tl.kill()
    }
  }, [filter])

  const chips: Filter[] = ['all', ...presentCollections]

  return (
    <section ref={ref} id="galleria" aria-labelledby="gal-title" className="section bg-white">
      <div className="wrap">
        <p className="eyebrow m-0 mb-5" data-reveal>{t('gal.eyebrow')}</p>
        <SplitHeading id="gal-title" className="h2 mb-10" lines={[t('gal.title')]} />
        <div role="group" aria-label={t('gal.filters')} className="mb-10 flex flex-wrap gap-2" data-reveal>
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              aria-controls="gallery-grid"
              onClick={() => choose(c)}
              className={`nav-text min-h-11 cursor-pointer rounded-full border px-5 transition-colors duration-200 ${
                filter === c ? 'border-action bg-action text-white' : 'border-line bg-white text-ink hover:border-action hover:text-action'
              }`}
            >
              {c === 'all' ? t('gal.all') : label(c, lang)}
            </button>
          ))}
        </div>
        <ul id="gallery-grid" ref={grid} className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {shown.map((p, i) => {
            const alt = lang === 'it' ? p.alt_it : p.alt_en
            return (
              <li key={p.slug} data-tile data-flip-id={p.slug}>
                <button
                  type="button"
                  data-slug={p.slug}
                  onClick={() => setOpen(i)}
                  aria-label={t('gal.open', { a: alt })}
                  className="zoom block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-ivory"
                >
                  <Img photo={p} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="size-full object-cover" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <Lightbox items={shown} index={open} setIndex={setOpen} />
    </section>
  )
}
