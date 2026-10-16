import {
  BadgeCheck,
  CircleHelp,
  Cog,
  Handshake,
  LifeBuoy,
  ListChecks,
  RefreshCw,
  Route,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { cn } from "cn"
import { reveal } from "@/components/service/reveal"
import {
  StageShowcase,
  type ShowcaseStage,
} from "@/components/service/stage-showcase"
import { useTicker } from "@/components/service/use-stage-player"

/* -------------------------------------------------------------------------- */
/*  Showcase hero for the Business Analysis page. It walks through the page's  */
/*  own four stages: Discovery & stakeholder alignment, Process & requirements */
/*  analysis, Scope & prioritisation, Delivery support. Each stage shows one   */
/*  simple idea that plays itself, and each stage marker can be clicked to     */
/*  revisit that stage. Nothing in a stage shows before its moment.            */
/* -------------------------------------------------------------------------- */

type VisualProps = { on: boolean }

/**
 * How long each stage stays up: the time it takes to read it (words on screen
 * / 3.5 words per second, about 210 wpm, a little under the 238 wpm adult
 * average because this is UI text, + 2s to notice the change), or the time its
 * animation needs plus a moment to take it in, whichever is longer.
 *   Discovery 26 words, Process 11, Scope 12, Delivery 16.
 *   The animations run 2.8s, 4.9s, 4.2s and 3.5s.
 */
const STAGE_MS = [9500, 7500, 7000, 7000]

const TICK_MS = 700

export function BusinessAnalysisCanvas() {
  // Reduced motion: rest on the second stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/* ------------------- 1. Discovery & stakeholder alignment ------------------ */

const VOICES: { icon: LucideIcon; label: string }[] = [
  { icon: User, label: "Use it" },
  { icon: Cog, label: "Run it" },
  { icon: Wallet, label: "Pay for it" },
]

/** Different voices are heard, then they reach one shared view. */
function DiscoveryVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 4)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2">
        {VOICES.map((voice, i) => {
          const Icon = voice.icon
          return (
            <span
              key={voice.label}
              className={reveal(
                t >= i + 1,
                "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/5 text-sm font-medium"
              )}
            >
              <Icon className="size-6 text-primary" />
              {voice.label}
            </span>
          )
        })}
      </div>

      <span
        className={reveal(
          t >= 4,
          "flex h-14 items-center justify-center gap-2 rounded-xl border border-primary bg-primary text-sm font-medium text-primary-foreground"
        )}
      >
        <Handshake className="size-4" />
        One shared view
      </span>
    </div>
  )
}

/* ------------------ 2. Process & requirements analysis --------------------- */

/** Today's process on one side, tomorrow's simpler one on the other. */
function ProcessVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 7)

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6">
      <Flow label="Today" boxes={4} flaggedBox={2} from={1} t={t} />
      <Flow label="Tomorrow" boxes={3} from={5} t={t} />
    </div>
  )
}

/** A small process map: boxes joined by short links. One can be flagged. */
function Flow({
  label,
  boxes,
  flaggedBox,
  from,
  t,
}: {
  label: string
  boxes: number
  flaggedBox?: number
  /** Step at which the first box appears (the label comes with it). */
  from: number
  t: number
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={reveal(
          t >= from,
          "mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase"
        )}
      >
        {label}
      </span>
      {Array.from({ length: boxes }).map((_, i) => {
        const flagged = i === flaggedBox
        const shown = t >= from + i
        return (
          <div key={i} className="flex w-full flex-col items-center">
            {i > 0 && (
              <span
                className={reveal(
                  shown,
                  "block h-3 w-0.5 rounded-full bg-border"
                )}
              />
            )}
            <span
              className={reveal(
                shown,
                cn(
                  "flex h-9 w-full items-center rounded-lg border px-3",
                  flagged
                    ? "border-amber-500/60 bg-amber-500/10"
                    : "border-primary/40 bg-primary/5"
                )
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-2/3 rounded-full",
                  flagged ? "bg-amber-500/50" : "bg-primary/30"
                )}
              />
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------- 3. Scope & prioritisation ---------------------- */

/** Essentials first, nice-to-haves after. */
function ScopeVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 6)

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6">
      <Column title="Essentials" tag="MVP" from={1} t={t} filled />
      <Column title="Nice-to-haves" tag="Later" from={4} t={t} />
    </div>
  )
}

function Column({
  title,
  tag,
  from,
  t,
  filled,
}: {
  title: string
  tag: string
  /** Step at which the first row appears (the header comes with it). */
  from: number
  t: number
  filled?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={reveal(
          t >= from,
          "mb-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-medium"
        )}
      >
        <span>{title}</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5",
            filled
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {tag}
        </span>
      </div>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={reveal(
            t >= from + i,
            cn(
              "flex h-11 items-center gap-3 rounded-lg border px-3",
              filled
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-background"
            )
          )}
        >
          <span
            className={cn(
              "size-3 shrink-0 rounded-full",
              filled ? "bg-primary" : "bg-border"
            )}
          />
          <span
            className={cn(
              "h-1.5 rounded-full",
              i === 1 ? "w-2/3" : "w-4/5",
              filled ? "bg-primary/30" : "bg-muted"
            )}
          />
        </span>
      ))}
    </div>
  )
}

/* ----------------------------- 4. Delivery support ------------------------- */

const SUPPORT: { icon: LucideIcon; label: string }[] = [
  { icon: CircleHelp, label: "Answering questions" },
  { icon: RefreshCw, label: "Refining requirements" },
  { icon: BadgeCheck, label: "Validating what's built" },
]

/** While development runs, we stay close. */
function DeliveryVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 4)

  return (
    <div className="flex flex-col gap-6">
      <div
        className={reveal(
          t >= 1,
          "flex items-center gap-3 text-xs font-medium"
        )}
      >
        <span className="shrink-0">Development</span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className={cn(
              "block h-full origin-left rounded-full bg-primary transition-transform duration-[3500ms] ease-linear",
              t >= 1 ? "scale-x-100" : "scale-x-0"
            )}
          />
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
        {SUPPORT.map((item, i) => {
          const Icon = item.icon
          return (
            <span
              key={item.label}
              className={reveal(
                t >= i + 2,
                "flex h-14 items-center gap-3 rounded-xl border border-primary/50 bg-primary/5 px-4 text-sm font-medium sm:h-24 sm:flex-col sm:justify-center sm:gap-2 sm:px-2 sm:text-center"
              )}
            >
              <Icon className="size-5 shrink-0 text-primary sm:size-6" />
              {item.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* --------------------------------- Stages ---------------------------------- */

const STAGES: ShowcaseStage[] = [
  {
    title: "Discovery & stakeholder alignment",
    shortTitle: "Discovery",
    icon: Users,
    description: "We talk to the people who use, run and pay for the system.",
    Visual: DiscoveryVisual,
  },
  {
    title: "Process & requirements analysis",
    shortTitle: "Analysis",
    icon: Route,
    description: "Today's process mapped, tomorrow's solution defined.",
    Visual: ProcessVisual,
  },
  {
    title: "Scope & prioritisation",
    shortTitle: "Scope",
    icon: ListChecks,
    description: "What comes first: essentials before nice-to-haves.",
    Visual: ScopeVisual,
  },
  {
    title: "Delivery support",
    shortTitle: "Delivery",
    icon: LifeBuoy,
    description: "We stay involved once development starts.",
    Visual: DeliveryVisual,
  },
]
