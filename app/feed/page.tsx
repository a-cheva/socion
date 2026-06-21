export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { safeAuth as auth } from "@/lib/auth-safe"
import { TikTokFeed } from "./TikTokFeed"

export default async function FeedPage() {
  let profiles: any[] = []
  let error = null

  try {
    const session = await auth()

    // Perfis que o usuário denunciou ficam ocultos do seu feed
    let reportedIds: string[] = []
    if (session?.user?.id) {
      const reports = await prisma.report.findMany({
        where: { reporterUserId: session.user.id },
        select: { reportedUserId: true },
      })
      reportedIds = reports.map((r) => r.reportedUserId)
    }

    profiles = await prisma.profile.findMany({
      where: {
        verificationStatus: { not: "REJECTED" },
        ...(reportedIds.length > 0 ? { userId: { notIn: reportedIds } } : {}),
      },
      select: {
        id: true,
        headline: true,
        location: true,
        trustScore: true,
        bio: true,
        pitchVideoUrl: true,
        user: { select: { id: true, name: true, image: true } },
      },
      take: 20,
      orderBy: { trustScore: "desc" },
    })
  } catch (e: any) {
    error = e?.message ?? "Erro desconhecido"
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0f0d]">
        <div className="bg-[#1a0a0a] border border-red-900 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-400 font-bold mb-2">Erro ao carregar perfis</h2>
          <pre className="text-xs text-red-500 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    )
  }

  return <TikTokFeed profiles={profiles} />
}
