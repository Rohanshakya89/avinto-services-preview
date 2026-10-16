import {
  Activity,
  Anchor,
  BellRing,
  Check,
  ChevronRight,
  ClipboardList,
  Cloud,
  Coins,
  FileCode,
  FlaskConical,
  GitBranch,
  Hammer,
  Layers,
  Lock,
  Rocket,
  ScrollText,
  Server,
  TrendingUp,
  Zap,
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
/*  Showcase hero for the DevOps page. It walks through the page's own four    */
/*  stages, in the page's own words: Assess & plan, CI/CD pipelines, Cloud     */
/*  infrastructure, Monitor & operate. Each stage has a small visual that     */
/*  plays itself, and each stage marker can be clicked to revisit that stage.  */
/*  Nothing in a stage shows before its moment.                                */
/* -------------------------------------------------------------------------- */

type VisualProps = { on: boolean }

/**
 * How long each stage stays up: the time it takes to read it (words on screen
 * / 3.5 words per second, about 210 wpm, a little under the 238 wpm adult
 * average because this is UI text, + 2s to notice the change), or the time its
 * animation needs plus a moment to take it in, whichever is longer.
 *   Assess & plan 22 words, CI/CD pipelines 22, Cloud infrastructure 19,
 *   Monitor & operate 26. The animations run 4.9s, 4.2s, 6.3s and 5.6s.
 */
const STAGE_MS = [8500, 8500, 9000, 9500]

const TICK_MS = 700

export function DevOpsCanvas() {
  // Reduced motion: rest on the second stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/* ------------------------------ 1. Assess & plan --------------------------- */

const REVIEW: { icon: LucideIcon; label: string }[] = [
  { icon: Hammer, label: "Build" },
  { icon: Rocket, label: "Release" },
  { icon: Server, label: "Run" },
]

const GAINS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Speed" },
  { icon: Anchor, label: "Stability" },
  { icon: Lock, label: "Security" },
  { icon: Coins, label: "Cost" },
]

/** How you build, release and run today, then where the biggest gains are. */
function AssessVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 7)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-2">
        {REVIEW.map((step, i) => {
          const Icon = step.icon
          return (
            <span
              key={step.label}
              className={reveal(
                t >= i + 1,
                "flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/5 text-sm font-medium text-foreground"
              )}
            >
              <Icon className="size-5 text-primary" />
              {step.label}
            </span>
          )
        })}
      </div>

      {/* The label and the chips come in together. */}
      <div className="flex flex-col gap-3">
        <span
          className={reveal(
            t >= 4,
            "text-xs font-medium tracking-wide text-muted-foreground uppercase"
          )}
        >
          Biggest gains in
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GAINS.map((gain, i) => {
            const Icon = gain.icon
            return (
              <span
                key={gain.label}
                className={reveal(
                  t >= i + 4,
                  "flex h-14 items-center justify-center gap-2 rounded-xl border border-primary bg-primary text-sm font-medium text-primary-foreground"
                )}
              >
                <Icon className="size-4" />
                {gain.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- 2. CI/CD pipelines -------------------------- */

const PIPELINE: { icon: LucideIcon; label: string }[] = [
  { icon: Hammer, label: "Build" },
  { icon: FlaskConical, label: "Test" },
  { icon: Rocket, label: "Deploy" },
]

const CADENCE = ["Once a month", "Ten times a day"]

/** Every change runs the same way through build, test and deploy. */
function PipelineVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 6)

  return (
    <div className="flex flex-col gap-6">
      <ol className="grid grid-cols-3">
        {PIPELINE.map((step, i) => {
          const Icon = step.icon
          return (
            <li
              key={step.label}
              className={reveal(
                t >= i + 1,
                "relative flex flex-col items-center gap-3"
              )}
            >
              {i > 0 && (
                <span className="absolute top-8 right-[calc(50%+36px)] h-0.5 w-[calc(100%-72px)] -translate-y-1/2 rounded-full bg-primary" />
              )}
              <span className="relative flex size-16 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground shadow-lg">
                <Icon className="size-7" />
              </span>
              <span className="text-sm font-medium">{step.label}</span>
            </li>
          )
        })}
      </ol>

      <div
        className={reveal(
          t >= 4,
          "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground"
        )}
      >
        <span>Whether you deploy</span>
        {CADENCE.map((label, i) => (
          <span
            key={label}
            className={reveal(
              t >= i + 5,
              "rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------- 3. Cloud infrastructure ------------------------ */

const ENVIRONMENTS = ["Development", "Staging", "Production"]
const QUALITIES = ["Secure", "Scalable", "Cost-aware"]

/** One definition in code, the same environment everywhere it is created. */
function CloudVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 9)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
        {/* The code that defines the environment. */}
        <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
          <span className="flex items-center gap-2 text-xs font-medium">
            <FileCode className="size-4 text-primary" />
            Infrastructure as code
          </span>
          <div className="flex flex-col gap-2">
            {[
              ["w-2/5", "bg-primary/40"],
              ["w-4/5", "bg-muted"],
              ["w-3/5", "bg-muted"],
            ].map(([width, color], i) => (
              <span
                key={i}
                className={reveal(
                  t >= i + 1,
                  cn("block h-2 rounded-full", width, color)
                )}
              />
            ))}
          </div>
        </div>

        <ChevronRight
          className={reveal(
            t >= 4,
            "mx-auto hidden size-5 rotate-0 text-primary sm:block"
          )}
        />

        {/* The same environment, three times. */}
        <ul className="flex flex-col gap-2">
          {ENVIRONMENTS.map((env, i) => (
            <li
              key={env}
              className={reveal(
                t >= i + 4,
                "flex h-10 items-center gap-3 rounded-xl border border-primary/50 bg-primary/5 px-3 text-sm font-medium"
              )}
            >
              <Layers className="size-4 shrink-0 text-primary" />
              {env}
              <Check
                className="ml-auto size-4 shrink-0 text-primary"
                strokeWidth={3}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {QUALITIES.map((quality, i) => (
          <span
            key={quality}
            className={reveal(
              t >= i + 7,
              "rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            )}
          >
            {quality}
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------- 4. Monitor & operate --------------------------- */

const LOG_WIDTHS = ["w-full", "w-4/5", "w-11/12", "w-3/5"]

/**
 * Logs, metrics and an alert come up, the alert fires and is resolved, and
 * then the page's promise: someone stays involved to run the platform.
 */
function MonitorVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 8)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Panel icon={ScrollText} title="Logging" shown={t >= 1}>
          <div className="flex flex-col gap-2">
            {LOG_WIDTHS.map((width, i) => (
              <span
                key={i}
                className={cn(
                  "block h-1.5 rounded-full bg-muted transition-[opacity,translate] duration-[450ms] [transition-timing-function:var(--ease-out)]",
                  width,
                  t >= 1
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0"
                )}
                style={{
                  transitionDelay: t >= 1 ? `${250 + i * 120}ms` : "0ms",
                }}
              />
            ))}
          </div>
        </Panel>

        <Panel icon={TrendingUp} title="Metrics" shown={t >= 2}>
          <svg viewBox="0 0 100 40" className="h-12 w-full overflow-visible">
            <path
              d="M0 32 C12 30 18 18 30 20 S52 34 64 22 S86 6 100 8"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: t >= 2 ? 0 : 1,
                transition: "stroke-dashoffset 1400ms var(--ease-out) 250ms",
              }}
            />
          </svg>
        </Panel>

        <Panel icon={BellRing} title="Alerting" shown={t >= 3}>
          <div className="relative flex h-12 items-center">
            <span
              className={reveal(
                t >= 5 && t < 7,
                "absolute inset-x-0 flex h-8 items-center justify-center rounded-lg border border-amber-500/60 bg-amber-500/10 text-xs font-medium text-amber-700"
              )}
            >
              Alert sent
            </span>
            <span
              className={reveal(
                t >= 7,
                "absolute inset-x-0 flex h-8 items-center justify-center gap-1 rounded-lg border border-primary bg-primary text-xs font-medium text-primary-foreground"
              )}
            >
              <Check className="hidden size-3.5 sm:block" strokeWidth={3} />
              Resolved
            </span>
          </div>
        </Panel>
      </div>

      <p
        className={reveal(t >= 8, "text-center text-sm text-muted-foreground")}
      >
        We run the platform, respond to incidents and keep improving it.
      </p>
    </div>
  )
}

function Panel({
  icon: Icon,
  title,
  shown,
  children,
}: {
  icon: LucideIcon
  title: string
  shown: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={reveal(
        shown,
        "flex flex-col gap-3 rounded-xl border border-border p-2 sm:p-4"
      )}
    >
      <span className="flex items-center gap-2 text-xs font-medium">
        <Icon className="hidden size-4 text-primary sm:block" />
        {title}
      </span>
      {children}
    </div>
  )
}

/* --------------------------------- Stages ---------------------------------- */

const STAGES: ShowcaseStage[] = [
  {
    title: "Assess & plan",
    shortTitle: "Assess",
    icon: ClipboardList,
    description: "We review how you build, release and run software today.",
    Visual: AssessVisual,
  },
  {
    title: "CI/CD pipelines",
    shortTitle: "Pipelines",
    icon: GitBranch,
    description: "Every change is verified and released consistently.",
    Visual: PipelineVisual,
  },
  {
    title: "Cloud infrastructure",
    shortTitle: "Cloud",
    icon: Cloud,
    description:
      "Secure, scalable, cost-aware cloud environments, built as code.",
    Visual: CloudVisual,
  },
  {
    title: "Monitor & operate",
    shortTitle: "Monitor",
    icon: Activity,
    description: "Issues caught early, not reported by users.",
    Visual: MonitorVisual,
  },
]
