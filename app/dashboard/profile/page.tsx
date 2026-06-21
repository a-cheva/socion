export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { safeAuth as auth } from "@/lib/auth-safe"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ProfileEditor } from "./ProfileEditor"

export default async function MyProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          skills: { orderBy: { createdAt: "asc" } },
          documents: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  })

  if (!user) redirect("/login")

  const p = user.profile

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/feed" className="text-xl font-bold text-[#00a86b]">SocioN</Link>
        <nav className="flex items-center gap-1">
          <Link href="/feed" className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors">Feed</Link>
          <Link href="/matches" className="px-3 py-1.5 text-sm text-[#8a9e94] hover:text-white rounded-lg transition-colors">Matches</Link>
          <Link href="/dashboard/profile" className="px-3 py-1.5 text-sm text-white bg-[#1e2e26] rounded-lg">Meu Perfil</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Meu Perfil</h1>
          <p className="text-[#8a9e94] text-sm">
            Edite seus dados e competências. Cada evidência aumenta seu Trust Score.
          </p>
          {session.user.id && (
            <Link
              href={`/profile/${session.user.id}`}
              className="inline-flex items-center gap-1 text-xs text-[#00a86b] hover:underline mt-2"
            >
              Ver como os outros veem →
            </Link>
          )}
        </div>

        <ProfileEditor
          initial={{
            name: user.name ?? "",
            image: user.image,
            headline: p?.headline ?? "",
            bio: p?.bio ?? "",
            location: p?.location ?? "",
            weeklyHours: p?.weeklyHours ?? 40,
            trustScore: p?.trustScore ?? null,
            verificationStatus: p?.verificationStatus ?? "PENDING",
            skills: (p?.skills ?? []).map((s) => ({
              id: s.id,
              name: s.name,
              evidence: s.evidence,
              verified: s.verified,
              source: s.source,
            })),
            documents: (p?.documents ?? []).map((doc) => ({
              id: doc.id,
              type: doc.type,
              fileName: doc.fileName,
              status: doc.status,
              rejectionReason: doc.rejectionReason,
            })),
          }}
        />
      </div>
    </div>
  )
}
