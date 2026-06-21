"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Skill {
  id: string
  name: string
  evidence: string | null
  verified: boolean
  source: string | null
}

interface Doc {
  id: string
  type: string
  fileName: string | null
  status: string
  rejectionReason: string | null
}

interface Props {
  initial: {
    name: string
    image: string | null
    headline: string
    bio: string
    location: string
    weeklyHours: number
    trustScore: number | null
    verificationStatus: string
    skills: Skill[]
    documents: Doc[]
  }
}

const DOC_TYPES = ["RG / CNH", "Comprovante de residência", "Selfie com documento"]

export function ProfileEditor({ initial }: Props) {
  const router = useRouter()

  const [headline, setHeadline] = useState(initial.headline)
  const [bio, setBio] = useState(initial.bio)
  const [location, setLocation] = useState(initial.location)
  const [weeklyHours, setWeeklyHours] = useState(initial.weeklyHours)
  const [savingInfo, setSavingInfo] = useState(false)

  const [skills, setSkills] = useState<Skill[]>(initial.skills)
  const [newSkill, setNewSkill] = useState("")
  const [newEvidence, setNewEvidence] = useState("")
  const [addingSkill, setAddingSkill] = useState(false)

  const [docs, setDocs] = useState<Doc[]>(initial.documents)
  const [docType, setDocType] = useState(DOC_TYPES[0])
  const [uploading, setUploading] = useState(false)

  async function uploadDoc(file: File) {
    setUploading(true)
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: docType, fileName: file.name }),
      })
      if (res.ok) {
        const { doc } = await res.json()
        setDocs((d) => [doc, ...d])
        toast.success("Documento enviado para análise!")
      } else {
        toast.error("Erro ao enviar documento.")
      }
    } finally {
      setUploading(false)
    }
  }

  async function removeDoc(id: string) {
    const prev = docs
    setDocs((d) => d.filter((x) => x.id !== id))
    const res = await fetch(`/api/documents?id=${id}`, { method: "DELETE" })
    if (!res.ok) {
      setDocs(prev)
      toast.error("Erro ao remover.")
    }
  }

  const statusBadge: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "Em análise", cls: "bg-[#1a1000] text-[#ffb84d]" },
    VERIFIED: { label: "✓ Aprovado", cls: "bg-[#003d26] text-[#00a86b]" },
    REJECTED: { label: "✕ Rejeitado", cls: "bg-[#1a0a0a] text-red-400" },
  }

  async function saveInfo() {
    setSavingInfo(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, bio, location, weeklyHours }),
      })
      if (res.ok) {
        toast.success("Perfil atualizado!")
        router.refresh()
      } else {
        toast.error("Erro ao salvar.")
      }
    } finally {
      setSavingInfo(false)
    }
  }

  async function addSkill() {
    if (!newSkill.trim()) return
    setAddingSkill(true)
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill.trim(), evidence: newEvidence.trim() || undefined }),
      })
      if (res.ok) {
        const { skill } = await res.json()
        setSkills((s) => [...s, skill])
        setNewSkill("")
        setNewEvidence("")
        toast.success("Competência adicionada!")
      } else {
        toast.error("Erro ao adicionar competência.")
      }
    } finally {
      setAddingSkill(false)
    }
  }

  async function removeSkill(id: string) {
    const prev = skills
    setSkills((s) => s.filter((sk) => sk.id !== id))
    const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" })
    if (!res.ok) {
      setSkills(prev)
      toast.error("Erro ao remover.")
    } else {
      toast.success("Competência removida.")
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Trust Score reminder */}
      {initial.trustScore != null && (
        <div className="bg-[#003d26] border border-[#00a86b]/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0a0f0d] border-2 border-[#00a86b] flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-[#00a86b]">{Math.round(initial.trustScore)}</span>
          </div>
          <div>
            <p className="text-[#00a86b] font-medium text-sm">Seu Trust Score</p>
            <p className="text-[#8a9e94] text-sm">Complete competências e evidências para aumentá-lo.</p>
          </div>
        </div>
      )}

      {/* Dados básicos */}
      <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-white">Dados básicos</h2>

        <div className="flex items-center gap-3">
          {initial.image ? (
            <img src={initial.image} alt="" className="w-14 h-14 rounded-full object-cover border border-[#2a3d32]" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold text-xl border border-[#2a3d32]">
              {initial.name?.[0] ?? "?"}
            </div>
          )}
          <div>
            <p className="text-white font-medium">{initial.name}</p>
            <p className="text-[#4a5e54] text-xs">Foto importada do login</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#8a9e94] mb-1.5">Headline</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Ex: CTO buscando sócio comercial"
            className="w-full bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#8a9e94] mb-1.5">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte sua trajetória e o que procura em um sócio..."
            className="w-full bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#8a9e94] mb-1.5">Localização</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="São Paulo, SP"
            className="w-full bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#8a9e94] mb-1.5">
            Disponibilidade: <strong className="text-white">{weeklyHours}h/semana</strong>
          </label>
          <input
            type="range" min={5} max={60} step={5}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
            className="w-full accent-[#00a86b]"
          />
        </div>

        <button
          onClick={saveInfo}
          disabled={savingInfo}
          className="self-start bg-[#00a86b] hover:bg-[#009060] disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {savingInfo ? "Salvando..." : "Salvar dados"}
        </button>
      </div>

      {/* Verificação KYC */}
      <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-white">Verificação de Identidade (KYC)</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full ${(statusBadge[initial.verificationStatus] ?? statusBadge.PENDING).cls}`}>
            {(statusBadge[initial.verificationStatus] ?? statusBadge.PENDING).label}
          </span>
        </div>
        <p className="text-[#4a5e54] text-sm mb-4">
          Envie seus documentos. Perfis verificados ganham +100 no subscore de Identidade.
        </p>

        {/* Lista de documentos */}
        <div className="flex flex-col gap-2 mb-4">
          {docs.length === 0 && (
            <p className="text-[#4a5e54] text-sm">Nenhum documento enviado.</p>
          )}
          {docs.map((doc) => (
            <div key={doc.id} className="border border-[#1e2e26] rounded-xl p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-white">📄 {doc.type}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${(statusBadge[doc.status] ?? statusBadge.PENDING).cls}`}>
                      {(statusBadge[doc.status] ?? statusBadge.PENDING).label}
                    </span>
                  </div>
                  {doc.fileName && <p className="text-xs text-[#4a5e54] mt-0.5">{doc.fileName}</p>}
                  {doc.status === "REJECTED" && doc.rejectionReason && (
                    <p className="text-xs text-red-400 mt-1.5 bg-[#1a0a0a] border border-red-900/50 rounded px-2 py-1">
                      Motivo: {doc.rejectionReason} — reenvie um novo documento.
                    </p>
                  )}
                </div>
                {doc.status !== "VERIFIED" && (
                  <button
                    onClick={() => removeDoc(doc.id)}
                    className="text-[#4a5e54] hover:text-red-400 text-sm transition-colors shrink-0"
                    title="Remover"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div className="border-t border-[#1e2e26] pt-4 flex flex-col gap-2">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00a86b] text-sm"
          >
            {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <label className={`self-start cursor-pointer bg-[#161f1a] hover:bg-[#1e2e26] border border-[#2a3d32] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? "Enviando..." : "📎 Enviar documento"}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDoc(f); e.target.value = "" }}
            />
          </label>
        </div>
      </div>

      {/* Competências */}
      <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-1">Competências</h2>
        <p className="text-[#4a5e54] text-sm mb-4">Adicione skills com evidências. Skills do LinkedIn vêm verificadas.</p>

        <div className="flex flex-col gap-2 mb-5">
          {skills.length === 0 && (
            <p className="text-[#4a5e54] text-sm">Nenhuma competência ainda.</p>
          )}
          {skills.map((s) => (
            <div key={s.id} className="border border-[#1e2e26] rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-medium text-white text-sm">{s.name}</span>
                  {s.verified && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#003d26] text-[#00a86b]">✓ verificada</span>
                  )}
                  {s.source && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1e2e26] text-[#4a5e54]">via {s.source}</span>
                  )}
                </div>
                {s.evidence && <p className="text-xs text-[#8a9e94]">{s.evidence}</p>}
              </div>
              <button
                onClick={() => removeSkill(s.id)}
                className="text-[#4a5e54] hover:text-red-400 text-sm transition-colors shrink-0"
                title="Remover"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="border-t border-[#1e2e26] pt-4 flex flex-col gap-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Nome da competência (ex: Growth Marketing)"
            className="w-full bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] text-sm"
          />
          <textarea
            rows={2}
            value={newEvidence}
            onChange={(e) => setNewEvidence(e.target.value)}
            placeholder="Evidência (opcional): ex: Liderei growth de 0 a 1M usuários no iFood"
            className="w-full bg-[#0d1310] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] resize-none text-sm"
          />
          <button
            onClick={addSkill}
            disabled={addingSkill || !newSkill.trim()}
            className="self-start bg-[#161f1a] hover:bg-[#1e2e26] border border-[#2a3d32] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {addingSkill ? "Adicionando..." : "+ Adicionar competência"}
          </button>
        </div>
      </div>
    </div>
  )
}
