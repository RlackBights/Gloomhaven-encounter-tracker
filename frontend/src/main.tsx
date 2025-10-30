import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Main from './components/Main/Main.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
