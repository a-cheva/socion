import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  seekingRoles: z.array(z.string()),
  seekingAvailability: z.string().optional(),
  seekingInvestment: z.string().optional(),
  seekingBusinessTypes: z.array(z.string()),
  offeringRoles: z.array(z.string()),
  offeringAvailability: z.string().optional(),
  offeringInvestment: z.string().optional(),
  offeringBusinessTypes: z.array(z.string()),
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

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      seekingRole: d.seekingRoles as any,
      seekingAvailability: d.seekingAvailability as any,
      seekingInvestment: d.seekingInvestment as any,
      seekingBusinessType: d.seekingBusinessTypes as any,
      offeringRole: d.offeringRoles as any,
      offeringAvailability: d.offeringAvailability as any,
      offeringInvestment: d.offeringInvestment as any,
      offeringBusinessType: d.offeringBusinessTypes as any,
    },
    update: {
      seekingRole: d.seekingRoles as any,
      seekingAvailability: d.seekingAvailability as any,
      seekingInvestment: d.seekingInvestment as any,
      seekingBusinessType: d.seekingBusinessTypes as any,
      offeringRole: d.offeringRoles as any,
      offeringAvailability: d.offeringAvailability as any,
      offeringInvestment: d.offeringInvestment as any,
      offeringBusinessType: d.offeringBusinessTypes as any,
    },
  })

  return NextResponse.json({ ok: true })
}
