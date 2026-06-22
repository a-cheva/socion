"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { VideoRecorder } from "./VideoRecorder"

const ROLES = ["Tecnologia", "Marketing", "Produto", "Vendas", "Operações", "Finanças", "Jurídico"]
const BUSINESS_TYPES = ["SaaS", "Marketplace", "IA", "E-commerce", "Agência", "Serviços"]
const INVESTMENTS = ["Sem investimento", "Até R$ 10k", "Até R$ 50k", "Acima de R$ 50k"]

const VALUES = [
  { key: "speed", left: "Velocidade", right: "Perfeição" },
  { key: "risk", left: "Risco", right: "Estabilidade" },
  { key: "growth", left: "Crescimento", right: "Lucro" },
  { key: "autonomy", left: "Autonomia", right: "Consenso" },
]

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        active
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    city: "",
    state: "",
    seekingRoles: [] as string[],
    offeringRoles: [] as string[],
    businessTypes: [] as string[],
    availability: "Full time",
    weeklyHours: 40,
    investment: "Sem investimento",
    values: { speed: 50, risk: 50, growth: 50, autonomy: 50 },
  })

  function toggleArr(key: "seekingRoles" | "offeringRoles" | "businessTypes", val: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.headline || (form.seekingRoles.length === 0 && form.offeringRoles.length === 0)) {
      setError("Preencha a headline e ao menos uma área que busca e que oferece.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: form.headline,
          bio: form.bio,
          location: [form.city, form.state].filter(Boolean).join(", "),
          seekingRoles: form.seekingRoles,
          offeringRoles: form.offeringRoles,
          seekingBusinessTypes: form.businessTypes,
          offeringBusinessTypes: form.businessTypes,
          seekingAvailability: form.availability === "Full time" ? "Full Time" : "Part Time",
          offeringAvailability: form.availability === "Full time" ? "Full Time" : "Part Time",
          weeklyHours: form.weeklyHours,
          seekingInvestment: form.investment,
          offeringInvestment: form.investment,
          values: form.values,
        }),
      })
      if (res.ok) {
        toast.success("Perfil concluído! Bem-vindo ao SocioN.")
        setTimeout(() => router.push("/feed"), 800)
      } else {
        const d = await res.json()
        setError(d.error ?? "Erro ao salvar perfil.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vamos montar seu perfil</h1>
          <p className="text-gray-500">Quanto mais completo, melhores os matches e maior seu Trust Score.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full">
            <span>⚡</span> Importamos seus dados do LinkedIn — revise e complete abaixo.
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            <span>●</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-7">

          {/* Headline */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Headline</label>
            <input
              type="text"
              placeholder="Head of Growth · ex-fintech · busca CTO"
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
            <textarea
              rows={4}
              placeholder="Empreendedor com foco em produtos digitais. Procuro um sócio complementar para construir o próximo negócio com base em confiança e execução."
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* Cidade / Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Cidade</label>
              <input
                type="text"
                placeholder="São Paulo"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Estado</label>
              <input
                type="text"
                placeholder="SP"
                maxLength={2}
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase() }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* O que busca */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">O que você busca em um sócio?</label>
            <p className="text-xs text-gray-400 mb-3">Áreas complementares às suas</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <Pill key={r} label={r} active={form.seekingRoles.includes(r)} onClick={() => toggleArr("seekingRoles", r)} />
              ))}
            </div>
          </div>

          {/* O que oferece */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">O que você oferece?</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <Pill key={r} label={r} active={form.offeringRoles.includes(r)} onClick={() => toggleArr("offeringRoles", r)} />
              ))}
            </div>
          </div>

          {/* Tipos de negócio */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Tipos de negócio de interesse</label>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_TYPES.map((b) => (
                <Pill key={b} label={b} active={form.businessTypes.includes(b)} onClick={() => toggleArr("businessTypes", b)} />
              ))}
            </div>
          </div>

          {/* Disponibilidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Disponibilidade</label>
            <div className="flex items-start gap-8">
              <div className="flex gap-2">
                {["Full time", "Part time"].map((a) => (
                  <Pill key={a} label={a} active={form.availability === a} onClick={() => setForm((f) => ({ ...f, availability: a }))} />
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Horas por semana: <strong className="text-gray-900">{form.weeklyHours}h</strong></p>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={form.weeklyHours}
                  onChange={(e) => setForm((f) => ({ ...f, weeklyHours: Number(e.target.value) }))}
                  className="w-full accent-black"
                />
              </div>
            </div>
          </div>

          {/* Faixa de investimento */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Faixa de investimento</label>
            <div className="flex flex-wrap gap-2">
              {INVESTMENTS.map((i) => (
                <Pill key={i} label={i} active={form.investment === i} onClick={() => setForm((f) => ({ ...f, investment: i }))} />
              ))}
            </div>
          </div>

          {/* Valores */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Seus valores</label>
            <p className="text-xs text-gray-400 mb-4">Onde você se posiciona?</p>
            <div className="flex flex-col gap-5">
              {VALUES.map(({ key, left, right }) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                    <span>{left}</span>
                    <span>{right}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={(form.values as any)[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, values: { ...f.values, [key]: Number(e.target.value) } }))
                    }
                    className="w-full accent-green-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Vídeo de apresentação */}
          <VideoRecorder />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-medium h-12 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">↻</span> Salvando...</>
            ) : (
              <><span>↻</span> Concluir e ver o feed</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
