import { Page } from '@playwright/test'

export function createNavbarActions(page: Page) {
    return {
        async orderLookupLink() {
            await page.getByRole('link', { name: 'Consultar Pedido' }).click()
        },
    }
}
