export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { FeedClient } from "@/components/feed/feed-client"

export default async function FeedPage() {
  const profiles = await prisma.profile.findMany({
    where: {
      verificationStatus: { not: "REJECTED" },
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      skills: { take: 5 },
    },
    take: 20,
    orderBy: { trustScore: "desc" },
  })

  return <FeedClient profiles={profiles} currentUserId="" />
}
