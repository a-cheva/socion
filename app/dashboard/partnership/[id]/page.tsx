export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { safeAuth as auth } from "@/lib/auth-safe"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { DissolveButton } from "./DissolveButton"

const MILESTONE_ICONS: Record<number, string> = {
  1: "✦",
  2: "📄",
  3: "🤝",
  4: "📋",
  5: "⚖️",
  6: "✅",
}

export default async function PartnershipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  const p = await prisma.partnership.findUnique({
    where: { id },
    include: {
      userA: { select: { id: true, name: true, image: true, profile: { select: { headline: true, trustScore: true, location: true, bio: true } } } },
      userB: { select: { id: true, name: true, image: true, profile: { select: { headline: true, trustScore: true, location: true, bio: true } } } },
      milestones: { orderBy: { order: "asc" } },
      proposals: {
        orderBy: { createdAt: "desc" },
        include: { fromUser: { select: { name: true, image: true } } },
      },
    },
  })

  if (!p || (p.userAId !== userId && p.userBId !== userId)) notFound()

  const partner = p.userAId === userId ? p.userB : p.userA
  const completed = p.milestones.filter((m) => m.completed).length
  const total = p.milestones.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const statusLabel: Record<string, string> = {
    MATCHED: "Match realizado",
    PROPOSAL_SENT: "Proposta enviada",
    CONTRACT_IN_PROGRESS: "Contrato em andamento",
    CONTRACT_SIGNED: "Contrato assinado",
    ACTIVE: "Sociedade ativa",
    DISSOLVED: "Encerrada",
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/matches" className="text-[#4a5e54] hover:text-white text-sm transition-colors">← Matches</Link>
        <span className="text-[#1e2e26]">/</span>
        <span className="text-white text-sm font-medium">Sala da Sociedade</span>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-5">

        {/* Partner header */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5">
          <div className="flex items-center gap-4">
            {partner.image ? (
              <img src={partner.image} alt={partner.name ?? ""} className="w-16 h-16 rounded-full object-cover border border-[#2a3d32]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold text-2xl border border-[#2a3d32]">
                {partner.name?.[0] ?? "?"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{partner.name}</h1>
              {partner.profile?.headline && <p className="text-[#8a9e94] text-sm">{partner.profile.headline}</p>}
              {partner.profile?.location && <p className="text-[#4a5e54] text-xs mt-0.5">{partner.profile.location}</p>}
            </div>
            {partner.profile?.trustScore != null && (
              <div className="flex flex-col items-center bg-[#003d26] rounded-xl px-4 py-2">
                <span className="text-[#00a86b] font-bold text-2xl leading-none">{partner.profile.trustScore}</span>
                <span className="text-[#4a5e54] text-xs">trust score</span>
              </div>
            )}
          </div>
          {partner.profile?.bio && (
            <p className="text-sm text-[#8a9e94] mt-4 pt-4 border-t border-[#1e2e26]">{partner.profile.bio}</p>
          )}
          <div className="mt-3 flex gap-2">
            <Link
              href={`/profile/${partner.id}`}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#161f1a] border border-[#2a3d32] text-[#8a9e94] hover:text-white transition-colors"
            >
              Ver perfil completo →
            </Link>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Progresso da Sociedade</h2>
            <span className="text-[#00a86b] text-sm font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-[#1e2e26] rounded-full h-2 mb-4">
            <div className="bg-[#00a86b] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex flex-col gap-3">
            {p.milestones.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${
                  m.completed ? "bg-[#003d26] text-[#00a86b]" : "bg-[#1e2e26] text-[#4a5e54]"
                }`}>
                  {m.completed ? "✓" : (MILESTONE_ICONS[m.order] ?? String(m.order))}
                </div>
                <span className={`text-sm ${m.completed ? "text-white" : "text-[#4a5e54]"}`}>{m.title}</span>
                {m.completed && m.completedAt && (
                  <span className="ml-auto text-xs text-[#4a5e54]">
                    {new Date(m.completedAt).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#4a5e54] mb-1">Status atual</p>
              <p className="font-semibold text-white">{statusLabel[p.status] ?? p.status}</p>
            </div>
            <Link
              href={`/dashboard/proposals/new?partnershipId=${p.id}&toUserId=${partner.id}`}
              className="bg-[#00a86b] hover:bg-[#009060] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Enviar proposta
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1e2e26] flex justify-end">
            <DissolveButton partnershipId={p.id} />
          </div>
        </div>

        {/* Proposals */}
        {p.proposals.length > 0 && (
          <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4">Propostas</h2>
            <div className="flex flex-col gap-3">
              {p.proposals.map((prop) => {
                const statusColor: Record<string, string> = {
                  SENT: "text-[#8a9e94] bg-[#1e2e26]",
                  VIEWED: "text-[#ffb84d] bg-[#1a1000]",
                  ACCEPTED: "text-[#00a86b] bg-[#003d26]",
                  REJECTED: "text-red-400 bg-[#1a0a0a]",
                }
                const statusLabel: Record<string, string> = {
                  SENT: "Enviada",
                  VIEWED: "Visualizada",
                  ACCEPTED: "Aceita",
                  REJECTED: "Recusada",
                }
                return (
                  <div key={prop.id} className="border border-[#1e2e26] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">
                        {prop.fromUser.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[prop.status]}`}>
                        {statusLabel[prop.status]}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-[#8a9e94] mb-2">
                      {prop.equityPercent != null && <span>Equity: <strong className="text-white">{prop.equityPercent}%</strong></span>}
                      {prop.role && <span>Papel: <strong className="text-white">{prop.role}</strong></span>}
                      {prop.investmentType && <span>Invest.: <strong className="text-white">{prop.investmentType}</strong></span>}
                    </div>
                    {prop.message && (
                      <p className="text-sm text-[#8a9e94] italic">"{prop.message}"</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
