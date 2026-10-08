import { useRef } from 'react'
import { aboutPhoto } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { sectionReveals, useMotion } from '../motion.ts'
import { Img, LOGO, Ornament, SplitHeading } from './ui.tsx'

export default function About() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  useMotion(ref, sectionReveals)

  return (
    <section ref={ref} id="chi-siamo" aria-labelledby="about-title" className="section bg-[linear-gradient(180deg,#fff_0%,var(--color-blush)_14%)]">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-[420px]">
          {aboutPhoto && (
            <div className="arch aspect-[4/5]" data-img>
              <Img photo={aboutPhoto} alt={lang === 'it' ? aboutPhoto.alt_it : aboutPhoto.alt_en} sizes="(min-width: 1024px) 420px, 80vw" className="size-full object-cover" />
            </div>
          )}
          <img src={LOGO} alt="" width={320} height={320} loading="lazy" className="absolute -right-3 -bottom-6 size-24 rounded-full border-4 border-blush sm:size-28" />
        </div>
        <div>
          <p className="eyebrow m-0 mb-5" data-reveal>{t('about.eyebrow')}</p>
          <SplitHeading id="about-title" className="h2" lines={[t('about.t1'), <>{t('about.t2a')} <em>{t('about.t2b')}</em></>]} />
          <div className="measure mt-7 space-y-4" data-reveal>
            <p className="lead m-0">{t('about.p1')}</p>
            <p className="m-0 text-muted">{t('about.p2')}</p>
          </div>
          <Ornament className="my-9" />
          <h3 className="eyebrow m-0 mb-4" data-reveal>{t('about.occasions')}</h3>
          <ul className="m-0 grid grid-cols-2 gap-x-4 list-none p-0 font-serif text-[1.5rem] leading-10 md:flex md:flex-wrap md:items-center" data-reveal>
            {t('occ').split('|').map((o, i) => (
              <li key={o} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="mx-4 hidden h-5 w-px bg-rose-gold md:block" />}
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
