import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from '../i18n.tsx'
import '../index.css'
import Admin from './Admin.tsx'

// Same provider as the site: the IT/EN choice (fm-lang) is shared between site and admin.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <Admin />
    </I18nProvider>
  </StrictMode>,
)
