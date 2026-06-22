"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function PortalButton() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    if (res.ok) {
      const { url } = await res.json()
      window.location.href = url
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? "Erro ao abrir o portal.")
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handlePortal} disabled={loading}>
      {loading ? "Abrindo..." : "Gerenciar assinatura"}
    </Button>
  )
}
