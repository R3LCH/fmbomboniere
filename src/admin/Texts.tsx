import { createContext, useContext, useState, type KeyboardEvent, type ReactNode } from 'react'
import { LOGO } from '../components/ui.tsx'
import type { Content } from '../content.ts'
import { dict, type Key, type Lang } from '../i18n.tsx'
import type { Update } from './Admin.tsx'
import type { AdminKey, T } from './strings.ts'
import { translate } from './translate.ts'
import { otherLang } from './ui.tsx'

type Props = { t: T; lang: Lang; content: Content; update: Update }
type State = 'busy' | 'done' | 'error'
type Ctx = {
  t: T
  lang: Lang
  content: Content
  state: Partial<Record<Key, State>>
  valueOf: (l: Lang, k: Key) => string
  edit: (k: Key, v: string) => void
  onEnter: (k: Key) => void
}

// Editable/Block live at module level: components declared inside render would remount and drop focus on each keystroke.
const EditCtx = createContext<Ctx | null>(null)

function Editable({ k, className = '', multiline = false, hint }: { k: Key; className?: string; multiline?: boolean; hint?: string }) {
  const { t, lang, content, state, valueOf, edit, onEnter } = useContext(EditCtx)!
  const other = otherLang(lang)
  const edited = content.text?.[lang]?.[k] !== undefined
  const st = state[k]
  const props = {
    lang,
    value: valueOf(lang, k),
    'aria-label': dict[lang][k],
    onChange: (e: { target: { value: string } }) => edit(k, e.target.value),
    onKeyDown: (e: KeyboardEvent) => {
      // Plain Enter translates. Line breaks are blocked: the site renders text on one flow (no white-space: pre).
      if (e.key !== 'Enter') return
      e.preventDefault()
      onEnter(k)
    },
    className: `w-full min-w-[4ch] resize-none rounded-[2px] border border-dashed border-transparent bg-transparent px-1 -mx-1 text-inherit outline-offset-2 transition-colors duration-200 hover:border-rose-gold focus:border-action focus:bg-white/70 ${className}`,
  }
  return (
    <span className="block">
      {multiline ? <textarea rows={2} {...props} /> : <input type="text" {...props} />}
      <span className="caption mt-1 flex flex-wrap gap-x-2 font-sans text-[12px] leading-4 tracking-normal normal-case text-muted" aria-live="polite">
        {edited && <span className="text-action">● {t('edited')}</span>}
        {hint && <span>{hint}</span>}
        <span className="italic">
          {t('inOther', { l: other.toUpperCase() })}{' '}
          {st === 'busy' ? t('translating') : st === 'error' ? <span className="text-action not-italic">{t('translateError')}</span> : valueOf(other, k)}
        </span>
      </span>
    </span>
  )
}

function Block({ title, className, children }: { title: AdminKey; className: string; children: ReactNode }) {
  const { t } = useContext(EditCtx)!
  return (
    <section className="overflow-hidden rounded-[14px] border border-line">
      <h3 className="eyebrow m-0 border-b border-line bg-white px-4 py-3 text-muted">{t(title)}</h3>
      <div className={`px-6 py-10 sm:px-10 ${className}`}>{children}</div>
    </section>
  )
}

/**
 * The site sections drawn as visitors see them; every visible text is editable in place.
 * Only texts shown on the page are listed (screen-reader labels and the lightbox stay as shipped).
 */
export default function Texts({ t, lang, content, update }: Props) {
  const [state, setState] = useState<Partial<Record<Key, State>>>({})
  const other = otherLang(lang)
  const valueOf = (l: Lang, k: Key) => content.text?.[l]?.[k] ?? dict[l][k]

  const set = (l: Lang, k: Key, v: string) =>
    update((c) => {
      const text = { it: { ...c.text?.it }, en: { ...c.text?.en } }
      // Identical to the shipped copy = no override, so later code updates still reach the site.
      if (v.trim() && v !== dict[l][k]) text[l][k] = v
      else delete text[l][k]
      return { ...c, text }
    })

  // Enter: translate into the other language, but never overwrite a version the admin already edited.
  const onEnter = async (k: Key) => {
    if (content.text?.[other]?.[k] !== undefined || state[k] === 'busy') return
    setState((s) => ({ ...s, [k]: 'busy' }))
    try {
      set(other, k, await translate(valueOf(lang, k), lang, other))
      setState((s) => ({ ...s, [k]: 'done' }))
    } catch {
      setState((s) => ({ ...s, [k]: 'error' }))
    }
  }

  const edit = (k: Key, v: string) => {
    set(lang, k, v)
    setState((s) => ({ ...s, [k]: undefined }))
  }

  return (
    <EditCtx.Provider value={{ t, lang, content, state, valueOf, edit, onEnter }}>
      <section aria-labelledby="texts-title" className="grid gap-8">
        <h2 id="texts-title" className="sr-only">{t('tabTexts')}</h2>
        <div className="grid max-w-[70ch] gap-2 rounded-[14px] border border-line bg-white p-4">
          <p className="m-0">{t('textsLead', { l: t(`lang.${lang}`) })}</p>
          <p className="m-0 font-medium text-action">{t('textsEnter', { o: t(`lang.${other}`) })}</p>
          <p className="caption m-0 text-muted">{t('translateNote')}</p>
        </div>

        <Block title="s.menu" className="bg-white">
          <div className="flex flex-wrap items-start gap-8">
            <img src={LOGO} alt="" className="size-11 rounded-full" />
            {(['nav.about', 'nav.collections', 'nav.gallery', 'nav.contact'] as const).map((k) => (
              <div key={k} className="w-40"><Editable k={k} className="nav-text" /></div>
            ))}
          </div>
        </Block>

        <Block title="s.hero" className="bg-[linear-gradient(180deg,var(--color-sky)_0%,#fff_100%)]">
          <div className="max-w-[44rem] space-y-3">
            <Editable k="hero.eyebrow" className="eyebrow" />
            <Editable k="hero.t1" className="h1" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Editable k="hero.t2a" className="h1" />
              <Editable k="hero.t2b" className="h1 italic" />
            </div>
            <Editable k="hero.lead" className="lead text-muted" multiline />
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="btn btn-primary"><Editable k="hero.cta" className="text-center" /></span>
              <span className="btn btn-outline"><Editable k="hero.contact" className="text-center" /></span>
            </div>
          </div>
        </Block>

        <Block title="s.about" className="bg-blush">
          <div className="max-w-[44rem] space-y-3">
            <Editable k="about.eyebrow" className="eyebrow" />
            <Editable k="about.t1" className="h2" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Editable k="about.t2a" className="h2" />
              <Editable k="about.t2b" className="h2 italic" />
            </div>
            <Editable k="about.p1" className="lead" multiline />
            <Editable k="about.p2" className="text-muted" multiline />
            <Editable k="about.occasions" className="eyebrow pt-4" />
            <Editable k="occ" className="font-serif text-[1.5rem] leading-10" hint={t('occHint')} />
          </div>
        </Block>

        <Block title="s.col" className="bg-sky">
          <div className="max-w-[44rem] space-y-3">
            <Editable k="col.eyebrow" className="eyebrow" />
            <Editable k="col.title" className="h2" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Editable k="col.count" className="caption" hint={`${t('many')} · ${t('countHint')}`} />
              <Editable k="col.countOne" className="caption" hint={t('one')} />
            </div>
          </div>
        </Block>

        <Block title="s.gal" className="bg-white">
          <div className="max-w-[44rem] space-y-3">
            <Editable k="gal.eyebrow" className="eyebrow" />
            <Editable k="gal.title" className="h2" />
            <span className="nav-text inline-block rounded-full border border-action bg-action px-5 py-2 text-white"><Editable k="gal.all" /></span>
          </div>
        </Block>

        <Block title="s.contact" className="bg-blush">
          <div className="max-w-[44rem] space-y-3">
            <Editable k="contact.eyebrow" className="eyebrow" />
            <Editable k="contact.title" className="h2" />
            <Editable k="contact.lead" className="lead text-muted" multiline />
            <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
              <Editable k="contact.address" className="eyebrow" />
              <Editable k="contact.maps" className="caption" />
              <Editable k="contact.phone" className="eyebrow" />
              <Editable k="contact.email" className="eyebrow" />
              <Editable k="contact.whatsapp" className="eyebrow" />
              <Editable k="contact.whatsappText" className="text-[17px]" />
            </div>
            <Editable k="contact.mapNote" className="caption" />
          </div>
        </Block>

        <Block title="s.footer" className="bg-disc text-white [&_.caption]:text-white/75">
          <div className="grid max-w-[44rem] gap-3 sm:grid-cols-2">
            <Editable k="footer.owner" className="text-[13px]" />
            <Editable k="footer.tag" className="text-[13px]" />
            <Editable k="footer.top" className="text-[13px]" />
          </div>
        </Block>
      </section>
    </EditCtx.Provider>
  )
}
