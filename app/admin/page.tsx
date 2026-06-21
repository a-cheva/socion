export const dynamic = "force-dynamic"

import { getAdminMetrics } from "@/lib/admin-metrics"
import Link from "next/link"

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function Section({ title }: { title: string }) {
  return <p className="text-xs text-gray-500 uppercase tracking-widest mt-6 mb-3">{title}</p>
}

export default async function AdminPage() {
  let m: any = null
  let error: string | null = null
  try {
    m = await getAdminMetrics()
  } catch (e: any) {
    error = e?.message ?? "Erro ao carregar métricas"
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="bg-[#1a0a0a] border border-red-900 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-400 font-bold mb-2">Erro ao carregar métricas</h2>
          <pre className="text-xs text-red-500 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    )
  }

  // Funil de conversão
  const total = m.totalUsers || 1
  const funnel = [
    { label: "Cadastros", value: m.totalUsers, pct: 100 },
    { label: "Perfis verificados", value: m.verifiedUsers, pct: Math.round((m.verifiedUsers / total) * 100) },
    { label: "Em match", value: m.totalMatches, pct: Math.round((m.totalMatches / total) * 100) },
    { label: "Propostas", value: m.totalProposals, pct: Math.round((m.totalProposals / total) * 100) },
    { label: "Contratos assinados", value: m.signedContracts, pct: Math.round((m.signedContracts / total) * 100) },
  ]

  // HEART
  const proposalAcceptPct = m.totalProposals > 0
    ? Math.round((m.acceptedProposals / m.totalProposals) * 100)
    : 0
  const matchToSociety = m.totalMatches > 0
    ? Math.round((m.signedContracts / m.totalMatches) * 100)
    : 0

  const planMap = Object.fromEntries(
    (m.planBreakdown ?? []).map((p: any) => [p.plan, p._count._all])
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#222]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">SocioN</span>
          <span className="text-xs bg-[#222] px-2 py-0.5 rounded text-gray-400">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Ver site</Link>
          <Link href="/api/auth/signout" className="text-sm text-gray-400 hover:text-white transition-colors">→ Sair</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-bold mb-1">Métricas de negócio</h1>
        <p className="text-gray-500 mb-8">Visão agregada de toda a atividade da plataforma.</p>

        {/* North Star + Funil */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {/* North Star */}
          <div className="bg-[#c8f5d0] rounded-2xl p-8 flex flex-col justify-between min-h-[280px]">
            <p className="text-xs font-semibold text-green-800 uppercase tracking-widest flex items-center gap-1">
              ↗ North Star Metric
            </p>
            <div>
              <p className="text-8xl font-bold text-black leading-none">{m.signedContracts}</p>
              <p className="text-gray-700 mt-3 text-sm">Sociedades com contrato assinado</p>
            </div>
          </div>

          {/* Funil */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Funil de Conversão</p>
            <div className="flex gap-4 h-44">
              {/* Bars */}
              <div className="flex-1 flex flex-col justify-end gap-1.5">
                {funnel.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div
                      className="h-6 rounded transition-all"
                      style={{
                        width: `${step.pct}%`,
                        background: `rgba(0,200,100,${1 - i * 0.15})`,
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Labels */}
              <div className="flex flex-col justify-end gap-1.5 shrink-0">
                {funnel.map((step) => (
                  <div key={step.label} className="h-6 flex flex-col justify-center">
                    <span className="text-xs font-bold text-white leading-none">{step.value}</span>
                    <span className="text-[10px] text-[#00c864] leading-none">{step.label}</span>
                    <span className="text-[10px] text-gray-500 leading-none">{step.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Aquisição */}
        <Section title="Aquisição" />
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Cadastros" value={m.totalUsers} />
          <Stat label="Perfis verificados" value={m.verifiedUsers} />
        </div>

        {/* Confiança */}
        <Section title="Confiança" />
        <div className="grid grid-cols-2 gap-4">
          <Stat label="% perfis verificados" value={`${m.verifiedRate}%`} sub="Verificados / cadastros" />
          <Stat label="Trust Score médio" value={m.avgTrustScore} sub="de 0 a 100" />
        </div>

        {/* Match */}
        <Section title="Match" />
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Likes" value={m.totalLikes} />
          <Stat label="Matches" value={m.totalMatches} />
          <Stat label="Propostas" value={m.totalProposals} />
        </div>

        {/* Sociedade */}
        <Section title="Sociedade" />
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Contratos enviados" value={m.totalProposals} />
          <div className="bg-[#c8f5d0] border border-[#222] rounded-xl p-5">
            <p className="text-xs text-green-800 uppercase tracking-wide mb-1">Contratos assinados</p>
            <p className="text-3xl font-bold text-black">{m.signedContracts}</p>
          </div>
        </div>

        {/* Retenção */}
        <Section title="Retenção" />
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Ativos após match" value={m.activePartnerships} sub={`${m.totalMatches > 0 ? Math.round((m.activePartnerships / m.totalMatches) * 100) : 0}% dos ${m.totalMatches} em match`} />
          <Stat label="Sociedades acompanhadas" value={m.activePartnerships} />
        </div>

        {/* HEART */}
        <div className="mt-10 pt-8 border-t border-[#222]">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Framework HEART · Google</p>
          <h2 className="text-3xl font-bold mb-1">Experiência do usuário</h2>
          <p className="text-gray-500 text-sm mb-8">Happiness, Engagement, Adoption, Retention e Task Success aplicados às features do SocioN.</p>

          <Section title="Happiness · Satisfação" />
          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Taxa de aceitação de propostas"
              value={`${proposalAcceptPct}%`}
              sub={`${m.acceptedProposals} de ${m.totalProposals} propostas`}
            />
            <div className="bg-[#111] border border-[#222] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Match → sociedade</p>
              <p className="text-3xl font-bold text-white">{matchToSociety}%</p>
              <div className="mt-3 bg-[#222] rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${matchToSociety}%` }} />
              </div>
            </div>
          </div>

          <Section title="Engagement · Engajamento" />
          <div className="grid grid-cols-4 gap-4">
            <Stat label="Likes no feed" value={m.totalLikes} />
            <Stat label="Favoritos" value={m.totalMatches} />
            <Stat label="Usuários ativos" value={m.totalUsers} sub="curtiram, favoritaram ou propuseram" />
            <Stat label="Likes / usuário ativo" value={m.totalUsers > 0 ? Math.round(m.totalLikes / m.totalUsers) : 0} />
          </div>

          <Section title="Adoption · Planos" />
          <div className="grid grid-cols-4 gap-4">
            {["TRIAL", "FREE", "PRO", "ENTERPRISE"].map((p) => (
              <Stat key={p} label={p} value={planMap[p] ?? 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
