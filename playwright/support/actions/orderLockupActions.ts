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

export function createOrderLockupActions(page: Page) {

    /** Valor exibido ao lado de um rótulo do cartão de detalhes. Ex.: "Cor" -> "Lunar White" */
    const fieldValue = (label: string) => page.locator(`p:text-is("${label}") + p`)

    const fillOrderCode = async (code: string) => {
        await page.getByRole('textbox', { name: 'Código do Pedido' }).fill(code)
    }

    return {
        async validatePageLoaded() {
            await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
        },

        fillOrderCode,

        async searchOrder(code: string) {
            await fillOrderCode(code)
            await page.getByRole('button', { name: 'Buscar Pedido' }).click()
        },

        async validateOrderDetails(order: OrderDetails) {
            await expect(page.getByTestId('order-result-id')).toHaveText(order.number)

            await expect(fieldValue('Modelo')).toHaveText('Velô Sprint')
            await expect(fieldValue('Cor')).toHaveText(order.color)
            await expect(fieldValue('Interior')).toHaveText(order.interior)
            await expect(fieldValue('Rodas')).toHaveText(order.wheels)

            await expect(fieldValue('Nome')).toHaveText(order.customer.name)
            await expect(fieldValue('Email')).toHaveText(order.customer.email)
            await expect(fieldValue('Data do Pedido')).toHaveText(/\d{2}\/\d{2}\/\d{4}/)

            await expect(page.getByText(order.payment, { exact: true })).toBeVisible()
            await expect(page.getByText(order.total, { exact: true })).toBeVisible()
        },

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

            const statusBadge = page.getByRole('status')

            await expect(statusBadge).toHaveText(status)
            await expect(statusBadge).toHaveClass(new RegExp(`\\b${background}\\b`))
            await expect(statusBadge).toHaveClass(new RegExp(`\\b${text}\\b`))
            await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(`\\b${icon}\\b`))
        },

        async validateOrderNumber(code: string) {
            await expect(page.getByTestId('order-result-id')).toHaveText(code)
        },

        async validateOrderNotFound() {
            await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible()
            await expect(page.getByText('Verifique o número do pedido e tente novamente')).toBeVisible()
            await expect(page.getByTestId('order-result-id')).toBeHidden()
            await expect(page.getByRole('status')).toBeHidden()
        },

        async validateSearchButtonDisabled() {
            await expect(page.getByRole('button', { name: 'Buscar Pedido' })).toBeDisabled()
        },

        async validateSearchButtonEnabled() {
            await expect(page.getByRole('button', { name: 'Buscar Pedido' })).toBeEnabled()
        },
    }
}
