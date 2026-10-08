import { useRef } from 'react'
import { countOf, cover, label, presentCollections, type Collection } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { sectionReveals, useMotion } from '../motion.ts'
import { Icon, Img, SplitHeading } from './ui.tsx'

export default function Collections({ onPick }: { onPick: (c: Collection) => void }) {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  useMotion(ref, sectionReveals)

  return (
    <section ref={ref} id="collezioni" aria-labelledby="col-title" className="section bg-sky">
      <div className="wrap">
        <p className="eyebrow m-0 mb-5" data-reveal>{t('col.eyebrow')}</p>
        <SplitHeading id="col-title" className="h2 mb-12" lines={[t('col.title')]} />
        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-10 p-0 md:grid-cols-3 md:gap-x-6">
          {presentCollections.map((c) => {
            const p = cover(c)
            const n = countOf(c)
            const name = label(c, lang)
            return (
              <li key={c} data-reveal>
                <button type="button" onClick={() => onPick(c)} className="group block w-full cursor-pointer rounded-[6px] text-left" aria-label={t('col.view', { c: name })}>
                  <span className="zoom block aspect-[4/5] overflow-hidden rounded-[6px] bg-white">
                    <Img photo={p} alt="" sizes="(min-width: 768px) 30vw, 46vw" className="size-full object-cover" />
                  </span>
                  <span className="mt-4 flex items-end justify-between gap-3">
                    <span>
                      <span className="h3 block">{name}</span>
                      <span className="caption block">{n === 1 ? t('col.countOne') : t('col.count', { n })}</span>
                    </span>
                    <Icon name="arrow" className="mb-1 size-5 shrink-0 text-action transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
