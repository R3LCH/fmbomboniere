import gallery from './data/gallery.json'
import type { TextOverrides } from './i18n.tsx'

/** Everything the admin panel edits. Shipped default = gallery.json + DEFAULT_COLLECTIONS. */
export type Category = { id: string; it: string; en: string }
export type RawPhoto = {
  src: string
  thumb: string
  w: number
  h: number
  collection: string
  alt_it: string
  alt_en: string
  featured: boolean
  date: string
}
export type Content = {
  collections: Category[]
  photos: RawPhoto[]
  /** Slugs: hero collage (arch, top, bottom) and About portrait. */
  hero: string[]
  about: string
  /** Edited UI copy per language, keyed by i18n keys; missing keys fall back to src/i18n.tsx. */
  text?: TextOverrides
}

export const DEFAULT_CONTENT: Content = {
  collections: [
    { id: 'battesimo', it: 'Battesimo', en: 'Baptism' },
    { id: 'comunione', it: 'Comunione e Cresima', en: 'Communion & Confirmation' },
    { id: 'matrimonio', it: 'Matrimonio', en: 'Wedding' },
    { id: 'feste', it: 'Feste e ricorrenze', en: 'Celebrations' },
    { id: 'regali', it: 'Idee regalo', en: 'Gift ideas' },
  ],
  photos: gallery as RawPhoto[],
  hero: ['comunione-aurora-fiori-rosa', 'battesimo-orsetto-aviatore', 'regali-tulipani-menta'],
  about: 'matrimonio-scatole-gypsophila',
}

/** `server`: VPS build with the Node API. Anything else: browser-only preview (GitHub Pages, portable builds). */
export const SERVER = import.meta.env.VITE_ADMIN_MODE === 'server'

/** Upload files are `<slug>~<version>.webp`; the version busts caches when a photo is replaced and is not part of the slug. */
export const slugOf = (p: RawPhoto) => p.src.split('/').pop()!.replace(/(~[a-z0-9]+)?\.webp$/, '')

export class HttpError extends Error {
  status: number
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

export type Store = {
  /** Saved content, or undefined when nothing was saved yet (shipped default applies). */
  load(): Promise<Content | undefined>
  save(c: Content): Promise<void>
  /** Stores both renditions; returns manifest paths. `name` has no extension. */
  upload(name: string, big: Blob, thumb: Blob): Promise<{ src: string; thumb: string }>
  session(): Promise<boolean>
  login(password: string): Promise<boolean>
  logout(): Promise<void>
}

// Preview: IndexedDB in this browser. Image paths are `idb:<file>` keys resolved to object URLs.
export const IDB_PREFIX = 'idb:'
export const blobUrls = new Map<string, string>()
const KV = 'kv'
const IMAGES = 'images'
let dbPromise: Promise<IDBDatabase> | undefined

function idb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  const { promise, resolve, reject } = Promise.withResolvers<IDBDatabase>()
  const r = indexedDB.open('fm-admin', 1)
  r.onupgradeneeded = () => {
    r.result.createObjectStore(KV)
    r.result.createObjectStore(IMAGES)
  }
  r.onsuccess = () => resolve(r.result)
  r.onerror = () => reject(r.error)
  dbPromise = promise
  return promise
}

async function idbRequest<T>(store: string, mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const r = run((await idb()).transaction(store, mode).objectStore(store))
  const { promise, resolve, reject } = Promise.withResolvers<T>()
  r.onsuccess = () => resolve(r.result)
  r.onerror = () => reject(r.error)
  return promise
}

function setBlobUrl(key: string, b: Blob) {
  const old = blobUrls.get(key)
  if (old) URL.revokeObjectURL(old)
  blobUrls.set(key, URL.createObjectURL(b))
}

const previewStore: Store = {
  async load() {
    const c = await idbRequest<Content | undefined>(KV, 'readonly', (s) => s.get('content'))
    if (!c) return undefined
    for (const key of await idbRequest(IMAGES, 'readonly', (s) => s.getAllKeys())) {
      const b = await idbRequest<Blob | undefined>(IMAGES, 'readonly', (s) => s.get(key))
      if (b) setBlobUrl(String(key), b)
    }
    return c
  },
  async save(c) {
    await idbRequest(KV, 'readwrite', (s) => s.put(c, 'content'))
    // Drop uploads no longer referenced (deleted or replaced photos).
    const used = new Set(c.photos.flatMap((p) => [p.src, p.thumb]))
    for (const key of await idbRequest(IMAGES, 'readonly', (s) => s.getAllKeys())) {
      if (used.has(String(key))) continue
      await idbRequest(IMAGES, 'readwrite', (s) => s.delete(key))
      URL.revokeObjectURL(blobUrls.get(String(key)) ?? '')
      blobUrls.delete(String(key))
    }
  },
  async upload(name, big, thumb) {
    const src = `${IDB_PREFIX}${name}.webp`
    const th = `${IDB_PREFIX}${name}-640.webp`
    await idbRequest(IMAGES, 'readwrite', (s) => s.put(big, src))
    await idbRequest(IMAGES, 'readwrite', (s) => s.put(thumb, th))
    setBlobUrl(src, big)
    setBlobUrl(th, thumb)
    return { src, thumb: th }
  },
  session: async () => true,
  login: async () => true,
  logout: async () => {},
}

// Server: same-origin JSON API. The custom header makes every mutating call non-simple (CSRF guard on top of SameSite=Strict).
async function api(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${import.meta.env.BASE_URL}api/${path}`, {
    ...init,
    credentials: 'same-origin',
    headers: { 'X-FM-Admin': '1', ...init.headers },
  })
  if (!res.ok && res.status !== 404) throw new HttpError(res.status)
  return res
}

const serverStore: Store = {
  async load() {
    const res = await api('content', { cache: 'no-cache' })
    return res.status === 404 ? undefined : ((await res.json()) as Content)
  },
  async save(c) {
    await api('content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
  },
  async upload(name, big, thumb) {
    for (const [file, blob] of [[`${name}.webp`, big], [`${name}-640.webp`, thumb]] as const) {
      await api(`upload?name=${encodeURIComponent(file)}`, { method: 'POST', headers: { 'Content-Type': 'image/webp' }, body: blob })
    }
    return { src: `uploads/${name}.webp`, thumb: `uploads/${name}-640.webp` }
  },
  async session() {
    const body: unknown = await (await api('session')).json()
    return !!body && typeof body === 'object' && 'authed' in body && body.authed === true
  },
  async login(password) {
    try {
      await api('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      return true
    } catch (e) {
      if (e instanceof HttpError && e.status === 401) return false
      throw e
    }
  },
  async logout() {
    await api('logout', { method: 'POST' })
  },
}

export const store: Store = SERVER ? serverStore : previewStore

/** Saved content if any, otherwise the shipped default; never throws, so the public site always renders. */
export async function loadContent(): Promise<Content> {
  return (await store.load().catch(() => undefined)) ?? DEFAULT_CONTENT
}
