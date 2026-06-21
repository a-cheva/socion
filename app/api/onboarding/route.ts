import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const INVEST_MAP: Record<string, string> = {
  "Sem investimento": "NONE",
  "Até R$ 10k": "UP_TO_10K",
  "Até R$ 50k": "UP_TO_50K",
  "Acima de R$ 50k": "ABOVE_50K",
}

const AVAIL_MAP: Record<string, string> = {
  "Full Time": "FULL_TIME",
  "Part Time": "PART_TIME",
}

const ROLE_MAP: Record<string, string> = {
  Tecnologia: "TECHNOLOGY",
  Marketing: "MARKETING",
  Produto: "PRODUCT",
  Vendas: "SALES",
  Operações: "OPERATIONS",
  Finanças: "FINANCE",
  Jurídico: "LEGAL",
}

const BIZ_MAP: Record<string, string> = {
  SaaS: "SAAS",
  Marketplace: "MARKETPLACE",
  IA: "AI",
  "E-commerce": "ECOMMERCE",
  Agência: "AGENCY",
  Serviços: "SERVICES",
}

const schema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  seekingRoles: z.array(z.string()).default([]),
  offeringRoles: z.array(z.string()).default([]),
  seekingBusinessTypes: z.array(z.string()).default([]),
  offeringBusinessTypes: z.array(z.string()).default([]),
  seekingAvailability: z.string().optional(),
  offeringAvailability: z.string().optional(),
  weeklyHours: z.number().optional(),
  seekingInvestment: z.string().optional(),
  offeringInvestment: z.string().optional(),
  values: z.record(z.string(), z.number()).optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  const d = parsed.data

  const profileData: any = {
    headline: d.headline,
    bio: d.bio,
    location: d.location,
    seekingRole: d.seekingRoles.map((r) => ROLE_MAP[r] ?? r),
    offeringRole: d.offeringRoles.map((r) => ROLE_MAP[r] ?? r),
    seekingBusinessType: d.seekingBusinessTypes.map((b) => BIZ_MAP[b] ?? b),
    offeringBusinessType: d.offeringBusinessTypes.map((b) => BIZ_MAP[b] ?? b),
    seekingAvailability: d.seekingAvailability ? AVAIL_MAP[d.seekingAvailability] ?? d.seekingAvailability : undefined,
    offeringAvailability: d.offeringAvailability ? AVAIL_MAP[d.offeringAvailability] ?? d.offeringAvailability : undefined,
    weeklyHours: d.weeklyHours,
    seekingInvestment: d.seekingInvestment ? INVEST_MAP[d.seekingInvestment] ?? d.seekingInvestment : undefined,
    offeringInvestment: d.offeringInvestment ? INVEST_MAP[d.offeringInvestment] ?? d.offeringInvestment : undefined,
    values: d.values,
  }

  // Remove undefined keys
  Object.keys(profileData).forEach((k) => profileData[k] === undefined && delete profileData[k])

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...profileData },
    update: profileData,
  })

  return NextResponse.json({ ok: true })
}
