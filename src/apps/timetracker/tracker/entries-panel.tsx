import * as React from "react"
import {
  eachDayOfInterval,
  format,
  isSameDay,
  isWeekend,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns"
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
} from "lucide-react"

import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getToday } from "../analytics/analytics-data"
import { SectionPanel } from "../analytics/section-panel"
import {
  getLeave,
  isWorkedOnLeave,
  LEAVE_TYPES,
  leaveCredit,
  type LeaveDay,
} from "../leave/leave-data"
import {
  DayDetails,
  describeDay,
  LEAVE_BAR,
  LEAVE_TEXT,
  LeaveChip,
  LeaveIcon,
  SegmentDetails,
} from "../leave/leave-ui"
import { ENTRY_GRID, EntryRow } from "./entry-row"
import {
  DAY_GOAL_MINUTES,
  type Entry,
  formatMinutes,
  getRangeBounds,
  minutes,
  RANGE_KINDS,
  type Range,
  rangeLabel,
} from "./tracker-data"

const STEP_BUTTON =
  "flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"

function RangeMenu({
  range,
  onChange,
}: {
  range: Range
  onChange: (range: Range) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Previous ${range.kind}`}
        onClick={() => onChange({ ...range, offset: range.offset - 1 })}
        className={STEP_BUTTON}
      >
        <ChevronLeft className="size-5" />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 min-w-40 items-center justify-between gap-3 rounded-md border border-border bg-card px-4 text-sm font-medium transition-colors duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          {rangeLabel(range)}
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Range</DropdownMenuLabel>
            {RANGE_KINDS.map(({ kind, label }) => (
              <DropdownMenuItem
                key={kind}
                onClick={() => onChange({ kind, offset: 0 })}
                className="justify-between"
              >
                {label}
                {range.kind === kind && range.offset === 0 && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Custom</DropdownMenuLabel>
            <DropdownMenuItem disabled>Custom date…</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        type="button"
        aria-label={`Next ${range.kind}`}
        disabled={range.offset >= 0}
        onClick={() => onChange({ ...range, offset: range.offset + 1 })}
        className={STEP_BUTTON}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}

const sumMinutes = (list: Entry[]) => list.reduce((s, e) => s + minutes(e), 0)

/* --------------------------------- Goals ---------------------------------- */

const GOAL_NAME: Record<Range["kind"], string> = {
  week: "Weekly",
  month: "Monthly",
  quarter: "Quarterly",
  year: "Yearly",
}

type Segment = {
  key: string
  label: string
  title: string
  /** Second line of the tooltip: what dates and how many working days it covers. */
  subtitle: string
  days: Date[]
}

const workingDays = (n: number) => `${n} working ${n === 1 ? "day" : "days"}`

/**
 * What one bar stands for: a day in a week, a week in a month, a month in a
 * quarter or year. Weekends are left out, like everywhere else.
 */
function buildSegments(range: Range): Segment[] {
  const { start, end } = getRangeBounds(range)
  const workdays = eachDayOfInterval({ start, end }).filter(
    (d) => !isWeekend(d)
  )

  if (range.kind === "week") {
    return workdays.map((day) => ({
      key: day.toISOString(),
      label: format(day, "EEE"),
      title: format(day, "EEEE d MMM"),
      subtitle: "",
      days: [day],
    }))
  }

  const groupKey = (d: Date) =>
    range.kind === "month"
      ? startOfWeek(d, { weekStartsOn: 1 }).getTime()
      : startOfMonth(d).getTime()

  const groups = new Map<number, Date[]>()
  for (const day of workdays) {
    const k = groupKey(day)
    groups.set(k, [...(groups.get(k) ?? []), day])
  }

  return [...groups.entries()].map(([k, days]) => {
    const first = days[0]
    const last = days[days.length - 1]
    return range.kind === "month"
      ? {
          key: String(k),
          label: format(first, "d MMM"),
          title: `Week of ${format(first, "d MMM")}`,
          subtitle: `${
            isSameDay(first, last)
              ? format(first, "d MMM")
              : `${format(first, "d MMM")} – ${format(last, "d MMM")}`
          } · ${workingDays(days.length)}`,
          days,
        }
      : {
          key: String(k),
          label: format(first, "MMM"),
          title: format(first, "MMMM yyyy"),
          subtitle: workingDays(days.length),
          days,
        }
  })
}

/**
 * Progress against the goal for the chosen range. Time worked fills from the
 * left in the brand colour; approved leave covers what is still missing in
 * teal. Hover, tap or focus a bar for the details.
 */
function GoalsRow({ entries, range }: { entries: Entry[]; range: Range }) {
  const isWeek = range.kind === "week"

  const workedByDay = new Map<number, number>()
  for (const e of entries) {
    const k = e.date.getTime()
    workedByDay.set(k, (workedByDay.get(k) ?? 0) + minutes(e))
  }

  const segments = buildSegments(range).map((seg) => {
    let worked = 0
    let credit = 0
    for (const day of seg.days) {
      const w = workedByDay.get(day.getTime()) ?? 0
      worked += w
      credit += leaveCredit(getLeave(day), w, DAY_GOAL_MINUTES)
    }
    return { ...seg, worked, credit, goal: seg.days.length * DAY_GOAL_MINUTES }
  })

  const worked = segments.reduce((s, x) => s + x.worked, 0)
  const leave = segments.reduce((s, x) => s + x.credit, 0)
  const goal = segments.reduce((s, x) => s + x.goal, 0)
  const counted = worked + leave
  const anyWorkedOnLeave = segments.some((seg) =>
    seg.days.some((day) =>
      isWorkedOnLeave(
        getLeave(day),
        workedByDay.get(day.getTime()) ?? 0,
        DAY_GOAL_MINUTES
      )
    )
  )

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
      <div className="flex shrink-0 flex-col md:w-32">
        <span className="text-sm text-muted-foreground">
          {GOAL_NAME[range.kind]} goals
        </span>
        <span className="text-sm">{rangeLabel(range)}</span>
      </div>

      <ul
        className={cn(
          "grid min-w-0 flex-1",
          segments.length > 8 ? "gap-1" : "gap-2"
        )}
        style={{
          gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))`,
        }}
        aria-label="Time logged against the goal"
      >
        {segments.map((seg) => {
          const day = isWeek ? seg.days[0] : undefined
          const dayLeave = day ? getLeave(day) : undefined
          const workedFill = Math.min(1, seg.worked / seg.goal)
          const leaveFill = Math.min(1 - workedFill, seg.credit / seg.goal)

          return (
            <li key={seg.key} className="min-w-0">
              <Popover>
                <PopoverTrigger
                  openOnHover
                  delay={150}
                  aria-label={
                    day
                      ? describeDay({
                          day,
                          leave: dayLeave,
                          worked: seg.worked,
                          credit: seg.credit,
                        })
                      : `${seg.title}: ${formatMinutes(seg.worked)} logged` +
                        (seg.credit > 0
                          ? `, leave covers ${formatMinutes(seg.credit)}`
                          : "")
                  }
                  className="flex w-full flex-col gap-2 rounded-md text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <span
                      className="h-full bg-primary"
                      style={{ width: `${workedFill * 100}%` }}
                    />
                    {leaveFill > 0 && (
                      <span
                        className={cn("h-full", LEAVE_BAR)}
                        style={{ width: `${leaveFill * 100}%` }}
                      />
                    )}
                  </span>
                  <span className="flex min-h-5 items-center gap-2 text-xs text-muted-foreground">
                    {seg.label}
                    {dayLeave && <LeaveIcon leave={dayLeave} />}
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  className="w-72 gap-0 p-3"
                >
                  {day ? (
                    <DayDetails
                      day={day}
                      leave={dayLeave}
                      worked={seg.worked}
                      credit={seg.credit}
                      dayGoal={DAY_GOAL_MINUTES}
                    />
                  ) : (
                    <SegmentDetails
                      title={seg.title}
                      subtitle={seg.subtitle}
                      worked={seg.worked}
                      credit={seg.credit}
                      goal={seg.goal}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </li>
          )
        })}
      </ul>

      <div className="flex shrink-0 flex-col md:items-end">
        <span className="text-sm text-muted-foreground">Logged</span>
        <span className="flex items-center gap-1 text-sm whitespace-nowrap tabular-nums">
          <span className="font-semibold">{formatMinutes(counted)}</span>
          <span className="text-muted-foreground">
            / {formatMinutes(goal)}
          </span>
          <Popover>
            <PopoverTrigger
              openOnHover
              delay={150}
              aria-label="How this total is calculated"
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <CircleHelp className="size-4" />
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              className="w-72 gap-3 p-3 text-xs"
            >
              <span className="text-sm font-medium">How this is counted</span>
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 tabular-nums">
                <dt className="text-muted-foreground">Time logged</dt>
                <dd className="text-right">{formatMinutes(worked)}</dd>
                {leave > 0 && (
                  <>
                    <dt className="text-muted-foreground">Approved leave</dt>
                    <dd className={cn("text-right", LEAVE_TEXT)}>
                      + {formatMinutes(leave)}
                    </dd>
                  </>
                )}
                <dt className="border-t border-border pt-2 font-medium">
                  Counted
                </dt>
                <dd className="border-t border-border pt-2 text-right font-medium">
                  {formatMinutes(counted)}
                </dd>
                <dt className="text-muted-foreground">
                  {GOAL_NAME[range.kind]} goal
                </dt>
                <dd className="text-right">{formatMinutes(goal)}</dd>
              </dl>
              {anyWorkedOnLeave && (
                <span className="text-muted-foreground">
                  On a day you worked during leave, leave only covers the time
                  still missing, so a day never counts for more than{" "}
                  {formatMinutes(DAY_GOAL_MINUTES)}.
                </span>
              )}
            </PopoverContent>
          </Popover>
        </span>
      </div>
    </div>
  )
}

/* ------------------------------- Day cards -------------------------------- */

function dayName(day: Date) {
  const today = startOfDay(getToday())
  if (isSameDay(day, today)) return "Today"
  if (isSameDay(day, subDays(today, 1))) return "Yesterday"
  return format(day, "EEEE")
}

function DayGroup({
  day,
  entries,
  leave,
  update,
  onResume,
  onDuplicate,
  onDelete,
}: {
  day: Date
  entries: Entry[]
  leave: LeaveDay | undefined
  update: (id: string, patch: Partial<Entry>) => void
  onResume: (entry: Entry) => void
  onDuplicate: (entry: Entry) => void
  onDelete: (id: string) => void
}) {
  const total = sumMinutes(entries)
  const credit = leaveCredit(leave, total, DAY_GOAL_MINUTES)

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-muted/40 px-5 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-sm font-semibold">{dayName(day)}</h3>
          <span className="text-xs text-muted-foreground">
            {format(day, "MMM d, yyyy")}
          </span>
          {entries.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          )}
          {leave && <LeaveChip leave={leave} />}
        </div>
        <span className="text-sm text-muted-foreground">
          {entries.length > 0 ? (
            <>
              Total{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {formatMinutes(total)}
              </span>
            </>
          ) : (
            <>
              Counts as{" "}
              <span className={cn("font-semibold tabular-nums", LEAVE_TEXT)}>
                {formatMinutes(credit)}
              </span>
            </>
          )}
        </span>
      </header>

      {entries.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted-foreground">
          No time logged.{" "}
          {leave?.name ?? (leave && LEAVE_TYPES[leave.type].label)} covers this
          day.
        </p>
      ) : (
        <>
          <div
            aria-hidden
            className={cn(
              "hidden h-10 items-center gap-x-4 border-b border-border px-5 text-xs tracking-wider text-muted-foreground uppercase md:grid",
              ENTRY_GRID
            )}
          >
            <span>Task</span>
            <span>Tags</span>
            <span>Time</span>
            <span>Duration</span>
            <span />
          </div>

          <ul className="divide-y divide-border">
            {entries.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onChange={(patch) => update(entry.id, patch)}
                onResume={() => onResume(entry)}
                onDuplicate={() => onDuplicate(entry)}
                onDelete={() => onDelete(entry.id)}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

const DAYS_PER_PAGE = 10

/** A long range (a quarter, a year) would be hundreds of cards: show ten at a time. */
function DayList({
  days,
  renderDay,
}: {
  days: Date[]
  renderDay: (day: Date) => React.ReactNode
}) {
  const [visible, setVisible] = React.useState(DAYS_PER_PAGE)
  const left = days.length - visible

  return (
    <>
      {days.slice(0, visible).map((day) => (
        <React.Fragment key={day.getTime()}>{renderDay(day)}</React.Fragment>
      ))}
      {left > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + DAYS_PER_PAGE)}
          className="h-10 w-fit self-center rounded-md px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Show {Math.min(left, DAYS_PER_PAGE)} more days ({left} left)
        </button>
      )}
    </>
  )
}

/** Summary and goals in one card, then one card per day below it, newest first. */
export function EntriesPanel({
  entries,
  range,
  onRangeChange,
  update,
  onResume,
  onDuplicate,
  onDelete,
}: {
  entries: Entry[]
  range: Range
  onRangeChange: (range: Range) => void
  update: (id: string, patch: Partial<Entry>) => void
  onResume: (entry: Entry) => void
  onDuplicate: (entry: Entry) => void
  onDelete: (id: string) => void
}) {
  const { start, end } = getRangeBounds(range)
  const today = startOfDay(getToday())
  const inRange = entries.filter((e) => e.date >= start && e.date <= end)
  const total = sumMinutes(inRange)

  // A day appears if time was logged on it, or if approved leave covers it (so
  // a day off does not silently vanish). Work from home is not a day off.
  const leaveOnlyDays = eachDayOfInterval({ start, end })
    .filter((d) => d <= today && !isWeekend(d))
    .filter((d) => {
      const l = getLeave(d)
      return l && LEAVE_TYPES[l.type].absence
    })
  const days = [
    ...new Set([
      ...inRange.map((e) => e.date.getTime()),
      ...leaveOnlyDays.map((d) => d.getTime()),
    ]),
  ]
    .sort((a, b) => b - a)
    .map((t) => new Date(t))

  return (
    <>
      <SectionPanel
        id="entries-title"
        title="Time entries"
        description={`${range.kind[0].toUpperCase()}${range.kind.slice(1)}: ${formatMinutes(total)} logged`}
        actions={<RangeMenu range={range} onChange={onRangeChange} />}
      >
        <GoalsRow entries={inRange} range={range} />
      </SectionPanel>

      {days.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No time logged in this period.
        </p>
      ) : (
        <DayList
          // Start from the newest ten whenever the range changes.
          key={`${range.kind}${range.offset}`}
          days={days}
          renderDay={(day) => (
            <DayGroup
              day={day}
              leave={getLeave(day)}
              entries={inRange
                .filter((e) => isSameDay(e.date, day))
                .sort((a, b) => b.start - a.start)}
              update={update}
              onResume={onResume}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          )}
        />
      )}
    </>
  )
}
