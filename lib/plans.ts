import { Plan } from "@prisma/client"

export const PLAN_LIMITS = {
  [Plan.TRIAL]: {
    likes: 10,
    proposals: 2,
    profileViews: 20,
  },
  [Plan.FREE]: {
    likes: 5,
    proposals: 1,
    profileViews: 10,
  },
  [Plan.PRO]: {
    likes: Infinity,
    proposals: Infinity,
    profileViews: Infinity,
  },
  [Plan.ENTERPRISE]: {
    likes: Infinity,
    proposals: Infinity,
    profileViews: Infinity,
  },
}

export function isTrialActive(trialEndsAt: Date | null | undefined): boolean {
  if (!trialEndsAt) return false
  return new Date() < new Date(trialEndsAt)
}

export function isSubscribed(stripeCurrentPeriodEnd: Date | null | undefined): boolean {
  if (!stripeCurrentPeriodEnd) return false
  return new Date() < new Date(stripeCurrentPeriodEnd)
}

export function hasAccess(plan: Plan, trialEndsAt: Date | null, stripeCurrentPeriodEnd: Date | null): boolean {
  if (plan === Plan.PRO || plan === Plan.ENTERPRISE) return isSubscribed(stripeCurrentPeriodEnd)
  if (plan === Plan.TRIAL) return isTrialActive(trialEndsAt)
  return false
}

export function daysLeftInTrial(trialEndsAt: Date | null | undefined): number {
  if (!trialEndsAt) return 0
  const diff = new Date(trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

type Resource = "likes" | "proposals" | "profileViews"

/** Verifica se o uso atual ainda está dentro do limite do plano. */
export function checkUsageLimit(
  plan: Plan,
  resource: Resource,
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const limit = PLAN_LIMITS[plan]?.[resource] ?? 0
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - currentUsage)
  return { allowed: currentUsage < limit, limit, remaining }
}
