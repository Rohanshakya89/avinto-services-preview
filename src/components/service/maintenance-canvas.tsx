import {
  ArrowUpCircle,
  Check,
  Gauge,
  HeartPulse,
  Plus,
  ShieldCheck,
  Sprout,
} from "lucide-react"

import { cn } from "cn"
import { reveal } from "@/components/service/reveal"
import {
  StageShowcase,
  type ShowcaseStage,
} from "@/components/service/stage-showcase"
import { useTicker } from "@/components/service/use-stage-player"

/* -------------------------------------------------------------------------- */
/*  Showcase hero for the Maintenance page. It walks through the page's own    */
/*  four stages: Monitor & support, Update & secure, Improve & optimise,       */
/*  Develop further. Each stage shows one simple idea that plays itself, and   */
/*  each stage marker can be clicked to revisit that stage. Nothing in a       */
/*  stage shows before its moment.                                             */
/* -------------------------------------------------------------------------- */

type VisualProps = { on: boolean }

/**
 * How long each stage stays up: the time it takes to read it (words on screen
 * / 3.5 words per second, about 210 wpm, a little under the 238 wpm adult
 * average because this is UI text, + 2s to notice the change), or the time its
 * animation needs plus a moment to take it in, whichever is longer.
 *   Monitor 21 words, Update 18, Improve 21, Develop 19.
 *   The animations run 4.2s, 4.2s, 4.7s and 2.1s.
 */
const STAGE_MS = [8000, 7500, 8000, 7500]

const TICK_MS = 700

export function MaintenanceCanvas() {
  // Reduced motion: rest on the second stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/* ---------------------------- 1. Monitor & support ------------------------- */

const SUPPORT_STEPS = ["Investigated", "Fixed", "Explained clearly"]

/** The product stays healthy; an issue shows up and is dealt with. */
function MonitorVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 6)
  const issue = t >= 2 && t < 6

  return (
    <div className="flex flex-col gap-6">
      <div
        className={reveal(
          t >= 1,
          "mx-auto flex h-12 w-full max-w-xs items-center justify-between gap-3 rounded-xl border border-border bg-background px-4"
        )}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <HeartPulse className="size-4 text-primary" />
          Product health
        </span>
        {/* Both states share one cell and cross-fade. */}
        <span className="grid text-xs font-medium">
          <span
            className={cn(
              "rounded-full bg-primary px-2 py-1 text-primary-foreground transition-opacity duration-500 [grid-area:1/1]",
              issue ? "opacity-0" : "opacity-100"
            )}
          >
            Healthy
          </span>
          <span
            className={cn(
              "rounded-full bg-amber-500/15 px-2 py-1 text-amber-700 transition-opacity duration-500 [grid-area:1/1]",
              issue ? "opacity-100" : "opacity-0"
            )}
          >
            Issue found
          </span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SUPPORT_STEPS.map((step, i) => (
          <span
            key={step}
            className={reveal(
              t >= i + 3,
              "flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/5 px-2 text-center text-xs font-medium sm:text-sm"
            )}
          >
            <Check className="size-5 text-primary" strokeWidth={3} />
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- 2. Update & secure -------------------------- */

const KEPT_CURRENT = [
  "Frameworks",
  "Dependencies",
  "Operating systems",
  "Infrastructure",
]

/** Each part is flagged as outdated, then brought up to date. */
function UpdateVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 6)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {KEPT_CURRENT.map((item, i) => {
          const current = t >= i + 2
          return (
            <span
              key={item}
              className={reveal(
                t >= i + 1,
                cn(
                  "flex h-14 items-center gap-3 rounded-xl border px-3 text-xs font-medium sm:text-sm",
                  current
                    ? "border-primary/50 bg-primary/5"
                    : "border-amber-500/50 bg-amber-500/5"
                )
              )}
            >
              <span className="relative grid size-5 shrink-0 place-items-center">
                <ArrowUpCircle
                  className={cn(
                    "size-5 text-amber-600 transition-opacity duration-500 [grid-area:1/1]",
                    current ? "opacity-0" : "opacity-100"
                  )}
                />
                <Check
                  className={cn(
                    "size-5 rounded-full bg-primary p-1 text-primary-foreground transition-opacity duration-500 [grid-area:1/1]",
                    current ? "opacity-100" : "opacity-0"
                  )}
                  strokeWidth={3}
                />
              </span>
              {item}
            </span>
          )
        })}
      </div>

      <span
        className={reveal(
          t >= 6,
          "flex h-12 items-center justify-center gap-2 rounded-xl border border-primary bg-primary text-sm font-medium text-primary-foreground"
        )}
      >
        <ShieldCheck className="size-4" />
        Security patches applied promptly
      </span>
    </div>
  )
}

/* --------------------------- 3. Improve & optimise ------------------------- */

/** Performance goes up and technical debt comes down. */
function ImproveVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 5)

  return (
    <div className="flex flex-col gap-5">
      <Meter label="Performance" shown={t >= 1} level={t >= 3 ? 0.9 : 0.35} />
      <Meter
        label="Technical debt"
        shown={t >= 2}
        level={t >= 4 ? 0.2 : 0.75}
      />
      <p
        className={reveal(t >= 5, "text-center text-sm text-muted-foreground")}
      >
        Fast and easy to work on as it grows.
      </p>
    </div>
  )
}

function Meter({
  label,
  shown,
  level,
}: {
  label: string
  shown: boolean
  /** 0..1 */
  level: number
}) {
  return (
    <div className={reveal(shown, "flex flex-col gap-2")}>
      <span className="text-sm font-medium">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full origin-left rounded-full bg-primary transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out)]"
          style={{ transform: `scaleX(${level})` }}
        />
      </span>
    </div>
  )
}

/* ----------------------------- 4. Develop further -------------------------- */

const ADDITIONS = ["New feature", "New system"]

/** The product grows, built by a team that already knows it. */
function DevelopVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 3)

  return (
    <div className="grid grid-cols-2 items-stretch gap-3">
      <span
        className={reveal(
          t >= 1,
          "flex h-40 items-center justify-center gap-2 rounded-xl border border-primary bg-primary text-sm font-medium text-primary-foreground"
        )}
      >
        <Sprout className="size-5" />
        Your product
      </span>
      <div className="flex flex-col gap-3">
        {ADDITIONS.map((item, i) => (
          <span
            key={item}
            className={reveal(
              t >= i + 2,
              "flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/5 text-sm font-medium"
            )}
          >
            <Plus className="size-4 text-primary" strokeWidth={3} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------- Stages ---------------------------------- */

const STAGES: ShowcaseStage[] = [
  {
    title: "Monitor & support",
    shortTitle: "Monitor",
    icon: HeartPulse,
    description: "We watch your product and respond when something goes wrong.",
    Visual: MonitorVisual,
  },
  {
    title: "Update & secure",
    shortTitle: "Update",
    icon: ShieldCheck,
    description: "Everything kept current, security patches applied promptly.",
    Visual: UpdateVisual,
  },
  {
    title: "Improve & optimise",
    shortTitle: "Improve",
    icon: Gauge,
    description: "We tune performance and reduce technical debt.",
    Visual: ImproveVisual,
  },
  {
    title: "Develop further",
    shortTitle: "Develop",
    icon: Sprout,
    description:
      "Features and integrations, from a team that already knows your product.",
    Visual: DevelopVisual,
  },
]
