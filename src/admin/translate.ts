import type { Lang } from '../i18n.tsx'

/**
 * Machine translation IT↔EN via the MyMemory public API (no key, CORS-enabled).
 * The text is sent to api.mymemory.translated.net; the admin always shows the result for review before saving.
 * `{n}`-style placeholders are protected so templates like "{n} foto" survive translation.
 */
export async function translate(text: string, from: Lang, to: Lang): Promise<string> {
  const src = text.trim()
  if (!src) return ''
  const vars: string[] = []
  const masked = src.replace(/\{[a-z]+\}/g, (m) => `[[${vars.push(m) - 1}]]`)
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(masked)}&langpair=${from}|${to}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`translate HTTP ${res.status}`)
  const body: unknown = await res.json()
  const out =
    body && typeof body === 'object' && 'responseData' in body && body.responseData && typeof body.responseData === 'object' && 'translatedText' in body.responseData
      ? body.responseData.translatedText
      : undefined
  if (typeof out !== 'string' || !out) throw new Error('translate: empty response')
  // Quota/error messages come back as translatedText in upper case; treat them as failures.
  if (/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(out)) throw new Error(out)
  return out.replace(/\[\[\s*(\d+)\s*\]\]/g, (_, i: string) => vars[Number(i)] ?? '')
}
