"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export function TopLoader() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  function start() {
    setVisible(true)
    setProgress(8)
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 12 : p))
    }, 180)
  }

  function done() {
    if (timer.current) clearInterval(timer.current)
    setProgress(100)
    setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 280)
  }

  // Dispara ao clicar em qualquer link interno
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const anchor = (e.target as HTMLElement | null)?.closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || anchor.target === "_blank") return
      try {
        const url = new URL(anchor.href, window.location.href)
        if (url.origin !== window.location.origin) return
        if (url.pathname === window.location.pathname && url.search === window.location.search) return
        start()
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  // Completa quando a rota muda
  useEffect(() => {
    done()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-[#00a86b] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, boxShadow: "0 0 10px #00a86b, 0 0 5px #00a86b" }}
      />
    </div>
  )
}
