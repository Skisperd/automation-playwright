import { Locator, Page } from '@playwright/test'

export class OrderLockupPage {
    readonly orderCodeInput: Locator
    readonly searchButton: Locator
    readonly statusBadge: Locator
    readonly statusIcon: Locator
    readonly orderCode: Locator
    readonly notFoundMessage: Locator

    constructor(private page: Page) {
        this.orderCodeInput = page.getByTestId('search-order-id')
        this.searchButton = page.getByTestId('search-order-button')
        this.statusBadge = page.getByRole('status')
        this.statusIcon = this.statusBadge.locator('svg')
        this.orderCode = page.getByTestId('order-result-id')
        this.notFoundMessage = page.getByRole('heading', { name: 'Pedido não encontrado' })
    }

    /** Acessa a consulta direto pela URL. */
    async open() {
        await this.page.goto('/lookup')
    }

    /** Acessa a consulta pelo menu, como um usuário faria a partir da home. */
    async openFromLanding() {
        await this.page.goto('/')
        await this.page.getByRole('link', { name: 'Consultar Pedido' }).click()
    }

    async searchOrder(code: string) {
        await this.orderCodeInput.fill(code)
        await this.searchButton.click()
    }
}
