import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())

const schema = z.object({
  profileId: z.string(),
  status: z.enum(["VERIFIED", "REJECTED"]),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })

  const { profileId, status } = parsed.data

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      verificationStatus: status,
      ...(status === "VERIFIED" ? { identityScore: 100 } : { identityScore: 0 }),
    },
  })

  return NextResponse.json({ ok: true })
}
