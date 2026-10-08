import { useState, type ChangeEvent } from 'react'
import { slugOf, store, type Content, type RawPhoto } from '../content.ts'
import { asset } from '../data.ts'
import type { Lang } from '../i18n.tsx'
import type { Update } from './Admin.tsx'
import { processImage, slugify } from './image.ts'
import type { T } from './strings.ts'
import { Bilingual, Field, field, small } from './ui.tsx'

type Props = { t: T; lang: Lang; content: Content; update: Update }

/** Unique slug among current photos (≤80 chars, server `UPLOAD_NAME`); the `~version` suffix makes every upload a new file (cache-safe replace). */
function fileName(raw: string, taken: Set<string>): { slug: string; name: string } {
  const base = raw.slice(0, 76).replace(/-+$/, '') || 'foto'
  let slug = base
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`
  return { slug, name: `${slug}~${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}` }
}

export default function Photos({ t, lang, content, update }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const [progress, setProgress] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const cats = content.collections
  const target = filter === 'all' ? cats[0]?.id : filter

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])]
    e.target.value = ''
    if (!files.length || !target) return
    const failed: string[] = []
    const taken = new Set(content.photos.map(slugOf))
    for (const [i, file] of files.entries()) {
      setProgress(t('uploading', { n: i + 1, m: files.length }))
      try {
        const { big, thumb, w, h } = await processImage(file)
        const { slug, name } = fileName(`${target}-${slugify(file.name.replace(/\.[^.]+$/, ''))}`, taken)
        taken.add(slug)
        const paths = await store.upload(name, big, thumb)
        const photo: RawPhoto = { ...paths, w, h, collection: target, alt_it: '', alt_en: '', featured: false, date: new Date().toISOString().slice(0, 10) }
        update((c) => ({ ...c, photos: [photo, ...c.photos] }))
      } catch (err) {
        failed.push(err instanceof Error && err.message === 'webp-unsupported' ? t('webp') : t('uploadError', { f: file.name }))
      }
    }
    setProgress(null)
    setErrors(failed)
  }

  const replace = async (index: number, file: File | undefined) => {
    if (!file) return
    setProgress(t('uploading', { n: 1, m: 1 }))
    try {
      const { big, thumb, w, h } = await processImage(file)
      const slug = slugOf(content.photos[index])
      const paths = await store.upload(fileName(slug, new Set()).name, big, thumb)
      update((c) => ({ ...c, photos: c.photos.map((p, i) => (i === index ? { ...p, ...paths, w, h } : p)) }))
      setErrors([])
    } catch (err) {
      setErrors([err instanceof Error && err.message === 'webp-unsupported' ? t('webp') : t('uploadError', { f: file.name })])
    }
    setProgress(null)
  }

  const patch = (index: number, p: Partial<RawPhoto>) => update((c) => ({ ...c, photos: c.photos.map((x, i) => (i === index ? { ...x, ...p } : x)) }))
  const move = (index: number, dir: -1 | 1) =>
    update((c) => {
      // Swap with the nearest neighbour in the same visible list, so ordering works inside a filter.
      const visible = c.photos.flatMap((p, i) => (filter === 'all' || p.collection === filter ? [i] : []))
      const other = visible[visible.indexOf(index) + dir]
      if (other === undefined) return c
      const photos = [...c.photos]
      ;[photos[index], photos[other]] = [photos[other], photos[index]]
      return { ...c, photos }
    })

  const shown = content.photos.flatMap((p, i) => (filter === 'all' || p.collection === filter ? [{ p, i }] : []))

  return (
    <section aria-labelledby="photos-title">
      <h2 id="photos-title" className="sr-only">{t('tabPhotos')}</h2>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {[{ id: 'all', it: t('filterAll'), en: t('filterAll') }, ...cats].map((c) => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)} className={`${small} ${filter === c.id ? 'border-action! bg-action! text-white!' : ''}`}>
            {c[lang]} <span className="opacity-80">({c.id === 'all' ? content.photos.length : content.photos.filter((p) => p.collection === c.id).length})</span>
          </button>
        ))}
        <label className={`btn btn-primary ml-auto ${progress || !target ? 'pointer-events-none opacity-60' : ''}`}>
          {progress ?? t('upload')}
          <input type="file" accept="image/*" multiple className="sr-only" disabled={!!progress || !target} onChange={upload} />
        </label>
      </div>
      <div role="status" aria-live="polite" className="mb-4">
        {errors.map((e) => (
          <p key={e} className="caption m-0 text-action">{e}</p>
        ))}
      </div>
      <ul className="m-0 grid list-none gap-5 p-0">
        {shown.map(({ p, i }, pos) => {
          const slug = slugOf(p)
          return (
            <li key={p.src} className="grid gap-5 rounded-[14px] border border-line bg-white p-4 md:grid-cols-[180px_1fr]">
              <img src={asset(p.thumb)} alt="" width={p.w} height={p.h} className="aspect-[4/5] w-full rounded-[6px] bg-ivory object-cover" loading="lazy" />
              <div className="grid gap-4">
                <p className="caption m-0 text-muted">{slug}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label={t('collection')}>
                    <select className={field} value={p.collection} onChange={(e) => patch(i, { collection: e.target.value })}>
                      {cats.map((c) => (
                        <option key={c.id} value={c.id}>{c[lang]}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t('date')}>
                    <input type="date" className={field} value={p.date} onChange={(e) => patch(i, { date: e.target.value })} />
                  </Field>
                  <label className="flex min-h-11 items-center gap-2 self-end">
                    <input type="checkbox" className="size-5 accent-[var(--color-action)]" checked={p.featured} onChange={(e) => patch(i, { featured: e.target.checked })} />
                    <span>{t('featured')}</span>
                  </label>
                </div>
                <Bilingual t={t} labels={{ it: t('altIt'), en: t('altEn') }} value={{ it: p.alt_it, en: p.alt_en }} onChange={(v) => patch(i, { alt_it: v.it, alt_en: v.en })} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={small} disabled={pos === 0} onClick={() => move(i, -1)}>{t('moveUp')}</button>
                  <button type="button" className={small} disabled={pos === shown.length - 1} onClick={() => move(i, 1)}>{t('moveDown')}</button>
                  <label className={`${small} inline-flex items-center`}>
                    {t('replace')}
                    <input type="file" accept="image/*" className="sr-only" disabled={!!progress} onChange={(e) => (replace(i, e.target.files?.[0]), (e.target.value = ''))} />
                  </label>
                  <button
                    type="button"
                    className={`${small} ml-auto`}
                    onClick={() => confirm(t('deletePhoto')) && update((c) => ({ ...c, photos: c.photos.filter((_, j) => j !== i) }))}
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
