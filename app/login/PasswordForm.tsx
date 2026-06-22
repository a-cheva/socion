"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export function PasswordForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("password", { email, password, redirect: false })
    if (res?.ok) {
      window.location.href = "/feed"
    } else {
      setError("E-mail ou senha incorretos.")
      setLoading(false)
    }
  }

  const input =
    "w-full bg-[#0a0f0d] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] text-sm"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      <input type="password" required placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#00a86b] hover:bg-[#009060] disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm"
      >
        {loading ? "Entrando..." : "Entrar com e-mail"}
      </button>
      <p className="text-sm text-center text-[#8a9e94]">
        Não tem conta?{" "}
        <Link href="/register" className="text-[#00a86b] font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
