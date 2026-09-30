import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'
// Fuentes servidas desde el propio sitio: la demo no depende de Google Fonts ni de la conexión del lugar
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/montserrat/wght.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
