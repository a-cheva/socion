import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { Plan } from "@prisma/client"

const providers: any[] = []

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google)
}

if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) {
  providers.push(
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      authorization: { params: { scope: "openid profile email" } },
    })
  )
}

// Demo login — no password needed
providers.push(
  Credentials({
    credentials: {},
    async authorize() {
      let user = await prisma.user.findUnique({ where: { email: "demo@socion.app" } })
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Usuário Demo",
            email: "demo@socion.app",
            emailVerified: new Date(),
            plan: Plan.TRIAL,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        })
      }
      return { id: user.id, name: user.name, email: user.email, image: user.image }
    },
  })
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, trialEndsAt: true },
        })
        if (dbUser) {
          session.user.plan = dbUser.plan
          session.user.trialEndsAt = dbUser.trialEndsAt
        }
      }
      return session
    },
    async signIn({ user }) {
      if (user.email && user.email !== "demo@socion.app") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        })
        if (!existing) {
          const trialEndsAt = new Date()
          trialEndsAt.setDate(trialEndsAt.getDate() + 14)
          await prisma.user
            .update({ where: { email: user.email }, data: { plan: Plan.TRIAL, trialEndsAt } })
            .catch(() => null)
        }
      }
      return true
    },
  },
  pages: { signIn: "/login", error: "/login" },
})
