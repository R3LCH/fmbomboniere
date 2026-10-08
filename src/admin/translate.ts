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

async function myMemory(q: string, from: Lang, to: Lang): Promise<string> {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from}|${to}`)
  if (!res.ok) throw new Error(`mymemory HTTP ${res.status}`)
  const body: unknown = await res.json()
  const out =
    body && typeof body === 'object' && 'responseData' in body && body.responseData && typeof body.responseData === 'object' && 'translatedText' in body.responseData
      ? body.responseData.translatedText
      : undefined
  if (typeof out !== 'string' || !out) throw new Error('mymemory: empty response')
  // Quota/error messages come back as translatedText; treat them as failures so the fallback runs.
  if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(out)) throw new Error(out)
  return out
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
