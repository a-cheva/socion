import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
import Resend from "next-auth/providers/resend"
import { prisma } from "@/lib/prisma"
import { Plan } from "@prisma/client"

const providers = []

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google)
}

if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) {
  providers.push(
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      authorization: {
        params: { scope: "openid profile email" },
      },
    })
  )
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@socion.app",
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
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
      if (user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        })
        if (!existing) {
          const trialEndsAt = new Date()
          trialEndsAt.setDate(trialEndsAt.getDate() + 14)
          await prisma.user
            .update({
              where: { email: user.email },
              data: { plan: Plan.TRIAL, trialEndsAt },
            })
            .catch(() => null)
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
