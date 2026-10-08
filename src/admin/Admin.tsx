import { useEffect, useState, type FormEvent } from 'react'
import { DEFAULT_CONTENT, HttpError, SERVER, store, type Content } from '../content.ts'
import type { Lang } from '../i18n.tsx'
import Categories from './Categories.tsx'
import Photos from './Photos.tsx'
import SitePhotos from './SitePhotos.tsx'
import { makeT, type T } from './strings.ts'
import Texts from './Texts.tsx'
import { field, small } from './ui.tsx'

type Tab = 'photos' | 'categories' | 'site' | 'texts'
type Status = 'idle' | 'saving' | 'error' | 'expired'
export type Update = (fn: (c: Content) => Content) => void

const LANG = 'fm-admin-lang'

export default function Admin() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(LANG) === 'en' ? 'en' : 'it'))
  const t = makeT(lang)
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [content, setContent] = useState<Content | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [tab, setTab] = useState<Tab>('photos')

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem(LANG, lang)
  }, [lang])

  useEffect(() => {
    store.session().then(setAuthed, () => setAuthed(false))
  }, [])

  // Load once after sign-in; a re-login after expiry keeps the unsaved edits in memory.
  useEffect(() => {
    if (!authed || content) return
    store.load().then(
      (c) => setContent(c ?? structuredClone(DEFAULT_CONTENT)),
      () => setLoadError(true),
    )
  }, [authed, content])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    addEventListener('beforeunload', warn)
    return () => removeEventListener('beforeunload', warn)
  }, [dirty])

  const update: Update = (fn) => {
    setContent((c) => c && fn(c))
    setDirty(true)
    setStatus((s) => (s === 'error' ? 'idle' : s))
  }

  const save = async () => {
    if (!content) return
    setStatus('saving')
    try {
      await store.save(content)
      setDirty(false)
      setStatus('idle')
    } catch (e) {
      if (e instanceof HttpError && e.status === 401) {
        setStatus('expired')
        setAuthed(false)
      } else setStatus('error')
    }
  }

  if (authed === false) return <Login t={t} expired={status === 'expired'} onDone={() => (setAuthed(true), setStatus('idle'))} />
  if (loadError) return <Centered>{t('loadError')}</Centered>
  if (authed === null || !content) return <Centered>{t('loading')}</Centered>

  const tabs: [Tab, string][] = [
    ['photos', t('tabPhotos')],
    ['categories', t('tabCategories')],
    ['site', t('tabSite')],
    ['texts', t('tabTexts')],
  ]
  const statusText = status === 'saving' ? t('saving') : status === 'error' ? t('saveError') : dirty ? t('unsaved') : t('saved')

  return (
    <div className="min-h-dvh bg-ivory">
      <header className="sticky top-0 z-10 border-b border-line bg-white">
        <div className="wrap flex flex-wrap items-center gap-3 py-3">
          <h1 className="h3 m-0 mr-auto">{t('title')}</h1>
          <a className={`${small} inline-flex items-center no-underline`} href={import.meta.env.BASE_URL} target="_blank" rel="noopener">
            {t('viewSite')}
          </a>
          <button type="button" className={small} lang={lang === 'it' ? 'en' : 'it'} onClick={() => setLang(lang === 'it' ? 'en' : 'it')}>
            {t('lang')}
          </button>
          {SERVER && (
            <button type="button" className={small} onClick={() => store.logout().finally(() => location.reload())}>
              {t('logout')}
            </button>
          )}
        </div>
        <div className="wrap flex flex-wrap items-center gap-3 pb-3">
          <nav aria-label={t('tabs')} className="mr-auto flex flex-wrap gap-2">
            {tabs.map(([id, name]) => (
              <button
                key={id}
                type="button"
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
                className={`nav-text min-h-11 cursor-pointer rounded-full border px-5 transition-colors duration-200 ${
                  tab === id ? 'border-action bg-action text-white' : 'border-line bg-white text-ink hover:border-action hover:text-action'
                }`}
              >
                {name}
              </button>
            ))}
          </nav>
          <p role="status" className={`caption m-0 ${status === 'error' ? 'text-action' : 'text-muted'}`}>
            {statusText}
          </p>
          <button type="button" className="btn btn-primary" disabled={!dirty || status === 'saving'} onClick={save}>
            {t('save')}
          </button>
        </div>
        {!SERVER && <p className="caption m-0 bg-sky px-[var(--gutter)] py-2 text-ink">{t('preview')}</p>}
      </header>
      <main className="wrap py-8">
        {tab === 'photos' && <Photos t={t} lang={lang} content={content} update={update} />}
        {tab === 'categories' && <Categories t={t} content={content} update={update} />}
        {tab === 'site' && <SitePhotos t={t} lang={lang} content={content} update={update} />}
        {tab === 'texts' && <Texts t={t} content={content} update={update} />}
        <div className="mt-16 border-t border-line pt-6">
          <button
            type="button"
            className={small}
            onClick={() => {
              if (confirm(t('resetConfirm'))) update(() => structuredClone(DEFAULT_CONTENT))
            }}
          >
            {t('reset')}
          </button>
        </div>
      </main>
    </div>
  )
}

function Centered({ children }: { children: string }) {
  return <p className="grid min-h-dvh place-items-center bg-ivory text-muted" role="status">{children}</p>
}

function Login({ t, expired, onDone }: { t: T; expired: boolean; onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (await store.login(password)) onDone()
      else setError(t('loginError'))
    } catch {
      setError(t('loginFail'))
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="grid min-h-dvh place-items-center bg-ivory px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[14px] border border-line bg-white p-8">
        <h1 className="h3 m-0 mb-6">{t('loginTitle')}</h1>
        {expired && <p className="caption mb-4 text-ink">{t('expired')}</p>}
        <label className="block">
          <span className="caption mb-1 block text-muted">{t('password')}</span>
          <input type="password" autoComplete="current-password" required autoFocus className={field} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p role="alert" className="caption mt-3 text-action">{error}</p>}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={busy}>
          {t('loginBtn')}
        </button>
      </form>
    </main>
  )
}
