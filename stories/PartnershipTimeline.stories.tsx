import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PartnershipTimeline } from "@/components/ds/partnership-timeline"

const milestones = [
  { id: "1", title: "Match realizado", completed: true, order: 1 },
  { id: "2", title: "Documentos enviados", completed: true, order: 2 },
  { id: "3", title: "Compatibilidade verificada", completed: true, order: 3 },
  { id: "4", title: "Proposta enviada", completed: false, order: 4 },
  { id: "5", title: "Contrato em elaboração", completed: false, order: 5 },
  { id: "6", title: "Contrato assinado", completed: false, order: 6 },
]

const meta: Meta<typeof PartnershipTimeline> = {
  title: "Design System/PartnershipTimeline",
  component: PartnershipTimeline,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof PartnershipTimeline>

export const InProgress: Story = {
  args: { milestones, partnerName: "Ricardo Alves" },
}

export const JustMatched: Story = {
  args: {
    partnerName: "Fernanda Costa",
    milestones: milestones.map((m) => ({ ...m, completed: m.order === 1 })),
  },
}

export const Completed: Story = {
  args: {
    partnerName: "Gabriel Lima",
    milestones: milestones.map((m) => ({ ...m, completed: true })),
  },
}
