"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface Profile {
  id: string
  headline: string | null
  location: string | null
  trustScore: number | null
  bio: string | null
  pitchVideoUrl: string | null
  user: { id: string; name: string | null; image: string | null }
}

export function TikTokFeed({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {/* Header flutuante */}
      <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <Link href="/" className="text-lg font-bold text-white">Socio<span className="text-[#00a86b]">N</span></Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/matches" className="text-white/80 hover:text-white">Matches</Link>
          <Link href="/dashboard/profile" className="text-white/80 hover:text-white">Perfil</Link>
        </nav>
      </header>

      {profiles.length === 0 && (
        <div className="h-screen flex items-center justify-center text-white/60">Nenhum perfil encontrado.</div>
      )}

      {profiles.map((p) => (
        <FeedItem key={p.id} profile={p} />
      ))}
    </div>
  )
}

function FeedItem({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [liked, setLiked] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [matched, setMatched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Toca/pausa o vídeo conforme entra na viewport
  useEffect(() => {
    const el = ref.current
    const vid = videoRef.current
    if (!el || !vid) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {})
        else vid.pause()
      },
      { threshold: 0.6 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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

  async function handleReport() {
    const reason = window.prompt("Por que você está denunciando este perfil?")
    if (!reason) return
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedUserId: profile.user.id, reason }),
    })
    setHidden(true)
  }

  if (hidden) return null

  const initial = profile.user.name?.[0] ?? "?"

  return (
    <div ref={ref} className="relative h-screen w-full snap-start overflow-hidden bg-black">
      {/* Mídia de fundo: vídeo de apresentação ou foto */}
      {profile.pitchVideoUrl ? (
        <video
          ref={videoRef}
          src={profile.pitchVideoUrl}
          poster={profile.user.image ?? undefined}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      ) : profile.user.image ? (
        <img
          src={profile.user.image}
          alt={profile.user.name ?? ""}
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[1px]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#003d26] to-[#0a0f0d]" />
      )}

      {/* Overlays gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

      {/* Badge "vídeo de apresentação" */}
      <div className="absolute top-20 left-5 z-10">
        <span className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full backdrop-blur">
          {profile.pitchVideoUrl ? "▶ Apresentação" : "Sem vídeo · foto do perfil"}
        </span>
      </div>

      {/* Match toast */}
      {matched && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 bg-[#003d26] border border-[#00a86b] rounded-full px-4 py-2 text-[#00a86b] text-sm font-medium">
          ✦ É um match! <Link href="/matches" className="underline">Ver sala →</Link>
        </div>
      )}

      {/* Info (esquerda inferior) */}
      <div className="absolute bottom-0 left-0 right-20 z-10 p-5 pb-10">
        <h2 className="text-2xl font-bold text-white">{profile.user.name}</h2>
        {profile.headline && <p className="text-white/90 text-sm mt-1">{profile.headline}</p>}
        {profile.location && <p className="text-white/60 text-xs mt-0.5">📍 {profile.location}</p>}
        {profile.bio && <p className="text-white/80 text-sm mt-3 line-clamp-3 max-w-md">{profile.bio}</p>}
      </div>

      {/* Ações (direita) */}
      <div className="absolute bottom-12 right-3 z-10 flex flex-col items-center gap-5">
        {/* Avatar → perfil */}
        <Link href={`/profile/${profile.user.id}`} className="relative">
          {profile.user.image ? (
            <img src={profile.user.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold border-2 border-white">{initial}</div>
          )}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#00a86b] text-white text-xs flex items-center justify-center font-bold">+</span>
        </Link>

        {/* Trust Score */}
        {profile.trustScore != null && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#003d26]/80 border border-[#00a86b] backdrop-blur flex items-center justify-center">
              <span className="text-[#00a86b] font-bold">{Math.round(profile.trustScore)}</span>
            </div>
            <span className="text-white/70 text-[10px] mt-1">score</span>
          </div>
        )}

        {/* Like */}
        <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center">
          <span className={`text-3xl ${liked ? "text-[#ff385c]" : "text-white"}`}>{liked ? "♥" : "♡"}</span>
          <span className="text-white/70 text-[10px]">Like</span>
        </button>

        {/* Favoritar (gera match) */}
        <button onClick={handleFavoritar} disabled={loading} className="flex flex-col items-center disabled:opacity-50">
          <span className={`text-3xl ${favorited ? "text-[#00a86b]" : "text-white"}`}>{favorited ? "★" : "☆"}</span>
          <span className="text-white/70 text-[10px]">Favoritar</span>
        </button>

        {/* Ver perfil */}
        <Link href={`/profile/${profile.user.id}`} className="flex flex-col items-center">
          <span className="text-2xl text-white">👤</span>
          <span className="text-white/70 text-[10px]">Perfil</span>
        </Link>

        {/* Denunciar */}
        <button onClick={handleReport} className="flex flex-col items-center">
          <span className="text-2xl text-white/80">⚑</span>
          <span className="text-white/70 text-[10px]">Denunciar</span>
        </button>
      </div>
    </div>
  )
}
