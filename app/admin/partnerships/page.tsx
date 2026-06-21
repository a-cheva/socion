import { prisma } from "@/lib/prisma"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default async function AdminPartnershipsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const { status } = await searchParams

  const partnerships = await prisma.partnership.findMany({
    where: status ? { status: status as any } : {},
    include: {
      userA: { select: { name: true, email: true } },
      userB: { select: { name: true, email: true } },
      milestones: true,
      proposals: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  })

  const statuses = [
    "MATCHED",
    "PROPOSAL_SENT",
    "CONTRACT_IN_PROGRESS",
    "CONTRACT_SIGNED",
    "ACTIVE",
    "DISSOLVED",
  ]

  const statusLabels: Record<string, string> = {
    MATCHED:              "Match",
    PROPOSAL_SENT:        "Proposta Enviada",
    CONTRACT_IN_PROGRESS: "Contrato em Andamento",
    CONTRACT_SIGNED:      "Contrato Assinado",
    ACTIVE:               "Ativa",
    DISSOLVED:            "Dissolvida",
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-display-md text-[var(--color-ink)]">Sociedades</h1>
        <p className="text-body-sm text-[var(--color-muted-text)] mt-1">
          {partnerships.length} resultado(s)
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/partnerships"
          className={`px-3 py-1.5 rounded-full text-button-sm border transition-colors ${
            !status
              ? "bg-[var(--color-rausch)] text-white border-[var(--color-rausch)]"
              : "border-[var(--color-hairline)] text-[var(--color-muted-text)] hover:border-[var(--color-ink)]"
          }`}
        >
          Todas
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/partnerships?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-button-sm border transition-colors ${
              status === s
                ? "bg-[var(--color-rausch)] text-white border-[var(--color-rausch)]"
                : "border-[var(--color-hairline)] text-[var(--color-muted-text)] hover:border-[var(--color-ink)]"
            }`}
          >
            {statusLabels[s]}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[14px] overflow-hidden">
        <table className="w-full text-body-sm">
          <thead className="bg-[var(--color-surface-soft)] border-b border-[var(--color-hairline)]">
            <tr>
              {["Sócio A", "Sócio B", "Status", "Progresso", "Última atualização"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-caption text-[var(--color-muted-text)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partnerships.map((p) => {
              const completed = p.milestones.filter((m) => m.completed).length
              const total = p.milestones.length
              return (
                <tr
                  key={p.id}
                  className="border-b border-[var(--color-hairline-soft)] last:border-0 hover:bg-[var(--color-surface-soft)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-caption font-medium text-[var(--color-ink)]">{p.userA?.name ?? "—"}</p>
                    <p className="text-caption-sm text-[var(--color-muted-text)]">{p.userA?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-caption font-medium text-[var(--color-ink)]">{p.userB?.name ?? "—"}</p>
                    <p className="text-caption-sm text-[var(--color-muted-text)]">{p.userB?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} labels={statusLabels} />
                  </td>
                  <td className="px-4 py-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={total > 0 ? (completed / total) * 100 : 0}
                        className="flex-1 h-1.5 bg-[var(--color-hairline-soft)]"
                      />
                      <span className="text-micro-label text-[var(--color-muted-text)] shrink-0">
                        {completed}/{total}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-caption-sm text-[var(--color-muted-text)]">
                    {new Date(p.updatedAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusPill({
  status,
  labels,
}: {
  status: string
  labels: Record<string, string>
}) {
  const colors: Record<string, string> = {
    MATCHED:              "bg-blue-100 text-blue-700",
    PROPOSAL_SENT:        "bg-purple-100 text-purple-700",
    CONTRACT_IN_PROGRESS: "bg-amber-100 text-amber-700",
    CONTRACT_SIGNED:      "bg-green-100 text-green-700",
    ACTIVE:               "bg-emerald-100 text-emerald-700",
    DISSOLVED:            "bg-gray-100 text-gray-600",
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-badge font-semibold ${
        colors[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}
