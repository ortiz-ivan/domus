/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Lee .env* y también las variables del entorno (así llega VITE_LANDING_ONLY desde netlify.toml)
  const landingOnly = loadEnv(mode, process.cwd(), '').VITE_LANDING_ONLY === 'true'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        // Solo landing: las rutas de la app no se compilan ni se suben al deploy
        ...(landingOnly ? [{ find: '@/app/appRoutes', replacement: src('app/appRoutes.landing.ts') }] : []),
        { find: '@', replacement: src('') },
      ],
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              // Librerías que casi no cambian: un archivo aparte que el navegador reutiliza de su caché entre deploys
              { name: 'vendor', test: /node_modules[\\/](react|react-dom|react-router|scheduler|zustand|tailwind-merge)[\\/]/ },
            ],
          },
        },
      },
    },
    test: {
      // jsdom: localStorage, sessionStorage y eventos "storage" reales
      environment: 'jsdom',
    },
  }
})
