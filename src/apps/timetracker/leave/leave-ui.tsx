import type * as React from "react"
import { format } from "date-fns"

import { cn } from "cn"
import { formatMinutes } from "../tracker/tracker-data"
import {
  isWorkedOnLeave,
  LEAVE_TYPES,
  type LeaveDay,
  PORTION_LABEL,
} from "./leave-data"

/**
 * One colour for every kind of leave (teal), so a week never turns into a
 * rainbow. What kind it is lives in the icon and the tooltip. Only approved
 * leave is ever shown (see `getLeave`), so there is no pending style.
 */
export const LEAVE_BAR = "bg-teal-500 tt-dark:bg-teal-400"
export const LEAVE_TEXT = "text-teal-700 tt-dark:text-teal-300"

const TONE = {
  tile: "bg-teal-500/10",
  chip: "bg-teal-500/15",
} as const

export function LeaveIcon({
  leave,
  className,
}: {
  leave: LeaveDay
  className?: string
}) {
  const meta = LEAVE_TYPES[leave.type]
  const Icon = meta.icon
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md",
        // Work from home is not leave: neutral grey instead of teal.
        meta.absence
          ? `${TONE.chip} ${LEAVE_TEXT}`
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3" />
    </span>
  )
}

/** Small label for a day card: icon, type and portion (only approved leave is shown). */
export function LeaveChip({ leave }: { leave: LeaveDay }) {
  const meta = LEAVE_TYPES[leave.type]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-2 rounded-md px-2 text-xs",
        meta.absence
          ? `${TONE.tile} ${LEAVE_TEXT}`
          : "bg-muted text-muted-foreground"
      )}
    >
      <Icon aria-hidden className="size-3" />
      {meta.label}
      {leave.portion !== "full" &&
        ` · ${PORTION_LABEL[leave.portion].toLowerCase()}`}
    </span>
  )
}

/** Plain-language summary, also used as the day's accessible name. */
export function describeDay({
  day,
  leave,
  worked,
  credit,
}: {
  day: Date
  leave: LeaveDay | undefined
  worked: number
  credit: number
}) {
  const lines: string[] = []
  if (leave) {
    const meta = LEAVE_TYPES[leave.type]
    const name = leave.name ?? meta.label
    lines.push(
      meta.absence
        ? `${name}, ${PORTION_LABEL[leave.portion].toLowerCase()}`
        : name
    )
  }
  if (worked > 0) lines.push(`${formatMinutes(worked)} logged`)
  if (leave && LEAVE_TYPES[leave.type].absence && credit > 0)
    lines.push(`leave covers ${formatMinutes(credit)}`)
  if (!leave && worked === 0) lines.push("no time logged")
  return `${format(day, "EEEE d MMMM")}: ${lines.join(", ")}`
}

/** One line of the breakdown: a dot that matches the bar, a label, a time. */
function BreakdownRow({
  dot,
  label,
  value,
  muted,
}: {
  dot: React.ReactNode
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      {dot}
      <dt className={cn("flex-1", muted && "text-muted-foreground")}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

const LOGGED_DOT = (
  <span aria-hidden className="size-2 shrink-0 rounded-full bg-primary" />
)
const LEAVE_DOT = (
  <span aria-hidden className={cn("size-2 shrink-0 rounded-full", LEAVE_BAR)} />
)

/**
 * Hover / tap / keyboard content for one day in the weekly goals.
 *
 *   Wednesday 18 Nov                        7h 30m / 7h 30m
 *   [icon] Sick leave
 *          Full day
 *   ● Logged                          2h 55m
 *   ● Leave covers                    4h 35m
 *
 * The dots reuse the bar's colours, so the tooltip reads as a legend for the
 * bar above it: blue is time worked, teal is leave.
 */
export function DayDetails({
  day,
  leave,
  worked,
  credit,
  dayGoal,
}: {
  day: Date
  leave: LeaveDay | undefined
  worked: number
  credit: number
  dayGoal: number
}) {
  const meta = leave ? LEAVE_TYPES[leave.type] : undefined
  const Icon = meta?.icon
  const absence = !!meta?.absence
  const counted = worked + (absence ? credit : 0)

  return (
    <div className="flex flex-col gap-3 text-xs">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium">{format(day, "EEEE d MMM")}</span>
        <span className="text-muted-foreground tabular-nums">
          {formatMinutes(counted)} / {formatMinutes(dayGoal)}
        </span>
      </div>

      {leave && meta && Icon && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-md p-3",
            absence ? TONE.tile : "bg-muted"
          )}
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              absence ? TONE.chip : "bg-background"
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                "size-4",
                absence ? LEAVE_TEXT : "text-muted-foreground"
              )}
            />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-medium">
              {leave.name ?? meta.label}
            </span>
            <span className="text-muted-foreground">
              {absence
                ? PORTION_LABEL[leave.portion]
                : "Time is logged as usual."}
            </span>
          </div>
        </div>
      )}

      {(worked > 0 || (absence && credit > 0) || !leave) && (
        <dl className="flex flex-col gap-2">
          {(worked > 0 || !leave) && (
            <BreakdownRow
              dot={LOGGED_DOT}
              label="Logged"
              value={worked > 0 ? formatMinutes(worked) : "Nothing yet"}
              muted={worked === 0}
            />
          )}
          {absence && credit > 0 && (
            <BreakdownRow
              dot={LEAVE_DOT}
              label="Leave covers"
              value={formatMinutes(credit)}
            />
          )}
        </dl>
      )}

      {absence && credit > 0 && isWorkedOnLeave(leave, worked, dayGoal) && (
        <p className="text-muted-foreground">
          You worked on leave, so leave only covers the time still missing.
        </p>
      )}
    </div>
  )
}

/**
 * Tooltip for one bar when the goals cover more than a week (a week of the
 * month, or a month of the year): the same dots, summed over its days.
 */
export function SegmentDetails({
  title,
  subtitle,
  worked,
  credit,
  goal,
}: {
  title: string
  subtitle?: string
  worked: number
  credit: number
  goal: number
}) {
  return (
    <div className="flex flex-col gap-3 text-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-muted-foreground tabular-nums">
            {formatMinutes(worked + credit)} / {formatMinutes(goal)}
          </span>
        </div>
        {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
      </div>
      <dl className="flex flex-col gap-2">
        <BreakdownRow
          dot={LOGGED_DOT}
          label="Logged"
          value={worked > 0 ? formatMinutes(worked) : "Nothing yet"}
          muted={worked === 0}
        />
        {credit > 0 && (
          <BreakdownRow
            dot={LEAVE_DOT}
            label="Leave covers"
            value={formatMinutes(credit)}
          />
        )}
      </dl>
    </div>
  )
}
