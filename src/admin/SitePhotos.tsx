import { slugOf, type Content } from '../content.ts'
import { asset } from '../data.ts'
import type { Lang } from '../i18n.tsx'
import type { Update } from './Admin.tsx'
import type { AdminKey, T } from './strings.ts'

type Props = { t: T; lang: Lang; content: Content; update: Update }
type Slot = { key: AdminKey; get: (c: Content) => string; set: (c: Content, slug: string) => Content }

const heroSlot = (i: number, key: AdminKey): Slot => ({
  key,
  get: (c) => c.hero[i] ?? '',
  set: (c, slug) => {
    const hero = [...c.hero]
    hero[i] = slug
    return { ...c, hero }
  },
})

const SLOTS: Slot[] = [
  heroSlot(0, 'heroMain'),
  heroSlot(1, 'heroTop'),
  heroSlot(2, 'heroBottom'),
  { key: 'aboutPhoto', get: (c) => c.about, set: (c, about) => ({ ...c, about }) },
]

export default function SitePhotos({ t, lang, content, update }: Props) {
  return (
    <section aria-labelledby="site-title" className="grid gap-8">
      <h2 id="site-title" className="sr-only">{t('tabSite')}</h2>
      <p className="m-0 max-w-[60ch] text-muted">{t('siteLead')}</p>
      {SLOTS.map((slot) => {
        const current = slot.get(content)
        return (
          <fieldset key={slot.key} className="m-0 rounded-[14px] border border-line bg-white p-4">
            <legend className="eyebrow px-2">{t(slot.key)}</legend>
            <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-5 lg:grid-cols-8">
              {content.photos.map((p) => {
                const slug = slugOf(p)
                const alt = (lang === 'it' ? p.alt_it : p.alt_en) || slug
                return (
                  <li key={p.src}>
                    <button
                      type="button"
                      aria-pressed={current === slug}
                      aria-label={t('pick', { a: alt })}
                      onClick={() => update((c) => slot.set(c, slug))}
                      className={`block w-full cursor-pointer overflow-hidden rounded-[6px] border-2 ${current === slug ? 'border-action' : 'border-transparent'}`}
                    >
                      <img src={asset(p.thumb)} alt="" loading="lazy" className="aspect-[4/5] w-full bg-ivory object-cover" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        )
      })}
    </section>
  )
}
