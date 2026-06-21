import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ApproveKycButton } from "@/components/admin/approve-kyc-button"

export default async function AdminVerificationPage() {
  const pendingProfiles = await prisma.profile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      documents: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-display-md text-[var(--color-ink)]">Verificação KYC</h1>
        <p className="text-body-sm text-[var(--color-muted-text)] mt-1">
          {pendingProfiles.length} perfil(is) aguardando revisão
        </p>
      </div>

      {pendingProfiles.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-muted-text)]">
          <p className="text-display-sm">✓ Nenhum KYC pendente</p>
          <p className="text-body-sm mt-2">Todos os perfis foram revisados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[14px] p-5 flex items-start gap-4"
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-[var(--color-surface-strong)] text-[var(--color-ink)] font-semibold">
                  {profile.user?.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-title-md text-[var(--color-ink)]">{profile.user?.name}</p>
                <p className="text-body-sm text-[var(--color-muted-text)]">{profile.user?.email}</p>
                {profile.headline && (
                  <p className="text-body-sm text-[var(--color-muted-text)] mt-1">{profile.headline}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-hairline)] rounded-full text-button-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)] transition-colors"
                    >
                      📄 {doc.type}
                    </a>
                  ))}
                  {profile.documents.length === 0 && (
                    <span className="text-caption-sm text-[var(--color-muted-soft)]">
                      Nenhum documento enviado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <ApproveKycButton profileId={profile.id} action="VERIFIED" />
                <ApproveKycButton profileId={profile.id} action="REJECTED" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
