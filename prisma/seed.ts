import { PrismaClient, Plan, VerificationStatus, PartnerRole, AvailabilityType, InvestmentRange, BusinessType } from "@prisma/client"

const prisma = new PrismaClient()

const fakeUsers = [
  {
    name: "Rafael Mendonça",
    email: "rafael.mendonca@fake.socion.app",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    plan: Plan.PRO,
    profile: {
      headline: "CTO & Co-founder | Ex-Nubank | 10 anos em fintech",
      location: "São Paulo, SP",
      bio: "Engenheiro de software com passagem pelo Nubank e Stone. Busco sócio de negócios com perfil comercial para co-fundar uma fintech B2B voltada para PMEs. Tenho o produto e a tecnologia, preciso de alguém que abra portas.",
      trustScore: 87,
      identityScore: 95,
      experienceScore: 90,
      competenceScore: 85,
      reputationScore: 80,
      commitmentScore: 85,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.SALES, PartnerRole.MARKETING],
      seekingAvailability: AvailabilityType.FULL_TIME,
      seekingInvestment: InvestmentRange.UP_TO_50K,
      seekingBusinessType: [BusinessType.SAAS, BusinessType.MARKETPLACE],
      offeringRole: [PartnerRole.TECHNOLOGY, PartnerRole.PRODUCT],
      offeringAvailability: AvailabilityType.FULL_TIME,
      offeringInvestment: InvestmentRange.UP_TO_10K,
      offeringBusinessType: [BusinessType.SAAS],
      weeklyHours: 40,
    },
  },
  {
    name: "Camila Torres",
    email: "camila.torres@fake.socion.app",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    plan: Plan.PRO,
    profile: {
      headline: "Head de Growth | Ex-iFood | Especialista em PLG",
      location: "São Paulo, SP",
      bio: "Cresci produtos de 0 a 1M de usuários no iFood e na Creditas. Tenho obsessão por dados e experimentação. Procuro sócio técnico para construir um produto SaaS na vertical de RH. Invisto tempo e tenho savings para os primeiros 6 meses.",
      trustScore: 82,
      identityScore: 90,
      experienceScore: 88,
      competenceScore: 78,
      reputationScore: 75,
      commitmentScore: 82,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.TECHNOLOGY, PartnerRole.PRODUCT],
      seekingAvailability: AvailabilityType.FULL_TIME,
      seekingInvestment: InvestmentRange.UP_TO_50K,
      seekingBusinessType: [BusinessType.SAAS],
      offeringRole: [PartnerRole.MARKETING, PartnerRole.SALES],
      offeringAvailability: AvailabilityType.FULL_TIME,
      offeringInvestment: InvestmentRange.UP_TO_50K,
      offeringBusinessType: [BusinessType.SAAS],
      weeklyHours: 40,
    },
  },
  {
    name: "Bruno Castilho",
    email: "bruno.castilho@fake.socion.app",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    plan: Plan.PRO,
    profile: {
      headline: "CFO & Investidor Anjo | 3 exits | Especialista em M&A",
      location: "Curitiba, PR",
      bio: "Participei de 3 exits como CFO, o maior deles R$120M. Hoje atuo como investidor anjo e busco projetos early-stage com tração. Além de capital (até R$250k), trago network e mentoria financeira.",
      trustScore: 91,
      identityScore: 98,
      experienceScore: 92,
      competenceScore: 88,
      reputationScore: 90,
      commitmentScore: 88,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.TECHNOLOGY, PartnerRole.PRODUCT],
      seekingAvailability: AvailabilityType.PART_TIME,
      seekingInvestment: InvestmentRange.ABOVE_50K,
      seekingBusinessType: [BusinessType.SAAS, BusinessType.MARKETPLACE, BusinessType.AI],
      offeringRole: [PartnerRole.FINANCE, PartnerRole.OPERATIONS],
      offeringAvailability: AvailabilityType.PART_TIME,
      offeringInvestment: InvestmentRange.ABOVE_50K,
      offeringBusinessType: [BusinessType.SAAS, BusinessType.MARKETPLACE],
      weeklyHours: 15,
    },
  },
  {
    name: "Juliana Freitas",
    email: "juliana.freitas@fake.socion.app",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    plan: Plan.TRIAL,
    profile: {
      headline: "Designer de Produto | Ex-Figma | UX para B2B SaaS",
      location: "Florianópolis, SC",
      bio: "Trabalhei no time de design da Figma e da Resultados Digitais. Quero co-fundar um produto voltado para pequenas agências de marketing. Tenho o design e parte do produto mapeado. Busco dev full-stack para começar.",
      trustScore: 74,
      identityScore: 85,
      experienceScore: 80,
      competenceScore: 70,
      reputationScore: 65,
      commitmentScore: 72,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.TECHNOLOGY],
      seekingAvailability: AvailabilityType.FULL_TIME,
      seekingInvestment: InvestmentRange.NONE,
      seekingBusinessType: [BusinessType.SAAS, BusinessType.AGENCY],
      offeringRole: [PartnerRole.PRODUCT, PartnerRole.MARKETING],
      offeringAvailability: AvailabilityType.FULL_TIME,
      offeringInvestment: InvestmentRange.NONE,
      offeringBusinessType: [BusinessType.SAAS],
      weeklyHours: 40,
    },
  },
  {
    name: "Lucas Yamamoto",
    email: "lucas.yamamoto@fake.socion.app",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    plan: Plan.PRO,
    profile: {
      headline: "Founder & CEO | Saí do zero para R$2M ARR em 18 meses",
      location: "Belo Horizonte, MG",
      bio: "Fundei uma plataforma de logística para e-commerce que chegou a R$2M ARR antes de ser adquirida. Hoje quero fazer de novo, desta vez em AI. Tenho capital próprio e busco sócio técnico com experiência em LLMs.",
      trustScore: 88,
      identityScore: 92,
      experienceScore: 91,
      competenceScore: 85,
      reputationScore: 87,
      commitmentScore: 83,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.TECHNOLOGY],
      seekingAvailability: AvailabilityType.FULL_TIME,
      seekingInvestment: InvestmentRange.UP_TO_50K,
      seekingBusinessType: [BusinessType.AI, BusinessType.SAAS],
      offeringRole: [PartnerRole.SALES, PartnerRole.OPERATIONS],
      offeringAvailability: AvailabilityType.FULL_TIME,
      offeringInvestment: InvestmentRange.ABOVE_50K,
      offeringBusinessType: [BusinessType.AI],
      weeklyHours: 50,
    },
  },
  {
    name: "Mariana Lopes",
    email: "mariana.lopes@fake.socion.app",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    plan: Plan.TRIAL,
    profile: {
      headline: "Advogada Empresarial | Especialista em Contratos de Startup",
      location: "Rio de Janeiro, RJ",
      bio: "10 anos estruturando acordos de sócios, rodadas de investimento e contratos de SaaS. Busco sócio para montar uma LegalTech que automatize contratos para pequenas empresas. Venho com a expertise jurídica e metade do produto desenhado.",
      trustScore: 78,
      identityScore: 96,
      experienceScore: 82,
      competenceScore: 72,
      reputationScore: 76,
      commitmentScore: 65,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.TECHNOLOGY, PartnerRole.PRODUCT],
      seekingAvailability: AvailabilityType.PART_TIME,
      seekingInvestment: InvestmentRange.NONE,
      seekingBusinessType: [BusinessType.SAAS, BusinessType.SERVICES],
      offeringRole: [PartnerRole.LEGAL, PartnerRole.OPERATIONS],
      offeringAvailability: AvailabilityType.PART_TIME,
      offeringInvestment: InvestmentRange.NONE,
      offeringBusinessType: [BusinessType.SAAS],
      weeklyHours: 20,
    },
  },
  {
    name: "Diego Carvalho",
    email: "diego.carvalho@fake.socion.app",
    image: "https://randomuser.me/api/portraits/men/88.jpg",
    plan: Plan.PRO,
    profile: {
      headline: "Engenheiro de ML | Ex-Google Brain | Especialista em LLMs",
      location: "Remoto (base em Recife, PE)",
      bio: "5 anos de Google Brain trabalhando com modelos de linguagem. Publiquei 8 papers e tenho 2 patentes. Quero sair do research e construir um produto real. Busco sócio de negócios que traga visão de mercado e habilidade comercial.",
      trustScore: 93,
      identityScore: 98,
      experienceScore: 96,
      competenceScore: 95,
      reputationScore: 88,
      commitmentScore: 86,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.SALES, PartnerRole.MARKETING, PartnerRole.OPERATIONS],
      seekingAvailability: AvailabilityType.FULL_TIME,
      seekingInvestment: InvestmentRange.UP_TO_10K,
      seekingBusinessType: [BusinessType.AI, BusinessType.SAAS],
      offeringRole: [PartnerRole.TECHNOLOGY],
      offeringAvailability: AvailabilityType.FULL_TIME,
      offeringInvestment: InvestmentRange.NONE,
      offeringBusinessType: [BusinessType.AI],
      weeklyHours: 45,
    },
  },
  {
    name: "Fernanda Oliveira",
    email: "fernanda.oliveira@fake.socion.app",
    image: "https://randomuser.me/api/portraits/women/72.jpg",
    plan: Plan.PRO,
    profile: {
      headline: "CMO | Growth Hacker | Escalo marcas de 0 a 100k usuários",
      location: "Porto Alegre, RS",
      bio: "Já escalei 4 startups como CMO. Especialista em growth orgânico, SEO e comunidade. Tenho uma ideia validada para marketplace de serviços criativos e preciso de sócio técnico. Já tenho 200 pessoas na lista de espera.",
      trustScore: 80,
      identityScore: 88,
      experienceScore: 84,
      competenceScore: 78,
      reputationScore: 77,
      commitmentScore: 74,
      verificationStatus: VerificationStatus.VERIFIED,
      seekingRole: [PartnerRole.TECHNOLOGY, PartnerRole.PRODUCT],
      seekingAvailability: AvailabilityType.FULL_TIME,
      seekingInvestment: InvestmentRange.NONE,
      seekingBusinessType: [BusinessType.MARKETPLACE, BusinessType.SAAS],
      offeringRole: [PartnerRole.MARKETING, PartnerRole.SALES],
      offeringAvailability: AvailabilityType.FULL_TIME,
      offeringInvestment: InvestmentRange.NONE,
      offeringBusinessType: [BusinessType.MARKETPLACE],
      weeklyHours: 40,
    },
  },
]

const d = (y: number, m = 1) => new Date(y, m - 1, 1)

// Enriquecimento por email: skills, experiências, projetos, valores e compatibilidade
const enrichment: Record<string, {
  compatibilityScore: number
  values: { speed: number; risk: number; growth: number }
  skills: { name: string; source: string; verified: boolean; evidence: string }[]
  experiences: { company: string; title: string; start: number; end?: number; current?: boolean; description: string }[]
  projects: { name: string; description: string; start: number; end?: number; results: string; links: string[] }[]
}> = {
  "rafael.mendonca@fake.socion.app": {
    compatibilityScore: 88,
    values: { speed: 35, risk: 40, growth: 30 },
    skills: [
      { name: "Arquitetura de Software", source: "linkedin", verified: true, evidence: "10 anos liderando times de engenharia em fintechs reguladas." },
      { name: "Liderança Técnica", source: "linkedin", verified: true, evidence: "Gerenciou squads de até 25 engenheiros no Nubank." },
      { name: "Pagamentos & PIX", source: "portfolio", verified: true, evidence: "Construiu infraestrutura de pagamentos processando milhões/dia." },
      { name: "Go & Kubernetes", source: "github", verified: false, evidence: "Contribuições públicas em projetos de infraestrutura." },
    ],
    experiences: [
      { company: "Nubank", title: "Staff Engineer", start: 2017, end: 2022, description: "Liderou a plataforma de pagamentos e a migração para microsserviços." },
      { company: "Stone", title: "Tech Lead", start: 2022, current: true, description: "Responsável pela arquitetura de produtos de crédito B2B." },
    ],
    projects: [
      { name: "Plataforma de Pagamentos B2B", description: "Infraestrutura de pagamentos para PMEs com conciliação automática.", start: 2022, current: true as any, results: "Processa R$ 40M/mês em volume transacionado.", links: ["https://github.com/rafael"] },
    ] as any,
  },
  "camila.torres@fake.socion.app": {
    compatibilityScore: 84,
    values: { speed: 25, risk: 35, growth: 20 },
    skills: [
      { name: "Product-Led Growth", source: "linkedin", verified: true, evidence: "Cresceu produtos de 0 a 1M de usuários no iFood." },
      { name: "Growth Marketing", source: "linkedin", verified: true, evidence: "Liderou aquisição e ativação na Creditas." },
      { name: "Analytics & Experimentação", source: "portfolio", verified: true, evidence: "Estruturou cultura de A/B testing com +200 experimentos/ano." },
    ],
    experiences: [
      { company: "iFood", title: "Head of Growth", start: 2018, end: 2021, description: "Responsável por aquisição e retenção de novos usuários." },
      { company: "Creditas", title: "Growth Lead", start: 2021, current: true, description: "Liderou estratégia de PLG para produtos de crédito." },
    ],
    projects: [
      { name: "Motor de Ativação de Usuários", description: "Sistema de onboarding personalizado baseado em comportamento.", start: 2019, end: 2020, results: "+38% de ativação em 90 dias.", links: [] },
    ],
  },
  "bruno.castilho@fake.socion.app": {
    compatibilityScore: 79,
    values: { speed: 60, risk: 75, growth: 65 },
    skills: [
      { name: "M&A e Fusões", source: "linkedin", verified: true, evidence: "3 exits como CFO, o maior de R$120M." },
      { name: "Modelagem Financeira", source: "portfolio", verified: true, evidence: "Estruturou valuations para 12 rodadas de investimento." },
      { name: "Captação de Investimento", source: "linkedin", verified: true, evidence: "Captou +R$300M em rodadas Series A/B." },
    ],
    experiences: [
      { company: "TechCorp (exit R$120M)", title: "CFO", start: 2014, end: 2019, description: "Estruturou a empresa financeiramente até a aquisição." },
      { company: "Investidor Anjo", title: "Angel Investor", start: 2019, current: true, description: "Investe e mentora startups early-stage." },
    ],
    projects: [
      { name: "Exit TechCorp", description: "Condução do processo de M&A da venda da empresa.", start: 2018, end: 2019, results: "Aquisição concluída por R$120M.", links: [] },
    ],
  },
  "juliana.freitas@fake.socion.app": {
    compatibilityScore: 72,
    values: { speed: 30, risk: 45, growth: 35 },
    skills: [
      { name: "UX Design", source: "linkedin", verified: true, evidence: "Time de design da Figma e Resultados Digitais." },
      { name: "Design Systems", source: "portfolio", verified: true, evidence: "Construiu design system usado por +40 produtos." },
      { name: "Product Design B2B", source: "linkedin", verified: false, evidence: "Especialista em interfaces para SaaS complexos." },
    ],
    experiences: [
      { company: "Figma", title: "Product Designer", start: 2020, end: 2022, description: "Trabalhou em ferramentas de colaboração em tempo real." },
      { company: "Resultados Digitais", title: "Senior Designer", start: 2018, end: 2020, description: "Redesenhou o produto principal de automação de marketing." },
    ],
    projects: [
      { name: "Design System Atlas", description: "Sistema de design escalável e documentado.", start: 2021, end: 2022, results: "Reduziu tempo de entrega de UI em 50%.", links: ["https://dribbble.com/juliana"] },
    ],
  },
  "lucas.yamamoto@fake.socion.app": {
    compatibilityScore: 86,
    values: { speed: 20, risk: 25, growth: 15 },
    skills: [
      { name: "Empreendedorismo", source: "linkedin", verified: true, evidence: "Fundou e escalou startup até R$2M ARR em 18 meses." },
      { name: "Vendas B2B", source: "portfolio", verified: true, evidence: "Construiu time comercial do zero." },
      { name: "Operações & Logística", source: "linkedin", verified: true, evidence: "Otimizou cadeia logística para e-commerce." },
    ],
    experiences: [
      { company: "LogTech (adquirida)", title: "Founder & CEO", start: 2020, end: 2023, description: "Fundou plataforma de logística para e-commerce." },
      { company: "Nova Startup (AI)", title: "Founder", start: 2023, current: true, description: "Construindo produto de AI aplicada." },
    ],
    projects: [
      { name: "LogTech", description: "Plataforma de fulfillment para e-commerce.", start: 2020, end: 2023, results: "R$2M ARR e aquisição em 18 meses.", links: [] },
    ],
  },
  "mariana.lopes@fake.socion.app": {
    compatibilityScore: 70,
    values: { speed: 65, risk: 70, growth: 55 },
    skills: [
      { name: "Direito Societário", source: "linkedin", verified: true, evidence: "10 anos estruturando acordos de sócios." },
      { name: "Contratos de Startup", source: "portfolio", verified: true, evidence: "Estruturou +50 rodadas e cap tables." },
      { name: "Compliance", source: "linkedin", verified: false, evidence: "Especialista em adequação regulatória para SaaS." },
    ],
    experiences: [
      { company: "Escritório Lopes Advocacia", title: "Sócia", start: 2016, current: true, description: "Atende startups em direito societário e rodadas." },
      { company: "Pinheiro Neto", title: "Advogada", start: 2013, end: 2016, description: "Atuou em fusões e aquisições de grande porte." },
    ],
    projects: [
      { name: "Templates de Acordo de Sócios", description: "Biblioteca de contratos para early-stage.", start: 2022, current: true as any, results: "Usado por +30 startups.", links: [] } as any,
    ],
  },
  "diego.carvalho@fake.socion.app": {
    compatibilityScore: 93,
    values: { speed: 40, risk: 50, growth: 25 },
    skills: [
      { name: "Machine Learning", source: "linkedin", verified: true, evidence: "5 anos no Google Brain com modelos de linguagem." },
      { name: "LLMs & NLP", source: "portfolio", verified: true, evidence: "8 papers publicados e 2 patentes." },
      { name: "Pesquisa Aplicada", source: "github", verified: true, evidence: "Projetos open-source com milhares de estrelas." },
    ],
    experiences: [
      { company: "Google Brain", title: "ML Research Engineer", start: 2018, end: 2023, description: "Pesquisa em modelos de linguagem de grande escala." },
      { company: "Independente", title: "AI Builder", start: 2023, current: true, description: "Desenvolvendo produto baseado em LLMs." },
    ],
    projects: [
      { name: "Modelo de Sumarização", description: "LLM fine-tuned para sumarização em português.", start: 2022, end: 2023, results: "State-of-the-art em benchmark nacional.", links: ["https://github.com/diego"] },
    ],
  },
  "fernanda.oliveira@fake.socion.app": {
    compatibilityScore: 81,
    values: { speed: 25, risk: 40, growth: 20 },
    skills: [
      { name: "Growth Hacking", source: "linkedin", verified: true, evidence: "Escalou 4 startups como CMO." },
      { name: "SEO & Conteúdo", source: "portfolio", verified: true, evidence: "Growth orgânico de 0 a 100k usuários." },
      { name: "Community Building", source: "linkedin", verified: false, evidence: "Construiu comunidades engajadas de criadores." },
    ],
    experiences: [
      { company: "StartupX", title: "CMO", start: 2019, end: 2022, description: "Liderou marketing e crescimento orgânico." },
      { company: "Consultoria de Growth", title: "Fundadora", start: 2022, current: true, description: "Consultoria para startups em estágio inicial." },
    ],
    projects: [
      { name: "Marketplace Criativo (waitlist)", description: "Marketplace de serviços criativos validado.", start: 2023, current: true as any, results: "200 pessoas na lista de espera antes do lançamento.", links: [] } as any,
    ],
  },
}

// Vídeos de apresentação (pitch). Exemplos públicos estáveis — troque pelos vídeos reais depois.
const pitchVideos: Record<string, string> = {
  "rafael.mendonca@fake.socion.app": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "camila.torres@fake.socion.app": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "diego.carvalho@fake.socion.app": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "lucas.yamamoto@fake.socion.app": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
}

async function main() {
  console.log("🌱 Seeding fake profiles...")

  for (const u of fakeUsers) {
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        image: u.image,
        emailVerified: new Date(),
        plan: u.plan,
        trialEndsAt,
      },
    })

    const ext = enrichment[u.email]

    const profileData = {
      ...u.profile,
      ...(ext ? { compatibilityScore: ext.compatibilityScore, values: ext.values } : {}),
      ...(pitchVideos[u.email] ? { pitchVideoUrl: pitchVideos[u.email] } : {}),
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData,
      },
    })

    if (ext) {
      // Recria skills, experiências e projetos
      await prisma.skill.deleteMany({ where: { profileId: profile.id } })
      await prisma.experience.deleteMany({ where: { profileId: profile.id } })
      await prisma.project.deleteMany({ where: { profileId: profile.id } })

      await prisma.skill.createMany({
        data: ext.skills.map((s) => ({
          profileId: profile.id,
          name: s.name,
          source: s.source,
          verified: s.verified,
          evidence: s.evidence,
        })),
      })

      await prisma.experience.createMany({
        data: ext.experiences.map((e) => ({
          profileId: profile.id,
          company: e.company,
          title: e.title,
          startDate: d(e.start),
          endDate: e.end ? d(e.end) : null,
          current: e.current ?? false,
          description: e.description,
        })),
      })

      await prisma.project.createMany({
        data: ext.projects.map((pr) => ({
          profileId: profile.id,
          name: pr.name,
          description: pr.description,
          startDate: d(pr.start),
          endDate: pr.end ? d(pr.end) : null,
          results: pr.results,
          links: pr.links,
        })),
      })
    }

    console.log(`✅ ${u.name}`)
  }

  console.log(`\n🎉 ${fakeUsers.length} perfis criados com sucesso!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
