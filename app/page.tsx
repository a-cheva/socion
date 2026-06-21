import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-2xl font-bold text-indigo-600">SocioN</span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/login">
            <Button>Começar grátis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 gap-6 max-w-4xl mx-auto">
        <Badge variant="secondary" className="text-indigo-600">
          Plataforma de Confiança para Sócios
        </Badge>
        <h1 className="text-5xl font-bold leading-tight text-gray-900">
          Encontre o sócio certo.{" "}
          <span className="text-indigo-600">Com evidências reais.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          O SocioN valida competências, histórico profissional e reputação antes de
          qualquer contrato. Pare de apostar. Comece com dados.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Criar perfil grátis
            </Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="outline">
              Ver feed de sócios
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 max-w-5xl mx-auto">
        {[
          {
            icon: "🔍",
            title: "Trust Score",
            desc: "Score de confiança 0-100 baseado em identidade, experiência, competências, reputação e comprometimento.",
          },
          {
            icon: "🤝",
            title: "Match Bilateral",
            desc: "Só acontece match quando ambos demonstram interesse. Sem spam, sem mensagens indesejadas.",
          },
          {
            icon: "📋",
            title: "Sala da Sociedade",
            desc: "Workspace completo para evoluir da conversa até o contrato assinado com histórico completo.",
          },
          {
            icon: "✅",
            title: "Verificação KYC",
            desc: "Identidade verificada via documentos e liveness check. Perfis falsos eliminados.",
          },
          {
            icon: "🧠",
            title: "IA Evidence Engine",
            desc: "IA extrai evidências do LinkedIn e detecta inconsistências no histórico declarado.",
          },
          {
            icon: "🌐",
            title: "Rede de Confiança",
            desc: "Contatos em comum aumentam a confiança. Converse com quem já conhece o candidato.",
          },
        ].map((f) => (
          <div key={f.title} className="flex flex-col gap-3 p-6 rounded-xl border bg-gray-50">
            <span className="text-3xl">{f.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Pronto para encontrar seu sócio ideal?
        </h2>
        <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
          14 dias grátis. Sem cartão de crédito. Cancele quando quiser.
        </p>
        <Link href="/login">
          <Button size="lg" variant="secondary" className="text-indigo-700 font-semibold">
            Começar agora
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm border-t">
        © 2025 SocioN. Todos os direitos reservados.
      </footer>
    </main>
  )
}
