import raw from './data/gallery.json'

/** Canonical collection order; only those with photos in the manifest are shown. */
export const COLLECTIONS = ['matrimonio', 'battesimo', 'comunione', 'laurea', 'eventi', 'regali'] as const
export type Collection = (typeof COLLECTIONS)[number]

type RawPhoto = {
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

export type Photo = Omit<RawPhoto, 'collection'> & { slug: string; collection: Collection; landscape: boolean }

const base = import.meta.env.BASE_URL
export const asset = (p: string) => base + p.replace(/^\//, '')

const isCollection = (c: string): c is Collection => (COLLECTIONS as readonly string[]).includes(c)

export const photos: Photo[] = (raw as RawPhoto[]).flatMap((p) =>
  isCollection(p.collection)
    ? [
        {
          ...p,
          collection: p.collection,
          slug: p.src.split('/').pop()!.replace(/\.webp$/, ''),
          src: asset(p.src),
          thumb: asset(p.thumb),
          landscape: p.w / p.h > 1.15,
        },
      ]
    : [],
)

/** Collections that actually have photos, in canonical order. */
export const presentCollections: Collection[] = COLLECTIONS.filter((c) => photos.some((p) => p.collection === c))

export const countOf = (c: Collection) => photos.filter((p) => p.collection === c).length

/** Hero collage: tall arch photo first, then two stacked. Falls back to any featured photos. */
const HERO_SLUGS = ['comunione-chanel-cappelliere-rosa', 'battesimo-joseph-fiocco-azzurro', 'matrimonio-davide-veronica-coppetta']
export const heroPhotos: Photo[] = (() => {
  const picked = HERO_SLUGS.map((s) => photos.find((p) => p.slug === s)).filter((p): p is Photo => !!p)
  for (const p of [...photos.filter((x) => x.featured), ...photos]) {
    if (picked.length >= 3) break
    if (!picked.includes(p)) picked.push(p)
  }
  return picked
})()

/** About portrait inside the arch frame. */
export const aboutPhoto: Photo = photos.find((p) => p.slug === 'battesimo-alessia-allestimento-mare') ?? photos[0]

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
