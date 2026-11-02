import {
  CalendarDays,
  ChartNoAxesCombined,
  FileChartColumn,
  Timer,
  type LucideIcon,
} from "lucide-react"

export const TRACKER_HOME = "/apps/timetracker"

export type TrackerNavItem = {
  /** Sidebar label. */
  label: string
  /** Heading shown in the top bar. */
  title: string
  href: string
  icon: LucideIcon
  /** Fixed-width digits, so a ticking label doesn't jiggle. */
  tabular?: boolean
}

export type TrackerNavGroup = {
  label: string
  items: TrackerNavItem[]
}

/** Shown on the timer item until the real running timer is wired in. */
export const IDLE_TIMER = "00:00:00"

export const TRACKER_NAV: TrackerNavGroup[] = [
  {
    label: "Track",
    items: [
      {
        label: IDLE_TIMER,
        title: "Time tracker",
        href: TRACKER_HOME,
        icon: Timer,
        tabular: true,
      },
      {
        label: "Time sheet",
        title: "Time sheet",
        href: `${TRACKER_HOME}/timesheet`,
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Menu",
    items: [
      {
        label: "Reports",
        title: "Reports",
        href: `${TRACKER_HOME}/reports`,
        icon: FileChartColumn,
      },
      {
        label: "Analytics",
        title: "Analytics",
        href: `${TRACKER_HOME}/analytics`,
        icon: ChartNoAxesCombined,
      },
    ],
  },
]

const normalize = (path: string) => path.replace(/\/+$/, "") || "/"

export function findNavItem(path: string) {
  const current = normalize(path)
  return TRACKER_NAV.flatMap((g) => g.items).find((i) => i.href === current)
}
