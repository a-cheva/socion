"use client"

import { useEffect, useRef, useState } from "react"

const dims = [
  { label: "Identidade", target: 100 },
  { label: "Experiência", target: 96 },
  { label: "Competência", target: 95 },
  { label: "Reputação", target: 88 },
  { label: "Comprometimento", target: 86 },
]

const FINAL = 93

export function TrustScoreDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!on) return
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setScore(Math.round(eased * FINAL))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on])

  return (
    <div
      ref={ref}
      className="relative mx-auto max-w-md w-full rounded-2xl border border-white/[0.08] bg-[#0c1210] shadow-2xl shadow-black/40 overflow-hidden"
    >
      {/* barra de janela */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-[11px] text-[#4a5e54]">socion.app/profile</span>
      </div>

      <div className="p-6">
        {/* header do perfil */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="https://randomuser.me/api/portraits/men/88.jpg"
            alt="Perfil de exemplo"
            className="w-12 h-12 rounded-full object-cover border border-white/10"
          />
          <div>
            <div className="text-white font-semibold text-sm">Diego Carvalho</div>
            <div className="text-[#8a9e94] text-xs">Engenheiro de ML · Ex-Google Brain</div>
          </div>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#003d26] text-[#00a86b]">✓ Verificado</span>
        </div>

        {/* trust score */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#1e2e26" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none" stroke="#00a86b" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - score / 100)}
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#00a86b] tabular-nums">{score}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#4a5e54] uppercase tracking-wide">Trust Score</p>
            <p className="text-white font-bold">Confiança excepcional</p>
            <p className="text-[#8a9e94] text-xs mt-0.5">baseado em evidências reais</p>
          </div>
        </div>

        {/* barras das dimensões */}
        <div className="flex flex-col gap-2.5">
          {dims.map((d, i) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="text-xs text-[#8a9e94] w-32 shrink-0">{d.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#1e2e26] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#00a86b]"
                  style={{
                    width: on ? `${d.target}%` : "0%",
                    transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 100 + 200}ms`,
                  }}
                />
              </div>
              <span className="text-xs text-white w-7 text-right tabular-nums">{on ? d.target : 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
