import * as React from "react"
import { format } from "date-fns"
import { CircleCheck, CircleHelp, Info, TriangleAlert } from "lucide-react"

import { cn } from "cn"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs } from "@/components/ui/tabs"
import { SegmentedList, SegmentedTab } from "./segmented-tabs"
import { Link } from "@/lib/router"
import { TRACKER_HOME } from "../nav"
import { SectionPanel } from "./section-panel"
import {
  CHECK_LABEL,
  type Check,
  type CheckFilter,
  type Flag,
} from "./analytics-data"

const CHECKS: CheckFilter[] = ["all", "breaks", "day-totals", "entries"]

/** Long lists collapse so the charts below stay within reach. */
const COLLAPSED_COUNT = 5

function HowFlagsWork() {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-8 items-center gap-2 rounded-md bg-muted px-3 text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
        <CircleHelp className="size-3" />
        How flags work
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-4 p-4 text-sm">
        <p className="text-muted-foreground">
          Weekends, holidays and approved leave are left out of the unusual-day
          and break checks.
        </p>
        {[
          [
            "Hard limits",
            "An entry or timer over 12 hours, a day with more than 12 hours, entries in the future and overlapping entries are always flagged.",
          ],
          [
            "Unusual days",
            "Each day is compared with your own last 8 weeks, or the team when you're new. Far shorter days need attention; far longer days are info.",
          ],
          [
            "Skipped breaks",
            "6.5h or more without a gap on a full workday suggests the timer ran through lunch.",
          ],
          [
            "Severity",
            "Needs attention is worth a look. Low priority is background context, hidden unless you turn on \"Show low-priority flags\".",
          ],
        ].map(([title, text]) => (
          <div key={title} className="flex flex-col gap-1">
            <span className="font-medium">{title}</span>
            <span className="text-muted-foreground">{text}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function FlagRow({ flag }: { flag: Flag }) {
  const attention = flag.severity === "attention"
  const Icon = attention ? TriangleAlert : Info

  return (
    <li className="flex items-start gap-4 p-4">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          attention
            ? "bg-amber-500/20 text-amber-700 tt-dark:text-amber-300"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium">{flag.title}</span>
        <span className="text-sm text-muted-foreground">{flag.detail}</span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
          {format(flag.date, "EEE d MMM")}
        </span>
        <Link
          href={`${TRACKER_HOME}/timesheet`}
          className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          View day
        </Link>
      </div>
    </li>
  )
}

/**
 * The action list. Filters are limited to what changes the list: one row of
 * check chips (with counts, so empty ones are obvious) and a single switch
 * for low-priority flags.
 */
export function FlagsSection({
  flags,
  check,
  onCheckChange,
}: {
  flags: Flag[]
  check: CheckFilter
  onCheckChange: (check: CheckFilter) => void
}) {
  const [showInfo, setShowInfo] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  const visibleBySeverity = flags.filter(
    (f) => showInfo || f.severity === "attention"
  )
  const hiddenInfo = flags.length - visibleBySeverity.length
  const countFor = (c: CheckFilter) =>
    c === "all"
      ? visibleBySeverity.length
      : visibleBySeverity.filter((f) => f.check === c).length
  const matching =
    check === "all"
      ? visibleBySeverity
      : visibleBySeverity.filter((f) => f.check === check)
  const shown = expanded ? matching : matching.slice(0, COLLAPSED_COUNT)

  return (
    <SectionPanel
      id="flags-title"
      title="Needs attention"
      description="Days and entries in your timesheet that look off."
      actions={
        <>
          <HowFlagsWork />
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Switch checked={showInfo} onCheckedChange={setShowInfo} />
            Show low-priority flags
          </label>
        </>
      }
    >
      {visibleBySeverity.length === 0 ? (
        <div className="flex items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 tt-dark:text-emerald-300">
            <CircleCheck className="size-4" />
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              Your timesheet looks fine
            </span>
            <span className="text-sm text-muted-foreground">
              {hiddenInfo > 0
                ? `Nothing needs attention. ${hiddenInfo} low-priority ${hiddenInfo === 1 ? "flag is" : "flags are"} hidden.`
                : "Nothing looked off in this period."}
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* The same segmented filter as "Your trends". It scrolls sideways on narrow screens. */}
          <Tabs
            value={check}
            onValueChange={(value) => {
              onCheckChange(value as CheckFilter)
              setExpanded(false)
            }}
            className="-mx-5 overflow-x-auto px-5"
          >
            <SegmentedList aria-label="Filter by check">
              {CHECKS.map((c) => (
                <SegmentedTab key={c} value={c}>
                  {c === "all" ? "All" : CHECK_LABEL[c]}
                  {/* The count sits on a subtle circle (a pill once it reaches 10). */}
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/5 px-1 text-xs text-muted-foreground tabular-nums">
                    {countFor(c)}
                  </span>
                </SegmentedTab>
              ))}
            </SegmentedList>
          </Tabs>

          {shown.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No {CHECK_LABEL[check as Check].toLowerCase()} flags in this
              period.
            </p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {shown.map((flag) => (
                <FlagRow key={flag.id} flag={flag} />
              ))}
            </ul>
          )}

          {matching.length > COLLAPSED_COUNT && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="h-10 w-fit self-center rounded-lg px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {expanded ? "Show fewer" : `Show all ${matching.length}`}
            </button>
          )}
        </>
      )}
    </SectionPanel>
  )
}
