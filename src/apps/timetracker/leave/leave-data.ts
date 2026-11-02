import {
  Baby,
  Droplet,
  Flower2,
  House,
  PartyPopper,
  Thermometer,
  TreePalm,
  type LucideIcon,
} from "lucide-react"
import { format, isSameDay } from "date-fns"

/**
 * Leave, as it will arrive from the leave management system. Until that is
 * connected, `LEAVE_DAYS` is demo data in the same shape the integration
 * should return: one row per employee per day.
 *
 * Needed from the leave system (per employee, per date range):
 *   date, type, portion ("full" | "am" | "pm"), status ("approved" | "pending")
 * plus a name for public holidays.
 */

export type LeaveType =
  | "vacation"
  | "sick"
  | "period"
  | "paternity"
  | "bereavement"
  | "maternity"
  | "wfh"
  | "holiday"

export type LeaveStatus = "approved" | "pending"
export type LeavePortion = "full" | "am" | "pm"

export type LeaveDay = {
  date: Date
  type: LeaveType
  status: LeaveStatus
  portion: LeavePortion
  /** Shown for public holidays, e.g. "Constitution Day". */
  name?: string
}

export const LEAVE_TYPES: Record<
  LeaveType,
  {
    label: string
    icon: LucideIcon
    /** Work from home is not an absence: the person still logs time. */
    absence: boolean
  }
> = {
  vacation: { label: "Vacation", icon: TreePalm, absence: true },
  sick: { label: "Sick leave", icon: Thermometer, absence: true },
  period: { label: "Period leave", icon: Droplet, absence: true },
  paternity: { label: "Paternity leave", icon: Baby, absence: true },
  bereavement: { label: "Bereavement leave", icon: Flower2, absence: true },
  maternity: { label: "Maternity leave", icon: Baby, absence: true },
  wfh: { label: "Work from home", icon: House, absence: false },
  holiday: { label: "Public holiday", icon: PartyPopper, absence: true },
}

export const PORTION_LABEL: Record<LeavePortion, string> = {
  full: "Full day",
  am: "Morning",
  pm: "Afternoon",
}

const d = (day: number) => new Date(2026, 10, day) // November 2026

// Demo: one employee's November. Covers every state the UI has to show.
export const LEAVE_DAYS: LeaveDay[] = [
  { date: d(3), type: "period", status: "approved", portion: "full" },
  { date: d(5), type: "bereavement", status: "approved", portion: "full" },
  {
    date: d(11),
    type: "holiday",
    status: "approved",
    portion: "full",
    name: "Public holiday",
  },
  { date: d(16), type: "vacation", status: "approved", portion: "full" },
  // Sick, but pulled in for an emergency deadline: see DEMO_WORKED_ON_LEAVE.
  { date: d(18), type: "sick", status: "approved", portion: "full" },
  { date: d(19), type: "wfh", status: "approved", portion: "full" },
  { date: d(20), type: "vacation", status: "approved", portion: "pm" },
  // A request still waiting: kept here to show it is NOT displayed anywhere.
  { date: d(13), type: "vacation", status: "pending", portion: "full" },
]

/**
 * Demo only: days where the person logged time on a full day of leave. With
 * real data this is simply "entries exist on a leave day", so nothing needs to
 * be stored for it.
 */
const DEMO_WORKED_ON_LEAVE = [d(18)]
export const workedOnLeaveDemo = (date: Date) =>
  DEMO_WORKED_ON_LEAVE.some((x) => isSameDay(x, date))

/**
 * The leave on a day. Only approved leave is returned: pending requests are
 * kept in the data but never shown, since they are not confirmed.
 */
export function getLeave(date: Date) {
  return LEAVE_DAYS.find(
    (l) => isSameDay(l.date, date) && l.status === "approved"
  )
}

/** Minutes of the day the leave covers, before any work is taken off it. */
export function leaveMinutes(leave: LeaveDay, dayGoalMinutes: number) {
  if (!LEAVE_TYPES[leave.type].absence) return 0
  return leave.portion === "full" ? dayGoalMinutes : dayGoalMinutes / 2
}

/**
 * How much of the daily goal leave covers once the person has also worked.
 *
 * Working on a day of leave is common (emergencies, deadlines). Rule used here:
 * time worked comes first, and leave only covers what is still missing from the
 * day, so a day never counts for more than its goal.
 *   Sick all day, worked 2h  -> leave covers 5h 30m
 *   Half-day off, worked 5h  -> leave covers the last 2h 30m
 *   Worked a full day        -> leave covers nothing
 * Whether the leave balance should be given back for that time is a decision
 * for the leave system, not something this screen can settle.
 */
export function leaveCredit(
  leave: LeaveDay | undefined,
  workedMinutes: number,
  dayGoalMinutes: number
) {
  if (!leave) return 0
  const covered = leaveMinutes(leave, dayGoalMinutes)
  return Math.max(0, Math.min(covered, dayGoalMinutes - workedMinutes))
}

/**
 * True when time was logged during the part of the day leave is meant to cover.
 * Working the other half of a half day is normal and does not count.
 */
export function isWorkedOnLeave(
  leave: LeaveDay | undefined,
  workedMinutes: number,
  dayGoalMinutes: number
) {
  if (!leave || !LEAVE_TYPES[leave.type].absence) return false
  const normalWork = leave.portion === "full" ? 0 : dayGoalMinutes / 2
  return workedMinutes > normalWork
}

/** A working day nobody is expected to log: approved full-day absence, nothing worked. */
export function isNonWorkingDay(date: Date) {
  const leave = getLeave(date)
  return (
    !!leave &&
    LEAVE_TYPES[leave.type].absence &&
    leave.portion === "full" &&
    leave.status === "approved" &&
    !workedOnLeaveDemo(date)
  )
}

export const leaveDayLabel = (date: Date) => format(date, "EEEE d MMM")
