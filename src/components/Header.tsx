import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useI18n, type Key } from '../i18n.tsx'
import { gsap, lockScroll, reducedMotion, scrollToId } from '../motion.ts'
import { LangToggle, LOGO } from './ui.tsx'

export const NAV: { id: string; key: Key }[] = [
  { id: 'chi-siamo', key: 'nav.about' },
  { id: 'collezioni', key: 'nav.collections' },
  { id: 'galleria', key: 'nav.gallery' },
  { id: 'contatti', key: 'nav.contact' },
]

export default function Header() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const overlay = useRef<HTMLDivElement>(null)
  const toggleBtn = useRef<HTMLButtonElement>(null)
  const first = useRef(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = overlay.current
    if (!el) return
    if (first.current) {
      first.current = false
      return
    }
    lockScroll(open)
    const d = reducedMotion() ? 0 : 1
    const items = el.querySelectorAll('[data-menu-item]')
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(el, { visibility: 'visible' })
        if (d) {
          gsap.fromTo(el, { clipPath: 'circle(0% at calc(100% - 2.75rem) 2rem)' }, { clipPath: 'circle(150% at calc(100% - 2.75rem) 2rem)', duration: 0.6, ease: 'expo.inOut' })
          gsap.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.2, ease: 'expo.out' })
        } else gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 })
      } else if (d) {
        gsap.to(el, { clipPath: 'circle(0% at calc(100% - 2.75rem) 2rem)', duration: 0.5, ease: 'expo.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) })
      } else gsap.set(el, { visibility: 'hidden' })
    })
    if (open) {
      el.querySelector<HTMLElement>('a')?.focus()
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false)
          toggleBtn.current?.focus()
        }
        if (e.key === 'Tab') {
          // Focus trap across the toggle button and overlay controls.
          const f = [toggleBtn.current!, ...el.querySelectorAll<HTMLElement>('a,button')]
          const i = f.indexOf(document.activeElement as HTMLElement)
          const next = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : i === f.length - 1 ? 0 : i + 1
          e.preventDefault()
          f[next].focus()
        }
      }
      window.addEventListener('keydown', onKey)
      return () => {
        window.removeEventListener('keydown', onKey)
        ctx.kill()
      }
    }
    return () => ctx.kill()
  }, [open])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    if (open) {
      setOpen(false)
      toggleBtn.current?.focus()
      setTimeout(() => scrollToId(id), reducedMotion() ? 0 : 500)
    } else scrollToId(id)
  }

  const solid = scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        solid ? 'glass border-line' : 'border-transparent'
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <a href="#top" onClick={go('top')} className="relative z-10 flex min-h-11 items-center gap-3 rounded-full" aria-label={t('nav.home')}>
          <img
            src={LOGO}
            alt=""
            width={320}
            height={320}
            className={`rounded-full transition-[width,height] duration-300 ${scrolled ? 'size-11' : 'size-11 lg:size-[52px]'}`}
          />
          <span className="font-serif text-[1.375rem] leading-none font-medium tracking-wide">FM Bomboniere</span>
        </a>

        <nav aria-label={t('nav.label')} className="hidden items-center gap-8 lg:flex">
          <ul className="m-0 flex list-none items-center gap-8 p-0">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} className="nav-text flex min-h-11 items-center text-ink transition-colors duration-200 hover:text-action">
                  {t(n.key)}
                </a>
              </li>
            ))}
          </ul>
          <span className="h-5 w-px bg-line" aria-hidden="true" />
          <LangToggle />
        </nav>

        <button
          ref={toggleBtn}
          type="button"
          className="relative z-10 flex size-11 items-center justify-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('nav.close') : t('nav.menu')}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-6" aria-hidden="true">
            <span className={`absolute left-0 block h-[1.5px] w-full bg-ink transition-transform duration-300 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 block h-[1.5px] w-full bg-ink transition-transform duration-300 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
          </span>
        </button>
      </div>

      <div
        ref={overlay}
        id="mobile-menu"
        className="invisible fixed inset-0 flex flex-col items-center justify-center gap-10 bg-ivory lg:hidden"
        inert={!open}
      >
        <nav aria-label={t('nav.label')}>
          <ul className="m-0 flex list-none flex-col items-center gap-5 p-0">
            {NAV.map((n) => (
              <li key={n.id} data-menu-item>
                <a href={`#${n.id}`} onClick={go(n.id)} className="h3 block px-4 py-1 text-[2.25rem]">
                  {t(n.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-item>
          <LangToggle />
        </div>
      </div>
    </header>
  )
}
