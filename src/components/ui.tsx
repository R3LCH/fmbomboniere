import { useEffect, useRef, type ReactNode } from 'react'
import { asset, type Photo } from '../data.ts'
import { useI18n } from '../i18n.tsx'

export const LOGO = asset('logo-320.webp')
export const LOGO_LARGE = asset('logo.webp')

/** IT/EN pill toggle; shared by the site header and the admin panel. */
export function LangToggle({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={`flex items-center ${className}`} role="group" aria-label={t('lang.label')}>
      {(['it', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`nav-text flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full uppercase transition-colors duration-200 ${
            lang === l ? (dark ? 'bg-white text-ink' : 'bg-ink text-white') : dark ? 'text-white/80 hover:text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

/** Heading whose lines are revealed by `sectionReveals` ([data-split]); static spans, no split library. */
export function SplitHeading({ lines, className = '', as: Tag = 'h2', id }: { lines: ReactNode[]; className?: string; as?: 'h1' | 'h2'; id?: string }) {
  return (
    <Tag id={id} className={className} data-split>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Responsive photo: 640px thumb + full-size source, explicit dimensions, lazy by default. */
export function Img({ photo, alt, sizes, eager = false, className = '' }: { photo: Photo; alt: string; sizes: string; eager?: boolean; className?: string }) {
  return (
    <img
      src={photo.thumb}
      srcSet={`${photo.thumb} 640w, ${photo.src} ${photo.w}w`}
      sizes={sizes}
      width={photo.w}
      height={photo.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
}

export function Star({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  )
}

export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <Star />
    </div>
  )
}

const SPARKS = [
  { x: 4, y: 10, s: 14, d: 4.2, delay: 0 },
  { x: 88, y: 4, s: 10, d: 5.1, delay: 1.3 },
  { x: -6, y: 46, s: 8, d: 3.8, delay: 2.1 },
  { x: 96, y: 38, s: 12, d: 4.6, delay: 0.7 },
  { x: 20, y: -4, s: 8, d: 5.6, delay: 1.8 },
  { x: 72, y: -6, s: 7, d: 3.4, delay: 2.6 },
]

/** Rose-gold four-point stars around the arch; paused while offscreen, hidden under reduced motion (CSS). */
export function Sparkles() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('sparkles-on', e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {SPARKS.map((p, i) => (
        <span
          key={i}
          className="sparkle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, ['--d' as string]: `${p.d}s`, ['--delay' as string]: `${p.delay}s` }}
        >
          <Star className="block size-full" />
        </span>
      ))}
    </div>
  )
}

export type IconName = 'phone' | 'whatsapp' | 'mail' | 'pin' | 'instagram' | 'facebook' | 'arrow' | 'close' | 'prev' | 'next' | 'up'

/** Line icons, 1.5px stroke, one consistent set. */
export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24', 'aria-hidden': true }
  switch (name) {
    case 'phone':
      return <svg {...common}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
    case 'whatsapp':
      return <svg {...common}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5" /></svg>
    case 'mail':
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
    case 'pin':
      return <svg {...common}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21" /><circle cx="12" cy="9.5" r="2.5" /></svg>
    case 'instagram':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
    case 'facebook':
      return <svg {...common}><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" /></svg>
    case 'arrow':
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    case 'close':
      return <svg {...common}><path d="M6 6l12 12M18 6 6 18" /></svg>
    case 'prev':
      return <svg {...common}><path d="M15 5l-7 7 7 7" /></svg>
    case 'next':
      return <svg {...common}><path d="M9 5l7 7-7 7" /></svg>
    case 'up':
      return <svg {...common}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
  }
}
