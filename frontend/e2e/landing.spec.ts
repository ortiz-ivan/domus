import { expect, test, type Page } from '@playwright/test'

test.describe('selector de ciudad del buscador', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  const hero = (page: Page) => page.getByRole('search').first()

  test('se elige con el mouse y se cierra al hacer clic afuera', async ({ page }) => {
    const ciudad = hero(page).getByRole('combobox', { name: 'Ciudad' })
    await expect(ciudad).toHaveText('Asunción')

    await ciudad.click()
    const lista = page.getByRole('listbox', { name: 'Ciudad' })
    await expect(lista).toBeVisible()
    await expect(lista.getByRole('option', { name: 'Asunción' })).toHaveAttribute('aria-selected', 'true')
    await lista.getByRole('option', { name: 'Lambaré' }).click()
    await expect(lista).toBeHidden()
    await expect(ciudad).toHaveText('Lambaré')

    await ciudad.click()
    await expect(lista).toBeVisible()
    await page.getByRole('heading', { level: 1 }).click()
    await expect(lista).toBeHidden()
    await expect(ciudad).toHaveText('Lambaré')
  })

  test('se maneja con el teclado', async ({ page }) => {
    const ciudad = hero(page).getByRole('combobox', { name: 'Ciudad' })
    const lista = page.getByRole('listbox', { name: 'Ciudad' })
    await ciudad.focus()

    // Flecha abajo abre en la opción elegida; otra la mueve; Enter confirma
    await page.keyboard.press('ArrowDown')
    await expect(ciudad).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('ArrowDown')
    const luque = await lista.getByRole('option', { name: 'Luque' }).getAttribute('id')
    await expect(ciudad).toHaveAttribute('aria-activedescendant', luque!)
    await page.keyboard.press('Enter')
    await expect(ciudad).toHaveText('Luque')
    await expect(ciudad).toBeFocused()

    // Escape cierra sin cambiar
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('End')
    await page.keyboard.press('Escape')
    await expect(lista).toBeHidden()
    await expect(ciudad).toHaveText('Luque')

    // Escribir la inicial salta a esa ciudad
    await page.keyboard.press('f')
    await page.keyboard.press('Enter')
    await expect(ciudad).toHaveText('Fernando de la Mora')
  })
})

test('la lista pública de profesionales se ordena con el selector propio', async ({ page }) => {
  await page.goto('/servicios/plomeria')
  const orden = page.getByRole('combobox', { name: 'Ordenar por' })
  await expect(orden).toHaveText('Recomendados')

  await orden.click()
  await page.getByRole('option', { name: 'Responden más rápido' }).click()
  await expect(orden).toHaveText('Responden más rápido')

  // Las tarjetas quedan de menor a mayor tiempo de respuesta
  const tiempos = await page.getByText(/^Responde en /).allTextContents()
  const minutos = tiempos.map((t) => {
    const [, n, unidad] = t.match(/(\d+) (min|h|día|días)/)!
    return Number(n) * (unidad === 'min' ? 1 : unidad === 'h' ? 60 : 1440)
  })
  expect(minutos.length).toBeGreaterThan(5)
  expect(minutos).toEqual([...minutos].sort((a, b) => a - b))
})
