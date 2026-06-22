"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (res.ok) {
      // Loga automaticamente após criar a conta
      const login = await signIn("password", { email, password, redirect: false })
      if (login?.ok) {
        window.location.href = "/onboarding"
        return
      }
      window.location.href = "/login"
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? "Erro ao criar conta.")
      setLoading(false)
    }
  }

  const input =
    "w-full bg-[#0a0f0d] border border-[#2a3d32] rounded-lg px-4 py-2.5 text-white placeholder-[#4a5e54] focus:outline-none focus:border-[#00a86b] text-sm"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1310] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-[#00a86b] font-bold text-2xl">SocioN</Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Criar sua conta</h1>
          <p className="text-[#8a9e94] text-sm">14 dias grátis · sem cartão de crédito</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" required placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} className={input} />
          <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          <input type="password" required minLength={8} placeholder="Senha (mín. 8 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#00a86b] hover:bg-[#009060] disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm"
          >
            {loading ? "Criando..." : "Criar conta grátis"}
          </button>
        </form>

        <p className="text-sm text-center text-[#8a9e94] mt-5">
          Já tem conta?{" "}
          <Link href="/login" className="text-[#00a86b] font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
