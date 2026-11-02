import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { periodLabel, type Period } from "./analytics-data"

const PRESETS: Period[] = [
  { kind: "week", offset: 0 },
  { kind: "week", offset: -1 },
  { kind: "month", offset: 0 },
  { kind: "month", offset: -1 },
]

const BUTTON =
  "flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"

/** One control for the whole page: step back/forward or jump to a preset. */
export function PeriodPicker({
  period,
  onChange,
}: {
  period: Period
  onChange: (period: Period) => void
}) {
  const step = (delta: number) =>
    onChange({ ...period, offset: period.offset + delta })

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Previous ${period.kind}`}
        onClick={() => step(-1)}
        className={BUTTON}
      >
        <ChevronLeft className="size-5" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex h-10 min-w-40 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          )}
        >
          {periodLabel(period)}
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          {PRESETS.map((preset) => (
            <DropdownMenuItem
              key={`${preset.kind}${preset.offset}`}
              onClick={() => onChange(preset)}
            >
              {periodLabel(preset)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        type="button"
        aria-label={`Next ${period.kind}`}
        disabled={period.offset >= 0}
        onClick={() => step(1)}
        className={BUTTON}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
