import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface Milestone {
  id: string
  title: string
  completed: boolean
  order: number
}

interface PartnershipTimelineProps {
  milestones: Milestone[]
  partnerName?: string
  className?: string
}

export function PartnershipTimeline({
  milestones,
  partnerName,
  className,
}: PartnershipTimelineProps) {
  const sorted = [...milestones].sort((a, b) => a.order - b.order)
  const completed = sorted.filter((m) => m.completed).length
  const progress = sorted.length > 0 ? (completed / sorted.length) * 100 : 0

  return (
    <div
      className={cn(
        "bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[14px] p-6",
        className
      )}
    >
      {partnerName && (
        <p className="text-caption text-[var(--color-muted-text)] mb-1">Parceria com</p>
      )}
      {partnerName && (
        <h3 className="text-title-md text-[var(--color-ink)] mb-4">{partnerName}</h3>
      )}

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-caption text-[var(--color-muted-text)]">Progresso</span>
          <span className="text-badge font-semibold text-[var(--color-ink)]">
            {completed}/{sorted.length}
          </span>
        </div>
        <Progress value={progress} className="h-1.5 bg-[var(--color-hairline-soft)]" />
      </div>

      {/* Timeline */}
      <ol className="flex flex-col gap-0">
        {sorted.map((milestone, idx) => (
          <li key={milestone.id} className="flex items-start gap-3">
            {/* Icon + connector */}
            <div className="flex flex-col items-center shrink-0">
              {milestone.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--color-rausch)] mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-[var(--color-hairline)] mt-0.5" />
              )}
              {idx < sorted.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 my-1 min-h-[16px]",
                    milestone.completed ? "bg-[var(--color-rausch)]" : "bg-[var(--color-hairline-soft)]"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                "text-body-sm pb-4",
                milestone.completed
                  ? "text-[var(--color-ink)] font-medium"
                  : "text-[var(--color-muted-text)]"
              )}
            >
              {milestone.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
