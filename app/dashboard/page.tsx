import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { daysLeftInTrial } from "@/lib/plans"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      partnerships1: {
        include: { userB: true, milestones: true },
        take: 5,
      },
      partnerships2: {
        include: { userA: true, milestones: true },
        take: 5,
      },
    },
  })

  if (!user) redirect("/login")

  const days = daysLeftInTrial(user.trialEndsAt)
  const partnerships = [...(user.partnerships1 ?? []), ...(user.partnerships2 ?? [])]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">SocioN</Link>
        <div className="flex gap-2">
          <Link href="/feed"><Button variant="ghost" size="sm">Feed</Button></Link>
          <Link href="/settings"><Button variant="ghost" size="sm">Configurações</Button></Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
        {/* Trial banner */}
        {user.plan === "TRIAL" && days > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-indigo-800">
                Período de teste — {days} dia{days !== 1 ? "s" : ""} restante{days !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-indigo-600">Faça upgrade para acesso ilimitado.</p>
            </div>
            <Link href="/settings/billing">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Fazer upgrade
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm text-gray-500">Trust Score</CardTitle></CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-indigo-600">
                {user.profile?.trustScore ?? "—"}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-gray-500">Matches</CardTitle></CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-gray-900">{partnerships.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-gray-500">Status</CardTitle></CardHeader>
            <CardContent>
              <Badge variant={user.profile?.verificationStatus === "VERIFIED" ? "default" : "secondary"}>
                {user.profile?.verificationStatus === "VERIFIED" ? "✓ Verificado" : "Em verificação"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Partnerships */}
        <Card>
          <CardHeader>
            <CardTitle>Salas de Sociedade</CardTitle>
          </CardHeader>
          <CardContent>
            {partnerships.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum match ainda.</p>
                <Link href="/feed">
                  <Button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Explorar feed
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {partnerships.map((p: any) => {
                  const partner = p.userA ?? p.userB
                  const completed = p.milestones.filter((m: any) => m.completed).length
                  const total = p.milestones.length
                  return (
                    <div key={p.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{partner?.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{p.status.toLowerCase().replace("_", " ")}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={(completed / total) * 100} className="flex-1 h-1.5" />
                          <span className="text-xs text-gray-500">{completed}/{total}</span>
                        </div>
                      </div>
                      <Link href={`/dashboard/partnership/${p.id}`}>
                        <Button size="sm" variant="outline">Ver sala</Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
