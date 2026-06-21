"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const ROLES = ["CEO", "CTO", "CMO", "CFO", "COO", "CPO"]
const INVESTMENT_TYPES = ["Capital", "Tempo", "Conhecimento", "Rede de contatos"]

function ProposalForm() {
  const router = useRouter()
  const params = useSearchParams()
  const partnershipId = params.get("partnershipId") ?? ""
  const toUserId = params.get("toUserId") ?? ""

  const [form, setForm] = useState({
    equityPercent: "",
    role: "",
    investmentType: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!partnershipId || !toUserId) { setError("Parâmetros inválidos."); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnershipId,
          toUserId,
          equityPercent: form.equityPercent ? Number(form.equityPercent) : null,
          role: form.role || null,
          investmentType: form.investmentType || null,
          message: form.message || null,
        }),
      })
      if (res.ok) {
        router.push(`/dashboard/partnership/${partnershipId}`)
      } else {
        const data = await res.json()
        setError(data.error ?? "Erro ao enviar proposta.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-[#8a9e94] mb-2">Participação (%)</label>
        <input
          type="number" min="1" max="99" placeholder="Ex: 50"
          value={form.equityPercent}
          onChange={(e) => setForm((f) => ({ ...f, equityPercent: e.target.value }))}
          className="w-full bg-[#111816] border border-[#2a3d32] rounded-lg px-4 py-3 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8a9e94] mb-2">Papel</label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button key={r} type="button"
              onClick={() => setForm((f) => ({ ...f, role: f.role === r ? "" : r }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                form.role === r ? "bg-[#003d26] border-[#00a86b] text-[#00a86b]" : "bg-[#111816] border-[#2a3d32] text-[#8a9e94] hover:text-white"
              }`}
            >{r}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8a9e94] mb-2">Tipo de Investimento</label>
        <div className="flex flex-wrap gap-2">
          {INVESTMENT_TYPES.map((t) => (
            <button key={t} type="button"
              onClick={() => setForm((f) => ({ ...f, investmentType: f.investmentType === t ? "" : t }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                form.investmentType === t ? "bg-[#003d26] border-[#00a86b] text-[#00a86b]" : "bg-[#111816] border-[#2a3d32] text-[#8a9e94] hover:text-white"
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#8a9e94] mb-2">Mensagem</label>
        <textarea rows={4}
          placeholder="Descreva sua proposta, motivações e o que você traz para a sociedade..."
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full bg-[#111816] border border-[#2a3d32] rounded-lg px-4 py-3 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-[#00a86b] hover:bg-[#009060] disabled:opacity-50 text-white font-medium h-12 rounded-lg transition-colors"
      >
        {loading ? "Enviando..." : "Enviar proposta"}
      </button>
    </form>
  )
}

export default function NewProposalPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/matches" className="text-[#4a5e54] hover:text-white text-sm transition-colors">← Matches</Link>
        <span className="text-[#1e2e26]">/</span>
        <span className="text-white text-sm font-medium">Nova Proposta</span>
      </header>
      <div className="max-w-lg mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-white mb-1">Enviar Proposta</h1>
        <p className="text-[#8a9e94] text-sm mb-8">Defina os termos da sua proposta de sociedade.</p>
        <Suspense fallback={<div className="text-[#4a5e54]">Carregando...</div>}>
          <ProposalForm />
        </Suspense>
      </div>
    </div>
  )
}
