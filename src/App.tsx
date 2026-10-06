import { useEffect, useState } from 'react'
import About from './components/About.tsx'
import Collections from './components/Collections.tsx'
import Contact from './components/Contact.tsx'
import Footer from './components/Footer.tsx'
import Gallery, { type Filter } from './components/Gallery.tsx'
import Header from './components/Header.tsx'
import Hero from './components/Hero.tsx'
import Intro from './components/Intro.tsx'
import { useI18n } from './i18n.tsx'
import { scrollToId, startLenis } from './motion.ts'

export default function App() {
  const { t } = useI18n()
  const [ready, setReady] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    startLenis()
    const id = location.hash.slice(1)
    if (id) requestAnimationFrame(() => scrollToId(id))
  }, [])

  return (
    <>
      <a href="#main" className="btn btn-primary fixed top-3 left-3 z-[110] -translate-y-[200%] focus:translate-y-0">
        {t('skip')}
      </a>
      <Intro onDone={() => setReady(true)} />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={ready} />
        <About />
        <Collections
          onPick={(c) => {
            setFilter(c)
            scrollToId('galleria')
          }}
        />
        <Gallery filter={filter} setFilter={setFilter} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
