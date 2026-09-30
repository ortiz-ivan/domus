/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { enabledRoles, parseDemoScope } from './src/app/scope.ts'

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Lee .env* y también las variables del entorno (así llega VITE_DEMO_SCOPE desde netlify.toml)
  const env = loadEnv(mode, process.cwd(), '')
  const scope = parseDemoScope(env.VITE_DEMO_SCOPE, env.VITE_LANDING_ONLY)
  const roles = enabledRoles(scope)
  const disabled = src('app/routes/disabledRoutes.ts')

  // Lo que no se publica no se compila ni se sube al deploy: sus rutas apuntan a módulos vacíos
  const scopeAliases =
    scope === 'landing'
      ? [{ find: '@/app/appRoutes', replacement: src('app/appRoutes.landing.ts') }]
      : (['cliente', 'profesional', 'admin'] as const)
          .filter((role) => !roles.includes(role))
          .map((role) => ({ find: `@/app/routes/${role}Routes`, replacement: disabled }))

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        ...scopeAliases,
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
      // Los de e2e/ son de Playwright (pnpm e2e)
      include: ['src/**/*.test.{ts,tsx}'],
    },
  }
})
