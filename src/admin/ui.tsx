import { useState, type KeyboardEvent, type ReactNode } from 'react'
import type { Lang } from '../i18n.tsx'
import type { T } from './strings.ts'
import { translate } from './translate.ts'

export const field = 'w-full rounded-[2px] border border-line bg-white px-3 py-2 text-[15px] text-ink min-h-11'
export const small = 'nav-text min-h-11 cursor-pointer rounded-full border border-line bg-white px-4 text-ink transition-colors duration-200 hover:border-action hover:text-action disabled:cursor-default disabled:opacity-60'

export const otherLang = (l: Lang): Lang => (l === 'it' ? 'en' : 'it')

export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="caption mb-1 flex items-center text-muted">{label}</span>
      {children}
    </label>
  )
}

/**
 * IT + EN inputs. Enter in either field translates it into the other one when that one is empty;
 * the result is shown for review and saved only with the global Save.
 */
export function Bilingual({
  t,
  value,
  onChange,
  labels,
}: {
  t: T
  value: Record<Lang, string>
  onChange: (v: Record<Lang, string>) => void
  labels: Record<Lang, string>
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const onKeyDown = async (e: KeyboardEvent<HTMLInputElement>, from: Lang) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const to = otherLang(from)
    if (busy || !value[from].trim() || value[to].trim()) return
    setBusy(true)
    setError(false)
    try {
      onChange({ ...value, [to]: await translate(value[from], from, to) })
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        {(['it', 'en'] as const).map((l) => (
          <Field key={l} label={labels[l]}>
            <input
              type="text"
              lang={l}
              className={field}
              value={value[l]}
              readOnly={busy}
              onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              onKeyDown={(e) => onKeyDown(e, l)}
            />
          </Field>
        ))}
      </div>
      <p className={`caption m-0 mt-1 ${error ? 'text-action' : 'text-muted'}`} role={error ? 'alert' : undefined} aria-live="polite">
        {busy ? t('translating') : error ? t('translateError') : t('enterHint')}
      </p>
    </div>
  )
}
