import { useState, type ReactNode } from 'react'
import type { Lang } from '../i18n.tsx'
import type { T } from './strings.ts'
import { translate } from './translate.ts'

export const field = 'w-full rounded-[2px] border border-line bg-white px-3 py-2 text-[15px] text-ink min-h-11'
export const small = 'nav-text min-h-11 cursor-pointer rounded-full border border-line bg-white px-4 text-ink transition-colors duration-200 hover:border-action hover:text-action disabled:cursor-default disabled:opacity-60'

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="caption mb-1 block text-muted">{label}</span>
      {children}
      {hint && <span className="caption mt-1 block text-muted">{hint}</span>}
    </label>
  )
}

/**
 * IT + EN inputs with translate buttons in both directions. The translation fills the other field;
 * nothing is saved until the global Save, so the result can be reviewed first.
 */
export function Bilingual({
  t,
  value,
  onChange,
  labels,
  placeholder,
  multiline = false,
  hint,
}: {
  t: T
  value: Record<Lang, string>
  onChange: (v: Record<Lang, string>) => void
  labels: Record<Lang, string>
  placeholder?: Record<Lang, string>
  multiline?: boolean
  hint?: string
}) {
  const [busy, setBusy] = useState<Lang | null>(null)
  const [error, setError] = useState(false)
  const run = async (from: Lang, to: Lang) => {
    const source = value[from] || placeholder?.[from] || ''
    if (!source.trim()) return
    setBusy(to)
    setError(false)
    try {
      onChange({ ...value, [to]: await translate(source, from, to) })
    } catch {
      setError(true)
    } finally {
      setBusy(null)
    }
  }
  const input = (l: Lang) => {
    const props = {
      className: field,
      value: value[l],
      placeholder: placeholder?.[l],
      lang: l,
      onChange: (e: { target: { value: string } }) => onChange({ ...value, [l]: e.target.value }),
    }
    return multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />
  }
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label={labels.it} hint={hint}>{input('it')}</Field>
        <Field label={labels.en} hint={hint}>{input('en')}</Field>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className={small} disabled={busy !== null} onClick={() => run('it', 'en')} aria-label={t('translateTo', { l: 'English' })}>
          {busy === 'en' ? t('translating') : t('toEn')}
        </button>
        <button type="button" className={small} disabled={busy !== null} onClick={() => run('en', 'it')} aria-label={t('translateTo', { l: 'italiano' })}>
          {busy === 'it' ? t('translating') : t('toIt')}
        </button>
        {error && (
          <span role="alert" className="caption text-action">
            {t('translateError')}
          </span>
        )}
      </div>
    </div>
  )
}
