import * as React from "react"
import { Calendar as CalendarIcon, EllipsisVertical, Play } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ProjectPicker } from "./project-picker"
import { TagPicker } from "./tag-picker"
import {
  type Entry,
  formatEntryDuration,
  formatTimeOfDay,
  minutes,
} from "./tracker-data"

/** Shared by the column header and every row, so the columns line up. */
export const ENTRY_GRID =
  "md:grid-cols-[minmax(0,1fr)_96px_128px_104px_80px]"

const ICON_BUTTON =
  "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

export function EntryRow({
  entry,
  onChange,
  onResume,
  onDuplicate,
  onDelete,
}: {
  entry: Entry
  onChange: (patch: Partial<Entry>) => void
  onResume: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [dateOpen, setDateOpen] = React.useState(false)

  return (
    <li
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors duration-150 hover:bg-muted/40 ${ENTRY_GRID}`}
    >
      <div className="col-start-1 row-start-1 flex min-w-0 flex-col items-start gap-2">
        <span className="max-w-full truncate text-sm font-medium">
          {entry.task}
        </span>
        <ProjectPicker
          variant="chip"
          value={entry.projectId}
          onChange={(projectId) => projectId && onChange({ projectId })}
        />
      </div>

      {/* Phones: this row sits under the task. md and up: its three cells join the grid. */}
      <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
        <div className="flex items-center gap-2">
          <TagPicker
            size="sm"
            value={entry.tagIds}
            onChange={(tagIds) => onChange({ tagIds })}
          />
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger aria-label="Change date" className={ICON_BUTTON}>
              <CalendarIcon className="size-4" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
              <Calendar
                mode="single"
                selected={entry.date}
                defaultMonth={entry.date}
                onSelect={(date) => {
                  if (date) {
                    onChange({ date })
                    setDateOpen(false)
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <span className="text-sm tabular-nums">
          {formatTimeOfDay(entry.start)} - {formatTimeOfDay(entry.end)}
        </span>
        <span className="text-sm font-medium tabular-nums">
          {formatEntryDuration(minutes(entry))}
        </span>
      </div>

      <div className="col-start-2 row-start-1 flex items-center justify-end gap-1 md:col-start-5">
        <button
          type="button"
          aria-label={`Start a timer for ${entry.task}`}
          onClick={onResume}
          className={ICON_BUTTON}
        >
          <Play className="size-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`More actions for ${entry.task}`}
            className={ICON_BUTTON}
          >
            <EllipsisVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32">
            <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}
