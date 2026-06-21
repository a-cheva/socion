# SocioN — Fluxo do Usuário

Diagrama do fluxo completo (happy path + ramos), do login ao contrato. Renderiza no GitHub (Mermaid).

```mermaid
flowchart TD
    A[Landing /] --> B{Tem conta?}
    B -->|Entrar| C[/login]
    C --> C1[LinkedIn]
    C --> C2[Google]
    C --> C3[Usuário de teste]
    C1 --> D[/onboarding]
    C2 --> D
    C3 --> E[/feed]

    D -->|Headline, bio, áreas, valores| E

    E --> F{Ação no card}
    F -->|Like| F1[Interesse unilateral]
    F -->|Favoritar| G{Reciprocidade?}
    F -->|Ver perfil| P[/profile/:id]
    F -->|Denunciar / Ocultar| E

    G -->|Não| F1
    G -->|Sim, ambos favoritaram| M[★ MATCH → cria Partnership]

    P --> P1[Trust Score + subscores]
    P --> P2[Competências / Histórico / Projetos]
    P --> P3[Disponibilidade / Valores]
    P --> P4[Rede de confiança: contatos em comum]
    P --> H[Enviar proposta]

    M --> S[/matches]
    S --> T[Sala da Sociedade /dashboard/partnership/:id]
    T --> T1[Timeline: Match → Docs → Compat. → Proposta → Contrato → Assinado]
    T --> H
    T --> T2[Desfazer match → DISSOLVED]

    H --> H1[/dashboard/proposals/new]
    H1 -->|Equity, papel, investimento, msg| H2[Proposta enviada → status PROPOSAL_SENT]
    H2 --> T

    %% KYC paralelo
    MP[/dashboard/profile] --> K[Upload documento]
    K --> K1{Admin revisa}
    K1 -->|Aprova| K2[VERIFIED +100 identidade]
    K1 -->|Rejeita c/ motivo| K3[REJECTED → reenviar]
    K3 --> K

    %% Admin
    AD[/admin] --> AD1[North Star: contratos assinados]
    AD --> AD2[Funil de conversão]
    AD --> AD3[HEART framework]
```

## Ramos alternativos cobertos (edge cases)

- **Login**: nega LinkedIn → Google/teste; perfil incompleto → completa no onboarding
- **Documentos**: ilegível/expirado/cortado/outro país → rejeição **com motivo** → reenvio
- **Feed**: não curte ninguém (segue funcionando); denuncia/oculta → some do feed
- **Perfil**: remove competência / adiciona evidência (perfil editável)
- **Match**: like ≠ match; desfazer match → `DISSOLVED`
