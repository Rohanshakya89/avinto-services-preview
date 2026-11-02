import * as React from "react"
import { ChevronLeft, Menu, Moon, Sun } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { APPS_HOME } from "@/lib/apps"
import { navigate, usePath } from "@/lib/router"
import { findNavItem } from "./nav"
import { TrackerSidebar } from "./tracker-sidebar"
import { useTrackerTheme } from "./use-tracker-theme"

const ICON_BUTTON =
  "flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

function TopBar({
  title,
  dark,
  onToggleTheme,
  menu,
}: {
  title: string
  dark: boolean
  onToggleTheme: () => void
  menu: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
      {menu}
      <button
        type="button"
        aria-label="Back to apps"
        onClick={() => navigate(APPS_HOME)}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors duration-150 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ChevronLeft className="size-5" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-base font-medium tracking-normal">
        {title}
      </h1>
      <button
        type="button"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={onToggleTheme}
        className={ICON_BUTTON}
      >
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </button>
      <Avatar className="size-10">
        <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
          RS
        </AvatarFallback>
      </Avatar>
    </header>
  )
}

/** Side bar + top bar around every Avinto Time page. */
export function TrackerShell({ children }: { children: React.ReactNode }) {
  const path = usePath()
  const { theme, toggle } = useTrackerTheme()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const dark = theme === "dark"
  const title = findNavItem(path)?.title ?? "Time tracker"

  React.useEffect(() => {
    document.title = `${title} · Avinto Time`
  }, [title])

  return (
    <div className="flex min-h-svh bg-(--tt-canvas,var(--muted))">
      <aside className="sticky top-0 hidden h-svh w-56 shrink-0 border-r border-border md:block">
        <TrackerSidebar dark={dark} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          dark={dark}
          onToggleTheme={toggle}
          menu={
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className={`${ICON_BUTTON} md:hidden`}
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                showCloseButton={false}
                className="gap-0 p-0 data-[side=left]:w-56 data-[side=left]:sm:max-w-56"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Avinto Time navigation
                </SheetDescription>
                <TrackerSidebar
                  dark={dark}
                  onNavigate={() => setMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          }
        />
        {/* Keyed by path: the content eases in on every page change while the
            sidebar and top bar stay put. */}
        <main key={path} className="animate-page-in flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
