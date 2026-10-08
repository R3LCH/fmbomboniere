import { blobUrls, IDB_PREFIX, slugOf, type Category, type Content, type RawPhoto } from './content.ts'
import type { Lang } from './i18n.tsx'

export type Collection = string
export type Photo = RawPhoto & { slug: string; landscape: boolean }

const base = import.meta.env.BASE_URL
/** Base-path aware URL; `idb:` keys resolve to object URLs of admin uploads. */
export const asset = (p: string) => (p.startsWith(IDB_PREFIX) ? (blobUrls.get(p) ?? '') : base + p.replace(/^\//, ''))

// Live bindings, filled once by initData() before the app renders.
export let collections: Category[] = []
export let photos: Photo[] = []
export let presentCollections: Collection[] = []
export let heroPhotos: Photo[] = []
export let aboutPhoto: Photo | undefined

export function initData(c: Content) {
  collections = c.collections
  const known = new Set(c.collections.map((x) => x.id))
  photos = c.photos.flatMap((p) =>
    known.has(p.collection) ? [{ ...p, slug: slugOf(p), src: asset(p.src), thumb: asset(p.thumb), landscape: p.w / p.h > 1.15 }] : [],
  )
  presentCollections = c.collections.map((x) => x.id).filter((id) => photos.some((p) => p.collection === id))
  // Hero collage: chosen slugs first, topped up with featured, then any photo.
  const picked = c.hero.map((s) => photos.find((p) => p.slug === s)).filter((p): p is Photo => !!p)
  for (const p of [...photos.filter((x) => x.featured), ...photos]) {
    if (picked.length >= 3) break
    if (!picked.includes(p)) picked.push(p)
  }
  heroPhotos = picked
  aboutPhoto = photos.find((p) => p.slug === c.about) ?? photos[0]
}

export const label = (id: Collection, lang: Lang) => collections.find((c) => c.id === id)?.[lang] ?? id

export const countOf = (c: Collection) => photos.filter((p) => p.collection === c).length

/** Collection cover: a featured photo not used in the hero, then any non-hero photo, then any. */
export const cover = (c: Collection): Photo => {
  const own = photos.filter((p) => p.collection === c)
  const fresh = own.filter((p) => !heroPhotos.includes(p))
  return fresh.find((p) => p.featured) ?? fresh[0] ?? own[0]
}

const ADDRESS_QUERY = 'Via Tommaso Campanella 33, 87029 Scalea CS'

export const CONTACT = {
  phone: '+393773802773',
  phoneLabel: '377 380 2773',
  whatsapp: 'https://wa.me/393773802773',
  email: 'moliternifrancesca91@gmail.com',
  instagram: 'https://www.instagram.com/fmbombonierescalea/',
  instagramLabel: '@fmbombonierescalea',
  facebook: 'https://www.facebook.com/profile.php?id=61556412425114',
  street: 'Via Tommaso Campanella, 33',
  city: '87029 Scalea (CS), Italia',
  maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ADDRESS_QUERY),
  embed: 'https://maps.google.com/maps?q=' + encodeURIComponent(ADDRESS_QUERY) + '&z=16&output=embed',
}
