"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Bookmark, User, Star } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getTrustLabel, getTrustColor } from "@/lib/trust-score"

interface FeedProfile {
  id: string
  bio: string | null
  location: string | null
  headline: string | null
  trustScore: number | null
  offeringRole: string[]
  pitchVideoUrl: string | null
  user: { id: string; name: string | null; image: string | null }
  skills: { name: string }[]
}

export function FeedClient({
  profiles,
  currentUserId,
}: {
  profiles: FeedProfile[]
  currentUserId: string
}) {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())

  async function handleLike(profileId: string, userId: string) {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: userId }),
    })
    if (res.ok) {
      const { matched } = await res.json()
      setLiked((prev) => new Set(prev).add(profileId))
      if (matched) {
        toast.success("🎉 É um Match! Você e o candidato se interessaram mutuamente.")
      } else {
        toast.success("Interesse registrado!")
      }
    } else {
      toast.error("Limite de likes atingido. Faça upgrade para o Pro.")
    }
  }

  if (!profiles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Nenhum perfil encontrado. Volte mais tarde!
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="text-2xl font-bold text-indigo-600">SocioN</span>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm">Configurações</Button>
          </Link>
        </div>
      </header>

      {/* Feed */}
      <div className="max-w-xl mx-auto py-8 px-4 flex flex-col gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id} className="overflow-hidden">
            {profile.pitchVideoUrl && (
              <video
                src={profile.pitchVideoUrl}
                className="w-full max-h-64 object-cover bg-black"
                controls
                playsInline
              />
            )}
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.user.image ?? ""} />
                  <AvatarFallback>{profile.user.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">
                      {profile.user.name}
                    </span>
                    {profile.trustScore !== null && (
                      <Badge variant="secondary" className={getTrustColor(profile.trustScore)}>
                        <Star className="w-3 h-3 mr-1" />
                        {profile.trustScore}
                      </Badge>
                    )}
                  </div>
                  {profile.headline && (
                    <p className="text-sm text-gray-600 truncate">{profile.headline}</p>
                  )}
                  {profile.location && (
                    <p className="text-xs text-gray-400">{profile.location}</p>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-700 mt-3 line-clamp-3">{profile.bio}</p>
              )}

              {profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {profile.skills.map((s) => (
                    <Badge key={s.name} variant="outline" className="text-xs">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              )}

              {profile.offeringRole.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.offeringRole.map((r) => (
                    <Badge key={r} className="text-xs bg-indigo-100 text-indigo-700">
                      {r}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant={liked.has(profile.id) ? "default" : "outline"}
                  size="sm"
                  className={liked.has(profile.id) ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
                  onClick={() => handleLike(profile.id, profile.user.id)}
                  disabled={liked.has(profile.id)}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  {liked.has(profile.id) ? "Curtido" : "Curtir"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSaved((prev) => new Set(prev).add(profile.id))
                    toast.success("Salvo nos favoritos!")
                  }}
                  disabled={saved.has(profile.id)}
                >
                  <Bookmark className="w-4 h-4 mr-1" />
                  Favoritar
                </Button>
                <Link href={`/profile/${profile.user.id}`} className="ml-auto">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-1" />
                    Ver perfil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
