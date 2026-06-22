import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Storage de vídeo não configurado. Crie um Blob store na Vercel." },
      { status: 503 }
    )
  }

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 })
  }

  // Limite de tamanho (50 MB)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "Vídeo muito grande (máx 50MB)" }, { status: 413 })
  }

  const ext = file.type.includes("mp4") ? "mp4" : "webm"
  const blob = await put(`pitch/${session.user.id}-${Date.now()}.${ext}`, file, {
    access: "public",
    contentType: file.type || "video/webm",
  })

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, pitchVideoUrl: blob.url },
    update: { pitchVideoUrl: blob.url },
  })

  return NextResponse.json({ ok: true, url: blob.url })
}
