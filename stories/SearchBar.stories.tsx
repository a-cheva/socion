import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchBar } from "@/components/ds/search-bar"

const meta: Meta<typeof SearchBar> = {
  title: "Design System/SearchBar",
  component: SearchBar,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto py-8">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: { placeholder: "Buscar sócios por habilidade ou área..." },
}

export const CustomPlaceholder: Story = {
  args: { placeholder: "Ex: CTO, Marketing, Produto..." },
}
