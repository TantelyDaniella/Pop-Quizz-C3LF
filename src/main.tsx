import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
import '@fontsource/urbanist/700.css'
import '@fontsource/space-grotesk/700.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)