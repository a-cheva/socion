import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Desfaz um match (dissolve a parceria e remove o like do usuário)
export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const partnershipId = searchParams.get("partnershipId")
  if (!partnershipId) {
    return NextResponse.json({ error: "partnershipId obrigatório" }, { status: 400 })
  }

  const userId = session.user.id
  const partnership = await prisma.partnership.findFirst({
    where: {
      id: partnershipId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  })
  if (!partnership) {
    return NextResponse.json({ error: "Parceria não encontrada" }, { status: 404 })
  }

  const otherUserId = partnership.userAId === userId ? partnership.userBId : partnership.userAId

  // Remove o like do usuário (quebra a reciprocidade) e marca como dissolvida
  await prisma.like.deleteMany({
    where: { fromUserId: userId, toUserId: otherUserId },
  })
  await prisma.partnership.update({
    where: { id: partnershipId },
    data: { status: "DISSOLVED" },
  })

  return NextResponse.json({ ok: true })
}
