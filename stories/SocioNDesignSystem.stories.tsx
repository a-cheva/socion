import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta: Meta = {
  title: "SocioN/Design System",
  parameters: { layout: "fullscreen", backgrounds: { default: "socion-base" } },
}
export default meta
type Story = StoryObj

const colors = [
  { name: "bg/base", hex: "#0a0f0d" },
  { name: "bg/surface", hex: "#0d1310" },
  { name: "bg/card", hex: "#111816" },
  { name: "bg/inset", hex: "#161f1a" },
  { name: "green/500", hex: "#00a86b" },
  { name: "green/600", hex: "#009060" },
  { name: "green/deep", hex: "#003d26" },
  { name: "border/hairline", hex: "#1e2e26" },
  { name: "border/strong", hex: "#2a3d32" },
  { name: "text/primary", hex: "#ffffff" },
  { name: "text/secondary", hex: "#8a9e94" },
  { name: "text/muted", hex: "#4a5e54" },
]

export const Colors: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0f0d] p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Cores</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {colors.map((c) => (
          <div key={c.name} className="bg-[#111816] border border-[#1e2e26] rounded-xl overflow-hidden">
            <div className="h-16" style={{ background: c.hex }} />
            <div className="p-3">
              <p className="text-white text-sm font-medium">{c.name}</p>
              <p className="text-[#4a5e54] text-xs">{c.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const Components: Story = {
  render: () => (
    <div className="min-h-screen bg-[#0a0f0d] p-8 flex flex-col gap-8">
      {/* Botões */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Botões</h2>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-[#00a86b] hover:bg-[#009060] text-white rounded-lg px-4 py-2 font-medium">Primário</button>
          <button className="bg-[#161f1a] border border-[#2a3d32] text-white hover:bg-[#1e2e26] rounded-lg px-4 py-2 font-medium">Secundário</button>
          <button className="border border-[#2a3d32] hover:border-[#00a86b] text-white px-4 py-2 rounded-full">Pill nav →</button>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Badges</h2>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-[#003d26] text-[#00a86b] text-xs px-2 py-0.5 rounded-full">✓ Verificado</span>
          <span className="bg-[#1a1000] text-[#ffb84d] text-xs px-2 py-0.5 rounded-full">Em análise</span>
          <span className="bg-[#1a0a0a] text-red-400 text-xs px-2 py-0.5 rounded-full">✕ Rejeitado</span>
          <span className="bg-[#1e2e26] text-[#8a9e94] text-xs px-2 py-0.5 rounded-full">via linkedin</span>
        </div>
      </section>

      {/* Card */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Card de perfil</h2>
        <div className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#1e2e26] flex items-center justify-center text-[#00a86b] font-bold text-lg border border-[#2a3d32]">D</div>
            <div className="flex-1">
              <div className="font-semibold text-white">Diego Carvalho</div>
              <div className="text-sm text-[#8a9e94]">Engenheiro de ML · Ex-Google Brain</div>
            </div>
            <div className="flex flex-col items-center bg-[#003d26] rounded-xl px-3 py-1.5">
              <span className="text-[#00a86b] font-bold text-lg leading-none">93</span>
              <span className="text-[#4a5e54] text-[10px]">score</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#161f1a] border border-[#2a3d32] text-[#8a9e94] rounded-lg px-3 py-1.5 text-sm">♡ Like</button>
            <button className="bg-[#161f1a] border border-[#2a3d32] text-[#8a9e94] rounded-lg px-3 py-1.5 text-sm">☆ Favoritar</button>
          </div>
        </div>
      </section>

      {/* Trust Score */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Trust Score</h2>
        <div className="w-24 h-24 rounded-full bg-[#003d26] flex flex-col items-center justify-center border-2 border-[#00a86b]">
          <span className="text-4xl font-bold text-[#00a86b] leading-none">93</span>
          <span className="text-[10px] text-[#4a5e54] mt-1">de 100</span>
        </div>
      </section>
    </div>
  ),
}
