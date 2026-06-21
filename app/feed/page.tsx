export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FeedCard } from "./FeedCard"

export default async function FeedPage() {
  let profiles: any[] = []
  let error = null

  try {
    profiles = await prisma.profile.findMany({
      where: { verificationStatus: { not: "REJECTED" } },
      include: {
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

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold text-[#00a86b]">SocioN</Link>
        <nav className="flex items-center gap-1">
          <Link href="/feed" className="px-3 py-1.5 text-sm text-white bg-[#1e2e26] rounded-lg">Feed</Link>
          <Link href="/matches" className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors">Matches</Link>
          <Link href="/dashboard/profile" className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors">Meu Perfil</Link>
        </nav>
      </header>

      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">
            Feed de Sócios{" "}
            <span className="text-[#4a5e54] font-normal text-base">({profiles.length})</span>
          </h1>
        </div>

        {profiles.length === 0 && (
          <p className="text-[#4a5e54] text-center py-12">Nenhum perfil encontrado.</p>
        )}

        <div className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <FeedCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  )
}
