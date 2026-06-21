import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getTrustColor } from "@/lib/trust-score"

export interface ProfileCardProps {
  userId: string
  name: string
  image?: string | null
  headline?: string | null
  location?: string | null
  trustScore?: number | null
  skills?: string[]
  roles?: string[]
  isLiked?: boolean
  isSaved?: boolean
  onLike?: () => void
  onSave?: () => void
  className?: string
}

export function ProfileCard({
  userId,
  name,
  image,
  headline,
  location,
  trustScore,
  skills = [],
  roles = [],
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  className,
}: ProfileCardProps) {
  return (
    <article
      className={cn(
        "bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[14px] p-6",
        "hover:shadow-card transition-shadow duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={image ?? ""} alt={name} />
          <AvatarFallback className="bg-[var(--color-surface-strong)] text-[var(--color-ink)] font-semibold">
            {name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-title-md text-[var(--color-ink)] truncate">{name}</span>
            {trustScore !== null && trustScore !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-badge font-semibold",
                  getTrustColor(trustScore)
                )}
              >
                <Star className="w-3 h-3 fill-current" />
                {trustScore}
              </span>
            )}
          </div>
          {headline && (
            <p className="text-body-sm text-[var(--color-muted-text)] truncate mt-0.5">{headline}</p>
          )}
          {location && (
            <p className="text-caption-sm text-[var(--color-muted-soft)] mt-0.5">{location}</p>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          aria-label="Salvar perfil"
          className={cn(
            "rounded-full p-2 transition-colors",
            isSaved
              ? "text-[var(--color-rausch)]"
              : "text-[var(--color-muted-text)] hover:text-[var(--color-rausch)]"
          )}
        >
          <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Roles */}
      {roles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {roles.map((r) => (
            <span
              key={r}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-badge font-semibold bg-[var(--color-surface-soft)] text-[var(--color-ink)]"
            >
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.slice(0, 4).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-caption-sm border-[var(--color-hairline)] text-[var(--color-muted-text)]"
            >
              {s}
            </Badge>
          ))}
          {skills.length > 4 && (
            <span className="text-caption-sm text-[var(--color-muted-text)]">+{skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onLike}
          disabled={isLiked}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-12 rounded-lg text-button-md font-medium transition-colors",
            isLiked
              ? "bg-[var(--color-rausch-disabled)] text-[var(--color-rausch)] cursor-default"
              : "bg-[var(--color-rausch)] text-white hover:bg-[var(--color-rausch-active)] active:bg-[var(--color-rausch-active)]"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          {isLiked ? "Interesse registrado" : "Demonstrar interesse"}
        </button>
        <Link href={`/profile/${userId}`} className="shrink-0">
          <Button
            variant="outline"
            className="h-12 border-[var(--color-hairline)] text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
          >
            Ver perfil
          </Button>
        </Link>
      </div>
    </article>
  )
}
