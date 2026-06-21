# SocioN

> Plataforma de formação de sociedades com validação de competências, reputação e confiabilidade.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS v4 · Prisma 7 · Auth.js v5 · Stripe · shadcn/ui · Storybook · Airbnb Design System

---

## 🚀 Setup Local

```bash
npm install
cp .env.example .env
# preencha o .env com suas credenciais
npm run dev
```

## 🎨 Storybook

```bash
npm run storybook
```

Acesse: http://localhost:6006

### Design System (Airbnb-inspired tokens)

| Grupo | Arquivo |
|---|---|
| Tokens (cores, tipografia, espaçamento, radius, shadow) | `components/ds/tokens.ts` |
| TrustScoreBadge | `components/ds/trust-score-badge.tsx` |
| ProfileCard | `components/ds/profile-card.tsx` |
| SearchBar | `components/ds/search-bar.tsx` |
| PartnershipTimeline | `components/ds/partnership-timeline.tsx` |

---

## ☁️ Deploy (GitHub + Vercel)

### 1. Criar repositório GitHub

Instale o GitHub CLI: https://cli.github.com

```bash
gh auth login
gh repo create lbrezende/socion --public
git remote add origin https://github.com/lbrezende/socion.git
git push -u origin main
```

### 2. Deploy Vercel

```bash
npm i -g vercel
vercel login
vercel --prod --name socion
```

URL final: https://socion.vercel.app

### 3. Variáveis de Ambiente no Vercel

Copie todas as variáveis do `.env.example` para:
**Vercel Dashboard → Settings → Environment Variables**

---

## 🗄️ Banco de Dados (Neon)

1. Crie conta em https://neon.tech
2. Crie um projeto e copie a `DATABASE_URL`
3. Adicione no `prisma.config.ts` e `.env`
4. Execute:

```bash
npx prisma migrate dev --name init
```

---

## 🔑 Credenciais Necessárias

| Serviço | Link |
|---|---|
| Google OAuth | https://console.cloud.google.com |
| LinkedIn OAuth | https://developer.linkedin.com |
| Resend | https://resend.com |
| Stripe | https://dashboard.stripe.com |
| Neon PostgreSQL | https://neon.tech |

---

## 📐 Arquitetura

```
app/
  page.tsx              → Landing page
  login/                → Login com LinkedIn + Google
  onboarding/           → Configuração de perfil (2 passos)
  feed/                 → Feed de pitches (estilo TikTok)
  profile/[userId]/     → Perfil completo + Trust Score
  dashboard/            → Sala da sociedade, matches
  settings/billing/     → Plano e cobrança
  api/
    auth/               → Auth.js handlers
    likes/              → Match engine (like bilateral)
    onboarding/         → Salvar preferências
    stripe/checkout/    → Criar sessão de pagamento
    stripe/webhook/     → Processar eventos Stripe
components/
  ds/                   → Design system (tokens + componentes)
  feed/                 → Feed client component
  billing/              → Checkout button
  providers.tsx         → QueryClient + SessionProvider
lib/
  auth.ts               → Auth.js config (LinkedIn, Google, Resend)
  prisma.ts             → Prisma singleton
  stripe.ts             → Stripe lazy init
  plans.ts              → PLAN_LIMITS, isTrialActive, hasAccess
  trust-score.ts        → Trust Score engine
prisma/
  schema.prisma         → Schema completo
stories/
  DesignTokens.stories.tsx
  TrustScoreBadge.stories.tsx
  ProfileCard.stories.tsx
  SearchBar.stories.tsx
  PartnershipTimeline.stories.tsx
```

---

## Trust Engine

Trust Score (0–100) — 5 dimensões com peso igual de 20%:

| Dimensão | Fonte |
|---|---|
| Identidade | KYC via Persona / Onfido |
| Experiência | LinkedIn OAuth |
| Competência | Skills + evidências |
| Reputação | Rede de conexões |
| Comprometimento | Comportamento na plataforma |

---

## Planos

| Plano | Likes | Propostas | Período |
|---|---|---|---|
| TRIAL | 10 | 2 | 14 dias grátis |
| FREE | 5 | 1 | — |
| PRO | ∞ | ∞ | Mensal (Stripe) |
