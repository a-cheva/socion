export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import Link from "next/link"

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
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-700 font-bold mb-2">Erro ao carregar perfis</h2>
          <pre className="text-xs text-red-600 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#ff385c]">SocioN</Link>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Feed de Sócios ({profiles.length})</h1>

        {profiles.length === 0 && (
          <p className="text-gray-500 text-center py-12">Nenhum perfil encontrado.</p>
        )}

        <div className="flex flex-col gap-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                {profile.user.image && (
                  <img
                    src={profile.user.image}
                    alt={profile.user.name ?? ""}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">{profile.user.name}</div>
                  {profile.headline && (
                    <div className="text-sm text-gray-500">{profile.headline}</div>
                  )}
                  {profile.location && (
                    <div className="text-xs text-gray-400">{profile.location}</div>
                  )}
                </div>
                {profile.trustScore && (
                  <span className="ml-auto text-sm font-bold text-[#ff385c] bg-red-50 px-2 py-1 rounded-full">
                    ★ {profile.trustScore}
                  </span>
                )}
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-700 line-clamp-3">{profile.bio}</p>
              )}

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/profile/${profile.user.id}`}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-700"
                >
                  Ver perfil →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
