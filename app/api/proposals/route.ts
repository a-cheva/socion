import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  partnershipId: z.string(),
  toUserId: z.string(),
  equityPercent: z.number().min(1).max(99).nullable().optional(),
  role: z.string().nullable().optional(),
  investmentType: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const { partnershipId, toUserId, equityPercent, role, investmentType, message } = parsed.data
  const fromUserId = session.user.id

  const partnership = await prisma.partnership.findFirst({
    where: {
      id: partnershipId,
      OR: [{ userAId: fromUserId }, { userBId: fromUserId }],
    },
  })

  if (!partnership) {
    return NextResponse.json({ error: "Parceria não encontrada" }, { status: 404 })
  }

  const proposal = await prisma.proposal.create({
    data: {
      partnershipId,
      fromUserId,
      toUserId,
      equityPercent: equityPercent ?? null,
      role: role ?? null,
      investmentType: investmentType ?? null,
      message: message ?? null,
    },
  })

  await prisma.partnership.update({
    where: { id: partnershipId },
    data: { status: "PROPOSAL_SENT" },
  })

  return NextResponse.json({ ok: true, proposal })
}
