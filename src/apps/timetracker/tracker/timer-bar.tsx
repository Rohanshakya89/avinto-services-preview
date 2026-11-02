import type * as React from "react"
import { ListChecks, Megaphone, X } from "lucide-react"

import { cn } from "cn"
import { ProjectPicker } from "./project-picker"
import { TagPicker } from "./tag-picker"
import { startTimer, stopTimer, useTimer } from "./use-timer"

/** Company notice. Dismissing it only hides it for this visit. */
export function NoticeBanner({
  children,
  onDismiss,
}: {
  children: React.ReactNode
  onDismiss: () => void
}) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl border border-border bg-card py-3 pr-3 pl-4"
    >
      <Megaphone aria-hidden className="size-4 shrink-0 text-primary" />
      <p className="min-w-0 flex-1 text-sm">{children}</p>
      <button
        type="button"
        aria-label="Dismiss notice"
        onClick={onDismiss}
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

/**
 * The one control that matters most: what are you working on, for which
 * project, with which tags, and the clock with its start/stop button.
 */
export function TimerBar({
  description,
  onDescriptionChange,
  projectId,
  onProjectChange,
  tagIds,
  onTagsChange,
}: {
  description: string
  onDescriptionChange: (value: string) => void
  projectId: string | null
  onProjectChange: (projectId: string | null) => void
  tagIds: string[]
  onTagsChange: (tagIds: string[]) => void
}) {
  const timer = useTimer()

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 lg:flex-nowrap">
      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="What are you working on?"
        aria-label="What are you working on?"
        className="h-10 min-w-0 basis-full rounded-md bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 lg:basis-auto lg:flex-1"
      />
      <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />
      <ProjectPicker value={projectId} onChange={onProjectChange} />
      <TagPicker value={tagIds} onChange={onTagsChange} />
      <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />
      <span
        role="timer"
        aria-label="Elapsed time"
        className="ml-auto min-w-24 text-center text-xl font-semibold tabular-nums lg:ml-0"
      >
        {timer.display}
      </span>
      <button
        type="button"
        onClick={timer.running ? stopTimer : startTimer}
        className={cn(
          "h-10 w-24 shrink-0 rounded-md text-sm font-semibold tracking-wide text-white transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          timer.running
            ? "bg-red-400 hover:bg-red-500"
            : "bg-primary hover:bg-[color-mix(in_oklch,var(--primary),black_8%)]"
        )}
      >
        {timer.running ? "STOP" : "START"}
      </button>
      <button
        type="button"
        aria-label="Add time manually"
        disabled={timer.running}
        title={timer.running ? "Stop the timer to add time manually" : undefined}
        className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <ListChecks className="size-4" />
      </button>
    </div>
  )
}
