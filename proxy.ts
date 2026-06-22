import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que exigem login. Checamos o cookie de sessão direto (leve, sem Auth.js/Prisma no Edge).
const PROTECTED = ["/dashboard", "/settings", "/matches"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (needsAuth) {
    // Auth.js v5 usa authjs.session-token (ou __Secure- em produção HTTPS)
    const hasSession =
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("__Secure-authjs.session-token")

    if (!hasSession) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
