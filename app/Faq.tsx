"use client"

import { useState } from "react"

const faqs = [
  {
    q: "É seguro? Como vocês validam os perfis?",
    a: "Cada perfil passa por verificação de identidade (KYC com documento e selfie), importação de histórico do LinkedIn e validação de competências com evidências. Nada de currículo inflado sem prova.",
  },
  {
    q: "Como o Trust Score é calculado?",
    a: "São cinco dimensões, cada uma valendo 20%: identidade, histórico profissional, competências verificadas, evidências de execução e rede de confiança. Juntas formam um número de 0 a 100.",
  },
  {
    q: "Preciso ter LinkedIn para usar?",
    a: "Não. O LinkedIn acelera o preenchimento do seu perfil, mas você pode entrar com Google ou e-mail e completar tudo manualmente no onboarding.",
  },
  {
    q: "Quanto custa?",
    a: "Você começa com 14 dias grátis e acesso total, sem cartão de crédito. Depois, o plano PRO libera likes, propostas e o Trust Engine de forma ilimitada.",
  },
  {
    q: "O que acontece quando dou match?",
    a: "Match só acontece quando o interesse é mútuo. A partir daí abre uma Sala da Sociedade, onde vocês negociam a proposta, alinham metas e acompanham a evolução até o contrato.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="px-6 py-24 sm:py-32 max-w-2xl mx-auto w-full">
      <p className="text-xs text-[#4a5e54] uppercase tracking-[0.2em] mb-5 text-center">Perguntas frequentes</p>
      <h2 className="text-[1.9rem] sm:text-4xl font-bold tracking-tight mb-12 text-center">Ainda em dúvida?</h2>

      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="border border-white/[0.08] rounded-2xl bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a86b] rounded-2xl"
              >
                <span className="font-medium text-white text-sm sm:text-base">{f.q}</span>
                <span className={`text-[#00a86b] text-xl shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-[#8a9e94] leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
