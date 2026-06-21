import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({ toUserId: z.string() })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const fromUserId = session.user.id
  const { toUserId } = parsed.data

  if (fromUserId === toUserId) {
    return NextResponse.json({ error: "Cannot like yourself" }, { status: 400 })
  }

  // Upsert the like
  await prisma.like.upsert({
    where: { fromUserId_toUserId: { fromUserId, toUserId } },
    create: { fromUserId, toUserId },
    update: {},
  })

  // Check for mutual like (match)
  const reversal = await prisma.like.findUnique({
    where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: fromUserId } },
  })

  let matched = false
  if (reversal) {
    // Create or find partnership
    const existing = await prisma.partnership.findFirst({
      where: {
        OR: [
          { userAId: fromUserId, userBId: toUserId },
          { userAId: toUserId, userBId: fromUserId },
        ],
      },
    })

    if (!existing) {
      await prisma.partnership.create({
        data: {
          userAId: fromUserId,
          userBId: toUserId,
          milestones: {
            createMany: {
              data: [
                { title: "Match realizado", completed: true, order: 1 },
                { title: "Documentos enviados", order: 2 },
                { title: "Compatibilidade verificada", order: 3 },
                { title: "Proposta enviada", order: 4 },
                { title: "Contrato em elaboração", order: 5 },
                { title: "Contrato assinado", order: 6 },
              ],
            },
          },
        },
      })
    }
    matched = true
  }

  return NextResponse.json({ ok: true, matched })
}
