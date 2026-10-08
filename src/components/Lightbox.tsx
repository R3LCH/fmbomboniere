import { useEffect, useLayoutEffect, useRef } from 'react'
import { label, type Photo } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { gsap, lockScroll, reducedMotion } from '../motion.ts'
import { Icon } from './ui.tsx'

type Props = { items: Photo[]; index: number | null; setIndex: (i: number | null) => void }

/** Native modal <dialog>: inert background, Esc, ←/→, swipe, counter; focus returns to the tile. */
export default function Lightbox({ items, index, setIndex }: Props) {
  const { t, lang } = useI18n()
  const dlg = useRef<HTMLDialogElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const slug = useRef<string | null>(null)
  const closing = useRef(false)
  const touch = useRef<number | null>(null)
  const prevIndex = useRef<number | null>(null)
  const dirRef = useRef<1 | -1>(1)
  const photo = index === null ? null : items[index]
  const tile = (s: string | null) => (s ? document.querySelector<HTMLElement>(`[data-slug="${s}"]`) : null)

  const close = () => {
    const d = dlg.current
    if (!d || closing.current) return
    closing.current = true
    const done = () => {
      d.close()
      lockScroll(false)
      closing.current = false
      tile(slug.current)?.focus()
      setIndex(null)
    }
    if (reducedMotion()) return done()
    gsap.to(backdrop.current, { opacity: 0, duration: 0.4 })
    gsap.to(img.current, { opacity: 0, scale: 0.96, duration: 0.4, ease: 'power3.inOut', onComplete: done })
  }

  const step = (dir: 1 | -1) => {
    if (index === null || closing.current) return
    dirRef.current = dir
    setIndex((index + dir + items.length) % items.length)
  }

  // Open: show modal, then grow the image from the tile rect.
  useLayoutEffect(() => {
    const d = dlg.current
    if (!d || index === null) return
    const opening = prevIndex.current === null
    const dir = dirRef.current
    prevIndex.current = index
    slug.current = items[index].slug
    if (opening) {
      d.showModal()
      lockScroll(true)
      if (reducedMotion()) {
        gsap.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.15, clearProps: 'opacity' })
        return
      }
      gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      const from = tile(slug.current)?.getBoundingClientRect()
      const el = img.current
      if (from && el) {
        // Flip-style: start the image at the tile's rect, then settle into its layout box.
        const to = el.getBoundingClientRect()
        gsap.from(el, {
          x: from.left + from.width / 2 - (to.left + to.width / 2),
          y: from.top + from.height / 2 - (to.top + to.height / 2),
          scale: Math.max(from.width / to.width, from.height / to.height),
          duration: 0.55,
          ease: 'power3.inOut',
          clearProps: 'transform',
        })
      }
      return
    }
    if (!reducedMotion()) gsap.fromTo(img.current, { opacity: 0, x: 24 * dir }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' })
  }, [index, items])

  useEffect(() => {
    if (index === null) prevIndex.current = null
  }, [index])

  if (!photo || index === null) return <dialog ref={dlg} className="lightbox" aria-label={t('lb.label')} />

  const alt = lang === 'it' ? photo.alt_it : photo.alt_en
  const btn = 'flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink transition-colors duration-200 hover:bg-white'

  return (
    <dialog
      ref={dlg}
      className="lightbox"
      aria-label={t('lb.label')}
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        touch.current = null
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
      }}
    >
      <div ref={backdrop} className="absolute inset-0 bg-ink/85" onClick={close} aria-hidden="true" />
      <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-4 px-4 py-20 sm:px-20">
        <img
          ref={img}
          key={photo.slug}
          src={photo.src}
          alt={alt}
          width={photo.w}
          height={photo.h}
          className="pointer-events-auto max-h-full w-auto max-w-full rounded-[6px] bg-white object-contain"
        />
        <p className="pointer-events-auto m-0 max-w-[60ch] text-center text-[15px] leading-6 text-white" aria-live="polite">
          <span className="sr-only">{`${index + 1} / ${items.length}. `}</span>
          {alt}
          <span className="mt-1 block text-[12px] tracking-[0.18em] uppercase text-white/80">{label(photo.collection, lang)}</span>
        </p>
      </div>
      <p className="nav-text absolute top-5 left-5 m-0 text-white" aria-hidden="true">{`${index + 1} / ${items.length}`}</p>
      <button type="button" autoFocus onClick={close} aria-label={t('lb.close')} className={`${btn} absolute top-4 right-4`}>
        <Icon name="close" />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" onClick={() => step(-1)} aria-label={t('lb.prev')} className={`${btn} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}>
            <Icon name="prev" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={t('lb.next')} className={`${btn} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}>
            <Icon name="next" />
          </button>
        </>
      )}
    </dialog>
  )
}
