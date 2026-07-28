export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export type OrderTestData = {
  /** Sufixo usado no título do teste. Ex.: "aprovado" */
  scenario: string;
  code: string;
  status: OrderStatus;
  color: string;
  interior: string;
  wheels: string;
  customer: {
    name: string;
    email: string;
  };
  payment: string;
  total: string;
  /** Identidade visual da badge de status (ver statusStyles em src/pages/OrderLookup.tsx) */
  badge: {
    classes: string[];
    icon: string;
  };
};

export const approvedOrder: OrderTestData = {
  scenario: 'aprovado',
  code: 'VLO-LNFEYE',
  status: 'APROVADO',
  color: 'Glacier Blue',
  interior: 'cream',
  wheels: 'aero Wheels',
  customer: {
    name: 'Tiago Oliveira',
    email: 'tiago.qa@gmail.com',
  },
  payment: 'À Vista',
  total: 'R$ 40.000,00',
  badge: {
    classes: ['bg-green-100', 'text-green-700'],
    icon: 'lucide-circle-check-big',
  },
};

export const rejectedOrder: OrderTestData = {
  scenario: 'reprovado',
  code: 'VLO-0J7T9E',
  status: 'REPROVADO',
  color: 'Midnight Black',
  interior: 'cream',
  wheels: 'sport Wheels',
  customer: {
    name: 'TIAGO DE OLIVEIRA',
    email: 'felipe.reprovado@apple.com',
  },
  payment: 'À Vista',
  total: 'R$ 52.500,00',
  badge: {
    classes: ['bg-red-100', 'text-red-700'],
    icon: 'lucide-circle-x',
  },
};

export const inAnalysisOrder: OrderTestData = {
  scenario: 'em análise',
  code: 'VLO-SGOZZO',
  status: 'EM_ANALISE',
  color: 'Lunar White',
  interior: 'cream',
  wheels: 'aero Wheels',
  customer: {
    name: 'Nicolas James',
    email: 'james@apple.com',
  },
  payment: 'À Vista',
  total: 'R$ 40.000,00',
  badge: {
    classes: ['bg-amber-100', 'text-amber-700'],
    icon: 'lucide-clock',
  },
};

export const orders = [approvedOrder, rejectedOrder, inAnalysisOrder];

/**
 * Monta o aria snapshot esperado do cartão de detalhes do pedido.
 *
 * Observações:
 * - "Loja de Retirada" é um parágrafo vazio porque a consulta devolve store: ''
 *   (ver dbOrderToOrder em src/hooks/useOrders.ts).
 * - A data do pedido é validada por formato, não por valor, para não depender
 *   de quando a massa de teste foi criada.
 */
export function orderDetailsSnapshot(order: OrderTestData): string {
  return `
    - img
    - paragraph: Pedido
    - paragraph: ${order.code}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: ${order.interior}
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d{2}\\/\\d{2}\\/\\d{4}/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: ${order.total}
  `;
}
