import * as React from "react"
import { Tag as TagIcon } from "lucide-react"

import { cn } from "cn"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TAGS } from "./tracker-data"

/** Multi-select tag list with search. The trigger shows how many are set. */
export function TagPicker({
  value,
  onChange,
  size = "md",
}: {
  value: string[]
  onChange: (tagIds: string[]) => void
  size?: "md" | "sm"
}) {
  const [query, setQuery] = React.useState("")
  const list = TAGS.filter((t) =>
    t.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Popover onOpenChange={(open) => !open && setQuery("")}>
      <PopoverTrigger
        aria-label={
          value.length ? `Tags: ${value.length} selected` : "Choose tags"
        }
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          size === "md" ? "size-10" : "size-8",
          value.length > 0 && "text-primary"
        )}
      >
        <TagIcon className="size-4" />
        {value.length > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground tabular-nums">
            {value.length}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 gap-2 p-2">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tags..."
          aria-label="Search tags"
          className="h-10 w-full rounded-md bg-muted px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <ul className="flex max-h-64 flex-col overflow-y-auto">
          {list.length === 0 && (
            <li className="px-3 py-4 text-center text-sm text-muted-foreground">
              No tag matches "{query}".
            </li>
          )}
          {list.map((t) => (
            <li key={t.id}>
              <label className="flex h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-muted">
                <Checkbox
                  checked={value.includes(t.id)}
                  onCheckedChange={(checked) =>
                    onChange(
                      checked
                        ? [...value, t.id]
                        : value.filter((id) => id !== t.id)
                    )
                  }
                />
                <span className="truncate">{t.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
