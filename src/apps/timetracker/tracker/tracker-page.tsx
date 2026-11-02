import * as React from "react"

import { EntriesPanel } from "./entries-panel"
import { NoticeBanner, TimerBar } from "./timer-bar"
import {
  type Entry,
  makeEntries,
  PROJECTS,
  type Range,
} from "./tracker-data"
import { startTimer } from "./use-timer"

/**
 * Timer first, history second: the notice, then the timer bar, then the
 * entries panel. All state lives here for now (demo data, nothing is saved).
 */
export function TrackerPage() {
  const [entries, setEntries] = React.useState<Entry[]>(makeEntries)
  const [range, setRange] = React.useState<Range>({ kind: "week", offset: 0 })
  const [showNotice, setShowNotice] = React.useState(true)

  // What the timer bar is currently set up with.
  const [description, setDescription] = React.useState("")
  const [projectId, setProjectId] = React.useState<string | null>(
    PROJECTS[4].id
  )
  const [tagIds, setTagIds] = React.useState<string[]>([])

  const update = (id: string, patch: Partial<Entry>) =>
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  const duplicate = (entry: Entry) =>
    setEntries((list) => [
      ...list,
      { ...entry, id: `${entry.id}-copy-${list.length}` },
    ])

  // Resuming an entry loads it into the timer bar and starts the clock.
  const resume = (entry: Entry) => {
    setDescription(entry.task)
    setProjectId(entry.projectId)
    setTagIds(entry.tagIds)
    startTimer()
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {showNotice && (
        <NoticeBanner onDismiss={() => setShowNotice(false)}>
          All staff are reminded to clock out during lunch and any extended
          breaks, and to clock back in upon returning.
        </NoticeBanner>
      )}
      <TimerBar
        description={description}
        onDescriptionChange={setDescription}
        projectId={projectId}
        onProjectChange={setProjectId}
        tagIds={tagIds}
        onTagsChange={setTagIds}
      />
      <EntriesPanel
        entries={entries}
        range={range}
        onRangeChange={setRange}
        update={update}
        onResume={resume}
        onDuplicate={duplicate}
        onDelete={(id) => setEntries((list) => list.filter((e) => e.id !== id))}
      />
    </div>
  )
}
