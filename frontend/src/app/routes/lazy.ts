import type { ComponentType } from 'react'

/**
 * Toma un componente de un módulo que se importa recién al navegar a la ruta.
 * `name` se valida contra los exports: un nombre mal escrito falla al compilar.
 */
export const from = <M,>(load: () => Promise<M>, name: keyof M) => ({
  Component: async () => (await load())[name] as ComponentType,
})

export const layouts = () => import('@/components/layout/RoleLayout')
