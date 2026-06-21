import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    icon: "✦",
    title: "Perfis verificados com Trust Score",
    desc: "Cada sócio passa por validação de identidade, experiência e reputação antes de aparecer no feed.",
  },
  {
    icon: "✦",
    title: "Match por complementaridade real",
    desc: "O algoritmo cruza habilidades, objetivos e estilo de trabalho — não só palavras-chave.",
  },
  {
    icon: "✦",
    title: "Da proposta ao contrato em um lugar só",
    desc: "Negocie, alinhe metas e formalize a sociedade dentro da plataforma, sem sair para outros apps.",
  },
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#0a0f0d]">
      {/* Left — hero */}
      <div className="hidden lg:flex lg:w-[58%] flex-col justify-between p-14 relative overflow-hidden">
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#00a86b 1px, transparent 1px), linear-gradient(90deg, #00a86b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#00a86b] opacity-[0.07] blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <span className="text-[#00a86b] font-bold text-2xl tracking-tight">SocioN</span>
        </div>

        <div className="relative z-10 flex flex-col gap-10">
          <div>
            <h1 className="text-5xl font-bold text-white leading-[1.15] tracking-tight mb-4">
              O sócio certo<br />
              <span className="text-[#00a86b]">muda tudo.</span>
            </h1>
            <p className="text-[#8a9e94] text-lg leading-relaxed max-w-md">
              A primeira plataforma brasileira que valida quem você é antes de apresentar quem você precisa.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 items-start">
                <span className="text-[#00a86b] text-lg mt-0.5 shrink-0">{b.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{b.title}</p>
                  <p className="text-[#8a9e94] text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[#4a5e54] text-xs">
            © 2025 SocioN · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Right — auth card */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0d1310]">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <span className="text-[#00a86b] font-bold text-2xl">SocioN</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Entrar na plataforma</h2>
          <p className="text-[#8a9e94] text-sm mb-8">
            Use sua conta profissional para continuar.
          </p>

          <div className="flex flex-col gap-3">
            <form
              action={async () => {
                "use server"
                await signIn("linkedin", { redirectTo: "/onboarding" })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#0077b5] hover:bg-[#006399] text-white font-medium h-12 rounded-lg transition-colors text-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Continuar com LinkedIn
              </button>
            </form>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#1e2e26]" />
              <span className="text-[#4a5e54] text-xs">ou</span>
              <div className="flex-1 h-px bg-[#1e2e26]" />
            </div>

            <form
              action={async () => {
                "use server"
                await signIn("google", { redirectTo: "/onboarding" })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#161f1a] hover:bg-[#1e2e26] border border-[#2a3d32] text-white font-medium h-12 rounded-lg transition-colors text-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>
            </form>
          </div>

          <div className="mt-6">
            <a
              href="/feed"
              className="w-full flex items-center justify-center gap-2 text-[#8a9e94] hover:text-white text-sm transition-colors py-2"
            >
              Explorar sem cadastro →
            </a>
          </div>

          <p className="text-xs text-center text-[#4a5e54] mt-4 leading-relaxed">
            Ao entrar, você concorda com os{" "}
            <a href="/terms" className="text-[#8a9e94] hover:text-white transition-colors underline underline-offset-2">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/privacy" className="text-[#8a9e94] hover:text-white transition-colors underline underline-offset-2">
              Política de Privacidade
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
