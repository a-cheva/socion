import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-soft)]">
      <Card className="w-full max-w-sm border-[var(--color-hairline)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-rausch)] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-display-sm text-[var(--color-ink)]">Admin SocioN</CardTitle>
          <CardDescription className="text-body-sm text-[var(--color-muted-text)]">
            Acesso restrito. Entre com sua conta administrativa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/admin" })
            }}
          >
            <Button type="submit" className="w-full bg-[var(--color-rausch)] hover:bg-[var(--color-rausch-active)] text-white">
              Entrar com Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
