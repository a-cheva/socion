"use client"

import { useState } from "react"

const STORIES = [
  {
    name: "Felipe Andrade",
    role: "COO · CargoX Brasil",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote:
      "Confiança deixou de ser aposta. Vi o histórico, as evidências e os contatos em comum antes de assinar. Melhor decisão que tomei como empreendedor.",
  },
  {
    name: "Marina Costa",
    role: "CEO · HealthLoop",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Encontrei meu CTO em duas semanas. O Trust Score me deu segurança para acelerar uma conversa que normalmente levaria meses de due diligence.",
  },
  {
    name: "Rodrigo Tavares",
    role: "Founder · FinTrack",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote:
      "A rede de confiança mostrou que tínhamos 4 contatos em comum. Conversei com eles antes de fechar. Hoje somos sócios de uma empresa em crescimento.",
  },
]

export function Testimonials() {
  const [i, setI] = useState(0)
  const s = STORIES[i]

  const prev = () => setI((v) => (v - 1 + STORIES.length) % STORIES.length)
  const next = () => setI((v) => (v + 1) % STORIES.length)

  return (
    <section className="max-w-5xl mx-auto px-6 py-20 w-full">
      <p className="text-xs text-[#4a5e54] uppercase tracking-widest mb-4">Histórias reais</p>
      <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-10 max-w-2xl">
        Sócios que se encontraram aqui — e hoje faturam alto.
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className="w-64 h-64 rounded-3xl overflow-hidden border border-[#1e2e26] grayscale">
            <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -inset-2 -z-10 bg-[#00a86b] opacity-10 blur-2xl rounded-3xl" />
        </div>

        {/* Quote */}
        <div className="flex-1 pt-2">
          <h3 className="text-2xl font-bold text-white">{s.name}</h3>
          <p className="text-[#00a86b] text-sm mb-5">{s.role}</p>
          <p className="text-lg text-[#b8c9c0] leading-relaxed max-w-md">{s.quote}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full bg-[#003d26] hover:bg-[#00532f] text-[#00a86b] flex items-center justify-center transition-colors"
          aria-label="Anterior"
        >
          ←
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full bg-[#003d26] hover:bg-[#00532f] text-[#00a86b] flex items-center justify-center transition-colors"
          aria-label="Próximo"
        >
          →
        </button>
        <div className="flex gap-1.5 ml-3">
          {STORIES.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${idx === i ? "bg-[#00a86b]" : "bg-[#1e2e26]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
