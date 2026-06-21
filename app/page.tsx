import Link from "next/link"

const features = [
  {
    icon: "✦",
    title: "Trust Score",
    desc: "Score de confiança 0-100 baseado em identidade, experiência, competências, reputação e comprometimento.",
  },
  {
    icon: "✦",
    title: "Match Bilateral",
    desc: "Só acontece match quando ambos demonstram interesse. Sem spam, sem mensagens indesejadas.",
  },
  {
    icon: "✦",
    title: "Sala da Sociedade",
    desc: "Workspace completo para evoluir da conversa até o contrato assinado com histórico completo.",
  },
  {
    icon: "✦",
    title: "Verificação KYC",
    desc: "Identidade verificada via documentos e liveness check. Perfis falsos eliminados.",
  },
  {
    icon: "✦",
    title: "IA Evidence Engine",
    desc: "IA extrai evidências do LinkedIn e detecta inconsistências no histórico declarado.",
  },
  {
    icon: "✦",
    title: "Rede de Confiança",
    desc: "Contatos em comum aumentam a confiança. Converse com quem já conhece o candidato.",
  },
]

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0a0f0d]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e26] sticky top-0 z-20 bg-[#0a0f0d]/90 backdrop-blur">
        <span className="text-xl font-bold text-[#00a86b]">SocioN</span>
        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors"
          >
            Feed
          </Link>
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm text-white bg-[#00a86b] hover:bg-[#009060] rounded-lg font-medium transition-colors"
          >
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-28 pb-24 gap-6 max-w-4xl mx-auto overflow-hidden">
        {/* grid + glow */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#00a86b 1px, transparent 1px), linear-gradient(90deg, #00a86b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#00a86b] opacity-[0.08] blur-[120px] pointer-events-none" />

        <span className="relative z-10 inline-flex items-center gap-2 text-[#00a86b] text-sm bg-[#003d26] border border-[#00a86b]/30 px-3 py-1 rounded-full">
          ✦ Plataforma de Confiança para Sócios
        </span>
        <h1 className="relative z-10 text-5xl font-bold leading-[1.15] tracking-tight text-white">
          Encontre o sócio certo.{" "}
          <span className="text-[#00a86b]">Com evidências reais.</span>
        </h1>
        <p className="relative z-10 text-lg text-[#8a9e94] max-w-2xl leading-relaxed">
          O SocioN valida competências, histórico profissional e reputação antes de
          qualquer contrato. Pare de apostar. Comece com dados.
        </p>
        <div className="relative z-10 flex flex-wrap justify-center gap-3 mt-4">
          <Link
            href="/login"
            className="bg-[#00a86b] hover:bg-[#009060] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Criar perfil grátis
          </Link>
          <Link
            href="/feed"
            className="bg-[#161f1a] hover:bg-[#1e2e26] border border-[#2a3d32] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ver feed de sócios
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-16 max-w-5xl mx-auto w-full">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-3 p-6 rounded-2xl border border-[#1e2e26] bg-[#111816] hover:border-[#2a3d32] transition-colors"
          >
            <span className="text-[#00a86b] text-xl">{f.icon}</span>
            <h3 className="text-lg font-semibold text-white">{f.title}</h3>
            <p className="text-[#8a9e94] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="relative mx-6 mb-16 max-w-5xl md:mx-auto w-[calc(100%-3rem)] rounded-3xl border border-[#1e2e26] bg-[#111816] py-16 text-center px-6 overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#00a86b] opacity-[0.1] blur-[100px] pointer-events-none" />
        <h2 className="relative z-10 text-3xl font-bold text-white mb-3">
          Pronto para encontrar seu sócio ideal?
        </h2>
        <p className="relative z-10 text-[#8a9e94] mb-8 max-w-xl mx-auto">
          14 dias grátis. Sem cartão de crédito. Cancele quando quiser.
        </p>
        <Link
          href="/login"
          className="relative z-10 inline-flex bg-[#00a86b] hover:bg-[#009060] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Começar agora
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-[#4a5e54] text-sm border-t border-[#1e2e26]">
        © 2025 SocioN. Todos os direitos reservados.
      </footer>
    </main>
  )
}
