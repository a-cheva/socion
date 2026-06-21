import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FeedClient } from "@/components/feed/feed-client"

export default async function FeedPage() {
  const session = await auth()

  const profiles = await prisma.profile.findMany({
    where: {
      userId: { not: session?.user?.id },
      verificationStatus: { not: "REJECTED" },
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      skills: { take: 5 },
    },
    take: 20,
    orderBy: { trustScore: "desc" },
  })

  return <FeedClient profiles={profiles} currentUserId={session?.user?.id ?? ""} />
}
