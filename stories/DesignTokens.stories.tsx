import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { colors, radius, spacing, typography, shadows } from "@/components/ds/tokens"

const meta: Meta = {
  title: "Design System/Tokens",
  parameters: { layout: "padded" },
}
export default meta

type Story = StoryObj

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-display-md text-[#222222] mb-4">Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(colors).map(([name, value]) => (
            <div key={name} className="flex flex-col gap-2">
              <div
                className="h-14 rounded-lg border border-[#dddddd]"
                style={{ backgroundColor: value }}
              />
              <div>
                <p className="text-caption font-semibold text-[#222222]">{name}</p>
                <p className="text-caption-sm text-[#6a6a6a]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h2 className="text-display-md text-[#222222]">Typography Scale</h2>
      {[
        { name: "display-xl", className: "text-display-xl", sample: "Encontre seu sócio ideal" },
        { name: "display-lg", className: "text-display-lg", sample: "Plataforma de confiança" },
        { name: "display-md", className: "text-display-md", sample: "Trust Score 92" },
        { name: "display-sm", className: "text-display-sm", sample: "Competências verificadas" },
        { name: "title-md",   className: "text-title-md",   sample: "Sócio com evidências reais" },
        { name: "body-md",    className: "text-body-md",    sample: "Transformando intuição em dados." },
        { name: "body-sm",    className: "text-body-sm",    sample: "São Paulo, SP · Full Time" },
        { name: "caption",    className: "text-caption",    sample: "Disponibilidade · Investimento · Área" },
        { name: "caption-sm", className: "text-caption-sm", sample: "© 2025 SocioN. Todos os direitos reservados." },
        { name: "badge",      className: "text-badge",      sample: "VERIFICADO" },
        { name: "button-md",  className: "text-button-md",  sample: "Demonstrar interesse" },
      ].map(({ name, className, sample }) => (
        <div key={name} className="flex items-baseline gap-4 border-b border-[#ebebeb] pb-4">
          <span className="text-caption-sm text-[#929292] w-24 shrink-0">{name}</span>
          <span className={`${className} text-[#222222]`}>{sample}</span>
        </div>
      ))}
    </div>
  ),
}

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-display-md text-[#222222] mb-2">Spacing</h2>
      {Object.entries(spacing).map(([name, value]) => (
        <div key={name} className="flex items-center gap-4">
          <span className="text-caption text-[#6a6a6a] w-20 shrink-0">{name}</span>
          <div
            className="bg-[#ff385c] h-4 rounded-sm"
            style={{ width: value }}
          />
          <span className="text-caption-sm text-[#929292]">{value}</span>
        </div>
      ))}
    </div>
  ),
}

export const BorderRadius: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-display-md text-[#222222] mb-2">Border Radius</h2>
      <div className="flex flex-wrap gap-6 items-end">
        {Object.entries(radius).filter(([k]) => k !== "full").map(([name, value]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 bg-[#ff385c]"
              style={{ borderRadius: value }}
            />
            <p className="text-caption text-[#222222]">{name}</p>
            <p className="text-caption-sm text-[#6a6a6a]">{value}</p>
          </div>
        ))}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-[#ff385c] rounded-full" />
          <p className="text-caption text-[#222222]">full</p>
          <p className="text-caption-sm text-[#6a6a6a]">9999px</p>
        </div>
      </div>
    </div>
  ),
}

export const Elevation: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-display-md text-[#222222] mb-2">Elevation</h2>
      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-20 bg-white border border-[#dddddd] rounded-[14px]" />
          <p className="text-caption text-[#6a6a6a]">Flat</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-32 h-20 bg-white rounded-[14px]"
            style={{ boxShadow: shadows.card }}
          />
          <p className="text-caption text-[#6a6a6a]">Card hover</p>
        </div>
      </div>
    </div>
  ),
}
