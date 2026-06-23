import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { TopLoader } from "./TopLoader"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "SocioN — Encontre o Sócio Ideal",
  description:
    "Plataforma de formação de sociedades com validação de competências, reputação e confiabilidade.",
  openGraph: {
    title: "SocioN",
    description: "Encontre sócios complementares com alto grau de confiança.",
    siteName: "SocioN",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TopLoader />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
