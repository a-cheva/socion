export const dynamic = "force-dynamic"

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Testimonials } from "./Testimonials"
import { Reveal } from "./Reveal"

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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a86b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f0d]"

function CTA({ children, size = "md" }: { children: React.ReactNode; size?: "md" | "lg" }) {
  const pad = size === "lg" ? "px-7 py-3.5 text-base" : "px-4 py-2 text-sm"
  return (
    <Link
      href="/login"
      className={`inline-flex items-center justify-center gap-2 bg-[#00a86b] hover:bg-[#00b873] text-[#04140d] font-semibold rounded-lg transition-all hover:-translate-y-0.5 active:translate-y-0 ${pad} ${focusRing}`}
    >
      {children}
    </Link>
  )
}

export default async function LandingPage() {
  const stats = await getStats()

  return (
    <main className="flex flex-col min-h-screen bg-[#0a0f0d] text-white selection:bg-[#00a86b]/30">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 sm:px-8 py-4 sticky top-0 z-30 bg-[#0a0f0d]/70 backdrop-blur-xl border-b border-white/[0.06]">
        <span className="text-lg font-semibold tracking-tight">Socio<span className="text-[#00a86b]">N</span></span>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8a9e94]">
          <a href="#problema" className="hover:text-white transition-colors">O problema</a>
          <a href="#trust" className="hover:text-white transition-colors">Trust Score</a>
          <a href="#como" className="hover:text-white transition-colors">Como funciona</a>
        </div>
        <CTA>Criar conta grátis</CTA>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 sm:pt-28 pb-20 sm:pb-28 text-center overflow-hidden">
        {/* grid sutil + glow */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-[760px] max-w-[120vw] h-[420px] rounded-full bg-[#00a86b] blur-[140px] pointer-events-none animate-glowpulse" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[#9fb4a9] text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full mb-8 animate-fadeup">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a86b]" />
            A camada de confiança para formar sociedades
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.04] mb-6 text-balance animate-fadeup" style={{ animationDelay: "80ms" }}>
            Escolha seu sócio com{" "}
            <span className="text-[#00a86b]">dados, não com fé.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#8a9e94] leading-relaxed max-w-xl mx-auto mb-10 animate-fadeup" style={{ animationDelay: "180ms" }}>
            O SocioN valida identidade, competências e reputação antes de qualquer contrato.
            Transforme confiança subjetiva em um Trust Score de 0 a 100.
          </p>
          <div className="flex flex-col items-center gap-3 animate-fadeup" style={{ animationDelay: "280ms" }}>
            <CTA size="lg">Criar conta grátis →</CTA>
            <span className="text-[#4a5e54] text-sm">14 dias grátis · sem cartão de crédito</span>
          </div>

          {/* Prova social — números reais */}
          <div className="grid grid-cols-3 max-w-lg mx-auto mt-16 sm:mt-20 pt-10 border-t border-white/[0.06] animate-fadeup" style={{ animationDelay: "400ms" }}>
            <Stat value={`${stats.verified}`} label="perfis verificados" />
            <Stat value={stats.avgTrust ? `${stats.avgTrust}` : "—"} label="Trust Score médio" divider />
            <Stat value={`${stats.matches}`} label="matches formados" divider />
          </div>
        </div>
      </section>

      {/* Problema (dor) */}
      <section id="problema" className="px-6 py-24 sm:py-32 max-w-4xl mx-auto w-full text-center">
        <Reveal>
          <p className="text-xs text-[#4a5e54] uppercase tracking-[0.2em] mb-5">O problema</p>
          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-7">
            <span className="text-[#6f857a]">8 em cada 10 sociedades fracassam.</span><br />
            Quase sempre pelo mesmo motivo: <span className="text-white">confiança mal colocada.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#8a9e94] leading-relaxed max-w-2xl mx-auto mb-14">
            Você conhece alguém num evento, troca ideias, sente um "match" — e aposta o seu negócio
            nisso. Sem saber se a pessoa fez o que diz, entrega o que promete, ou é compatível com você.
            O resultado é caro: tempo, dinheiro e energia perdidos numa relação que não tinha base.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { t: "Currículo inflado", d: "Títulos e experiências que ninguém verifica de verdade." },
            { t: "Promessas sem prova", d: "“Já escalei uma startup” — mas onde estão as evidências?" },
            { t: "Valores incompatíveis", d: "Descobertos tarde demais, já no meio do conflito." },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 120} from="up">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 h-full hover:bg-white/[0.04] transition-colors">
                <h3 className="font-semibold mb-2">{p.t}</h3>
                <p className="text-sm text-[#8a9e94] leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust Score explicado */}
      <section id="trust" className="px-6 py-24 sm:py-32 bg-[#0c1210] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-14">
              <div>
                <p className="text-xs text-[#4a5e54] uppercase tracking-[0.2em] mb-5">Trust Engine · o core do produto</p>
                <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight max-w-xl">
                  Confiança que se mede, não que se intui.
                </h2>
              </div>
              <p className="text-[#8a9e94] text-sm max-w-xs leading-relaxed">
                Cinco dimensões, cada uma valendo 20%. Juntas formam o Trust Score — de 0 a 100.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {trustFormula.map((f, i) => (
              <Reveal key={f.label} delay={i * 80} from="scale">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full hover:border-[#00a86b]/40 transition-colors">
                  <span className="text-[#00a86b] text-2xl font-bold mb-3 tracking-tight">{f.weight}</span>
                  <h3 className="font-semibold text-sm mb-1">{f.label}</h3>
                  <p className="text-xs text-[#8a9e94] leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como" className="px-6 py-24 sm:py-32 max-w-5xl mx-auto w-full">
        <Reveal>
          <p className="text-xs text-[#4a5e54] uppercase tracking-[0.2em] mb-5 text-center">Como funciona</p>
          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-16 text-center">
            Do cadastro ao contrato.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} from={i % 2 === 0 ? "left" : "right"}>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 flex gap-5 h-full hover:bg-white/[0.04] transition-colors">
                <span className="text-[#00a86b]/30 text-3xl font-bold shrink-0 tabular-nums">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1.5">{s.title}</h3>
                  <p className="text-sm text-[#8a9e94] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <Testimonials />

      {/* CTA final */}
      <section className="relative mx-6 mb-16 max-w-5xl md:mx-auto w-[calc(100%-3rem)] rounded-[28px] border border-white/[0.08] bg-[#0c1210] py-20 sm:py-24 text-center px-6 overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] max-w-[100vw] h-[300px] rounded-full bg-[#00a86b] opacity-[0.12] blur-[110px] pointer-events-none" />
        <Reveal>
          <h2 className="relative z-10 text-3xl sm:text-4xl font-bold tracking-tight mb-4">Comece com confiança de verdade.</h2>
          <p className="relative z-10 text-[#8a9e94] mb-9 max-w-xl mx-auto text-base sm:text-lg">
            Crie seu perfil, construa seu Trust Score e encontre o sócio certo — com evidências.
          </p>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <CTA size="lg">Criar conta grátis →</CTA>
            <span className="text-[#4a5e54] text-sm">14 dias grátis · sem cartão de crédito</span>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-[#4a5e54] text-sm border-t border-white/[0.06]">
        © 2025 SocioN · Projeto de portfólio. Todos os direitos reservados.
      </footer>
    </main>
  )
}

function Stat({ value, label, divider }: { value: string; label: string; divider?: boolean }) {
  return (
    <div className={divider ? "border-l border-white/[0.06]" : ""}>
      <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-[#4a5e54] mt-1.5">{label}</div>
    </div>
  )
}
