import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getTrustLabel, getTrustColor } from "@/lib/trust-score"

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      profile: {
        include: {
          skills: true,
          experiences: { orderBy: { startDate: "desc" } },
          projects: { orderBy: { startDate: "desc" } },
        },
      },
    },
  })

  if (!user || !user.profile) notFound()

  const p = user.profile
  const score = p.trustScore ?? 0
  const isOwnProfile = session?.user?.id === params.userId

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <a href="/feed" className="text-2xl font-bold text-indigo-600">SocioN</a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-medium">{user.name}</span>
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
        {/* Header card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback className="text-2xl">{user.name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                {p.headline && <p className="text-gray-600">{p.headline}</p>}
                {p.location && <p className="text-sm text-gray-400 mt-1">{p.location}</p>}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Badge variant={p.verificationStatus === "VERIFIED" ? "default" : "secondary"}>
                    {p.verificationStatus === "VERIFIED" ? "✓ Verificado" : "Em verificação"}
                  </Badge>
                  {p.offeringRole.map((r) => (
                    <Badge key={r} className="bg-indigo-100 text-indigo-700">{r}</Badge>
                  ))}
                </div>
              </div>
              {!isOwnProfile && (
                <a href={`/dashboard/proposals/new?toUserId=${params.userId}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Enviar proposta
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trust Score */}
        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-5xl font-bold ${getTrustColor(score)}`}>{score || "—"}</span>
              <div>
                <p className="font-medium text-gray-900">{getTrustLabel(score)}</p>
                <p className="text-sm text-gray-500">Score de confiabilidade</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: "Identidade", value: p.identityScore },
                { label: "Experiência", value: p.experienceScore },
                { label: "Competência", value: p.competenceScore },
                { label: "Reputação", value: p.reputationScore },
                { label: "Comprometimento", value: p.commitmentScore },
                { label: "Compatibilidade", value: p.compatibilityScore },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32">{label}</span>
                  <Progress value={value ?? 0} className="flex-1 h-2" />
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {value ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        {p.skills.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Competências</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-1">
                    <Badge variant={s.verified ? "default" : "outline"}>
                      {s.verified && "✓ "}{s.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experiences */}
        {p.experiences.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Histórico Profissional</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {p.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-indigo-200 pl-4">
                  <p className="font-semibold text-gray-900">{exp.title}</p>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-400">
                    {exp.startDate ? new Date(exp.startDate).getFullYear() : "?"} —{" "}
                    {exp.current ? "Atual" : exp.endDate ? new Date(exp.endDate).getFullYear() : "?"}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {p.projects.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Projetos</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {p.projects.map((proj) => (
                <div key={proj.id} className="rounded-lg border p-4">
                  <p className="font-semibold text-gray-900">{proj.name}</p>
                  {proj.description && (
                    <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                  )}
                  {proj.results && (
                    <p className="text-sm text-green-700 mt-1 font-medium">Resultados: {proj.results}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
