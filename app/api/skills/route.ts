import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(80),
  evidence: z.string().max(500).optional(),
})

async function getProfileId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  })
  return profile?.id ?? null
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const profileId = await getProfileId(session.user.id)
  if (!profileId) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
  }

  const skill = await prisma.skill.create({
    data: {
      profileId,
      name: parsed.data.name,
      evidence: parsed.data.evidence || null,
      source: "manual",
      verified: false,
    },
  })

  return NextResponse.json({ ok: true, skill })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 })
  }

  const profileId = await getProfileId(session.user.id)
  if (!profileId) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
  }

  // Garante que a skill pertence ao perfil do usuário
  const skill = await prisma.skill.findUnique({ where: { id }, select: { profileId: true } })
  if (!skill || skill.profileId !== profileId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }

  await prisma.skill.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
