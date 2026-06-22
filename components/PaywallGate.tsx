import Link from "next/link"
import { Plan } from "@prisma/client"
import { hasAccess } from "@/lib/plans"

interface Props {
  plan: Plan
  trialEndsAt: Date | null
  stripeCurrentPeriodEnd: Date | null
  children: React.ReactNode
  /** Texto curto do que está sendo bloqueado. */
  feature?: string
}

/**
 * Libera os children quando o usuário tem acesso (TRIAL ativo ou PRO).
 * Caso contrário, bloqueia com card de upgrade.
 */
export function PaywallGate({ plan, trialEndsAt, stripeCurrentPeriodEnd, children, feature }: Props) {
  if (hasAccess(plan, trialEndsAt, stripeCurrentPeriodEnd)) {
    return <>{children}</>
  }

  return (
    <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#003d26] border border-[#00a86b] flex items-center justify-center mx-auto mb-4">
        <span className="text-[#00a86b] text-xl">🔒</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Seu período de teste terminou</h2>
      <p className="text-[#8a9e94] text-sm mb-6">
        {feature ? `Para ${feature}, ` : "Para continuar, "}
        faça upgrade para o plano PRO e tenha acesso ilimitado.
      </p>
      <Link
        href="/settings/billing"
        className="inline-flex items-center gap-2 bg-[#00a86b] hover:bg-[#009060] text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Fazer upgrade →
      </Link>
    </div>
  )
}
