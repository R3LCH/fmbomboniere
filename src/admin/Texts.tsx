import type { Content } from '../content.ts'
import { dict, type Key, type Lang } from '../i18n.tsx'
import type { Update } from './Admin.tsx'
import type { AdminKey, T } from './strings.ts'
import { Bilingual } from './ui.tsx'

type Props = { t: T; content: Content; update: Update }

// Group i18n keys by their prefix (hero.*, about.*, …) so each site section is edited together.
const KEYS = Object.keys(dict.it) as Key[]
const groupOf = (k: Key): AdminKey => {
  const prefix = k.split('.')[0]
  return `g.${prefix}` as AdminKey
}
const GROUPS = [...new Set(KEYS.map(groupOf))]

export default function Texts({ t, content, update }: Props) {
  const set = (k: Key, v: Record<Lang, string>) =>
    update((c) => {
      const text = { it: { ...c.text?.it }, en: { ...c.text?.en } }
      for (const l of ['it', 'en'] as const) {
        // Blank or identical to the shipped copy = no override.
        if (v[l] && v[l] !== dict[l][k]) text[l][k] = v[l]
        else delete text[l][k]
      }
      return { ...c, text }
    })

  return (
    <section aria-labelledby="texts-title" className="grid gap-8">
      <h2 id="texts-title" className="sr-only">{t('tabTexts')}</h2>
      <p className="m-0 max-w-[60ch] text-muted">{t('textsLead')}</p>
      <p className="caption m-0 text-muted">{t('translateNote')}</p>
      {GROUPS.map((g) => (
        <fieldset key={g} className="m-0 grid gap-6 rounded-[14px] border border-line bg-white p-4">
          <legend className="eyebrow px-2">{t(g)}</legend>
          {KEYS.filter((k) => groupOf(k) === g).map((k) => {
            const long = dict.it[k].length > 60
            return (
              <div key={k}>
                <p className="caption m-0 mb-2 font-medium text-ink">{k}</p>
                <Bilingual
                  t={t}
                  labels={{ it: 'IT', en: 'EN' }}
                  multiline={long}
                  hint={k === 'occ' ? t('occHint') : undefined}
                  value={{ it: content.text?.it?.[k] ?? '', en: content.text?.en?.[k] ?? '' }}
                  placeholder={{ it: dict.it[k], en: dict.en[k] }}
                  onChange={(v) => set(k, v)}
                />
              </div>
            )
          })}
        </fieldset>
      ))}
    </section>
  )
}
