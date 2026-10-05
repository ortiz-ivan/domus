import { expect, test } from '@playwright/test'

/**
 * Vista dividida para la TV: los dos celulares comparten la pestaña (y su sessionStorage),
 * pero cada uno tiene que quedar en su rol, también al recargar la página.
 */
test('la vista dividida muestra al cliente y al profesional, cada uno en su rol', async ({ page }) => {
  await page.goto('/presentacion')
  const cliente = page.frameLocator('iframe[name="cliente"]')
  const pro = page.frameLocator('iframe[name="profesional"]')

  const enRol = async () => {
    await expect(cliente.getByRole('heading', { name: /^Hola, / })).toBeVisible()
    await expect(cliente.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Mis solicitudes' })).toBeVisible()
    await expect(pro.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Ganancias' })).toBeVisible()
    // Dentro de los celulares no aparecen los controles del presentador
    await expect(cliente.getByRole('button', { name: 'Controles del presentador' })).toHaveCount(0)
  }

  await enRol()
  await page.reload()
  await enRol()

  // Lo que hace un celular le llega al otro: María cancela su solicitud pendiente y a Carlos le aparece el aviso arriba
  await cliente.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Mis solicitudes' }).click()
  await cliente.getByRole('link', { name: /Pérdida de agua bajo la pileta/ }).first().click()
  await cliente.getByRole('button', { name: 'Cancelar solicitud' }).click()
  await cliente.getByRole('button', { name: 'Sí, cancelar' }).click()
  await expect(pro.getByRole('paragraph').filter({ hasText: 'María canceló “Pérdida de agua bajo la pileta”' })).toBeVisible()
  await expect(pro.getByText('Domus · ahora')).toBeVisible()
})

test('en la vista dividida se elige con qué profesional entra su celular', async ({ page }) => {
  await page.goto('/presentacion')
  const pro = page.frameLocator('iframe[name="profesional"]')
  await expect(pro.getByRole('heading', { name: 'Hola, Carlos' })).toBeVisible()

  await page.getByRole('combobox', { name: 'Profesional que se muestra' }).click()
  await page.getByRole('option', { name: 'Fernando Duarte · Electricidad' }).click()
  await expect(pro.getByRole('heading', { name: 'Hola, Fernando' })).toBeVisible()
  // El cliente sigue en su celular, sin cambios
  await expect(page.frameLocator('iframe[name="cliente"]').getByRole('heading', { name: /^Hola, María/ })).toBeVisible()
})

test('al ingresar como profesional se elige uno por categoría', async ({ page }) => {
  await page.goto('/ingresar')
  await page.getByRole('button', { name: /Profesional/ }).click()
  const dialog = page.getByRole('dialog', { name: '¿Con qué profesional entrás?' })
  await expect(dialog.getByRole('button')).toHaveCount(9) // 8 categorías + cerrar
  await dialog.getByRole('button', { name: /Liliana Báez/ }).click()
  await expect(page).toHaveURL('/profesional')
  await expect(page.getByRole('heading', { name: 'Hola, Liliana' })).toBeVisible()
})
