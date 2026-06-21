import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Handshake,
  TrendingUp,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/admin/login")
  }

  const nav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Usuários", icon: Users },
    { href: "/admin/partnerships", label: "Sociedades", icon: Handshake },
    { href: "/admin/metrics", label: "Métricas", icon: TrendingUp },
    { href: "/admin/verification", label: "Verificação KYC", icon: ShieldCheck },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ]

  return (
    <div className="min-h-screen flex bg-[var(--color-surface-soft)]">
      {/* Sidebar */}
      <aside className="w-60 bg-[var(--color-canvas)] border-r border-[var(--color-hairline)] flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-[var(--color-hairline)]">
          <Link href="/" className="text-xl font-bold text-[var(--color-rausch)]">
            SocioN
          </Link>
          <p className="text-caption-sm text-[var(--color-muted-text)] mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-body-sm text-[var(--color-body-text)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--color-hairline)]">
          <p className="text-caption-sm text-[var(--color-muted-text)] px-3 mb-1 truncate">
            {session.user.email}
          </p>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-body-sm text-[var(--color-muted-text)] hover:text-[var(--color-rausch)] hover:bg-[var(--color-surface-soft)] w-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
