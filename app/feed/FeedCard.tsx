"use client"

import { useState } from "react"
import Link from "next/link"

interface FeedCardProps {
  profile: {
    id: string
    headline: string | null
    location: string | null
    trustScore: number | null
    bio: string | null
    user: { id: string; name: string | null; image: string | null }
  }
}

export function FeedCard({ profile }: FeedCardProps) {
  const [liked, setLiked] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [matched, setMatched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLike() {
    if (loading) return
    setLiked((v) => !v)
  }

  async function handleFavoritar() {
    if (loading || favorited) return
    setLoading(true)
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: profile.user.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setFavorited(true)
        if (data.matched) setMatched(true)
      } else if (res.status === 401) {
        window.location.href = "/login"
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5 shadow-sm hover:border-[#2a3d32] transition-colors">
      {matched && (
        <div className="mb-3 bg-[#003d26] border border-[#00a86b] rounded-lg px-3 py-2 text-[#00a86b] text-sm font-medium flex items-center gap-2">
          <span>✦</span> É um match! Acesse sua sala de sociedade.
          <Link href="/matches" className="ml-auto underline text-xs">Ver →</Link>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        {profile.user.image ? (
          <img
            src={profile.user.image}
            alt={profile.user.name ?? ""}
            className="w-12 h-12 rounded-full object-cover border border-[#2a3d32]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold text-lg border border-[#2a3d32]">
            {profile.user.name?.[0] ?? "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white">{profile.user.name}</div>
          {profile.headline && (
            <div className="text-sm text-[#8a9e94] truncate">{profile.headline}</div>
          )}
          {profile.location && (
            <div className="text-xs text-[#4a5e54] mt-0.5">{profile.location}</div>
          )}
        </div>
        {profile.trustScore != null && (
          <div className="shrink-0 flex flex-col items-center bg-[#003d26] rounded-xl px-3 py-1.5">
            <span className="text-[#00a86b] font-bold text-lg leading-none">{profile.trustScore}</span>
            <span className="text-[#4a5e54] text-[10px]">score</span>
          </div>
        )}
      </div>

      {profile.bio && (
        <p className="text-sm text-[#8a9e94] line-clamp-2 mb-4">{profile.bio}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            liked
              ? "bg-[#1a1000] border-[#a86b00] text-[#ffb84d]"
              : "bg-[#161f1a] border-[#2a3d32] text-[#8a9e94] hover:text-white"
          }`}
        >
          <span>{liked ? "♥" : "♡"}</span> Like
        </button>

        <button
          onClick={handleFavoritar}
          disabled={loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
            favorited
              ? "bg-[#003d26] border-[#00a86b] text-[#00a86b]"
              : "bg-[#161f1a] border-[#2a3d32] text-[#8a9e94] hover:text-white"
          } disabled:opacity-50`}
        >
          <span>{favorited ? "★" : "☆"}</span> Favoritar
        </button>

        <Link
          href={`/profile/${profile.user.id}`}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#161f1a] border border-[#2a3d32] text-[#8a9e94] hover:text-white hover:border-[#00a86b] transition-colors"
        >
          Ver perfil →
        </Link>
      </div>
    </div>
  )
}
