import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TrustScoreBadge } from "@/components/ds/trust-score-badge"

const meta: Meta<typeof TrustScoreBadge> = {
  title: "Design System/TrustScoreBadge",
  component: TrustScoreBadge,
  parameters: { layout: "centered" },
  argTypes: {
    score: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: "select", options: ["sm", "md", "lg"] },
    showLabel: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof TrustScoreBadge>

export const Default: Story = {
  args: { score: 92, size: "md", showLabel: true },
}

export const High: Story = {
  args: { score: 95, size: "lg", showLabel: true },
}

export const Medium: Story = {
  args: { score: 72, size: "md", showLabel: true },
}

export const Low: Story = {
  args: { score: 38, size: "md", showLabel: true },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <TrustScoreBadge score={92} size="sm" />
      <TrustScoreBadge score={92} size="md" />
      <TrustScoreBadge score={92} size="lg" />
    </div>
  ),
}

export const ScoreSpectrum: Story = {
  render: () => (
    <div className="flex gap-8 flex-wrap">
      {[10, 30, 50, 65, 80, 92, 98].map((score) => (
        <TrustScoreBadge key={score} score={score} size="md" />
      ))}
    </div>
  ),
}
