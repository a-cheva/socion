import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  type: z.string().min(1),
  fileName: z.string().min(1),
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

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
    select: { id: true },
  })

  // Sem blob storage neste ambiente — registramos o documento e marcamos para revisão.
  const doc = await prisma.document.create({
    data: {
      profileId: profile.id,
      type: parsed.data.type,
      fileName: parsed.data.fileName,
      fileUrl: "#",
      status: "PENDING",
    },
  })

  // Garante que o perfil volte para PENDING ao reenviar documentos
  await prisma.profile.update({
    where: { id: profile.id },
    data: { verificationStatus: "PENDING" },
  })

  return NextResponse.json({ ok: true, doc })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 })

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })
  const doc = await prisma.document.findUnique({ where: { id }, select: { profileId: true } })
  if (!profile || !doc || doc.profileId !== profile.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }

  await prisma.document.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
