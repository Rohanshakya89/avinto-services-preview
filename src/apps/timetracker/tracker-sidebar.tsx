import { ChevronDown } from "lucide-react"

import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { APPS } from "@/lib/apps"
import { Link, navigate, usePath } from "@/lib/router"
import { findNavItem, TRACKER_NAV } from "./nav"
import { useTimer } from "./tracker/use-timer"

/** Logo + app switcher: jump to another Avinto app without going back first. */
function AppSwitcher({ dark }: { dark: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch app"
        className="flex h-10 items-center gap-2 rounded-lg px-3 transition-colors duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <img
          src={dark ? "/Logo/Logo white.svg" : "/Logo/Logo black.svg"}
          alt="Avinto Time"
          className="h-6 w-auto"
          draggable={false}
        />
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Avinto apps</DropdownMenuLabel>
          {APPS.map((app) => (
            <DropdownMenuItem key={app.slug} onClick={() => navigate(app.href)}>
              {app.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Sidebar content, shared by the desktop rail and the mobile sheet. */
export function TrackerSidebar({
  dark,
  onNavigate,
}: {
  dark: boolean
  onNavigate?: () => void
}) {
  const active = findNavItem(usePath())
  const timer = useTimer()

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <AppSwitcher dark={dark} />
      </div>

      <nav aria-label="Time tracker" className="flex flex-col gap-6 p-4">
        {TRACKER_NAV.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="flex h-8 items-center px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {group.label}
            </span>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = active?.href === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span
                    className={cn("truncate", item.tabular && "tabular-nums")}
                  >
                    {/* The timer item shows the live clock. */}
                    {item.tabular ? timer.display : item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </div>
  )
}
