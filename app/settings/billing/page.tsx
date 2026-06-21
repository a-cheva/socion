import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckoutButton } from "@/components/billing/checkout-button"
import Link from "next/link"

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, stripeCurrentPeriodEnd: true, trialEndsAt: true },
  })

  if (!user) redirect("/login")

  const isPro = user.plan === "PRO" || user.plan === "ENTERPRISE"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-indigo-600">SocioN</Link>
      </header>
      <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900">Plano e cobrança</h1>

        <Card>
          <CardHeader>
            <CardTitle>Plano atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge className={isPro ? "bg-indigo-600" : "bg-gray-400"}>
                {user.plan}
              </Badge>
              {user.stripeCurrentPeriodEnd && (
                <span className="text-sm text-gray-500">
                  Renova em {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {!isPro && (
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-700">SocioN Pro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2 text-sm text-gray-700">
                {[
                  "Likes e favoritos ilimitados",
                  "Propostas ilimitadas",
                  "Acesso completo ao Trust Engine",
                  "IA Evidence Engine",
                  "Rede de confiança avançada",
                  "Sala da sociedade com contratos",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-indigo-600">✓</span> {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
