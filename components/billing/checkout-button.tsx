"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch("/api/stripe/checkout", { method: "POST" })
    if (res.ok) {
      const { url } = await res.json()
      window.location.href = url
    } else {
      toast.error("Erro ao iniciar pagamento. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
      size="lg"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Redirecionando..." : "Assinar SocioN Pro — R$49/mês"}
    </Button>
  )
}
