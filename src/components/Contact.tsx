import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CONTACT } from '../data.ts'
import { useI18n } from '../i18n.tsx'
import { sectionReveals, useMotion } from '../motion.ts'
import { Icon, type IconName, SplitHeading } from './ui.tsx'

function Row({ icon, label, href, children, external = false }: { icon: IconName; label: string; href: string; children: ReactNode; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex min-h-16 items-center gap-4 border-b border-line py-4 text-ink transition-colors duration-200 hover:text-action"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-action">
          <Icon name={icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow block">{label}</span>
          <span className="block text-[17px] leading-7 break-words">{children}</span>
        </span>
        <Icon name="arrow" className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </li>
  )
}

export default function Contact() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const mapBox = useRef<HTMLDivElement>(null)
  const [mapOn, setMapOn] = useState(false)
  useMotion(ref, sectionReveals)

  // Load the Maps iframe only when its box approaches the viewport.
  useEffect(() => {
    const el = mapBox.current
    if (!el || mapOn) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMapOn(true), { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [mapOn])

  return (
    <section ref={ref} id="contatti" aria-labelledby="contact-title" className="section bg-[linear-gradient(180deg,#fff_0%,var(--color-blush)_14%)]">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow m-0 mb-5" data-reveal>{t('contact.eyebrow')}</p>
          <SplitHeading id="contact-title" className="h2" lines={[t('contact.title')]} />
          <p className="lead measure mt-6 mb-8 text-muted" data-reveal>{t('contact.lead')}</p>
          <address className="not-italic" data-reveal>
            <ul className="m-0 list-none border-t border-line p-0">
              <Row icon="pin" label={t('contact.address')} href={CONTACT.maps} external>
                {CONTACT.street}, {CONTACT.city}
                <span className="caption block">{t('contact.maps')}</span>
              </Row>
              <Row icon="phone" label={t('contact.phone')} href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</Row>
              <Row icon="whatsapp" label={t('contact.whatsapp')} href={CONTACT.whatsapp} external>{t('contact.whatsappText')}</Row>
              <Row icon="mail" label={t('contact.email')} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Row>
              <Row icon="instagram" label="Instagram" href={CONTACT.instagram} external>{CONTACT.instagramLabel}</Row>
              <Row icon="facebook" label="Facebook" href={CONTACT.facebook} external>FM Bomboniere</Row>
            </ul>
          </address>
        </div>
        <div ref={mapBox} className="relative min-h-[360px] overflow-hidden rounded-[14px] border border-line bg-sky lg:min-h-full" data-reveal>
          {mapOn ? (
            <iframe
              src={CONTACT.embed}
              title={t('contact.map')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <p className="caption absolute inset-0 m-0 flex items-center justify-center p-6 text-center">{t('contact.mapNote')}</p>
          )}
        </div>
      </div>
    </section>
  )
}
