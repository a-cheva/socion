import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ProfileCard } from "@/components/ds/profile-card"
import { useState } from "react"

const meta: Meta<typeof ProfileCard> = {
  title: "Design System/ProfileCard",
  component: ProfileCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ProfileCard>

export const Default: Story = {
  args: {
    userId: "user-1",
    name: "Ricardo Alves",
    headline: "CTO · Ex-Nubank · 12 anos em fintech",
    location: "São Paulo, SP",
    trustScore: 92,
    skills: ["React", "Node.js", "System Design", "Product"],
    roles: ["Tecnologia", "Produto"],
    isLiked: false,
    isSaved: false,
  },
}

export const Liked: Story = {
  args: {
    ...Default.args,
    name: "Fernanda Costa",
    headline: "CMO · Growth Hacker · +5M usuários adquiridos",
    trustScore: 88,
    roles: ["Marketing", "Vendas"],
    isLiked: true,
    isSaved: true,
  },
}

export const NoScore: Story = {
  args: {
    userId: "user-2",
    name: "Carlos Mendes",
    headline: "Jurídico · M&A · Startups",
    location: "Rio de Janeiro, RJ",
    skills: ["Contratos", "Societário", "IP"],
    roles: ["Jurídico"],
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    return (
      <ProfileCard
        {...args}
        isLiked={liked}
        isSaved={saved}
        onLike={() => setLiked(true)}
        onSave={() => setSaved(!saved)}
      />
    )
  },
  args: Default.args,
}

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      {[
        { name: "Ricardo Alves", role: "Tecnologia", score: 92 },
        { name: "Fernanda Costa", role: "Marketing", score: 88 },
        { name: "Gabriel Lima", role: "Produto", score: 76 },
        { name: "Ana Beatriz", role: "Finanças", score: 95 },
      ].map((p) => (
        <ProfileCard
          key={p.name}
          userId={p.name}
          name={p.name}
          headline={`Especialista em ${p.role}`}
          location="São Paulo, SP"
          trustScore={p.score}
          roles={[p.role]}
          skills={["Skill A", "Skill B", "Skill C"]}
        />
      ))}
    </div>
  ),
}
