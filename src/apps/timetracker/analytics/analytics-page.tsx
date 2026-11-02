import * as React from "react"

import { cn } from "cn"

import {
  getDays,
  getFlags,
  rangeLabel,
  summarize,
  type CheckFilter,
  type Period,
} from "./analytics-data"
import { FlagsSection } from "./flags-section"
import { KpiStrip } from "./kpi-strip"
import { PeriodPicker } from "./period-picker"
import { TrendsSection } from "./trends-section"

/**
 * Top to bottom: what period -> how am I doing (four numbers) -> what needs
 * fixing (action list) -> how do I compare (charts, one group at a time).
 */
export function AnalyticsPage() {
  const [period, setPeriod] = React.useState<Period>({
    kind: "month",
    offset: 0,
  })
  const [check, setCheck] = React.useState<CheckFilter>("all")
  const flagsRef = React.useRef<HTMLDivElement>(null)
  // A short ring around the flags panel after a KPI card jumps to it.
  const [flash, setFlash] = React.useState(false)
  const flashTimers = React.useRef<number[]>([])
  React.useEffect(() => {
    const timers = flashTimers.current
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  const days = React.useMemo(() => getDays(period), [period])
  const flags = React.useMemo(() => getFlags(days), [days])
  const stats = React.useMemo(() => summarize(days, flags), [days, flags])

  function changePeriod(next: Period) {
    setPeriod(next)
    setCheck("all")
  }

  // A KPI card sets the filter, then brings the list into view.
  function openFlags(next: CheckFilter) {
    setCheck(next)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    flagsRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    })

    // Say where we landed: move focus to the heading, then ring the panel
    // once the scroll has (nearly) arrived.
    document.getElementById("flags-title")?.focus({ preventScroll: true })
    flashTimers.current.forEach((t) => window.clearTimeout(t))
    setFlash(false)
    flashTimers.current = [
      window.setTimeout(() => setFlash(true), reduce ? 0 : 350),
      window.setTimeout(() => setFlash(false), 2000),
    ]
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{rangeLabel(period)}</h2>
        <PeriodPicker period={period} onChange={changePeriod} />
      </header>

      <KpiStrip stats={stats} flags={flags} onOpenFlags={openFlags} />
      {/* scroll-mt clears the sticky top bar (64px) plus a little air. */}
      <div
        ref={flagsRef}
        className={cn(
          "scroll-mt-20 rounded-xl transition-shadow duration-500 ease-out",
          flash
            ? "shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
            : "shadow-[0_0_0_0_transparent]"
        )}
      >
        <FlagsSection
          key={`${period.kind}${period.offset}`}
          flags={flags}
          check={check}
          onCheckChange={setCheck}
        />
      </div>
      <TrendsSection days={days} />
    </div>
  )
}
