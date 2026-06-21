import Link from "next/link"
import { Testimonials } from "./Testimonials"

// Cluster de sócios no hero
const cluster = [
  { img: "https://randomuser.me/api/portraits/men/32.jpg", role: "CTO", x: "8%", y: "10%", s: 64 },
  { img: "https://randomuser.me/api/portraits/women/44.jpg", role: "Growth", x: "2%", y: "48%", s: 56 },
  { img: "https://randomuser.me/api/portraits/men/67.jpg", role: "CFO", x: "24%", y: "70%", s: 60 },
  { img: "https://randomuser.me/api/portraits/women/28.jpg", role: "Designer", x: "20%", y: "26%", s: 52 },
  { img: "https://randomuser.me/api/portraits/men/11.jpg", role: "CEO", x: "46%", y: "6%", s: 68 },
  { img: "https://randomuser.me/api/portraits/women/55.jpg", role: "Jurídico", x: "44%", y: "62%", s: 54 },
  { img: "https://randomuser.me/api/portraits/men/88.jpg", role: "ML", x: "70%", y: "20%", s: 60 },
  { img: "https://randomuser.me/api/portraits/women/72.jpg", role: "CMO", x: "76%", y: "58%", s: 64 },
]

const trustFeatures = [
  { icon: "⊙", title: "Identidade verificada", desc: "KYC com documentos e selfie. Adeus perfis falsos." },
  { icon: "▥", title: "Evidências de execução", desc: "Projetos, resultados e histórico que comprovam o que foi dito." },
  { icon: "⧉", title: "Rede de confiança", desc: "Contatos em comum que aumentam (de verdade) a confiança." },
  { icon: "◈", title: "Trust Score 0–100", desc: "Confiança subjetiva transformada em confiança mensurável." },
]

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0a0f0d]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-30 bg-[#0a0f0d]/90 backdrop-blur">
        <span className="text-xl font-bold text-white">Socio<span className="text-[#00a86b]">N</span></span>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8a9e94]">
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#trust-engine" className="hover:text-white transition-colors">Trust Engine</a>
          <a href="#precos" className="hover:text-white transition-colors">Preços</a>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 border border-[#2a3d32] hover:border-[#00a86b] text-white px-4 py-2 rounded-full text-sm transition-colors"
        >
          Entrar no app →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-12 pb-20 grid md:grid-cols-2 gap-10 items-center w-full">
        {/* Cluster */}
        <div className="relative h-[360px] order-2 md:order-1">
          <div className="absolute inset-0 bg-[#00a86b] opacity-[0.07] blur-[100px] rounded-full" />
          {cluster.map((c) => (
            <div key={c.role} className="absolute" style={{ left: c.x, top: c.y }}>
              <div className="relative">
                <img
                  src={c.img}
                  alt={c.role}
                  className="rounded-2xl object-cover border border-[#1e2e26] grayscale"
                  style={{ width: c.s, height: c.s }}
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#003d26] text-[#00a86b] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-[#00a86b]/30">
                  {c.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Copy */}
        <div className="relative z-10 order-1 md:order-2">
          <span className="inline-flex items-center gap-2 text-[#00a86b] text-sm bg-[#003d26] border border-[#00a86b]/30 px-3 py-1 rounded-full mb-5">
            ✦ LinkedIn + Tinder + Due Diligence de sócios
          </span>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white mb-5">
            Encontre sócios em quem você <span className="text-[#00a86b]">pode confiar.</span>
          </h1>
          <p className="text-lg text-[#8a9e94] leading-relaxed mb-8 max-w-md">
            Achar um sócio é fácil. Difícil é saber se ele fez o que diz, entrega resultados e é
            compatível com você. O SocioN valida competências, reputação e confiabilidade antes do contrato.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 border border-[#2a3d32] hover:border-[#00a86b] text-white px-6 py-3 rounded-full font-medium transition-colors">
              Começar agora →
            </Link>
            <Link href="/feed" className="inline-flex items-center gap-2 text-[#8a9e94] hover:text-white px-6 py-3 transition-colors">
              Ver feed de sócios
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="como-funciona">
        <Testimonials />
      </div>

      {/* Trust Engine */}
      <section id="trust-engine" className="max-w-6xl mx-auto px-6 py-20 w-full">
        <p className="text-xs text-[#4a5e54] uppercase tracking-widest mb-4">Trust Engine · O core do produto</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl">
            Confiança que se mede, não que se intui.
          </h2>
          <p className="text-[#8a9e94] text-sm max-w-xs">
            A maioria das sociedades fracassa por assimetria de informação. Nós atacamos isso na raiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {trustFeatures.map((f) => (
            <div key={f.title} className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6 hover:border-[#2a3d32] transition-colors">
              <span className="text-[#00a86b] text-2xl block mb-4">{f.icon}</span>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-[#8a9e94] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Preços */}
      <section id="precos" className="relative mx-6 mb-16 max-w-6xl md:mx-auto w-[calc(100%-3rem)] rounded-3xl border border-[#1e2e26] bg-[#111816] py-16 text-center px-6 overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#00a86b] opacity-[0.1] blur-[100px] pointer-events-none" />
        <h2 className="relative z-10 text-3xl font-bold text-white mb-3">
          Pronto para encontrar seu sócio ideal?
        </h2>
        <p className="relative z-10 text-[#8a9e94] mb-8 max-w-xl mx-auto">
          14 dias grátis. Sem cartão de crédito. Cancele quando quiser.
        </p>
        <Link
          href="/login"
          className="relative z-10 inline-flex items-center gap-2 bg-[#00a86b] hover:bg-[#009060] text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Começar agora →
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-[#4a5e54] text-sm border-t border-[#1e2e26]">
        © 2025 SocioN. Todos os direitos reservados.
      </footer>
    </main>
  )
}
