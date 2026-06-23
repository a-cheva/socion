import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "SocioN — Escolha seu sócio com dados, não com fé"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0f0d",
          backgroundImage: "radial-gradient(ellipse 70% 60% at 30% 0%, rgba(0,168,107,0.18), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#003d26", display: "flex", alignItems: "center", justifyContent: "center", color: "#00a86b", fontSize: 26, fontWeight: 700 }}>S</div>
          <span style={{ color: "#fff", fontSize: 30, fontWeight: 600 }}>SocioN</span>
        </div>
        <div style={{ color: "#fff", fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
          Escolha seu sócio com{" "}
          <span style={{ color: "#00a86b" }}>dados, não com fé.</span>
        </div>
        <div style={{ color: "#8a9e94", fontSize: 30, marginTop: 28, maxWidth: 820 }}>
          Validação de identidade, competências e reputação — um Trust Score de 0 a 100.
        </div>
      </div>
    ),
    { ...size }
  )
}
