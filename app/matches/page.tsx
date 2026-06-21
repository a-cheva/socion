export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { safeAuth as auth } from "@/lib/auth-safe"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MatchesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  const partnerships = await prisma.partnership.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: { id: true, name: true, image: true, profile: { select: { headline: true, trustScore: true } } } },
      userB: { select: { id: true, name: true, image: true, profile: { select: { headline: true, trustScore: true } } } },
      proposals: { orderBy: { createdAt: "desc" }, take: 1 },
      milestones: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold text-[#00a86b]">SocioN</Link>
        <nav className="flex items-center gap-1">
          <Link href="/feed" className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors">Feed</Link>
          <Link href="/matches" className="px-3 py-1.5 text-sm text-white bg-[#1e2e26] rounded-lg">Matches</Link>
          <Link href="/dashboard" className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors">Dashboard</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-xl font-bold text-white mb-1">Seus Matches</h1>
        <p className="text-[#4a5e54] text-sm mb-6">Pessoas que também favoritaram você.</p>

        {partnerships.length === 0 ? (
          <div className="text-center py-20 text-[#4a5e54]">
            <div className="text-4xl mb-3">✦</div>
            <p className="text-lg font-medium text-[#8a9e94] mb-1">Nenhum match ainda</p>
            <p className="text-sm mb-6">Favorite perfis no feed para gerar matches.</p>
            <Link href="/feed" className="inline-flex items-center gap-2 bg-[#00a86b] hover:bg-[#009060] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
              Explorar feed →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {partnerships.map((p) => {
              const partner = p.userAId === userId ? p.userB : p.userA
              const completed = p.milestones.filter((m) => m.completed).length
              const total = p.milestones.length
              const statusLabel: Record<string, string> = {
                MATCHED: "Match",
                PROPOSAL_SENT: "Proposta enviada",
                CONTRACT_IN_PROGRESS: "Contrato em andamento",
                CONTRACT_SIGNED: "Contrato assinado",
                ACTIVE: "Sociedade ativa",
                DISSOLVED: "Encerrada",
              }

              return (
                <Link
                  key={p.id}
                  href={`/dashboard/partnership/${p.id}`}
                  className="block bg-[#111816] border border-[#1e2e26] rounded-2xl p-5 hover:border-[#00a86b] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {partner.image ? (
                      <img src={partner.image} alt={partner.name ?? ""} className="w-12 h-12 rounded-full object-cover border border-[#2a3d32]" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold text-lg border border-[#2a3d32]">
                        {partner.name?.[0] ?? "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-white">{partner.name}</div>
                      {partner.profile?.headline && (
                        <div className="text-sm text-[#8a9e94]">{partner.profile.headline}</div>
                      )}
                    </div>
                    {partner.profile?.trustScore != null && (
                      <div className="shrink-0 flex flex-col items-center bg-[#003d26] rounded-xl px-3 py-1.5">
                        <span className="text-[#00a86b] font-bold text-lg leading-none">{partner.profile.trustScore}</span>
                        <span className="text-[#4a5e54] text-[10px]">score</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#4a5e54] mb-2">
                    <span className="bg-[#003d26] text-[#00a86b] px-2 py-0.5 rounded-full">
                      {statusLabel[p.status] ?? p.status}
                    </span>
                    <span>{completed}/{total} etapas</span>
                  </div>

                  <div className="w-full bg-[#1e2e26] rounded-full h-1.5">
                    <div
                      className="bg-[#00a86b] h-1.5 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
