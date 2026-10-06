import type { MouseEvent } from 'react'
import { CONTACT } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { scrollToId } from '../motion.ts'
import { NAV } from './Header.tsx'
import { Icon, LOGO_LARGE, Star } from './ui.tsx'

export default function Footer() {
  const { t } = useI18n()
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }
  const link = 'inline-flex min-h-11 items-center text-white/85 transition-colors duration-200 hover:text-white'

  return (
    <footer className="bg-disc text-white">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[auto_1fr_1fr] md:gap-16 lg:py-20">
        <div className="flex flex-col items-start gap-4">
          <img src={LOGO_LARGE} alt="FM Bomboniere" width={640} height={640} loading="lazy" className="size-[120px] rounded-full" />
          <p className="m-0 font-serif text-xl leading-7">
            FM Bomboniere
            <span className="block font-sans text-[13px] leading-5 text-white/80">{t('footer.owner')}</span>
          </p>
          <p className="m-0 max-w-[28ch] text-[13px] leading-5 text-white/80">{t('footer.tag')}</p>
        </div>
        <nav aria-label={t('nav.label')}>
          <ul className="m-0 list-none space-y-1 p-0">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} className={`nav-text ${link}`}>{t(n.key)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 text-[15px] leading-6">
          <p className="m-0 py-2 text-white/85">
            {CONTACT.street}
            <br />
            {CONTACT.city}
          </p>
          <p className="m-0"><a className={link} href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a></p>
          <p className="m-0"><a className={`${link} break-all`} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          <div className="flex gap-2 pt-2">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:border-white">
              <Icon name="instagram" />
            </a>
            <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:border-white">
              <Icon name="facebook" />
            </a>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="flex items-center gap-3 text-rose-gold" aria-hidden="true">
          <span className="h-px flex-1 bg-white/15" />
          <Star />
          <span className="h-px flex-1 bg-white/15" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-[13px] leading-5 text-white/80">
          <p className="m-0">© {new Date().getFullYear()} FM Bomboniere di Francesca Moliterni</p>
          <a href="#top" onClick={go('top')} className={`${link} gap-2`}>
            {t('footer.top')} <Icon name="up" className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
