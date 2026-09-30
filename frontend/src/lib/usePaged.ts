import { useState } from 'react'

/** Filas por tanda en las listas del admin */
export const PAGE_SIZE = 15

/**
 * Lista que se muestra por tandas ("Ver más"). Cuando cambia `resetKey` (filtros, búsqueda)
 * vuelve a la primera tanda: si no, un filtro nuevo arrancaría con la lista ya expandida.
 */
export function usePaged<T>(items: readonly T[], resetKey = '', pageSize = PAGE_SIZE) {
  const [visible, setVisible] = useState(pageSize)
  const [key, setKey] = useState(resetKey)

  // Ajuste durante el render (patrón recomendado por React en lugar de un efecto): sin parpadeo
  if (key !== resetKey) {
    setKey(resetKey)
    setVisible(pageSize)
  }

  return {
    items: items.slice(0, visible),
    shown: Math.min(visible, items.length),
    total: items.length,
    remaining: Math.max(0, items.length - visible),
    showMore: () => setVisible((v) => v + pageSize),
    pageSize,
  }
}
