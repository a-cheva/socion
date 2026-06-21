import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"

const providers = []

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google)
}

if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) {
  providers.push(
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    })
  )
}

export const { auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
})
