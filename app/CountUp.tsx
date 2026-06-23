"use client"

import { useEffect, useRef, useState } from "react"

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || to === 0) {
      setVal(to)
      return
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        obs.disconnect()
        const start = performance.now()
        const dur = 1300
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(eased * to))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return <span ref={ref} className="tabular-nums">{val}{suffix}</span>
}
