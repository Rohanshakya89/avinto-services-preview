import * as React from "react"

import { Logo } from "@/components/logo"

/**
 * Everything that appears on the /apps hub. To add a tool: add one entry here
 * (and a route for its `href` in App.tsx). The hub card shows up by itself.
 */
export type AppInfo = {
  slug: string
  name: string
  description: string
  href: string
  /** Shown as a small label on the card. */
  audience: "Public" | "Internal"
  /** Brand mark shown on the card's visual panel. */
  logo: () => React.ReactNode
}

export const APPS: AppInfo[] = [
  {
    slug: "website",
    name: "Avinto website",
    description:
      "Our public site: services, approach and how we work with clients.",
    href: "/services/design",
    audience: "Public",
    logo: () => <Logo className="h-9 w-auto text-foreground" />,
  },
  {
    slug: "timetracker",
    name: "Avinto Time",
    description:
      "Track your hours, review your timesheet and see how your week is going.",
    href: "/apps/timetracker",
    audience: "Internal",
    logo: () => (
      <img
        src="/Logo/Logo black.svg"
        alt=""
        className="h-9 w-auto"
        draggable={false}
      />
    ),
  },
]

/** The app chooser is the home page. Each app lives under /apps/<name>. */
export const APPS_HOME = "/"
const APPS_PREFIX = "/apps"

/** True for the home page (the chooser) and everything under /apps. */
export function isAppsPath(path: string) {
  return (
    path === APPS_HOME ||
    path === APPS_PREFIX ||
    path.startsWith(`${APPS_PREFIX}/`)
  )
}
