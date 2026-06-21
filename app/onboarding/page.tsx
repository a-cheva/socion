"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const ROLES = ["Tecnologia", "Marketing", "Produto", "Vendas", "Operações", "Finanças", "Jurídico"]
const BUSINESS_TYPES = ["SaaS", "Marketplace", "IA", "E-commerce", "Agência", "Serviços"]
const AVAILABILITIES = ["Full Time", "Part Time"]
const INVESTMENTS = ["Sem investimento", "Até R$10k", "Até R$50k", "Acima de R$50k"]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    seekingRoles: [] as string[],
    seekingAvailability: "",
    seekingInvestment: "",
    seekingBusinessTypes: [] as string[],
    offeringRoles: [] as string[],
    offeringAvailability: "",
    offeringInvestment: "",
    offeringBusinessTypes: [] as string[],
  })

  function toggle(key: keyof typeof data, value: string) {
    const arr = data[key] as string[]
    setData((d) => ({
      ...d,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    }))
  }

  function set(key: keyof typeof data, value: string) {
    setData((d) => ({ ...d, [key]: value }))
  }

  async function handleSubmit() {
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success("Perfil configurado! Bem-vindo ao SocioN.")
      router.push("/feed")
    } else {
      toast.error("Erro ao salvar perfil. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">Passo {step} de 2</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? "O que você está buscando?" : "O que você oferece?"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {step === 1 ? (
            <OnboardingStep
              prefix="seeking"
              data={data}
              toggle={toggle}
              set={set}
            />
          ) : (
            <OnboardingStep
              prefix="offering"
              data={data}
              toggle={toggle}
              set={set}
            />
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
            )}
            {step === 1 ? (
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setStep(2)}
              >
                Próximo
              </Button>
            ) : (
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleSubmit}
              >
                Finalizar e ver feed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OnboardingStep({
  prefix,
  data,
  toggle,
  set,
}: {
  prefix: "seeking" | "offering"
  data: Record<string, string | string[]>
  toggle: (key: any, value: string) => void
  set: (key: any, value: string) => void
}) {
  return (
    <>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Perfil desejado</p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <Badge
              key={r}
              variant={(data[`${prefix}Roles`] as string[]).includes(r) ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => toggle(`${prefix}Roles` as any, r)}
            >
              {r}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Disponibilidade</p>
        <div className="flex gap-2">
          {AVAILABILITIES.map((a) => (
            <Badge
              key={a}
              variant={data[`${prefix}Availability`] === a ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => set(`${prefix}Availability` as any, a)}
            >
              {a}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Faixa de investimento</p>
        <div className="flex flex-wrap gap-2">
          {INVESTMENTS.map((i) => (
            <Badge
              key={i}
              variant={data[`${prefix}Investment`] === i ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => set(`${prefix}Investment` as any, i)}
            >
              {i}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Tipo de negócio</p>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_TYPES.map((b) => (
            <Badge
              key={b}
              variant={(data[`${prefix}BusinessTypes`] as string[]).includes(b) ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => toggle(`${prefix}BusinessTypes` as any, b)}
            >
              {b}
            </Badge>
          ))}
        </div>
      </div>
    </>
  )
}
