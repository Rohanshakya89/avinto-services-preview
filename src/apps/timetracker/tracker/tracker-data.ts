import {
  addMonths,
  addWeeks,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  isWeekend,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  addQuarters,
} from "date-fns"

import { getToday } from "../analytics/analytics-data"
import { isNonWorkingDay } from "../leave/leave-data"

/**
 * Demo data for the Time tracker screen. Entries are generated per working day
 * from fixed seeds, so every reload shows the same week. Swap `makeEntries` for
 * an API call later; the screen only depends on the types below.
 */

export type Project = { id: string; name: string; color: string }
export type Tag = { id: string; name: string }

export type Entry = {
  id: string
  task: string
  projectId: string
  tagIds: string[]
  /** Start of the entry's day. */
  date: Date
  /** Minutes after midnight. */
  start: number
  end: number
}

// A handful of the real project names and colours from the live tracker.
export const PROJECTS: Project[] = [
  { id: "ai-kanban", name: "AI Kanban", color: "#f54299" },
  { id: "careers", name: "Avinto Careers", color: "#f24e07" },
  { id: "foundation", name: "Avinto Foundation", color: "#016f0e" },
  { id: "general", name: "Avinto General", color: "#6366f1" },
  { id: "internal", name: "Avinto Internal Projects", color: "#0d5dde" },
  { id: "leave", name: "Avinto Leave Management", color: "#467ace" },
  { id: "track-trace", name: "Avinto Track & Trace", color: "#49138b" },
  { id: "training", name: "Avinto Training Program", color: "#f434cb" },
  { id: "bci-driver", name: "BCI Driver App", color: "#6a5a96" },
  { id: "bring-api", name: "Bring API", color: "#5ab570" },
  { id: "bring-admin", name: "Bring Admin Work", color: "#5cc9ff" },
  { id: "bring-sbl", name: "Bring SBL", color: "#1c7ed6" },
]

export const TAGS: Tag[] = [
  { id: "admin", name: "Admin" },
  { id: "festive", name: "Festive Overtime (Dashain)" },
  { id: "general", name: "General" },
  { id: "hotfix", name: "Hotfix" },
  { id: "meeting", name: "Meeting" },
  { id: "overtime", name: "OverTime" },
  { id: "previous", name: "Previous Work" },
]

export const getProject = (id: string) => PROJECTS.find((p) => p.id === id)

/** Weekly goal: 5 working days of 7.5h, shown as one segment per day. */
export const DAY_GOAL_MINUTES = 7.5 * 60
export const WEEK_GOAL_MINUTES = 5 * DAY_GOAL_MINUTES

/* --------------------------------- Entries --------------------------------- */

const TASKS: [string, string, string?][] = [
  ["Working on analytics page of time tracker", "internal"],
  ["Sprint planning", "general", "meeting"],
  ["Code review", "internal"],
  ["Bring SBL: driver flow fixes", "bring-sbl"],
  ["Weekly sync", "general", "meeting"],
  ["Design review", "careers"],
  ["Bug fixing", "bring-api", "hotfix"],
  ["Documentation", "internal"],
  ["Deployment support", "track-trace"],
  ["Training session", "training"],
  ["Timesheet and admin", "general", "admin"],
]

function rand(seed: number) {
  const x = Math.sin(seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function makeDayEntries(date: Date, forceToday: boolean): Entry[] {
  const n = Math.floor(date.getTime() / 86_400_000)
  const r = (k: number) => rand(n * 13 + k)
  const count = 2 + Math.floor(r(1) * 3)
  const out: Entry[] = []
  let cursor = 8 * 60 + 30 + Math.floor(r(2) * 6) * 5

  for (let i = 0; i < count; i++) {
    const length = 25 + Math.floor(r(10 + i) * 18) * 5
    // Step through the list so a day doesn't repeat the same task.
    const [task, projectId, tag] =
      TASKS[(Math.floor(r(20) * TASKS.length) + i * 3) % TASKS.length]
    out.push({
      id: `${n}-${i}`,
      task,
      projectId,
      tagIds: tag ? [tag] : [],
      date,
      start: cursor,
      end: cursor + length,
    })
    cursor += length + 5 + Math.floor(r(30 + i) * 8) * 5
  }
  // Today: keep it short, the live timer is still running on top of this.
  return forceToday ? out.slice(0, 3) : out
}

export function makeEntries(): Entry[] {
  const today = startOfDay(getToday())
  // The whole year so far, so This month / quarter / year all have data.
  const days = eachDayOfInterval({
    start: startOfYear(today),
    end: today,
  }).filter((d) => !isWeekend(d) && !isNonWorkingDay(d))
  return days.flatMap((d) =>
    makeDayEntries(d, d.getTime() === today.getTime())
  )
}

/* ---------------------------------- Ranges --------------------------------- */

export type RangeKind = "week" | "month" | "quarter" | "year"
export type Range = { kind: RangeKind; offset: number }

export const RANGE_KINDS: { kind: RangeKind; label: string }[] = [
  { kind: "week", label: "This week" },
  { kind: "month", label: "This month" },
  { kind: "quarter", label: "This quarter" },
  { kind: "year", label: "This year" },
]

export function getRangeBounds({ kind, offset }: Range) {
  const base = startOfDay(getToday())
  switch (kind) {
    case "week": {
      const a = addWeeks(base, offset)
      return {
        start: startOfWeek(a, { weekStartsOn: 1 }),
        end: endOfWeek(a, { weekStartsOn: 1 }),
      }
    }
    case "month": {
      const a = addMonths(base, offset)
      return { start: startOfMonth(a), end: endOfMonth(a) }
    }
    case "quarter": {
      const a = addQuarters(base, offset)
      return { start: startOfQuarter(a), end: endOfQuarter(a) }
    }
    case "year": {
      const a = addYears(base, offset)
      return { start: startOfYear(a), end: endOfYear(a) }
    }
  }
}

export function rangeLabel(range: Range) {
  const { start, end } = getRangeBounds(range)
  const { kind, offset } = range
  if (offset === 0) return RANGE_KINDS.find((k) => k.kind === kind)!.label
  if (offset === -1 && kind !== "quarter" && kind !== "year")
    return `Last ${kind}`
  if (kind === "week") return `${format(start, "d MMM")} – ${format(end, "d MMM")}`
  if (kind === "month") return format(start, "MMM yyyy")
  if (kind === "quarter") return `Q${Math.floor(start.getMonth() / 3) + 1} ${format(start, "yyyy")}`
  return format(start, "yyyy")
}

/* -------------------------------- Formatting -------------------------------- */

export const minutes = (e: Entry) => e.end - e.start

/** 133 -> "2h 13m", 45 -> "45m", 120 -> "2h". */
export function formatMinutes(total: number) {
  const h = Math.floor(total / 60)
  const m = Math.round(total % 60)
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

/** 805 -> "13:25". */
export function formatTimeOfDay(min: number) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`
}

/** 25 -> "00:25:00". */
export function formatEntryDuration(min: number) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}:00`
}
