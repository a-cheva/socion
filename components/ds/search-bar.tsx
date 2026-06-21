"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
  className?: string
}

export function SearchBar({ placeholder = "Buscar sócios...", onSearch, className }: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex items-center h-16 rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas)]",
        "shadow-card px-6 gap-4",
        className
      )}
    >
      <div className="flex-1 flex flex-col">
        <span className="text-caption font-medium text-[var(--color-ink)] leading-tight">Buscar</span>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="bg-transparent text-body-sm text-[var(--color-muted-text)] placeholder:text-[var(--color-muted-soft)] outline-none border-none"
        />
      </div>
      <button
        aria-label="Pesquisar"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-rausch)] text-white hover:bg-[var(--color-rausch-active)] transition-colors shrink-0"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  )
}
