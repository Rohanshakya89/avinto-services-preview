import { type LucideIcon } from "lucide-react"

import { cn } from "cn"
import { reveal } from "@/components/service/reveal"
import { useTicker } from "@/components/service/use-stage-player"

export type System = { icon: LucideIcon; label: string }

const TICK_MS = 800

/**
 * "Your platform is connected to everything around it": three systems feed a
 * central hub, which feeds three more, with data flowing down each link.
 * Every piece appears at its moment, and nothing shows before then. Plays
 * itself while `on`. Shared by the service-page showcases.
 */
export function SystemHub({
  on,
  top,
  hub,
  bottom,
  bottomFlow = "down",
  note,
}: {
  on: boolean
  top: System[]
  hub: System
  bottom: System[]
  /** Which way data runs on the bottom links: away from the hub, or towards it. */
  bottomFlow?: "down" | "up"
  note: string
}) {
  const t = useTicker(on, TICK_MS, 7)
  const HubIcon = hub.icon

  return (
    <div className="flex flex-col items-stretch">
      <SystemRow systems={top} litFrom={1} t={t} />
      <LinkRow from={1} t={t} />
      <div
        className={reveal(
          t >= 4,
          "flex h-12 items-center justify-center gap-2 rounded-xl border border-primary bg-primary text-sm font-medium text-primary-foreground"
        )}
      >
        <HubIcon className="size-4" />
        {hub.label}
      </div>
      <LinkRow from={4} t={t} up={bottomFlow === "up"} />
      <SystemRow systems={bottom} litFrom={4} t={t} />
      <p
        className={reveal(
          t >= 7,
          "mt-4 text-center text-xs text-muted-foreground"
        )}
      >
        {note}
      </p>
    </div>
  )
}

function SystemRow({
  systems,
  litFrom,
  t,
}: {
  systems: System[]
  litFrom: number
  t: number
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {systems.map((system, i) => {
        const Icon = system.icon
        return (
          <span
            key={system.label}
            className={reveal(
              t >= litFrom + i,
              "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border border-primary/50 bg-primary/5 p-2 text-center text-xs leading-snug font-medium text-foreground"
            )}
          >
            <Icon className="size-5 text-primary" />
            {system.label}
          </span>
        )
      })}
    </div>
  )
}

/** Short vertical connectors with a data packet running down each one. */
function LinkRow({
  from,
  t,
  up = false,
}: {
  from: number
  t: number
  up?: boolean
}) {
  return (
    <div className="grid h-6 grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => {
        const shown = t >= from + i
        return (
          <span
            key={i}
            className={cn(
              "relative mx-auto h-full w-0.5 bg-border transition-opacity duration-[600ms] [transition-timing-function:var(--ease-out)]",
              shown ? "opacity-100" : "opacity-0"
            )}
          >
            {shown && (
              <span
                className={cn(
                  "absolute left-1/2 size-2 -translate-x-1/2 animate-[flow-y_1.1s_linear_infinite] rounded-full bg-primary",
                  up && "[animation-direction:reverse]"
                )}
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            )}
          </span>
        )
      })}
    </div>
  )
}
