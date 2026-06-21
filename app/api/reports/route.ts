import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  reportedUserId: z.string(),
  reason: z.string().min(1).max(300),
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

  if (parsed.data.reportedUserId === session.user.id) {
    return NextResponse.json({ error: "Não é possível denunciar você mesmo" }, { status: 400 })
  }

  await prisma.report.upsert({
    where: {
      reporterUserId_reportedUserId: {
        reporterUserId: session.user.id,
        reportedUserId: parsed.data.reportedUserId,
      },
    },
    create: {
      reporterUserId: session.user.id,
      reportedUserId: parsed.data.reportedUserId,
      reason: parsed.data.reason,
    },
    update: { reason: parsed.data.reason },
  })

  return NextResponse.json({ ok: true })
}
