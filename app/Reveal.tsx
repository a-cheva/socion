"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  children: React.ReactNode
  /** Atraso em ms para escalonar (stagger). */
  delay?: number
  className?: string
  /** Direção da entrada. */
  from?: "up" | "left" | "right" | "scale"
}

export function Reveal({ children, delay = 0, className = "", from = "up" }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hiddenTransform =
    from === "left" ? "translateX(-44px)"
    : from === "right" ? "translateX(44px)"
    : from === "scale" ? "scale(0.9)"
    : "translateY(44px)"

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : hiddenTransform,
        filter: shown ? "blur(0)" : "blur(8px)",
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 0.85s ease ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  )
}
