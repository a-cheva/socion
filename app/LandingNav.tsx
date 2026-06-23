"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`flex items-center justify-between px-5 sm:px-8 sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#0a0f0d]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/30"
          : "py-4 bg-transparent border-b border-transparent"
      }`}
    >
      <span className="text-lg font-semibold tracking-tight">Socio<span className="text-[#00a86b]">N</span></span>
      <div className="hidden md:flex items-center gap-8 text-sm text-[#8a9e94]">
        <a href="#problema" className="hover:text-white transition-colors">O problema</a>
        <a href="#trust" className="hover:text-white transition-colors">Trust Score</a>
        <a href="#como" className="hover:text-white transition-colors">Como funciona</a>
        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-2 bg-[#00a86b] hover:bg-[#00b873] text-[#04140d] font-semibold rounded-lg px-4 py-2 text-sm transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a86b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f0d]"
      >
        Criar conta grátis
      </Link>
    </nav>
  )
}
