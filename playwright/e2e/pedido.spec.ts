import { test, expect } from '@playwright/test';

const ORDER_ID = 'VLO-LNFEYE';

test('Deve consultar um pedido com sucesso', async ({ page }) => {
  // Arrange
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Velô Sprint', level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible();

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(ORDER_ID);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert
  await expect(page.getByRole('paragraph').filter({ hasText: ORDER_ID })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Dados do Cliente' })).toBeVisible();
  await expect(page.getByText('APROVADO')).toBeVisible();
});
