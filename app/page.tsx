export const dynamic = "force-dynamic"

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Testimonials } from "./Testimonials"

async function getStats() {
  try {
    const [total, verified, agg, matches] = await Promise.all([
      prisma.profile.count(),
      prisma.profile.count({ where: { verificationStatus: "VERIFIED" } }),
      prisma.profile.aggregate({ _avg: { trustScore: true } }),
      prisma.partnership.count(),
    ])
    return {
      total,
      verified,
      avgTrust: agg._avg.trustScore ? Math.round(agg._avg.trustScore) : 0,
      matches,
    }
  } catch {
    return { total: 0, verified: 0, avgTrust: 0, matches: 0 }
  }
}

const trustFormula = [
  { label: "Identidade", weight: "20%", desc: "KYC com documentos e selfie" },
  { label: "Histórico profissional", weight: "20%", desc: "Experiências importadas e validadas" },
  { label: "Competências verificadas", weight: "20%", desc: "Skills com evidência real" },
  { label: "Evidências de execução", weight: "20%", desc: "Projetos e resultados entregues" },
  { label: "Rede de confiança", weight: "20%", desc: "Contatos em comum reais" },
]

const steps = [
  { n: "01", title: "Crie seu perfil", desc: "Importe do LinkedIn, grave um pitch e adicione evidências das suas competências." },
  { n: "02", title: "Construa seu Trust Score", desc: "Validamos identidade, histórico e reputação — sua confiança vira um número de 0 a 100." },
  { n: "03", title: "Dê match com complementares", desc: "O algoritmo cruza habilidades e objetivos. Match só acontece quando o interesse é mútuo." },
  { n: "04", title: "Forme a sociedade", desc: "Da proposta ao contrato assinado, tudo numa sala única com histórico verificável." },
]

export default async function LandingPage() {
  const stats = await getStats()

  return (
    <main className="flex flex-col min-h-screen bg-[#0a0f0d] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-30 bg-[#0a0f0d]/80 backdrop-blur-md border-b border-[#1e2e26]/50">
        <span className="text-xl font-bold tracking-tight">Socio<span className="text-[#00a86b]">N</span></span>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8a9e94]">
          <a href="#problema" className="hover:text-white transition-colors">O problema</a>
          <a href="#trust" className="hover:text-white transition-colors">Trust Score</a>
          <a href="#como" className="hover:text-white transition-colors">Como funciona</a>
        </div>
        <Link href="/login" className="text-sm bg-[#00a86b] hover:bg-[#009060] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Criar conta grátis
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#00a86b] opacity-[0.08] blur-[130px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[#00a86b] text-sm bg-[#003d26] border border-[#00a86b]/30 px-3 py-1 rounded-full mb-7">
            ✦ A camada de confiança para formar sociedades
          </span>
          <h1 className="text-6xl font-bold leading-[1.05] tracking-tight mb-6">
            Escolha seu sócio com<br /><span className="text-[#00a86b]">dados, não com fé.</span>
          </h1>
          <p className="text-lg text-[#8a9e94] leading-relaxed max-w-xl mx-auto mb-9">
            O SocioN valida identidade, competências e reputação antes de qualquer contrato.
            Transforme confiança subjetiva em um Trust Score de 0 a 100.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link href="/login" className="bg-[#00a86b] hover:bg-[#009060] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Criar conta grátis →
            </Link>
            <span className="text-[#4a5e54] text-sm">14 dias grátis · sem cartão de crédito</span>
          </div>

          {/* Prova social — números reais */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 pt-10 border-t border-[#1e2e26]">
            <Stat value={`${stats.verified}`} label="perfis verificados" />
            <Stat value={stats.avgTrust ? `${stats.avgTrust}` : "—"} label="Trust Score médio" />
            <Stat value={`${stats.matches}`} label="matches formados" />
          </div>
        </div>
      </section>

      {/* Problema (dor) */}
      <section id="problema" className="px-6 py-24 max-w-4xl mx-auto w-full text-center">
        <p className="text-xs text-[#4a5e54] uppercase tracking-widest mb-4">O problema</p>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          <span className="text-[#8a9e94]">8 em cada 10 sociedades fracassam.</span><br />
          Quase sempre pelo mesmo motivo: <span className="text-white">confiança mal colocada.</span>
        </h2>
        <p className="text-lg text-[#8a9e94] leading-relaxed max-w-2xl mx-auto mb-12">
          Você conhece alguém num evento, troca ideias, sente um "match" — e aposta o seu negócio
          nisso. Sem saber se a pessoa fez o que diz, entrega o que promete, ou é compatível com você.
          O resultado é caro: tempo, dinheiro e energia perdidos numa relação que não tinha base.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { t: "Currículo inflado", d: "Títulos e experiências que ninguém verifica de verdade." },
            { t: "Promessas sem prova", d: "“Já escalei uma startup” — mas onde estão as evidências?" },
            { t: "Valores incompatíveis", d: "Descobertos tarde demais, já no meio do conflito." },
          ].map((p) => (
            <div key={p.t} className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
              <h3 className="font-semibold mb-2">{p.t}</h3>
              <p className="text-sm text-[#8a9e94] leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Score explicado */}
      <section id="trust" className="px-6 py-24 bg-[#0d1310] border-y border-[#1e2e26]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs text-[#4a5e54] uppercase tracking-widest mb-4">Trust Engine · o core do produto</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-xl">
                Confiança que se mede, não que se intui.
              </h2>
            </div>
            <p className="text-[#8a9e94] text-sm max-w-xs">
              Cinco dimensões, cada uma valendo 20%. Juntas formam o Trust Score — de 0 a 100.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-3">
            {trustFormula.map((f) => (
              <div key={f.label} className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5 flex flex-col">
                <span className="text-[#00a86b] text-2xl font-bold mb-3">{f.weight}</span>
                <h3 className="font-semibold text-sm mb-1">{f.label}</h3>
                <p className="text-xs text-[#8a9e94] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como" className="px-6 py-24 max-w-5xl mx-auto w-full">
        <p className="text-xs text-[#4a5e54] uppercase tracking-widest mb-4 text-center">Como funciona</p>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-14 text-center">Do cadastro ao contrato.</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-7 flex gap-5">
              <span className="text-[#00a86b]/40 text-3xl font-bold shrink-0">{s.n}</span>
              <div>
                <h3 className="font-semibold text-lg mb-1.5">{s.title}</h3>
                <p className="text-sm text-[#8a9e94] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <Testimonials />

      {/* CTA final */}
      <section className="relative mx-6 mb-16 max-w-5xl md:mx-auto w-[calc(100%-3rem)] rounded-3xl border border-[#1e2e26] bg-[#111816] py-20 text-center px-6 overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#00a86b] opacity-[0.12] blur-[110px] pointer-events-none" />
        <h2 className="relative z-10 text-4xl font-bold mb-4">Comece com confiança de verdade.</h2>
        <p className="relative z-10 text-[#8a9e94] mb-9 max-w-xl mx-auto text-lg">
          Crie seu perfil, construa seu Trust Score e encontre o sócio certo — com evidências.
        </p>
        <Link href="/login" className="relative z-10 inline-flex items-center gap-2 bg-[#00a86b] hover:bg-[#009060] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
          Criar conta grátis →
        </Link>
        <p className="relative z-10 text-[#4a5e54] text-sm mt-4">14 dias grátis · sem cartão de crédito</p>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-[#4a5e54] text-sm border-t border-[#1e2e26]">
        © 2025 SocioN · Projeto de portfólio. Todos os direitos reservados.
      </footer>
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#4a5e54] mt-1">{label}</div>
    </div>
  )
}
