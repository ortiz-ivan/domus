/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Alcance de la demo publicada: "full" | "cliente" | "landing" (ver src/app/scope.ts) */
  readonly VITE_DEMO_SCOPE?: string
  /** Anterior a VITE_DEMO_SCOPE: "true" equivale a VITE_DEMO_SCOPE=landing */
  readonly VITE_LANDING_ONLY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
