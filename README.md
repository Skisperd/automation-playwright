# Velô Sprint - Configurador de Veículo Elétrico

Aplicação web em React para configuração e compra do veículo elétrico **Velô Sprint**.

## Sobre o Projeto

Uma SPA (Single Page Application) que permite:
- Personalizar cores, rodas e opcionais do veículo
- Calcular preços em tempo real
- Realizar pedidos com análise de crédito
- Consultar status de pedidos

**Especificações do Velô Sprint:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv

---

## Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado** | Zustand (global), React Hook Form (formulários) |
| **Validação** | Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Testes E2E** | Playwright (TypeScript) |

---

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome e senha para o banco
4. Aguarde a criação (~2 minutos)

### 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

> Encontre essas informações em: **Project Settings → API**

### 3. Deploy (banco + functions)

```bash
# Instalar CLI
yarn add supabase -D

# Login e vincular projeto
yarn supabase login
yarn supabase link --project-ref qjobpralyjehstolxwwz

# Aplicar migrações (cria tabelas e RLS)
yarn supabase db push

# Deploy das Edge Functions
yarn supabase functions deploy
```

Pronto! O banco e as functions estarão configurados.

---

## Testes E2E (Playwright)

Os testes automatizados usam **Playwright + TypeScript**, no padrão **Actions + Fixtures**
(sem Page Objects/classes). Ver [docs/feature-actions.md](docs/feature-actions.md).

### 1. Pré-requisitos

| Requisito | Observação |
|-----------|------------|
| Node.js 18+ | Mesma versão usada pela aplicação |
| Dependências instaladas | `npm install` (o `@playwright/test` já está no `package.json`) |
| Arquivo `.env` configurado | Os testes rodam contra o Supabase real (ver seção acima) |
| Navegador do Playwright | Instalado no passo 2 |

### 2. Instalar o navegador

O Playwright baixa o próprio binário do Chromium (só precisa ser feito uma vez):

```bash
npx playwright install chromium
```

> Para instalar todos os navegadores (Firefox e WebKit inclusos): `npx playwright install`

### 3. Rodar os testes

```bash
# Executa toda a suíte em modo headless
npm run test:e2e

# Modo UI interativo (recomendado para desenvolver testes)
npm run test:e2e:ui

# Com o navegador visível
npm run test:e2e:headed

# Abre o último relatório HTML
npm run test:e2e:report
```

Não é necessário subir o servidor manualmente: a config tem um `webServer` que executa
`npm run dev` automaticamente e aguarda `http://localhost:5173`. Se o servidor já estiver
rodando, ele é reaproveitado (`reuseExistingServer`).

### 4. Execuções pontuais

```bash
# Um arquivo específico
npx playwright test playwright/e2e/pedidos.spec.ts

# Filtrar pelo título do teste
npx playwright test -g "pedido aprovado"

# Modo debug (inspector passo a passo)
npx playwright test --debug
```

### 5. Estrutura dos testes

```
playwright/
├── e2e/                      # Specs (.spec.ts)
│   └── pedidos.spec.ts          # Consulta de pedidos
├── support/
│   ├── fixtures.ts              # Fixture `app` — injeta todas as actions
│   ├── helpers.ts               # Utilitários (ex: generateOrderCode)
│   └── actions/                 # Actions por contexto
│       ├── landingActions.ts
│       ├── navbarActions.ts
│       └── orderLockupActions.ts
└── backup/legacy/            # Page Objects antigos (não usar)
```

**Como escrever um teste:**

1. Crie/edite a action em `playwright/support/actions/<contexto>Actions.ts`
   (função `create<Contexto>Actions(page)` retornando métodos async — sem `class`/`this`).
2. Registre a action no tipo `App` e na fixture em [playwright/support/fixtures.ts](playwright/support/fixtures.ts).
3. No spec, importe `{ test, expect }` de `../support/fixtures` e consuma via `{ app }`:

```ts
import { test } from '../support/fixtures'

test('deve consultar um pedido', async ({ app }) => {
  await app.landing.goto()
  await app.navbar.orderLockupLink()
  await app.orderLockup.searchOrder('VLO-LNFEYE')
  await app.orderLockup.validateStatusBadge('APROVADO')
})
```

### 6. Configuração

Definida em [playwright.config.ts](playwright.config.ts):

| Item | Valor |
|------|-------|
| `testDir` | `./playwright/e2e` |
| `baseURL` | `http://localhost:5173` |
| Projeto ativo | `chromium` (Firefox/WebKit comentados) |
| Timeout do teste | 60s |
| Timeout de assertiva | 5s |
| Timeout de action | 5s |
| Timeout de navegação | 10s |
| Retries | 2 em CI, 0 local |
| Trace | `retain-on-failure` |
| Reporter | `html` |

### 7. Resultados

- `playwright-report/` — relatório HTML (abra com `npm run test:e2e:report`)
- `test-results/` — traces, screenshots e vídeos das falhas

Ambos estão no `.gitignore` e não devem ser commitados.

> **Atenção:** os testes de consulta usam pedidos fixos (`VLO-LNFEYE`, `VLO-0J7T9E`,
> `VLO-SGOZZO`). Esses registros precisam existir na tabela `orders` do Supabase apontado
> pelo `.env`, senão os cenários falham por dado ausente.

---

## Estrutura Principal

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes shadcn/ui
├── store/           # Estado global (Zustand)
├── hooks/           # Hooks customizados
└── integrations/    # Cliente Supabase
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout/Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |

---

## Modelo de Preços

- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

---

## Banco de Dados

**Tabela `orders`** — campos principais:
- `order_number` — Formato: VLO-XXXXXX
- `color`, `wheel_type`, `optionals` — Configuração
- `customer_name`, `customer_email`, `customer_cpf` — Cliente
- `payment_method`, `total_price` — Pagamento
- `status` — pending, approved, rejected, analysis

---

## Análise de Crédito

| Score | Resultado |
|-------|-----------|
| > 700 | Aprovado |
| 501-700 | Em análise |
| ≤ 500 | Reprovado |

*Se entrada ≥ 50% do total, aprova mesmo com score < 700*

---

## Fluxo Principal

```
Landing → Configurador → Checkout → Análise de Crédito → Confirmação
```

---

## Scripts

```bash
npm run dev                # Desenvolvimento
npm run build              # Build de produção
npm run build:dev          # Build em modo development
npm run preview            # Servir o build de produção
npm run lint               # Verificar código

npm run test:e2e           # Testes E2E (headless)
npm run test:e2e:ui        # Testes E2E em modo UI
npm run test:e2e:headed    # Testes E2E com navegador visível
npm run test:e2e:report    # Abrir o relatório HTML
```