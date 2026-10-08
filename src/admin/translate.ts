import type { Lang } from '../i18n.tsx'

/**
 * Machine translation IT↔EN. MyMemory first (public API, no key); if it fails or hits its quota,
 * the unofficial Google endpoint (translate.googleapis.com, client=gtx) is tried. Both are called
 * from the browser, so the text is sent to those services. The admin shows the result for review before saving.
 * `{n}`-style placeholders are masked so templates like "{n} foto" survive translation.
 */
export async function translate(text: string, from: Lang, to: Lang): Promise<string> {
  const src = text.trim()
  if (!src) return ''
  const vars: string[] = []
  const masked = src.replace(/\{[a-z]+\}/g, (m) => `[[${vars.push(m) - 1}]]`)
  let out: string
  try {
    out = await myMemory(masked, from, to)
  } catch (first) {
    try {
      out = await google(masked, from, to)
    } catch {
      throw first
    }
  }
  return out.replace(/\[\[\s*(\d+)\s*\]\]/g, (_, i: string) => vars[Number(i)] ?? '')
}

type MemoryMatch = { segment?: unknown; translation?: unknown; 'created-by'?: unknown }
const norm = (s: string) => s.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim()

/**
 * MyMemory's top result (`responseData`) can be a fuzzy translation-memory hit for a *different* sentence
 * ("La felicità dipende da noi" → a 0.86 hit for "…da noi stessi"). Accept only a memory entry whose source
 * segment is exactly the query, or MyMemory's own machine translation ("MT!"); otherwise fail so Google runs.
 */
async function myMemory(q: string, from: Lang, to: Lang): Promise<string> {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from}|${to}`)
  if (!res.ok) throw new Error(`mymemory HTTP ${res.status}`)
  const body: unknown = await res.json()
  const matches: MemoryMatch[] = body && typeof body === 'object' && 'matches' in body && Array.isArray(body.matches) ? body.matches : []
  const valid = matches.filter((m): m is { segment: string; translation: string; 'created-by'?: unknown } => typeof m.segment === 'string' && typeof m.translation === 'string' && !!m.translation.trim())
  const target = norm(q)
  const pick = valid.find((m) => m['created-by'] !== 'MT!' && norm(m.segment) === target) ?? valid.find((m) => m['created-by'] === 'MT!')
  if (!pick) throw new Error('mymemory: no exact match')
  // Quota/error messages come back as translations; treat them as failures so the fallback runs.
  if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(pick.translation)) throw new Error(pick.translation)
  return pick.translation.trim()
}

/** Undocumented endpoint used by Google's web widget: response is [[["translated", "source", …], …], …]. */
async function google(q: string, from: Lang, to: Lang): Promise<string> {
  const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${from}&tl=${to}&q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error(`google HTTP ${res.status}`)
  const body: unknown = await res.json()
  const segments = Array.isArray(body) && Array.isArray(body[0]) ? (body[0] as unknown[]) : []
  const out = segments.map((s) => (Array.isArray(s) && typeof s[0] === 'string' ? s[0] : '')).join('')
  if (!out) throw new Error('google: empty response')
  return out
}
