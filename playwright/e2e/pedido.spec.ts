import { test, expect } from '@playwright/test';

test('Deve consultar um pedido com sucesso', async ({ page }) => {
   // Arrange   
  await page.goto('/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-LNFEYE');
  await page.getByRole('button', { name: 'Consultar Pedido' }).click();

  // Assert
  await expect(page.getByRole('heading')).toContainText('Resultado da Consulta');
  await expect(page.getByRole('heading')).toContainText('VLO-LNFEYE');

  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');

  await expect(page.getByTestId('order-result-VLO-LNFEYE')).toContainText('VLO-LNFEYE');

  await expect(page.getByTestId('order-result-VLO-LNFEYE')).toContainText('APROVADO');

});