export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { safeAuth as auth } from "@/lib/auth-safe"
import { notFound } from "next/navigation"
import Link from "next/link"

function trustLabel(score: number) {
  if (score >= 90) return "Confiança Excepcional"
  if (score >= 80) return "Altamente Confiável"
  if (score >= 70) return "Confiável"
  if (score >= 50) return "Confiança Moderada"
  return "Em construção"
}

const VALUE_QUESTIONS: Record<string, [string, string]> = {
  speed: ["Velocidade", "Perfeição"],
  risk: ["Risco", "Estabilidade"],
  growth: ["Crescimento", "Lucro"],
}

const HOURS_OPTIONS = [10, 20, 40]

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const session = await auth()

  let user: any = null
  try {
    user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        profile: {
          include: {
            skills: true,
            experiences: { orderBy: { startDate: "desc" } },
            projects: { orderBy: { createdAt: "desc" } },
          },
        },
        sentLikes: { select: { toUserId: true } },
      },
    })
  } catch (e: any) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-8">
        <div className="bg-[#1a0a0a] border border-red-900 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-400 font-bold mb-2">Erro ao carregar perfil</h2>
          <pre className="text-xs text-red-500 whitespace-pre-wrap">{e?.message}</pre>
        </div>
      </div>
    )
  }

  if (!user || !user.profile) notFound()

  const p = user.profile
  const score = Math.round(p.trustScore ?? 0)
  const isOwnProfile = session?.user?.id === params.userId

  // Rede de Confiança — contatos em comum
  let contatosEmComum = 0
  try {
    if (session?.user?.id && !isOwnProfile) {
      const viewerLikes = await prisma.like.findMany({
        where: { fromUserId: session.user.id },
        select: { toUserId: true },
      })
      const viewerSet = new Set(viewerLikes.map((l: any) => l.toUserId))
      contatosEmComum = (user.sentLikes ?? []).filter((l: any) => viewerSet.has(l.toUserId)).length
    }
  } catch {
    // rede de confiança falhou, continua sem ela
  }

  const subscores = [
    { label: "Identidade", value: p.identityScore },
    { label: "Experiência", value: p.experienceScore },
    { label: "Competência", value: p.competenceScore },
    { label: "Reputação", value: p.reputationScore },
    { label: "Comprometimento", value: p.commitmentScore },
    { label: "Compatibilidade", value: p.compatibilityScore },
  ]

  const values = (p.values as Record<string, number> | null) ?? null

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/feed" className="text-[#4a5e54] hover:text-white text-sm transition-colors">← Feed</Link>
        <span className="text-[#1e2e26]">/</span>
        <span className="text-white text-sm font-medium">{user.name}</span>
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-5">

        {/* Header card */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {user.image ? (
              <img src={user.image} alt={user.name ?? ""} className="w-20 h-20 rounded-full object-cover border border-[#2a3d32]" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold text-3xl border border-[#2a3d32]">
                {user.name?.[0] ?? "?"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {p.headline && <p className="text-[#8a9e94]">{p.headline}</p>}
              {p.location && <p className="text-sm text-[#4a5e54] mt-1">{p.location}</p>}
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.verificationStatus === "VERIFIED"
                    ? "bg-[#003d26] text-[#00a86b]"
                    : "bg-[#1e2e26] text-[#8a9e94]"
                }`}>
                  {p.verificationStatus === "VERIFIED" ? "✓ Verificado" : "Em verificação"}
                </span>
                {(p.offeringRole as string[]).map((r: string) => (
                  <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-[#1e2e26] text-[#8a9e94]">{r}</span>
                ))}
              </div>
            </div>
            {!isOwnProfile && (
              <Link
                href={`/dashboard/proposals/new?toUserId=${params.userId}`}
                className="bg-[#00a86b] hover:bg-[#009060] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
              >
                Enviar proposta
              </Link>
            )}
          </div>
          {p.bio && (
            <p className="text-sm text-[#8a9e94] mt-4 pt-4 border-t border-[#1e2e26] leading-relaxed">{p.bio}</p>
          )}
        </div>

        {/* Trust Score — elemento central */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#003d26] flex flex-col items-center justify-center border-2 border-[#00a86b]">
                <span className="text-4xl font-bold text-[#00a86b] leading-none">{score}</span>
                <span className="text-[10px] text-[#4a5e54] mt-1">de 100</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#4a5e54] uppercase tracking-wide mb-1">Trust Score</p>
              <p className="text-xl font-bold text-white">{trustLabel(score)}</p>
              <p className="text-sm text-[#8a9e94] mt-1">
                Confiança mensurável baseada em evidências reais.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {subscores.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-[#8a9e94] w-36 shrink-0">{label}</span>
                <div className="flex-1 bg-[#1e2e26] rounded-full h-2">
                  <div
                    className="bg-[#00a86b] h-2 rounded-full transition-all"
                    style={{ width: `${value ?? 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white w-9 text-right">
                  {value != null ? Math.round(value) : "—"}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#4a5e54] mt-5 pt-4 border-t border-[#1e2e26]">
            Fórmula: Identidade · Histórico profissional · Competências verificadas · Evidências de execução · Rede de confiança
          </p>
        </div>

        {/* Rede de Confiança */}
        {!isOwnProfile && (
          <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-[#00a86b]">✦</span> Rede de Confiança
            </h2>
            {contatosEmComum > 0 ? (
              <>
                <p className="text-[#8a9e94] text-sm mb-3">
                  Você e {user.name?.split(" ")[0]} possuem{" "}
                  <strong className="text-[#00a86b]">{contatosEmComum} contato{contatosEmComum !== 1 ? "s" : ""} em comum</strong>.
                </p>
                <div className="bg-[#003d26] border border-[#00a86b]/30 rounded-lg px-4 py-3 text-sm text-[#00a86b]">
                  💡 Converse com seus contatos em comum antes de decidir.
                </div>
              </>
            ) : (
              <p className="text-[#4a5e54] text-sm">
                Nenhum contato em comum ainda. Conforme sua rede cresce, mostramos conexões que aumentam a confiança.
              </p>
            )}
          </div>
        )}

        {/* Bloco 1 — Competências */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Competências</h2>
          {p.skills.length > 0 ? (
            <div className="flex flex-col gap-3">
              {p.skills.map((s) => (
                <div key={s.id} className="border border-[#1e2e26] rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-white text-sm">{s.name}</span>
                    {s.verified && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#003d26] text-[#00a86b]">✓ verificada</span>
                    )}
                    {s.source && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1e2e26] text-[#4a5e54]">via {s.source}</span>
                    )}
                  </div>
                  {s.evidence && <p className="text-xs text-[#8a9e94]">{s.evidence}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#4a5e54] text-sm">Nenhuma competência cadastrada.</p>
          )}
        </div>

        {/* Bloco 2 — Histórico */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Histórico Profissional</h2>
          {p.experiences.length > 0 ? (
            <div className="flex flex-col gap-4">
              {p.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#00a86b]/40 pl-4">
                  <p className="font-semibold text-white text-sm">{exp.title}</p>
                  <p className="text-[#8a9e94] text-sm">{exp.company}</p>
                  <p className="text-xs text-[#4a5e54] mt-0.5">
                    {exp.startDate ? new Date(exp.startDate).getFullYear() : "?"} —{" "}
                    {exp.current ? "Atual" : exp.endDate ? new Date(exp.endDate).getFullYear() : "?"}
                  </p>
                  {exp.description && <p className="text-sm text-[#8a9e94] mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#4a5e54] text-sm">Nenhuma experiência importada.</p>
          )}
        </div>

        {/* Bloco 3 — Projetos */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Projetos</h2>
          {p.projects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {p.projects.map((proj) => {
                const dur = proj.startDate
                  ? `${new Date(proj.startDate).getFullYear()}${proj.endDate ? ` – ${new Date(proj.endDate).getFullYear()}` : ""}`
                  : null
                return (
                  <div key={proj.id} className="border border-[#1e2e26] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white text-sm">{proj.name}</p>
                      {dur && <span className="text-xs text-[#4a5e54]">{dur}</span>}
                    </div>
                    {proj.description && <p className="text-sm text-[#8a9e94] mt-1">{proj.description}</p>}
                    {proj.results && (
                      <p className="text-sm text-[#00a86b] mt-2">📈 {proj.results}</p>
                    )}
                    {proj.links?.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {proj.links.map((l) => (
                          <a key={l} href={l} target="_blank" rel="noreferrer"
                            className="text-xs text-[#8a9e94] hover:text-[#00a86b] underline underline-offset-2">
                            {l.replace(/^https?:\/\//, "")}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-[#4a5e54] text-sm">Nenhum projeto cadastrado.</p>
          )}
        </div>

        {/* Bloco 4 — Disponibilidade */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Disponibilidade Semanal</h2>
          <div className="flex gap-3">
            {HOURS_OPTIONS.map((h, i) => {
              const next = HOURS_OPTIONS[i + 1] ?? 999
              const wh = p.weeklyHours ?? 0
              const isSelected = wh >= h && wh < next || (h === 40 && wh >= 40)
              return (
                <div key={h} className={`flex-1 text-center rounded-xl border py-4 ${
                  isSelected ? "bg-[#003d26] border-[#00a86b] text-[#00a86b]" : "bg-[#0d1310] border-[#1e2e26] text-[#4a5e54]"
                }`}>
                  <div className="text-2xl font-bold">{h}h</div>
                  <div className="text-xs mt-1">por semana</div>
                </div>
              )
            })}
          </div>
          {p.weeklyHours != null && (
            <p className="text-sm text-[#8a9e94] mt-3">
              Disponibilidade declarada: <strong className="text-white">{p.weeklyHours}h/semana</strong>
            </p>
          )}
        </div>

        {/* Bloco 5 — Valores */}
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Valores</h2>
          {values ? (
            <div className="flex flex-col gap-5">
              {Object.entries(VALUE_QUESTIONS).map(([key, [left, right]]) => {
                const v = values[key] ?? 50
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={v < 50 ? "text-[#00a86b] font-medium" : "text-[#4a5e54]"}>{left}</span>
                      <span className={v > 50 ? "text-[#00a86b] font-medium" : "text-[#4a5e54]"}>{right}</span>
                    </div>
                    <div className="relative bg-[#1e2e26] rounded-full h-2">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00a86b] border-2 border-[#111816]"
                        style={{ left: `calc(${v}% - 6px)` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-[#4a5e54] text-sm">Questionário de valores ainda não respondido.</p>
          )}
        </div>

      </div>
    </div>
  )
}
