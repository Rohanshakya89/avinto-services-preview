import {
  BarChart3,
  Blocks,
  Cable,
  Check,
  CreditCard,
  Database,
  FlaskConical,
  Hammer,
  KeyRound,
  Package,
  Rocket,
  Smartphone,
  Store,
  Workflow,
  Wrench,
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
/*  Showcase hero for the Mobile Application page. It walks through the        */
/*  page's own four stages, in the page's own words: Build, Integrate,         */
/*  Automate, Submit & maintain. Each stage has a small visual that plays      */
/*  itself, and each stage marker can be clicked to revisit that stage.        */
/*  Nothing in a stage shows before its moment.                                */
/* -------------------------------------------------------------------------- */

type VisualProps = { on: boolean }

/**
 * How long each stage stays up, sized to the time it takes to read it:
 * words on screen / 3.5 words per second (about 210 wpm, a little under the
 * 238 wpm adult average because this is UI text) + 2s to notice the change.
 *   Build 31 words, Integrate 34, Automate 25, Submit & maintain 35.
 */
const STAGE_MS = [11000, 11500, 9000, 12000]

const TICK_MS = 800

export function MobileAppCanvas() {
  // Reduced motion: rest on the second stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/** A row with a tick; it appears when `shown`. */
function CheckRow({
  label,
  shown,
  className,
}: {
  label: string
  shown: boolean
  className?: string
}) {
  return (
    <li
      className={reveal(
        shown,
        cn("flex items-center gap-1.5 text-foreground sm:gap-3", className)
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground sm:size-5">
        <Check className="size-2.5 sm:size-3" strokeWidth={3} />
      </span>
      {label}
    </li>
  )
}

/* -------------------------------- 1. Build --------------------------------- */

const BUILD_STEPS = [
  "Choose the right technology",
  "Design the architecture",
  "Build the product",
]

const FRAMEWORKS = [
  "Expo",
  "React Native",
  "React",
  "Flutter",
  "Kotlin",
  "Swift",
  "Objective-C",
  "Java",
]

/** The technical decisions are made, then the app takes shape on a phone. */
function BuildVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 7)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-center gap-4 min-[340px]:grid-cols-[auto_1fr] sm:gap-8">
        <div className="relative mx-auto flex h-44 w-24 flex-col overflow-hidden rounded-[1.5rem] border-2 border-border bg-background shadow-sm sm:h-48 sm:w-28">
          <span className="absolute top-1.5 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-border" />
          <div className="flex flex-1 flex-col gap-2 px-2.5 pt-6">
            <span
              className={reveal(
                t >= 3,
                "block h-3 w-1/2 rounded bg-primary/40"
              )}
            />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={reveal(t >= 4 + i, "flex items-center gap-2")}
              >
                <span className="size-5 shrink-0 rounded-full bg-primary/20" />
                <span className="flex flex-1 flex-col gap-1">
                  <span className="h-1.5 w-full rounded bg-muted" />
                  <span className="h-1.5 w-2/3 rounded bg-muted" />
                </span>
              </span>
            ))}
          </div>
          <div className="flex h-8 items-center justify-around border-t border-border">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "size-2 rounded-full transition-colors duration-500 [transition-timing-function:var(--ease-out)]",
                  t >= 7 && i === 0 ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {BUILD_STEPS.map((step, i) => (
            <li
              key={step}
              className={reveal(
                t >= i + 1,
                "flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/5 p-2 text-xs text-foreground sm:h-14 sm:gap-3 sm:px-3 sm:text-sm"
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* The divider, label and chips all come in together. */}
      <div
        className={reveal(
          t >= 7,
          "flex flex-wrap items-center justify-center gap-2 border-t border-border pt-4"
        )}
      >
        <span className="mr-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Frameworks
        </span>
        {FRAMEWORKS.map((framework, i) => (
          <span
            key={framework}
            className={cn(
              "rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary transition-[opacity,translate] duration-[600ms] [transition-timing-function:var(--ease-out)] sm:px-3 sm:py-1 sm:text-xs",
              t >= 7 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            )}
            style={{ transitionDelay: t >= 7 ? `${150 + i * 70}ms` : "0ms" }}
          >
            {framework}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------ 2. Integrate ------------------------------- */

const CONNECT_TOP: { icon: LucideIcon; label: string }[] = [
  { icon: Cable, label: "APIs" },
  { icon: Database, label: "Databases" },
  { icon: KeyRound, label: "Authentication" },
]

const CONNECT_BOTTOM: { icon: LucideIcon; label: string }[] = [
  { icon: CreditCard, label: "Payments" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Blocks, label: "Third-party services" },
]

/** The app is connected to the systems it works with. */
function IntegrateVisual({ on }: VisualProps) {
  return (
    <SystemHub
      on={on}
      top={CONNECT_TOP}
      hub={{ icon: Smartphone, label: "Your app" }}
      bottom={CONNECT_BOTTOM}
      bottomFlow="up"
      note="We also flag where the wider system may need to change."
    />
  )
}

/* ------------------------------- 3. Automate ------------------------------- */

const AUTOMATED: { icon: LucideIcon; label: string }[] = [
  { icon: FlaskConical, label: "Automated testing" },
  { icon: Package, label: "Automated builds" },
  { icon: Rocket, label: "Automated deployments" },
]

/** Testing, builds and deployments each run through, then the release. */
function AutomateVisual({ on }: VisualProps) {
  const t = useTicker(on, 900, 4)

  return (
    <div className="flex flex-col gap-3">
      {AUTOMATED.map((step, i) => {
        const Icon = step.icon
        const shown = t >= i + 1
        return (
          <div
            key={step.label}
            className={reveal(
              shown,
              "flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/5 p-2 min-[400px]:gap-3 min-[400px]:p-3"
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon className="size-4" />
            </span>
            <span className="w-24 shrink-0 text-xs font-medium min-[400px]:w-32 sm:w-44 sm:text-sm">
              {step.label}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "block h-full origin-left rounded-full bg-primary transition-transform duration-[900ms] [transition-timing-function:var(--ease-out)]",
                  shown ? "scale-x-100 delay-200" : "scale-x-0"
                )}
              />
            </span>
            <Check
              className={cn(
                "size-4 shrink-0 text-primary transition-opacity duration-500",
                shown ? "opacity-100 delay-[900ms]" : "opacity-0"
              )}
              strokeWidth={3}
            />
          </div>
        )
      })}

      <p
        className={reveal(
          t >= 4,
          "flex min-h-12 items-center justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
        )}
      >
        Release confidently and keep improving the app.
      </p>
    </div>
  )
}

/* --------------------------- 4. Submit & maintain -------------------------- */

const STORES = ["App Store", "Play Store"]

/**
 * Getting the app live, then staying involved after launch. Steps: stores
 * 1-2, "Get it live" card 3 with its rows 4-6 and badge 7, then "Stay
 * involved" card 8 with its rows 9-11.
 */
function SubmitVisual({ on }: VisualProps) {
  const t = useTicker(on, 700, 11)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STORES.map((store, i) => (
          <span
            key={store}
            className={reveal(
              t >= i + 1,
              "flex h-8 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-medium whitespace-nowrap text-primary-foreground sm:h-10 sm:px-4 sm:text-sm"
            )}
          >
            <Smartphone className="size-4" />
            {store}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Panel
          icon={Store}
          title="Get it live"
          items={["Store submissions", "Compliance", "Release management"]}
          panelAt={3}
          t={t}
          badgeAt={7}
        />
        <Panel
          icon={Wrench}
          title="Stay involved"
          items={[
            "Fixing issues",
            "Keeping dependencies current",
            "Developing the product",
          ]}
          panelAt={8}
          t={t}
        />
      </div>
    </div>
  )
}

function Panel({
  icon: Icon,
  title,
  items,
  panelAt,
  t,
  badgeAt,
}: {
  icon: LucideIcon
  title: string
  items: string[]
  panelAt: number
  t: number
  badgeAt?: number
}) {
  return (
    <div
      className={reveal(
        t >= panelAt,
        "flex flex-col gap-4 rounded-xl border border-border p-2 sm:p-5"
      )}
    >
      <div className="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1">
        <Icon className="size-4 shrink-0 text-primary" />
        <span className="text-xs font-medium whitespace-nowrap sm:text-sm">
          {title}
        </span>
        <span
          className={reveal(
            badgeAt !== undefined && t >= badgeAt,
            "ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
          )}
        >
          Live
        </span>
      </div>
      <ul className="flex flex-col gap-3 text-xs sm:text-sm">
        {items.map((item, i) => (
          <CheckRow
            key={item}
            label={item}
            shown={t >= panelAt + 1 + i}
            className="items-start sm:items-center"
          />
        ))}
      </ul>
    </div>
  )
}

/* --------------------------------- Stages ---------------------------------- */

const STAGES: ShowcaseStage[] = [
  {
    title: "Build",
    shortTitle: "Build",
    icon: Hammer,
    description:
      "We turn product ideas and requirements into reliable mobile apps.",
    Visual: BuildVisual,
  },
  {
    title: "Integrate",
    shortTitle: "Integrate",
    icon: Blocks,
    description: "A mobile app is only as useful as the systems it works with.",
    Visual: IntegrateVisual,
  },
  {
    title: "Automate",
    shortTitle: "Automate",
    icon: Workflow,
    description:
      "Automated testing, builds and deployments make it easier to release confidently.",
    Visual: AutomateVisual,
  },
  {
    title: "Submit & maintain",
    shortTitle: "Submit",
    icon: Store,
    description: "Practical work to get the app live, then ongoing support.",
    Visual: SubmitVisual,
  },
]
