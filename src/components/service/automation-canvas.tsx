import * as React from "react"
import {
  ArrowRightLeft,
  BellRing,
  Building2,
  Check,
  ChevronRight,
  Compass,
  Database,
  FileText,
  Inbox,
  Landmark,
  LoaderCircle,
  Mail,
  Plug,
  RefreshCw,
  Send,
  Server,
  ScrollText,
  ShieldCheck,
  Table,
  TriangleAlert,
  UserCheck,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "cn"
import { reveal } from "@/components/service/reveal"
import {
  StageShowcase,
  type ShowcaseStage,
} from "@/components/service/stage-showcase"
import { SystemHub } from "@/components/service/system-hub"
import { useTicker } from "@/components/service/use-stage-player"

/* -------------------------------------------------------------------------- */
/*  Showcase hero for the Automation page. It walks through the page's own     */
/*  four stages, in the page's own words: Map & identify, Build workflows,     */
/*  Integrate your systems, Monitor & maintain. Each stage has a small visual  */
/*  that plays itself, and each stage marker can be clicked to revisit it.     */
/*  Nothing in a stage shows before its moment.                                */
/* -------------------------------------------------------------------------- */

type VisualProps = { on: boolean }

/**
 * How long each stage stays up, sized to the time it takes to read it:
 * words on screen / 3.5 words per second (about 210 wpm, a little under the
 * 238 wpm adult average because this is UI text) + 2s to notice the change.
 *   Map & identify 36 words, Build workflows 33,
 *   Integrate your systems 33, Monitor & maintain 43.
 */
const STAGE_MS = [12000, 11500, 11500, 14000]

/**
 * The Monitor stage shows a new message at each step, so each step waits as
 * long as its message takes to read (4, 4, 4, 7, 3, 4, 4 words), and the last
 * message (9 words) then stays up for the rest of the stage.
 */
const MONITOR_STEP_MS = [800, 800, 800, 2800, 1700, 1200, 1200]
const TICK_MS = 800

export function AutomationCanvas() {
  // Reduced motion: rest on the second stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/* ------------------------- 1. Map & identify ------------------------------- */

const PROCESSES: { icon: LucideIcon; label: string }[] = [
  { icon: Table, label: "Spreadsheet copying" },
  { icon: FileText, label: "Weekly report" },
  { icon: Inbox, label: "Inbox approval" },
]

const CRITERIA = ["Time saved", "Risk reduced", "Effort required"]

/** Slow processes get spotted, then ranked by the page's three criteria. */
function MapVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 8)
  const ranked = t >= 8

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {PROCESSES.map((process, i) => {
          const Icon = process.icon
          return (
            <li
              key={process.label}
              className={reveal(
                t >= i + 1,
                cn(
                  "flex items-center gap-3 rounded-xl border p-2",
                  ranked && i === 0
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-background"
                )
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-sm leading-none font-medium">
                  {process.label}
                </span>
                {/* Both labels share one cell and cross-fade. */}
                <span className="grid text-xs leading-none">
                  <span
                    className={cn(
                      "text-amber-700 transition-opacity duration-500 [grid-area:1/1]",
                      ranked ? "opacity-0" : "opacity-100"
                    )}
                  >
                    Bottleneck found
                  </span>
                  <span
                    className={cn(
                      "text-primary transition-opacity duration-500 [grid-area:1/1]",
                      ranked ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {`Priority ${i + 1}${i === 0 ? ", automate first" : ""}`}
                  </span>
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      {/* Label and chips appear together, then the chips light up in turn. */}
      <div className={reveal(t >= 4, "flex flex-wrap items-center gap-2")}>
        <span className="mr-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Prioritised by
        </span>
        {CRITERIA.map((criterion, i) => (
          <span
            key={criterion}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-[background-color,border-color,color] duration-500 [transition-timing-function:var(--ease-out)]",
              t >= i + 5
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            {criterion}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------- 2. Build workflows ------------------------------ */

const BUILD_STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Trigger action" },
  { icon: ArrowRightLeft, label: "Move data" },
  { icon: FileText, label: "Generate document" },
  { icon: UserCheck, label: "Approval" },
  { icon: Send, label: "Send notification" },
]

/** The things a workflow does, appearing one after another. */
function BuildVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 6)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {BUILD_STEPS.map((step, i) => {
          const Icon = step.icon
          const shown = t >= i + 1
          return (
            <React.Fragment key={step.label}>
              {i > 0 && (
                <ChevronRight
                  className={reveal(shown, "size-4 text-primary")}
                />
              )}
              <span
                className={reveal(
                  shown,
                  "flex h-9 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground"
                )}
              >
                <Icon className="size-4" />
                {step.label}
              </span>
            </React.Fragment>
          )
        })}
      </div>
      <p
        className={reveal(t >= 6, "text-center text-xs text-muted-foreground")}
      >
        From simple connections to multi-step processes with approvals and
        exceptions.
      </p>
    </div>
  )
}

/* ---------------------- 3. Integrate your systems -------------------------- */

const SOURCES: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "CRM" },
  { icon: Building2, label: "ERP" },
  { icon: Landmark, label: "Finance tools" },
]

const DESTINATIONS: { icon: LucideIcon; label: string }[] = [
  { icon: Database, label: "Databases" },
  { icon: Mail, label: "Email" },
  { icon: Server, label: "Internal systems" },
]

/** Systems connect through APIs, so information flows without retyping. */
function IntegrateVisual({ on }: VisualProps) {
  return (
    <SystemHub
      on={on}
      top={SOURCES}
      hub={{ icon: Plug, label: "APIs" }}
      bottom={DESTINATIONS}
      bottomFlow="up"
      note="No API? We find a practical way around it."
    />
  )
}

/* ---------------------- 4. Monitor & maintain ------------------------------ */

type DotState = "pending" | "running" | "error" | "done"

/** Run of five steps; step 3 fails once, raises an alert, retries, recovers. */
function dotState(i: number, t: number): DotState {
  if (i === 2) {
    if (t < 3) return "pending"
    if (t === 3) return "error"
    if (t === 4) return "running"
    return "done"
  }
  const doneAt = [1, 2, 0, 6, 7][i]
  return t >= doneAt ? "done" : "pending"
}

const CAPABILITIES: { icon: LucideIcon; label: string; litAt: number }[] = [
  { icon: ScrollText, label: "Logging", litAt: 1 },
  { icon: BellRing, label: "Alerts", litAt: 3 },
  { icon: RefreshCw, label: "Error handling", litAt: 5 },
]

const MESSAGES = [
  "Every step is logged.",
  "A step failed. An alert is sent.",
  "Retrying the step.",
  "Recovered. The run continues.",
  "Run complete. We keep it running as things change.",
]

function messageIndex(t: number) {
  if (t < 3) return 0
  if (t === 3) return 1
  if (t === 4) return 2
  if (t < 7) return 3
  return 4
}

/** The page's promise: workflows never fail silently. */
function MonitorVisual({ on }: VisualProps) {
  const t = useTicker(on, MONITOR_STEP_MS, 7)
  const message = messageIndex(t)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const state = dotState(i, t)
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="h-0.5 w-4 overflow-hidden rounded-full bg-border sm:w-8">
                  <span
                    className={cn(
                      "block h-full origin-left bg-primary transition-transform duration-500 [transition-timing-function:var(--ease-out)]",
                      dotState(i - 1, t) === "done"
                        ? "scale-x-100"
                        : "scale-x-0"
                    )}
                  />
                </span>
              )}
              <span
                className={cn(
                  "relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-[background-color,border-color,color] duration-500 [transition-timing-function:var(--ease-out)] sm:size-10",
                  state === "done" &&
                    "border-primary bg-background text-primary",
                  state === "running" &&
                    "border-primary bg-primary text-primary-foreground",
                  state === "error" &&
                    "border-amber-500 bg-amber-500 text-white",
                  state === "pending" &&
                    "border-border bg-background text-muted-foreground"
                )}
              >
                {state === "done" && <Check className="size-4" />}
                {state === "running" && (
                  <LoaderCircle className="size-4 animate-spin" />
                )}
                {state === "error" && <TriangleAlert className="size-4" />}
                {state === "pending" && (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </span>
            </React.Fragment>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon
          return (
            <span
              key={cap.label}
              className={reveal(
                t >= cap.litAt,
                "flex h-8 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {cap.label}
            </span>
          )
        })}
      </div>

      {/* Messages share one cell and cross-fade; the cell is as tall as the
          longest one, so nothing moves. */}
      <div className="grid min-h-10 place-items-center text-center text-sm leading-snug">
        {MESSAGES.map((text, i) => (
          <p
            key={text}
            className={cn(
              "transition-opacity duration-500 [transition-timing-function:var(--ease-out)] [grid-area:1/1]",
              i === message ? "opacity-100" : "opacity-0",
              i === 1 ? "text-amber-700" : "text-foreground"
            )}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------- Stages ---------------------------------- */

const STAGES: ShowcaseStage[] = [
  {
    title: "Map & identify",
    shortTitle: "Map",
    icon: Compass,
    description:
      "We find the bottlenecks and prioritise what to automate first.",
    Visual: MapVisual,
  },
  {
    title: "Build workflows",
    shortTitle: "Build",
    icon: Workflow,
    description:
      "Automations that move data, trigger actions and coordinate steps across your systems.",
    Visual: BuildVisual,
  },
  {
    title: "Integrate your systems",
    shortTitle: "Integrate",
    icon: Plug,
    description:
      "Your tools connected through APIs, so information flows without anyone retyping it.",
    Visual: IntegrateVisual,
  },
  {
    title: "Monitor & maintain",
    shortTitle: "Monitor",
    icon: ShieldCheck,
    description:
      "Logging, alerts and error handling, so automations never fail silently.",
    Visual: MonitorVisual,
  },
]
