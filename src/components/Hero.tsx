import { useLayoutEffect, useRef, type MouseEvent } from 'react'
import { heroPhotos } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { EASE_SOFT, gsap, MOTION_OK, scrollToId } from '../motion.ts'
import { Img, Sparkles, SplitHeading } from './ui.tsx'

export default function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const [main, a, b] = heroPhotos

  // Entrance waits for the intro curtain; parallax is desktop-only scrub.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !ready) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.line-mask > span', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08 })
        gsap.from('[data-reveal]', { opacity: 0, y: 16, duration: 0.7, ease: EASE_SOFT, stagger: 0.08, delay: 0.3 })
        root.querySelectorAll<HTMLElement>('[data-img]').forEach((f, i) => {
          gsap.fromTo(f, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'expo.out', delay: 0.15 + i * 0.12, clearProps: 'clipPath' })
          gsap.from(f.querySelector('img'), { scale: 1.12, duration: 1, ease: 'expo.out', delay: 0.15 + i * 0.12, clearProps: 'transform' })
        })
      })
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const dir = Number(el.dataset.parallax)
          gsap.fromTo(el, { yPercent: -6 * dir }, { yPercent: 6 * dir, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-sky)_0%,#fff_78%)] pt-[calc(var(--header-h)+2.5rem)] pb-[var(--section-y)] lg:pt-[calc(var(--header-h)+4rem)]">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div>
          <p className="eyebrow m-0 mb-6" data-reveal>{t('hero.eyebrow')}</p>
          <SplitHeading
            as="h1"
            id="hero-title"
            className="h1"
            lines={[t('hero.t1'), <>{t('hero.t2a')} <em>{t('hero.t2b')}</em></>]}
          />
          <p className="lead measure mt-6 mb-10 text-muted" data-reveal>{t('hero.lead')}</p>
          <div className="flex flex-wrap gap-3" data-reveal>
            <a href="#galleria" onClick={go('galleria')} className="btn btn-primary">{t('hero.cta')}</a>
            <a href="#contatti" onClick={go('contatti')} className="btn btn-outline">{t('hero.contact')}</a>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-[640px] grid-cols-[3fr_2fr] items-center gap-3 sm:gap-5 lg:items-end">
          <div className="relative" data-parallax="1">
            <Sparkles />
            <div className="arch zoom aspect-[3/4] shadow-[0_30px_60px_-30px_rgb(46_42_48/.25)]" data-img>
              <Img photo={main} alt={lang === 'it' ? main.alt_it : main.alt_en} eager sizes="(min-width: 1024px) 380px, 58vw" className="size-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:gap-5 lg:pb-8" data-parallax="-1">
            {[a, b].map((p) => (
              <div key={p.slug} className="zoom aspect-[4/5] overflow-hidden rounded-[6px]" data-img>
                <Img photo={p} alt={lang === 'it' ? p.alt_it : p.alt_en} eager sizes="(min-width: 1024px) 250px, 38vw" className="size-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
