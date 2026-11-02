import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isWeekend,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import { getLeave, isNonWorkingDay, LEAVE_TYPES } from "../leave/leave-data"

/**
 * Sample data. Until the tracker has a backend, every number on the analytics
 * page comes from here: a deterministic day-by-day generator plus the real
 * flag rules from the live tracker. Swap `getDays` for an API call later; the
 * rest of the page only depends on the types below.
 */
export const USING_SAMPLE_DATA = true

/**
 * While the data is sample data, "today" is pinned to a Friday late in the
 * month, so This week and This month always have enough working days to show
 * charts and flags. Turn `USING_SAMPLE_DATA` off and the real date is used.
 */
const DEMO_TODAY = new Date(2026, 10, 20)

export function getToday() {
  return USING_SAMPLE_DATA ? DEMO_TODAY : new Date()
}

export type Check = "breaks" | "day-totals" | "entries"
export type CheckFilter = "all" | Check
export type Severity = "attention" | "info"

export type DayStat = {
  date: Date
  entries: number
  hours: number
  /** Average entry length, in hours. */
  avgEntryHours: number
  projects: number
  overtimeHours: number
  /** Longest run of logged time without a gap, in hours. */
  longestStretchHours: number
  longestEntryHours: number
  hasOverlap: boolean
}

export type Flag = {
  id: string
  date: Date
  check: Check
  severity: Severity
  title: string
  detail: string
}

export type Period = { kind: "week" | "month"; offset: number }

/** What a typical person logs; the dashed line on every chart. */
export const TYPICAL = {
  entries: 4,
  hours: 7.5,
  avgEntryHours: 1.9,
  projects: 2.4,
  overtimeHours: 0.3,
  /** Share of days with no break. */
  noBreakShare: 0.16,
} as const

export const CHECK_LABEL: Record<Check, string> = {
  breaks: "Breaks",
  "day-totals": "Day totals",
  entries: "Entries",
}

/* --------------------------------- Periods --------------------------------- */

export function getRange(period: Period, today = getToday()) {
  const base = startOfDay(today)
  if (period.kind === "month") {
    const anchor = addMonths(base, period.offset)
    const start = startOfMonth(anchor)
    const end = endOfMonth(anchor)
    return { start, end: end > base ? base : end }
  }
  const anchor = addWeeks(base, period.offset)
  const start = startOfWeek(anchor, { weekStartsOn: 1 })
  const end = endOfWeek(anchor, { weekStartsOn: 1 })
  return { start, end: end > base ? base : end }
}

export function periodLabel(period: Period) {
  const { start } = getRange(period)
  if (period.kind === "month") {
    if (period.offset === 0) return "This month"
    if (period.offset === -1) return "Last month"
    return format(start, "MMM yyyy")
  }
  if (period.offset === 0) return "This week"
  if (period.offset === -1) return "Last week"
  return `Week of ${format(start, "d MMM")}`
}

export function rangeLabel(period: Period) {
  const { start, end } = getRange(period)
  const sameDay = start.getTime() === end.getTime()
  if (sameDay) return format(start, "d MMM yyyy")
  const sameYear = start.getFullYear() === end.getFullYear()
  return `${format(start, sameYear ? "d MMM" : "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`
}

/* ---------------------------------- Days ---------------------------------- */

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const round1 = (n: number) => Math.round(n * 10) / 10

function makeDay(date: Date): DayStat {
  const n = Math.floor(date.getTime() / 86_400_000)
  const r = (k: number) => rand(n * 11 + k)

  let hours = 6.2 + r(1) * 3.4
  // A long day now and then: past 10.5h it shows as an info item, past 12h as a flag.
  if (r(2) > 0.82) hours += 3 + r(11) * 0.8
  if (r(3) > 0.93) hours -= 4.6 // and a very short one
  hours = round1(Math.max(0.8, hours))

  const entries = Math.max(1, Math.round(2 + r(4) * 5))
  const projects = Math.max(1, Math.min(entries, Math.round(1 + r(5) * 3)))
  const longestStretch =
    r(7) > 0.9 ? hours : round1(Math.min(hours, 2.5 + r(8) * 3.5))

  return {
    date,
    entries,
    hours,
    avgEntryHours: round1(hours / entries),
    projects,
    overtimeHours: hours > 8 ? round1((hours - 8) * (0.4 + r(6) * 0.5)) : 0,
    longestStretchHours: longestStretch,
    longestEntryHours: r(10) > 0.97 ? 12.5 : round1(longestStretch),
    hasOverlap: r(9) > 0.95,
  }
}

/** Working days in the period. Weekends are left out, like the live tracker. */
export function getDays(period: Period): DayStat[] {
  const { start, end } = getRange(period)
  return eachDayOfInterval({ start, end })
    // Approved full days of leave (and holidays) are not working days.
    .filter((d) => !isWeekend(d) && !isNonWorkingDay(d))
    .map(makeDay)
}

/* ---------------------------------- Flags ---------------------------------- */

export function getFlags(days: DayStat[]): Flag[] {
  const flags: Flag[] = []
  for (const d of days) {
    const key = format(d.date, "yyyy-MM-dd")
    // On a day of leave a short day or a missing break is expected, so those
    // two checks are skipped. Hard limits (12h, overlaps) still apply.
    const leave = getLeave(d.date)
    const onLeave = !!leave && LEAVE_TYPES[leave.type].absence

    if (d.longestEntryHours > 12) {
      flags.push({
        id: `${key}-long-entry`,
        date: d.date,
        check: "entries",
        severity: "attention",
        title: "An entry ran over 12 hours",
        detail: "A forgotten timer is the most common cause.",
      })
    }
    if (d.hasOverlap) {
      flags.push({
        id: `${key}-overlap`,
        date: d.date,
        check: "entries",
        severity: "attention",
        title: "Overlapping entries",
        detail: "Two entries cover the same time, so it's counted twice.",
      })
    }
    if (d.hours > 12) {
      flags.push({
        id: `${key}-over-12`,
        date: d.date,
        check: "day-totals",
        severity: "attention",
        title: "More than 12 hours logged",
        detail: `${d.hours}h in one day.`,
      })
    } else if (!onLeave && d.hours < TYPICAL.hours * 0.55) {
      flags.push({
        id: `${key}-short`,
        date: d.date,
        check: "day-totals",
        severity: "attention",
        title: "Far shorter than usual",
        detail: `${d.hours}h logged, you usually log about ${TYPICAL.hours}h.`,
      })
    } else if (d.hours > TYPICAL.hours * 1.4) {
      flags.push({
        id: `${key}-long`,
        date: d.date,
        check: "day-totals",
        severity: "info",
        title: "Longer than usual",
        detail: `${d.hours}h logged, you usually log about ${TYPICAL.hours}h.`,
      })
    }
    if (!onLeave && d.hours >= 6.5 && d.longestStretchHours >= 6.5) {
      flags.push({
        id: `${key}-no-break`,
        date: d.date,
        check: "breaks",
        severity: "attention",
        title: "No break on a full day",
        detail: `${d.longestStretchHours}h logged without a gap. Did the timer run through lunch?`,
      })
    }
  }
  return flags.sort((a, b) => b.date.getTime() - a.date.getTime())
}

/* -------------------------------- Summaries -------------------------------- */

export function summarize(days: DayStat[], flags: Flag[]) {
  const count = days.length
  const sum = (pick: (d: DayStat) => number) =>
    days.reduce((total, d) => total + pick(d), 0)
  const fullDays = days.filter((d) => d.hours >= 6.5)
  const noBreakDays = fullDays.filter((d) => d.longestStretchHours >= 6.5)
  const noBreakShare = fullDays.length ? noBreakDays.length / fullDays.length : 0

  return {
    activeDays: count,
    attention: flags.filter((f) => f.severity === "attention").length,
    info: flags.filter((f) => f.severity === "info").length,
    avgHours: count ? sum((d) => d.hours) / count : 0,
    overtimeHours: sum((d) => d.overtimeHours),
    overtimeDays: days.filter((d) => d.overtimeHours > 0).length,
    noBreakShare,
    noBreakLevel: (fullDays.length < 3
      ? "Rarely"
      : noBreakShare > 0.5
        ? "Often"
        : noBreakShare > TYPICAL.noBreakShare + 0.1
          ? "Sometimes"
          : "Rarely") as "Rarely" | "Sometimes" | "Often",
  }
}

/* -------------------------------- Formatting -------------------------------- */

/** 7.7 -> "7h 42m", 0.75 -> "45m", 8 -> "8h". */
export function formatHours(hours: number) {
  const total = Math.round(hours * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
