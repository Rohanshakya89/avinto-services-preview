import * as React from "react"
import { Pin, Plus } from "lucide-react"

import { cn } from "cn"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getProject, PROJECTS } from "./tracker-data"

export function ProjectDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  )
}

/**
 * Searchable project list. `bar` is the "+ Project" button in the timer bar;
 * `chip` is the small project label on an entry row. Pins float a project to
 * the top of the list.
 */
export function ProjectPicker({
  value,
  onChange,
  variant = "bar",
}: {
  value: string | null
  onChange: (projectId: string | null) => void
  variant?: "bar" | "chip"
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [pinned, setPinned] = React.useState<string[]>([])
  const project = value ? getProject(value) : undefined

  const list = PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  ).sort(
    (a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id))
  )

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger
        aria-label={project ? `Project: ${project.name}` : "Choose a project"}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-md text-sm transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          variant === "bar"
            ? project
              ? "h-10 max-w-48 bg-muted px-3 text-foreground hover:bg-accent"
              : "h-10 border border-amber-500/50 bg-amber-500/5 px-3 font-medium text-amber-700 hover:bg-amber-500/10 tt-dark:text-amber-300"
            : "h-6 bg-primary/10 px-2 text-xs text-primary hover:bg-primary/15"
        )}
      >
        {project ? (
          <>
            <ProjectDot color={project.color} />
            <span className="truncate">{project.name}</span>
          </>
        ) : (
          <>
            <Plus className="size-4" />
            Project
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 gap-2 p-2">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find project..."
          aria-label="Find project"
          className="h-10 w-full rounded-md bg-muted px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <ul role="listbox" className="flex max-h-64 flex-col overflow-y-auto">
          {list.length === 0 && (
            <li className="px-3 py-4 text-center text-sm text-muted-foreground">
              No project matches "{query}".
            </li>
          )}
          {list.map((p) => {
            const isPinned = pinned.includes(p.id)
            return (
              <li key={p.id} role="option" aria-selected={p.id === value}>
                <div className="flex h-10 items-center gap-1 rounded-md hover:bg-muted">
                  <button
                    type="button"
                    onClick={() => {
                      onChange(p.id === value ? null : p.id)
                      setOpen(false)
                    }}
                    className="flex h-full min-w-0 flex-1 items-center gap-3 rounded-md px-2 text-left text-sm outline-none focus-visible:bg-muted"
                  >
                    <ProjectDot color={p.color} />
                    <span
                      className={cn(
                        "truncate",
                        p.id === value && "font-medium text-primary"
                      )}
                    >
                      {p.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={isPinned ? `Unpin ${p.name}` : `Pin ${p.name}`}
                    aria-pressed={isPinned}
                    onClick={() =>
                      setPinned((cur) =>
                        isPinned ? cur.filter((id) => id !== p.id) : [...cur, p.id]
                      )
                    }
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      isPinned ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Pin
                      className={cn("size-4", isPinned && "fill-current")}
                    />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
