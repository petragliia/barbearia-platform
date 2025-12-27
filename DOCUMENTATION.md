# BarberSaaS - Barbershop WaaS Platform

## 1. Visão Geral
O BarberSaaS é uma plataforma "Website as a Service" (WaaS) projetada para barbearias. A plataforma permite que barbeiros criem, personalizem e gerenciem seus próprios sites, agendamentos e automações de marketing através de um painel intuitivo.

## 2. Tecnologias (Tech Stack)

### Core
- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **UI Library**: React 19
- **Estilização**: Tailwind CSS 4

### Backend & Serviços
- **Banco de Dados & Auth**: Firebase (Firestore, Auth)
- **Pagamentos**: Stripe (Subscriptions & Checkout)
- **Automação**: n8n (Webhooks para WhatsApp)

### Principais Bibliotecas
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit (Core, Sortable, Modifiers)
- **Formulários**: React Hook Form + Zod
- **UI Components**: Radix UI + Lucide React
- **3D/Visuals**: React Three Fiber / Drei

## 3. Arquitetura do Projeto

O projeto segue uma arquitetura baseada em funcionalidades (`Feature-Based Architecture`) dentro de `src/features`, mantendo componentes compartilhados em `src/components`.

### Estrutura de Diretórios
```
src/
├── app/                 # Next.js App Router (Páginas e Rotas API)
├── components/          # Componentes UI reutilizáveis (Button, Input, Card...)
├── config/              # Configurações globais (Stripe, Site types...)
├── features/            # Módulos principais
│   ├── auth/            # Autenticação
│   ├── builder/         # Editor visual de sites (Drag & Drop)
│   ├── loyalty/         # Sistema de fidelidade
│   ├── marketing/       # Automações e disparos
│   └── subscription/    # Planos e pagamentos
├── hooks/               # Custom React Hooks
├── lib/                 # Configurações de libs (Firebase, Stripe, Utils)
├── services/            # Serviços externos (n8n, API clients)
└── types/               # Definições de tipos TypeScript globais
```

## 4. Principais Funcionalidades

### 📅 Sistema de Agendamento
Solução completa para gestão de horários.
- **Online & WhatsApp**: Agendamento via site ou integrado ao WhatsApp.
- **Múltiplos Profissionais**: Suporte a agenda para diferentes barbeiros (Plano Empire).
- **Sincronização**: Atualização em tempo real de horários disponíveis.

### 🔔 Notificação Inteligente
Sistema automatizado para redução de *no-shows*.
- **Lembretes Automáticos**: Envio de confirmações via WhatsApp e E-mail.
- **Integração n8n**: Webhooks personalizáveis para fluxos de comunicação (`n8nService`).

### 👥 Gestão de Clientes (CRM)
Base de dados completa dos clientes da barbearia.
- **Histórico**: Registro de serviços realizados.
- **Métricas**: Acompanhamento de frequência e ticket médio.

### 🎨 Edição Visual (Site Builder)
Ferramenta No-Code para personalização do site.
- **Drag & Drop**: Reordenamento visual de seções.
- **Temas**: Layouts Classic, Modern e Urban.
- **Conteúdo Personalizável**: Edição fácil de textos e preços.

### 🏆 Fidelidade & Marketing
Ferramentas para retenção e engajamento.
- **Programa de Pontos**: Configuração flexível de recompensas.
- **Métricas Avançadas**: Relatórios de desempenho (Plano Empire).

### 💰 Gestão Financeira & Vendas
- **Venda de Produtos**: Catálogo para produtos capilares e acessórios.
- **Assinaturas**: Controle dos planos da barbearia via Stripe.

## 5. Configuração de Ambiente (.env.local)

As seguintes variáveis são necessárias para o funcionamento pleno:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# N8N Automation
NEXT_PUBLIC_N8N_WHATSAPP_WEBHOOK=   # Webhook específico para msg
NEXT_PUBLIC_N8N_WEBHOOK=            # Webhook genérico para workflows
```

## 6. Comandos Úteis

```bash
# Rodar ambiente de desenvolvimento
# Rodar ambiente de desenvolvimento
npm run dev

# Rodar Stack de Automação (n8n + Evolution API)
cd n8n_local && docker compose up -d

# Rodar listener do Stripe (Webhooks locais)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Build de produção
npm run build
```
