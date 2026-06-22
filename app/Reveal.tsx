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
    from === "left" ? "translateX(-24px)"
    : from === "right" ? "translateX(24px)"
    : from === "scale" ? "scale(0.96)"
    : "translateY(24px)"

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : hiddenTransform,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}
