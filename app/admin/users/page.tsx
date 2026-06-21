import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { plan?: string; status?: string; q?: string }
}) {
  const { plan, status, q } = await searchParams

  const users = await prisma.user.findMany({
    where: {
      ...(plan ? { plan: plan as any } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(status ? { profile: { verificationStatus: status as any } } : {}),
    },
    include: {
      profile: {
        select: {
          trustScore: true,
          verificationStatus: true,
          headline: true,
          location: true,
          offeringRole: true,
        },
      },
      _count: { select: { sentLikes: true, partnerships1: true, partnerships2: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const plans = ["TRIAL", "FREE", "PRO", "ENTERPRISE"]
  const statuses = ["PENDING", "VERIFIED", "REJECTED"]

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-display-md text-[var(--color-ink)]">Usuários</h1>
        <p className="text-body-sm text-[var(--color-muted-text)] mt-1">{users.length} resultado(s)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/users"
          className={`px-3 py-1.5 rounded-full text-button-sm border transition-colors ${
            !plan && !status ? "bg-[var(--color-rausch)] text-white border-[var(--color-rausch)]" : "border-[var(--color-hairline)] text-[var(--color-muted-text)] hover:border-[var(--color-ink)]"
          }`}
        >
          Todos
        </Link>
        {plans.map((p) => (
          <Link
            key={p}
            href={`/admin/users?plan=${p}`}
            className={`px-3 py-1.5 rounded-full text-button-sm border transition-colors ${
              plan === p ? "bg-[var(--color-rausch)] text-white border-[var(--color-rausch)]" : "border-[var(--color-hairline)] text-[var(--color-muted-text)] hover:border-[var(--color-ink)]"
            }`}
          >
            {p}
          </Link>
        ))}
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/users?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-button-sm border transition-colors ${
              status === s ? "bg-[var(--color-rausch)] text-white border-[var(--color-rausch)]" : "border-[var(--color-hairline)] text-[var(--color-muted-text)] hover:border-[var(--color-ink)]"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[14px] overflow-hidden">
        <table className="w-full text-body-sm">
          <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-hairline)]">
            <tr>
              {["Usuário", "Plano", "Trust Score", "KYC", "Likes", "Matches", "Cadastro"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-caption text-[var(--color-muted-text)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[var(--color-hairline-soft)] last:border-0 hover:bg-[var(--color-surface-soft)] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-micro-label bg-[var(--color-surface-strong)]">
                        {u.name?.[0] ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-caption font-medium text-[var(--color-ink)]">{u.name ?? "—"}</p>
                      <p className="text-caption-sm text-[var(--color-muted-text)]">{u.email}</p>
                      {u.profile?.headline && (
                        <p className="text-caption-sm text-[var(--color-muted-soft)] truncate max-w-[200px]">
                          {u.profile.headline}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PlanBadge plan={u.plan} />
                </td>
                <td className="px-4 py-3 text-caption font-semibold text-[var(--color-ink)]">
                  {u.profile?.trustScore ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <KycBadge status={u.profile?.verificationStatus ?? "PENDING"} />
                </td>
                <td className="px-4 py-3 text-caption text-[var(--color-muted-text)]">
                  {u._count.sentLikes}
                </td>
                <td className="px-4 py-3 text-caption text-[var(--color-muted-text)]">
                  {u._count.partnerships1 + u._count.partnerships2}
                </td>
                <td className="px-4 py-3 text-caption-sm text-[var(--color-muted-text)]">
                  {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    PRO:        "bg-[var(--color-rausch)] text-white",
    TRIAL:      "bg-blue-100 text-blue-700",
    FREE:       "bg-[var(--color-surface-strong)] text-[var(--color-muted-text)]",
    ENTERPRISE: "bg-[var(--color-luxe)] text-white",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-badge font-semibold ${map[plan] ?? "bg-gray-100 text-gray-600"}`}>
      {plan}
    </span>
  )
}

function KycBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    VERIFIED: "bg-green-100 text-green-700",
    PENDING:  "bg-amber-100 text-amber-700",
    REJECTED: "bg-red-100 text-red-700",
  }
  const labels: Record<string, string> = {
    VERIFIED: "✓ Verificado",
    PENDING:  "Pendente",
    REJECTED: "Reprovado",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-badge font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  )
}
