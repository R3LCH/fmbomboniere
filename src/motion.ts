import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger, Flip)

export { gsap, Flip, ScrollTrigger }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const EASE_SOFT = 'cubic-bezier(.16,1,.3,1)'

export const reducedMotion = () => !window.matchMedia(MOTION_OK).matches

let lenis: Lenis | null = null

/** Smooth wheel scrolling; touch stays native. Skipped under reduced motion. */
export function startLenis() {
  if (reducedMotion() || lenis) return
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

/** Scroll to a section id, honouring Lenis and the fixed header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = -(document.querySelector('header')?.getBoundingClientRect().height ?? 72) + 1
  if (lenis) lenis.scrollTo(el, { offset })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', '#' + id)
}

export function lockScroll(lock: boolean) {
  document.documentElement.classList.toggle('scroll-locked', lock)
  if (lenis) {
    if (lock) lenis.stop()
    else lenis.start()
  }
}

/**
 * One gsap.context per component, reverted on unmount. `setup` runs inside a
 * matchMedia branch for no-preference, so reduced motion gets no hidden states.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: (root: HTMLElement) => void) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.matchMedia().add(MOTION_OK, () => setup(root))
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/** Standard reveals inside a section: [data-reveal], [data-split] headings, [data-img] frames. */
export function sectionReveals(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((h) => {
    gsap.from(h.querySelectorAll('.line-mask > span'), {
      yPercent: 110,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: h, start: 'top 85%', once: true },
    })
  })
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 16, duration: 0.7, ease: EASE_SOFT, scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  })
  root.querySelectorAll<HTMLElement>('[data-img]').forEach((frame) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
    tl.fromTo(frame, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'expo.out', clearProps: 'clipPath' })
    const img = frame.querySelector('img')
    if (img) tl.from(img, { scale: 1.12, duration: 1, ease: 'expo.out', clearProps: 'transform' }, 0)
  })
}
