import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'it' | 'en'

const it = {
  'skip': 'Vai al contenuto',
  'nav.label': 'Navigazione principale',
  'nav.home': 'FM Bomboniere, torna all’inizio',
  'nav.about': 'Chi siamo',
  'nav.collections': 'Collezioni',
  'nav.gallery': 'Galleria',
  'nav.contact': 'Contatti',
  'nav.menu': 'Apri menu',
  'nav.close': 'Chiudi menu',
  'lang.label': 'Lingua',
  'hero.eyebrow': 'Bomboniere e articoli da regalo',
  'hero.t1': 'Piccoli dettagli',
  'hero.t2a': 'per i giorni',
  'hero.t2b': 'più belli',
  'hero.lead': 'A Scalea, Francesca Moliterni prepara bomboniere e confezioni regalo su misura per ogni vostra festa.',
  'hero.cta': 'Scopri la galleria',
  'hero.contact': 'Contattaci',
  'about.eyebrow': 'Chi siamo',
  'about.t1': 'Ogni festa merita',
  'about.t2a': 'un ricordo',
  'about.t2b': 'speciale',
  'about.p1': 'FM Bomboniere è il negozio di Francesca Moliterni a Scalea, dedicato alle bomboniere e agli articoli da regalo.',
  'about.p2': 'Insieme scegliamo colori, nastri e dettagli, perché ogni bomboniera somigli a voi e alla vostra occasione.',
  'about.occasions': 'Occasioni',
  'occ': 'Matrimonio|Battesimo|Comunione|Cresima|Nascita|Laurea|Regali',
  'col.eyebrow': 'Collezioni',
  'col.title': 'Le nostre collezioni',
  'col.count': '{n} foto',
  'col.countOne': '1 foto',
  'col.view': 'Vedi nella galleria: {c}',
  'gal.eyebrow': 'Galleria',
  'gal.title': 'Le ultime creazioni',
  'gal.filters': 'Filtra per collezione',
  'gal.all': 'Tutte',
  'gal.open': 'Apri foto: {a}',
  'lb.label': 'Visualizzatore foto',
  'lb.close': 'Chiudi',
  'lb.prev': 'Foto precedente',
  'lb.next': 'Foto successiva',
  'contact.eyebrow': 'Contatti',
  'contact.title': 'Vieni a trovarci',
  'contact.lead': 'Ti aspettiamo in negozio per scegliere insieme la bomboniera giusta. Puoi anche chiamarci o scriverci.',
  'contact.address': 'Indirizzo',
  'contact.maps': 'Apri in Google Maps',
  'contact.phone': 'Telefono',
  'contact.whatsapp': 'WhatsApp',
  'contact.whatsappText': 'Scrivici su WhatsApp',
  'contact.email': 'Email',
  'contact.map': 'Mappa: FM Bomboniere, Via Tommaso Campanella 33, Scalea',
  'contact.mapLoad': 'Mostra la mappa',
  'contact.mapNote': 'La mappa è fornita da Google Maps.',
  'footer.tag': 'Bomboniere e articoli da regalo a Scalea',
  'footer.top': 'Torna su',
  'footer.owner': 'di Francesca Moliterni',
}

export type Key = keyof typeof it

const en: Record<Key, string> = {
  'skip': 'Skip to content',
  'nav.label': 'Main navigation',
  'nav.home': 'FM Bomboniere, back to top',
  'nav.about': 'About',
  'nav.collections': 'Collections',
  'nav.gallery': 'Gallery',
  'nav.contact': 'Contact',
  'nav.menu': 'Open menu',
  'nav.close': 'Close menu',
  'lang.label': 'Language',
  'hero.eyebrow': 'Wedding favours and gifts',
  'hero.t1': 'Little details',
  'hero.t2a': 'for your most',
  'hero.t2b': 'beautiful days',
  'hero.lead': 'In Scalea, Francesca Moliterni prepares favours and gift packaging tailored to every celebration.',
  'hero.cta': 'View the gallery',
  'hero.contact': 'Contact us',
  'about.eyebrow': 'About',
  'about.t1': 'Every celebration deserves',
  'about.t2a': 'a special',
  'about.t2b': 'keepsake',
  'about.p1': 'FM Bomboniere is Francesca Moliterni’s shop in Scalea, devoted to wedding favours and gift items.',
  'about.p2': 'Together we choose colours, ribbons and details, so every favour reflects you and your occasion.',
  'about.occasions': 'Occasions',
  'occ': 'Wedding|Baptism|Communion|Confirmation|Birth|Graduation|Gifts',
  'col.eyebrow': 'Collections',
  'col.title': 'Our collections',
  'col.count': '{n} photos',
  'col.countOne': '1 photo',
  'col.view': 'View in the gallery: {c}',
  'gal.eyebrow': 'Gallery',
  'gal.title': 'Latest creations',
  'gal.filters': 'Filter by collection',
  'gal.all': 'All',
  'gal.open': 'Open photo: {a}',
  'lb.label': 'Photo viewer',
  'lb.close': 'Close',
  'lb.prev': 'Previous photo',
  'lb.next': 'Next photo',
  'contact.eyebrow': 'Contact',
  'contact.title': 'Come and visit us',
  'contact.lead': 'Visit the shop and we will choose the right favour together. You can also call or write to us.',
  'contact.address': 'Address',
  'contact.maps': 'Open in Google Maps',
  'contact.phone': 'Phone',
  'contact.whatsapp': 'WhatsApp',
  'contact.whatsappText': 'Message us on WhatsApp',
  'contact.email': 'Email',
  'contact.map': 'Map: FM Bomboniere, Via Tommaso Campanella 33, Scalea',
  'contact.mapLoad': 'Show the map',
  'contact.mapNote': 'The map is provided by Google Maps.',
  'footer.tag': 'Wedding favours and gifts in Scalea',
  'footer.top': 'Back to top',
  'footer.owner': 'by Francesca Moliterni',
}

export const dict: Record<Lang, Record<Key, string>> = { it, en }
export type TextOverrides = Partial<Record<Lang, Partial<Record<Key, string>>>>
const STORAGE = 'fm-lang'

// Admin-edited copy; set once from loaded content before render.
let overrides: TextOverrides = {}
export function setTextOverrides(o: TextOverrides | undefined) {
  overrides = o ?? {}
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string | number>) => string }
const I18n = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(STORAGE) === 'en' ? 'en' : 'it'))
  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem(STORAGE, lang)
  }, [lang])
  const t: Ctx['t'] = (k, vars) => {
    let s = overrides[lang]?.[k] || dict[lang][k]
    if (vars) for (const [n, v] of Object.entries(vars)) s = s.replace(`{${n}}`, String(v))
    return s
  }
  return <I18n.Provider value={{ lang, setLang, t }}>{children}</I18n.Provider>
}

export function useI18n() {
  const c = useContext(I18n)
  if (!c) throw new Error('useI18n outside I18nProvider')
  return c
}
