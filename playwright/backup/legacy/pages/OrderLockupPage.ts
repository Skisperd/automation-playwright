import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrderDetails = {
    number: string
    status: OrderStatus
    color: string
    interior: string
    wheels: string
    customer: {
        name: string
        email: string
    }
    payment: string
    total: string
}

export class OrderLockupPage {

    constructor(private page: Page) { }

    async validatePageLoaded() {
        await expect(this.page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
    }

    async fillOrderCode(code: string) {
        await this.page.getByRole('textbox', { name: 'Código do Pedido' }).fill(code)
    }

    async searchOrder(code: string) {
        await this.fillOrderCode(code)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }

    async validateOrderDetails(order: OrderDetails) {
        await expect(this.page.getByTestId('order-result-id')).toHaveText(order.number)

        await expect(this.fieldValue('Modelo')).toHaveText('Velô Sprint')
        await expect(this.fieldValue('Cor')).toHaveText(order.color)
        await expect(this.fieldValue('Interior')).toHaveText(order.interior)
        await expect(this.fieldValue('Rodas')).toHaveText(order.wheels)

        await expect(this.fieldValue('Nome')).toHaveText(order.customer.name)
        await expect(this.fieldValue('Email')).toHaveText(order.customer.email)
        await expect(this.fieldValue('Data do Pedido')).toHaveText(/\d{2}\/\d{2}\/\d{4}/)

        await expect(this.page.getByText(order.payment, { exact: true })).toBeVisible()
        await expect(this.page.getByText(order.total, { exact: true })).toBeVisible()
    }

    async validateStatusBadge(status: OrderStatus) {
        const statusClasses = {
            APROVADO: {
                background: 'bg-green-100',
                text: 'text-green-700',
                icon: 'lucide-circle-check-big'
            },
            REPROVADO: {
                background: 'bg-red-100',
                text: 'text-red-700',
                icon: 'lucide-circle-x'
            },
            EM_ANALISE: {
                background: 'bg-amber-100',
                text: 'text-amber-700',
                icon: 'lucide-clock'
            }
        } as const

        const { background, text, icon } = statusClasses[status]

        const statusBadge = this.page.getByRole('status')

        await expect(statusBadge).toHaveText(status)
        await expect(statusBadge).toHaveClass(new RegExp(`\\b${background}\\b`))
        await expect(statusBadge).toHaveClass(new RegExp(`\\b${text}\\b`))
        await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(`\\b${icon}\\b`))
    }

    async validateOrderNumber(code: string) {
        await expect(this.page.getByTestId('order-result-id')).toHaveText(code)
    }

    async validateOrderNotFound() {
        await expect(this.page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible()
        await expect(this.page.getByText('Verifique o número do pedido e tente novamente')).toBeVisible()
        await expect(this.page.getByTestId('order-result-id')).toBeHidden()
        await expect(this.page.getByRole('status')).toBeHidden()
    }

    async validateSearchButtonDisabled() {
        await expect(this.page.getByRole('button', { name: 'Buscar Pedido' })).toBeDisabled()
    }

    async validateSearchButtonEnabled() {
        await expect(this.page.getByRole('button', { name: 'Buscar Pedido' })).toBeEnabled()
    }

    /** Valor exibido ao lado de um rótulo do cartão de detalhes. Ex.: "Cor" -> "Lunar White" */
    private fieldValue(label: string) {
        return this.page.locator(`p:text-is("${label}") + p`)
    }
}
