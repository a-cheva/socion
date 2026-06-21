import { getAdminMetrics } from "@/lib/admin-metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  Handshake,
  Star,
  FileCheck,
  Heart,
  ShieldCheck,
  Clock,
} from "lucide-react"

export default async function AdminOverviewPage() {
  const m = await getAdminMetrics()

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-display-md text-[var(--color-ink)]">Dashboard Admin</h1>
        <p className="text-body-sm text-[var(--color-muted-text)] mt-1">
          Métricas em tempo real do SocioN
        </p>
      </div>

      {/* North Star */}
      <section>
        <p className="text-caption text-[var(--color-muted-text)] uppercase tracking-wider mb-3">
          ⭐ North Star Metric
        </p>
        <Card className="border-[var(--color-rausch)] bg-gradient-to-br from-white to-rose-50">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-rausch)] flex items-center justify-center shrink-0">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-caption text-[var(--color-muted-text)]">
                Sociedades iniciadas com contrato assinado
              </p>
              <p className="text-rating font-bold text-[var(--color-rausch)] leading-none mt-1">
                {m.signedContracts}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* KPIs Grid */}
      <section>
        <p className="text-caption text-[var(--color-muted-text)] uppercase tracking-wider mb-3">
          KPIs de Aquisição
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            label="Total de Usuários"
            value={m.totalUsers}
            sub={`+${m.newUsersLast30d} últimos 30d`}
          />
          <MetricCard
            icon={<ShieldCheck className="w-5 h-5" />}
            label="Perfis Verificados"
            value={m.verifiedUsers}
            sub={`${m.verifiedRate}% do total`}
          />
          <MetricCard
            icon={<Clock className="w-5 h-5" />}
            label="KYC Pendente"
            value={m.pendingKyc}
            sub="aguardando revisão"
            highlight={m.pendingKyc > 0}
          />
          <MetricCard
            icon={<Star className="w-5 h-5" />}
            label="Trust Score Médio"
            value={m.avgTrustScore}
            sub="plataforma toda"
          />
        </div>
      </section>

      <section>
        <p className="text-caption text-[var(--color-muted-text)] uppercase tracking-wider mb-3">
          KPIs de Match
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Heart className="w-5 h-5" />}
            label="Total de Likes"
            value={m.totalLikes}
            sub="interesses demonstrados"
          />
          <MetricCard
            icon={<Handshake className="w-5 h-5" />}
            label="Matches"
            value={m.totalMatches}
            sub={`${m.matchRate}% taxa de match`}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Propostas Enviadas"
            value={m.totalProposals}
            sub={`${m.proposalAcceptRate}% aceitas`}
          />
          <MetricCard
            icon={<FileCheck className="w-5 h-5" />}
            label="Sociedades Ativas"
            value={m.activePartnerships}
            sub="em andamento"
          />
        </div>
      </section>

      {/* Planos */}
      <section>
        <p className="text-caption text-[var(--color-muted-text)] uppercase tracking-wider mb-3">
          Distribuição de Planos
        </p>
        <Card className="border-[var(--color-hairline)]">
          <CardContent className="p-6 flex flex-col gap-4">
            {m.planBreakdown.map((p) => {
              const pct = m.totalUsers > 0 ? (p._count._all / m.totalUsers) * 100 : 0
              const colors: Record<string, string> = {
                PRO: "bg-[var(--color-rausch)]",
                TRIAL: "bg-blue-500",
                FREE: "bg-[var(--color-hairline)]",
                ENTERPRISE: "bg-[var(--color-luxe)]",
              }
              return (
                <div key={p.plan} className="flex items-center gap-4">
                  <span className="text-caption text-[var(--color-ink)] w-24 shrink-0">{p.plan}</span>
                  <div className="flex-1 bg-[var(--color-surface-strong)] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${colors[p.plan] ?? "bg-gray-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-caption font-semibold text-[var(--color-ink)] w-10 text-right">
                    {p._count._all}
                  </span>
                  <span className="text-caption-sm text-[var(--color-muted-text)] w-10 text-right">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>

      {/* Últimos 7 dias */}
      {m.dailySignups.length > 0 && (
        <section>
          <p className="text-caption text-[var(--color-muted-text)] uppercase tracking-wider mb-3">
            Cadastros — Últimos 7 dias
          </p>
          <Card className="border-[var(--color-hairline)]">
            <CardContent className="p-6">
              <div className="flex items-end gap-3 h-24">
                {m.dailySignups.map((d) => {
                  const max = Math.max(...m.dailySignups.map((x) => x.count), 1)
                  const h = (d.count / max) * 100
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-micro-label text-[var(--color-muted-text)]">{d.count}</span>
                      <div
                        className="w-full bg-[var(--color-rausch)] rounded-t-sm"
                        style={{ height: `${h}%`, minHeight: "4px" }}
                      />
                      <span className="text-micro-label text-[var(--color-muted-soft)]">
                        {new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Tabelas lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários recentes */}
        <Card className="border-[var(--color-hairline)]">
          <CardHeader>
            <CardTitle className="text-title-md text-[var(--color-ink)]">Usuários Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-[var(--color-hairline-soft)]">
                  <th className="text-left px-4 py-2 text-caption text-[var(--color-muted-text)]">Usuário</th>
                  <th className="text-left px-4 py-2 text-caption text-[var(--color-muted-text)]">Trust</th>
                  <th className="text-left px-4 py-2 text-caption text-[var(--color-muted-text)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {m.recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--color-hairline-soft)] last:border-0 hover:bg-[var(--color-surface-soft)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-micro-label bg-[var(--color-surface-strong)]">
                            {u.name?.[0] ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-caption font-medium text-[var(--color-ink)] leading-tight">{u.name ?? "—"}</p>
                          <p className="text-caption-sm text-[var(--color-muted-text)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caption font-semibold text-[var(--color-ink)]">
                      {u.profile?.trustScore ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.profile?.verificationStatus ?? "PENDING"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Sociedades recentes */}
        <Card className="border-[var(--color-hairline)]">
          <CardHeader>
            <CardTitle className="text-title-md text-[var(--color-ink)]">Sociedades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-[var(--color-hairline-soft)]">
                  <th className="text-left px-4 py-2 text-caption text-[var(--color-muted-text)]">Parceiros</th>
                  <th className="text-left px-4 py-2 text-caption text-[var(--color-muted-text)]">Status</th>
                  <th className="text-left px-4 py-2 text-caption text-[var(--color-muted-text)]">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {m.recentPartnerships.map((p) => {
                  const completed = p.milestones.filter((m) => m.completed).length
                  const total = p.milestones.length
                  return (
                    <tr key={p.id} className="border-b border-[var(--color-hairline-soft)] last:border-0 hover:bg-[var(--color-surface-soft)]">
                      <td className="px-4 py-3">
                        <p className="text-caption font-medium text-[var(--color-ink)] leading-tight">
                          {p.userA?.name ?? "—"}
                        </p>
                        <p className="text-caption-sm text-[var(--color-muted-text)]">
                          + {p.userB?.name ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <PartnershipBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={total > 0 ? (completed / total) * 100 : 0}
                            className="h-1.5 flex-1 bg-[var(--color-hairline-soft)]"
                          />
                          <span className="text-micro-label text-[var(--color-muted-text)] shrink-0">
                            {completed}/{total}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  highlight = false,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  sub?: string
  highlight?: boolean
}) {
  return (
    <Card
      className={`border-[var(--color-hairline)] ${highlight ? "border-amber-300 bg-amber-50" : ""}`}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-[var(--color-muted-text)] mb-3">
          {icon}
          <span className="text-caption">{label}</span>
        </div>
        <p className="text-display-md font-bold text-[var(--color-ink)]">{value}</p>
        {sub && <p className="text-caption-sm text-[var(--color-muted-text)] mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    VERIFIED:  { label: "Verificado", cls: "bg-green-100 text-green-700" },
    PENDING:   { label: "Pendente",   cls: "bg-amber-100 text-amber-700" },
    REJECTED:  { label: "Reprovado",  cls: "bg-red-100 text-red-700" },
  }
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-badge font-semibold ${cls}`}>
      {label}
    </span>
  )
}

function PartnershipBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    MATCHED:              { label: "Match",           cls: "bg-blue-100 text-blue-700" },
    PROPOSAL_SENT:        { label: "Proposta",        cls: "bg-purple-100 text-purple-700" },
    CONTRACT_IN_PROGRESS: { label: "Contrato",        cls: "bg-amber-100 text-amber-700" },
    CONTRACT_SIGNED:      { label: "Assinado ✓",     cls: "bg-green-100 text-green-700" },
    ACTIVE:               { label: "Ativa",           cls: "bg-emerald-100 text-emerald-700" },
    DISSOLVED:            { label: "Dissolvida",      cls: "bg-gray-100 text-gray-600" },
  }
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-badge font-semibold ${cls}`}>
      {label}
    </span>
  )
}
