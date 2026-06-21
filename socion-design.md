# SocioN — Design System

> Dark mode "trust green". A identidade transmite confiança mensurável: fundo escuro, verde como cor de ação/confiança, tipografia forte. Substitui o tema Airbnb (rosa) do boilerplate — ver `design.md` para a referência original.

## 1. Cores (tokens)

### Superfícies
| Token | Hex | Uso |
|---|---|---|
| `bg/base` | `#0a0f0d` | Fundo principal de todas as páginas |
| `bg/surface` | `#0d1310` | Headers, navs, faixas |
| `bg/card` | `#111816` | Cards, painéis |
| `bg/inset` | `#161f1a` | Inputs, botões secundários |

### Verde (marca / ação / confiança)
| Token | Hex | Uso |
|---|---|---|
| `green/500` | `#00a86b` | Primária — botões, links, destaques, score |
| `green/600` | `#009060` | Hover do botão primário |
| `green/deep` | `#003d26` | Fundo de badges/realces verdes |

### Bordas
| Token | Hex | Uso |
|---|---|---|
| `border/hairline` | `#1e2e26` | Borda padrão de cards |
| `border/strong` | `#2a3d32` | Borda de inputs e hover |

### Texto
| Token | Hex | Uso |
|---|---|---|
| `text/primary` | `#ffffff` | Títulos e conteúdo principal |
| `text/secondary` | `#8a9e94` | Texto de apoio, descrições |
| `text/muted` | `#4a5e54` | Labels, legendas, placeholders |

### Estados
| Token | Texto / Fundo | Uso |
|---|---|---|
| `state/warning` | `#ffb84d` / `#1a1000` | "Em análise" / pendente |
| `state/danger` | `#f87171` / `#1a0a0a` | Rejeitado / erro / denúncia |
| `state/success` | `#00a86b` / `#003d26` | Verificado / aprovado / match |

## 2. Tipografia

Fonte: **Geist** (`next/font/google`), variável `--font-geist-sans`.

| Token | Tailwind | Tamanho | Uso |
|---|---|---|---|
| `display/xl` | `text-6xl` | 60px | Headline do hero |
| `display/lg` | `text-5xl` | 48px | Títulos de seção da landing |
| `display/md` | `text-4xl` | 36px | Títulos de página (admin, onboarding) |
| `heading` | `text-2xl` | 24px | Título de card / nome de perfil |
| `title` | `text-xl` | 20px | Subtítulos |
| `body` | `text-base` | 16px | Corpo |
| `body/sm` | `text-sm` | 14px | Texto de apoio |
| `caption` | `text-xs` | 12px | Labels, badges |

Pesos: `font-bold` (títulos), `font-medium` (botões/labels), `font-normal` (corpo).

## 3. Raios e espaçamento

| Token | Tailwind | Uso |
|---|---|---|
| `radius/pill` | `rounded-full` | Badges, botões da landing |
| `radius/lg` | `rounded-lg` (8px) | Botões, inputs |
| `radius/xl` | `rounded-xl` (12px) | Cards internos |
| `radius/2xl` | `rounded-2xl` (16px) | Cards principais |
| `radius/3xl` | `rounded-3xl` (24px) | Blocos de CTA / hero |

Seção: `py-20`. Gap de cards: `gap-4`/`gap-5`. Padding de card: `p-6`.

## 4. Componentes-chave

- **Botão primário**: `bg-[#00a86b] hover:bg-[#009060] text-white rounded-lg px-4 py-2 font-medium`
- **Botão secundário**: `bg-[#161f1a] border border-[#2a3d32] text-white hover:bg-[#1e2e26]`
- **Card**: `bg-[#111816] border border-[#1e2e26] rounded-2xl p-6`
- **Badge verde**: `bg-[#003d26] text-[#00a86b] text-xs px-2 py-0.5 rounded-full`
- **Input**: `bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white focus:border-[#00a86b]`
- **Trust Score circular**: círculo `bg-[#003d26] border-2 border-[#00a86b]`, número em `green/500`

## 5. Princípios

1. **Verde = confiança e ação.** Use verde só para o que importa (CTA, score, verificado). Não decore com verde.
2. **Escuro por padrão.** Todo o app é dark; o onboarding (form longo) é a exceção clara.
3. **Hierarquia por cor de texto**, não por tamanho: `primary` → `secondary` → `muted`.
4. **Evidência antes de afirmação.** Toda competência mostra origem + verificação.

## 6. Mapa de telas

| Rota | Descrição | Tema |
|---|---|---|
| `/` | Landing (hero cluster, histórias, trust engine) | dark |
| `/login` | Login (LinkedIn/Google/teste) | dark |
| `/onboarding` | Montar perfil (form longo) | claro |
| `/feed` | Feed de sócios (like/favoritar/denunciar) | dark |
| `/profile/[userId]` | Perfil público (trust score, blocos PRD) | dark |
| `/dashboard/profile` | Meu perfil editável + KYC | dark |
| `/matches` | Matches | dark |
| `/dashboard/partnership/[id]` | Sala da Sociedade (timeline) | dark |
| `/dashboard/proposals/new` | Proposta de sociedade | dark |
| `/admin` | Métricas (North Star, funil, HEART) | dark |
