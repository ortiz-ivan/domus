/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" publica solo la landing (vista previa para el cliente) */
  readonly VITE_LANDING_ONLY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
