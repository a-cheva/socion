import { getTrustColor, getTrustLabel } from "@/lib/trust-score"
import { cn } from "@/lib/utils"

interface TrustScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const sizeMap = {
  sm: { score: "text-2xl", label: "text-caption-sm" },
  md: { score: "text-4xl", label: "text-body-sm" },
  lg: { score: "text-rating", label: "text-title-md" },
}

export function TrustScoreBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: TrustScoreBadgeProps) {
  const { score: scoreClass, label: labelClass } = sizeMap[size]

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span
        className={cn("font-bold tabular-nums", scoreClass, getTrustColor(score))}
        aria-label={`Trust Score: ${score}`}
      >
        {score}
      </span>
      {showLabel && (
        <span className={cn("text-[var(--color-muted-text)] mt-0.5", labelClass)}>
          {getTrustLabel(score)}
        </span>
      )}
    </div>
  )
}
