"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DissolveButton({ partnershipId }: { partnershipId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDissolve() {
    if (!window.confirm("Tem certeza que deseja desfazer este match? Esta ação encerra a sociedade.")) return
    setLoading(true)
    const res = await fetch(`/api/matches?partnershipId=${partnershipId}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/matches")
    } else {
      setLoading(false)
      window.alert("Erro ao desfazer match.")
    }
  }

  return (
    <button
      onClick={handleDissolve}
      disabled={loading}
      className="text-xs text-[#4a5e54] hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {loading ? "Desfazendo..." : "Desfazer match"}
    </button>
  )
}
