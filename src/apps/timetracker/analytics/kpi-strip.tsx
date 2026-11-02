import * as React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Coffee,
  Flag,
  Hourglass,
  type LucideIcon,
} from "lucide-react"

import { cn } from "cn"
import {
  formatHours,
  TYPICAL,
  type CheckFilter,
  type Flag as FlagItem,
  type summarize,
} from "./analytics-data"

type Tone = "good" | "warn" | "neutral"

const TONES: Record<Tone, { card: string; chip: string }> = {
  good: {
    card: "border-emerald-500/30 bg-emerald-500/5",
    chip: "bg-emerald-500/15 text-emerald-700 tt-dark:text-emerald-300",
  },
  warn: {
    card: "border-amber-500/40 bg-amber-500/10",
    chip: "bg-amber-500/20 text-amber-700 tt-dark:text-amber-300",
  },
  neutral: {
    card: "border-border bg-muted/40",
    chip: "bg-primary/10 text-primary",
  },
}

function KpiCard({
  icon: Icon,
  label,
  value,
  note,
  tone = "neutral",
  onClick,
  actionLabel,
}: {
  icon: LucideIcon
  label: string
  value: string
  note: React.ReactNode
  tone?: Tone
  /** Makes the card a button that jumps to the list it explains. */
  onClick?: () => void
  actionLabel?: string
}) {
  const className = cn(
    "group/kpi flex h-full w-full flex-col gap-4 rounded-xl border p-5 text-left",
    TONES[tone].card,
    onClick &&
      "transition-shadow duration-150 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
  )

  const content = (
    <>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            TONES[tone].chip
          )}
        >
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        {onClick && (
          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover/kpi:text-foreground"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-sm text-muted-foreground">{note}</span>
      </div>
    </>
  )

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-label={actionLabel ? `${label}: ${value}. ${actionLabel}` : undefined}
      className={className}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  )
}

/**
 * Four numbers that answer "how am I doing?". The two that point at the flags
 * list (needs attention, skips breaks) show a chevron and jump to it.
 */
export function KpiStrip({
  stats,
  flags,
  onOpenFlags,
}: {
  stats: ReturnType<typeof summarize>
  flags: FlagItem[]
  onOpenFlags: (check: CheckFilter) => void
}) {
  const noData = stats.activeDays === 0
  const diff = stats.avgHours - TYPICAL.hours
  const DiffIcon = diff >= 0 ? ArrowUpRight : ArrowDownRight
  const breakFlags = flags.filter(
    (f) => f.severity === "attention" && f.check === "breaks"
  ).length
  const empty = "No working days yet"

  return (
    <section
      aria-label="Key numbers"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <KpiCard
        icon={Flag}
        label="Needs attention"
        tone={noData ? "neutral" : stats.attention > 0 ? "warn" : "good"}
        value={noData ? "–" : String(stats.attention)}
        note={
          noData
            ? empty
            : stats.attention === 0
              ? "Nothing looks off"
              : stats.attention === 1
                ? "flag to review"
                : "flags to review"
        }
        onClick={stats.attention > 0 ? () => onOpenFlags("all") : undefined}
        actionLabel="Show the flags"
      />
      <KpiCard
        icon={Clock}
        label="Avg per day"
        value={noData ? "–" : formatHours(stats.avgHours)}
        note={
          noData ? (
            empty
          ) : (
            <span className="inline-flex items-center gap-1">
              <DiffIcon className="size-4 shrink-0" />
              {formatHours(Math.abs(diff))} {diff >= 0 ? "above" : "below"}{" "}
              typical
            </span>
          )
        }
      />
      <KpiCard
        icon={Hourglass}
        label="Overtime"
        value={noData ? "–" : formatHours(stats.overtimeHours)}
        note={
          noData
            ? empty
            : stats.overtimeDays === 0
              ? "No overtime logged"
              : `on ${stats.overtimeDays} ${stats.overtimeDays === 1 ? "day" : "days"}`
        }
      />
      <KpiCard
        icon={Coffee}
        label="Skips breaks"
        tone={stats.noBreakLevel === "Often" ? "warn" : "neutral"}
        value={noData ? "–" : stats.noBreakLevel}
        note={
          noData
            ? empty
            : `${Math.round(stats.noBreakShare * 100)}% of full days · typical ${Math.round(TYPICAL.noBreakShare * 100)}%`
        }
        onClick={breakFlags > 0 ? () => onOpenFlags("breaks") : undefined}
        actionLabel="Show the break flags"
      />
    </section>
  )
}
