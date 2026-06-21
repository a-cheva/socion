interface TrustScoreInput {
  identityScore: number
  experienceScore: number
  competenceScore: number
  reputationScore: number
  commitmentScore: number
}

const WEIGHTS = {
  identity: 0.20,
  experience: 0.20,
  competence: 0.20,
  reputation: 0.20,
  commitment: 0.20,
}

export function calculateTrustScore(input: TrustScoreInput): number {
  const score =
    input.identityScore * WEIGHTS.identity +
    input.experienceScore * WEIGHTS.experience +
    input.competenceScore * WEIGHTS.competence +
    input.reputationScore * WEIGHTS.reputation +
    input.commitmentScore * WEIGHTS.commitment

  return Math.round(score * 10) / 10
}

export function getTrustLabel(score: number): string {
  if (score >= 90) return "Altamente Confiável"
  if (score >= 75) return "Confiável"
  if (score >= 60) return "Em Verificação"
  if (score >= 40) return "Perfil Básico"
  return "Não Verificado"
}

export function getTrustColor(score: number): string {
  if (score >= 90) return "text-green-600"
  if (score >= 75) return "text-blue-600"
  if (score >= 60) return "text-yellow-600"
  if (score >= 40) return "text-orange-600"
  return "text-red-600"
}

export function estimateExperienceScore(
  experiences: { startDate: Date | null; endDate: Date | null; current: boolean }[]
): number {
  if (!experiences.length) return 0
  const totalMonths = experiences.reduce((sum, exp) => {
    const start = exp.startDate ? new Date(exp.startDate) : new Date()
    const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date())
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    return sum + Math.max(0, months)
  }, 0)
  return Math.min(100, Math.round((totalMonths / 12) * 8))
}

export function estimateCompetenceScore(skillCount: number, verifiedCount: number): number {
  return Math.min(50, skillCount * 5) + Math.min(50, verifiedCount * 10)
}
