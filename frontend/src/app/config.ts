/**
 * Modo vista previa: publica solo la landing (VITE_LANDING_ONLY=true).
 * Lo activa netlify.toml; en desarrollo local la app completa sigue disponible.
 */
export const LANDING_ONLY = import.meta.env.VITE_LANDING_ONLY === 'true'
