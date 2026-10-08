import { useState } from 'react'
import type { Content } from '../content.ts'
import type { Update } from './Admin.tsx'
import { slugify } from './image.ts'
import type { T } from './strings.ts'
import { Bilingual, small } from './ui.tsx'

type Props = { t: T; content: Content; update: Update }

export default function Categories({ t, content, update }: Props) {
  const [draft, setDraft] = useState({ it: '', en: '' })
  const [error, setError] = useState<string | null>(null)
  const cats = content.collections

  const add = () => {
    const id = slugify(draft.it || draft.en)
    if (!id) return
    if (cats.some((c) => c.id === id)) return setError(t('catExists'))
    update((c) => ({ ...c, collections: [...c.collections, { id, it: draft.it || draft.en, en: draft.en || draft.it }] }))
    setDraft({ it: '', en: '' })
    setError(null)
  }

  const move = (i: number, dir: -1 | 1) =>
    update((c) => {
      const collections = [...c.collections]
      ;[collections[i], collections[i + dir]] = [collections[i + dir], collections[i]]
      return { ...c, collections }
    })

  return (
    <section aria-labelledby="cat-title" className="grid gap-5">
      <h2 id="cat-title" className="sr-only">{t('tabCategories')}</h2>
      <ul className="m-0 grid list-none gap-5 p-0">
        {cats.map((cat, i) => {
          const n = content.photos.filter((p) => p.collection === cat.id).length
          return (
            <li key={cat.id} className="rounded-[14px] border border-line bg-white p-4">
              <p className="caption m-0 mb-3 text-muted">
                {cat.id} · {t('count', { n })}
              </p>
              <Bilingual
                t={t}
                labels={{ it: t('catIt'), en: t('catEn') }}
                value={{ it: cat.it, en: cat.en }}
                onChange={(v) => update((c) => ({ ...c, collections: c.collections.map((x) => (x.id === cat.id ? { ...x, ...v } : x)) }))}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className={small} disabled={i === 0} onClick={() => move(i, -1)}>{t('moveUp')}</button>
                <button type="button" className={small} disabled={i === cats.length - 1} onClick={() => move(i, 1)}>{t('moveDown')}</button>
                {n > 0 && <span className="caption text-muted">{t('catBlocked', { n })}</span>}
                <button
                  type="button"
                  className={`${small} ml-auto`}
                  disabled={n > 0}
                  onClick={() => confirm(t('catDelete', { c: cat.it })) && update((c) => ({ ...c, collections: c.collections.filter((x) => x.id !== cat.id) }))}
                >
                  {t('delete')}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="rounded-[14px] border border-dashed border-line bg-white p-4">
        <h3 className="eyebrow m-0 mb-3">{t('catNew')}</h3>
        <Bilingual t={t} labels={{ it: t('catIt'), en: t('catEn') }} value={draft} onChange={(v) => (setDraft(v), setError(null))} />
        {error && <p role="alert" className="caption mt-2 text-action">{error}</p>}
        <button type="button" className="btn btn-primary mt-4" disabled={!(draft.it || draft.en).trim()} onClick={add}>
          {t('catAdd')}
        </button>
      </div>
    </section>
  )
}
