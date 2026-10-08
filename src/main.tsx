import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { loadContent } from './content.ts'
import { initData } from './data.ts'
import { I18nProvider, setTextOverrides } from './i18n.tsx'
import './index.css'

// Saved admin content (server API or this browser's preview draft), else the shipped manifest.
const content = await loadContent()
initData(content)
setTextOverrides(content.text)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
