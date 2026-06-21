import { prisma } from "@/lib/prisma"

export async function getAdminMetrics() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsersLast30d,
    verifiedUsers,
    totalProfiles,
    totalLikes,
    totalMatches,
    totalProposals,
    acceptedProposals,
    signedContracts,
    activePartnerships,
    avgTrustScore,
    planBreakdown,
    recentUsers,
    recentPartnerships,
    dailySignups,
    pendingKyc,
  ] = await Promise.all([
    // Aquisição
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.profile.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.profile.count(),

    // Match
    prisma.like.count(),
    prisma.partnership.count(),
    prisma.proposal.count(),
    prisma.proposal.count({ where: { status: "ACCEPTED" } }),

    // North Star — contratos assinados
    prisma.partnership.count({ where: { status: "CONTRACT_SIGNED" } }),
    prisma.partnership.count({ where: { status: "ACTIVE" } }),

    // Trust
    prisma.profile.aggregate({ _avg: { trustScore: true } }),

    // Planos
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),

    // Recentes
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { profile: { select: { trustScore: true, verificationStatus: true } } },
    }),
    prisma.partnership.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        userA: { select: { name: true, email: true } },
        userB: { select: { name: true, email: true } },
        milestones: true,
      },
    }),

    // Cadastros por dia (últimos 7 dias)
    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE("createdAt")::text as date, COUNT(*)::bigint as count
      FROM "User"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,

    // KYC pendente
    prisma.profile.count({ where: { verificationStatus: "PENDING" } }),
  ])

  const matchRate = totalLikes > 0 ? ((totalMatches / totalLikes) * 100).toFixed(1) : "0"
  const proposalAcceptRate =
    totalProposals > 0 ? ((acceptedProposals / totalProposals) * 100).toFixed(1) : "0"
  const verifiedRate =
    totalProfiles > 0 ? ((verifiedUsers / totalProfiles) * 100).toFixed(1) : "0"

  return {
    // North Star
    signedContracts,

    // Aquisição
    totalUsers,
    newUsersLast30d,
    verifiedUsers,
    verifiedRate,
    pendingKyc,

    // Match funnel
    totalLikes,
    totalMatches,
    matchRate,
    totalProposals,
    acceptedProposals,
    proposalAcceptRate,

    // Sociedades ativas
    activePartnerships,

    // Trust
    avgTrustScore: avgTrustScore._avg.trustScore?.toFixed(1) ?? "—",

    // Planos
    planBreakdown,

    // Tabelas
    recentUsers,
    recentPartnerships,
    dailySignups: dailySignups.map((d) => ({
      date: d.date,
      count: Number(d.count),
    })),
  }
}
