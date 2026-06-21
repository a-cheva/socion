"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ApproveKycButton({
  profileId,
  action,
}: {
  profileId: string
  action: "VERIFIED" | "REJECTED"
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    const res = await fetch("/api/admin/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, status: action }),
    })
    if (res.ok) {
      toast.success(action === "VERIFIED" ? "KYC aprovado!" : "KYC reprovado.")
      router.refresh()
    } else {
      toast.error("Erro ao atualizar status.")
    }
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      variant={action === "VERIFIED" ? "default" : "outline"}
      className={
        action === "VERIFIED"
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "border-red-300 text-red-600 hover:bg-red-50"
      }
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "..." : action === "VERIFIED" ? "✓ Aprovar" : "✗ Reprovar"}
    </Button>
  )
}
