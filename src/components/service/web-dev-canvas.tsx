import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  Activity,
  Blocks,
  Cable,
  Check,
  ChevronDown,
  ClipboardCheck,
  Cloud,
  Code2,
  CreditCard,
  Database,
  GitBranch,
  Globe,
  KeyRound,
  Monitor,
  PencilRuler,
  Rocket,
  Server,
  Smartphone,
  Sparkles,
  Tablet,
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
/*  Showcase hero for the Web Development page. It walks through the page's    */
/*  own four stages, in the page's own words: Consult & architect, Develop,    */
/*  Integrate, Test, deploy & operate. Each stage has a small visual that      */
/*  plays itself, and each stage marker can be clicked to revisit that stage.  */
/*  Nothing in a stage shows before its moment.                                */
/* -------------------------------------------------------------------------- */

type VisualProps = { on: boolean }

/**
 * How long each stage stays up, sized to the time it takes to read it:
 * words on screen / 3.5 words per second (about 210 wpm, a little under the
 * 238 wpm adult average because this is UI text) + 2s to notice the change.
 *   Consult & architect 30 words, Develop 24, Integrate 31,
 *   Test, deploy & operate 29.
 * Develop matches its animation: build the page (3.6s), then show it on
 * desktop (1.2s), tablet (1.5s) and phone, which is up by 6.3s and then holds.
 */
const STAGE_MS = [10500, 9000, 11000, 10500]

const TICK_MS = 800

export function WebDevCanvas() {
  // Reduced motion: rest on the second stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/* ------------------------ 1. Consult & architect --------------------------- */

const ARCHITECT_STEPS = [
  "Define the scope",
  "Evaluate the options",
  "Choose the right technologies",
  "Design the architecture",
]

const LAYERS: { icon: LucideIcon; label: string }[] = [
  { icon: Monitor, label: "Front end" },
  { icon: Server, label: "Back end & APIs" },
  { icon: Database, label: "Data" },
]

/**
 * A clear technical direction: four decisions, then the architecture they
 * lead to. Side by side from `sm` up so it fills the card; compact on phones.
 */
function ArchitectVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 7)

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
      <ul className="flex flex-col gap-2">
        {ARCHITECT_STEPS.map((step, i) => (
          <li
            key={step}
            className={reveal(
              t >= i + 1,
              "flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/5 px-3 py-2 text-sm text-foreground sm:h-14"
            )}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            {step}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-col sm:justify-between sm:gap-0">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon
          const shown = t >= 5 + i
          return (
            <React.Fragment key={layer.label}>
              {i > 0 && (
                <ChevronDown
                  className={reveal(
                    shown,
                    "hidden size-4 self-center text-primary sm:block"
                  )}
                />
              )}
              <span
                className={reveal(
                  shown,
                  "flex flex-col items-center justify-center gap-1 rounded-xl border border-primary bg-primary px-2 py-3 text-center text-xs leading-snug font-medium text-primary-foreground sm:h-20 sm:w-full sm:gap-2 sm:text-sm"
                )}
              >
                <Icon className="size-4 sm:size-5" />
                {layer.label}
              </span>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------ 2. Develop --------------------------------- */

const PRODUCTS = [
  "Websites",
  "Web applications",
  "SaaS platforms",
  "Customer portals",
]

type Device = "desktop" | "tablet" | "phone"

const DEVICES: { id: Device; icon: LucideIcon; label: string }[] = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "phone", icon: Smartphone, label: "Phone" },
]

/**
 * Frame width per device, as a share of the stage. Percentages on both ends
 * (no max-width involved) so the resize interpolates evenly the whole way.
 */
const FRAME_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "60%",
  phone: "30%",
}

const FRAME_RADIUS: Record<Device, string> = {
  desktop: "rounded-xl",
  tablet: "rounded-2xl",
  phone: "rounded-3xl",
}

const CARD_COLUMNS: Record<Device, string> = {
  desktop: "grid-cols-3",
  tablet: "grid-cols-2",
  phone: "grid-cols-1",
}

const RESIZE_MS = 600
/** The content reflows partway through the resize, not at the very start. */
const REFLOW_DELAY_MS = 250

/**
 * Wait before each step (step 0->1, 1->2, ...). Steps 1-5 build the page,
 * step 6 shows it on desktop, 7 on a tablet and 8 on a phone, each held long
 * enough to see the layout reflow.
 */
const DEVELOP_STEP_MS = [600, 600, 600, 600, 600, 600, 1200, 1500]

/** A page builds itself, then resizes from desktop to tablet to phone. */
function DevelopVisual({ on }: VisualProps) {
  const reduceMotion = useReducedMotion()
  const t = useTicker(on, DEVELOP_STEP_MS, 8)

  const device: Device = reduceMotion
    ? "desktop"
    : t >= 8
      ? "phone"
      : t === 7
        ? "tablet"
        : "desktop"
  const responsive = t >= 6

  // The cards change layout a moment after the frame starts resizing.
  const [layout, setLayout] = React.useState<Device>("desktop")
  React.useEffect(() => {
    const timer = setTimeout(() => setLayout(device), REFLOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [device])

  return (
    <div className="flex flex-col gap-4">
      {/* Fixed-size stage: the frame resizes inside it without moving
          anything around it. */}
      <div className="mx-auto flex h-40 w-full max-w-sm items-center justify-center">
        <div
          className={cn(
            "flex h-full flex-col overflow-hidden border border-border bg-background shadow-sm transition-[width,border-radius] ease-in-out",
            FRAME_RADIUS[device]
          )}
          style={{
            width: FRAME_WIDTH[device],
            transitionDuration: `${RESIZE_MS}ms`,
          }}
        >
          <div className="relative h-7 shrink-0 border-b border-border bg-muted">
            <div
              className={cn(
                "absolute inset-0 flex items-center gap-1.5 px-3 transition-opacity duration-300",
                device === "desktop" ? "opacity-100" : "opacity-0"
              )}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-border" />
              ))}
              <span className="ml-2 h-3 flex-1 rounded-full bg-background" />
            </div>
            <span
              className={cn(
                "absolute top-1/2 left-1/2 h-1.5 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border transition-opacity duration-300",
                device === "desktop" ? "opacity-0" : "opacity-100"
              )}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-3">
            <Block lit={t >= 1} className="h-3 w-2/5 shrink-0 bg-primary/40" />
            <Block lit={t >= 2} className="h-8 shrink-0 bg-primary/15" />
            <div className={cn("grid gap-2", CARD_COLUMNS[layout])}>
              {[0, 1, 2].map((i) => (
                <Block key={i} lit={t >= 3 + i} className="h-6 bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRODUCTS.map((product, i) => (
          <span
            key={product}
            className={reveal(
              t >= i + 2,
              "flex h-8 items-center rounded-full border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground"
            )}
          >
            {product}
          </span>
        ))}
      </div>

      <div
        className={reveal(
          responsive,
          "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground"
        )}
      >
        <span>Works across devices</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {DEVICES.map((d) => {
            const Icon = d.icon
            const current = responsive && d.id === device
            return (
              <span
                key={d.id}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-full px-1.5 font-medium transition-[background-color,color] duration-500 [transition-timing-function:var(--ease-out)] sm:px-2",
                  current
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent"
                )}
              >
                <Icon className="size-3.5" />
                {d.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** A page block. `layout` makes it glide to its new place when the grid reflows. */
function Block({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <motion.span
      layout
      transition={{
        duration: RESIZE_MS / 1000 - 0.1,
        ease: [0.77, 0, 0.175, 1],
      }}
      className={reveal(lit, cn("block rounded-md", className))}
    />
  )
}

/* ----------------------------- 3. Integrate -------------------------------- */

const CONNECT_TOP: { icon: LucideIcon; label: string }[] = [
  { icon: Cable, label: "APIs" },
  { icon: Database, label: "Databases" },
  { icon: KeyRound, label: "Authentication services" },
]

const CONNECT_BOTTOM: { icon: LucideIcon; label: string }[] = [
  { icon: CreditCard, label: "Payment gateways" },
  { icon: Sparkles, label: "AI tools" },
  { icon: Blocks, label: "Third-party systems" },
]

/** The platform is connected to the systems around it. */
function IntegrateVisual({ on }: VisualProps) {
  return (
    <SystemHub
      on={on}
      top={CONNECT_TOP}
      hub={{ icon: Globe, label: "Your platform" }}
      bottom={CONNECT_BOTTOM}
      bottomFlow="up"
      note="Information moves reliably between the different parts of your business."
    />
  )
}

/* ------------------------ 4. Test, deploy & operate ------------------------ */

const RELEASE: { icon: LucideIcon; label: string }[] = [
  { icon: ClipboardCheck, label: "Automated testing" },
  { icon: GitBranch, label: "CI/CD pipeline" },
  { icon: Cloud, label: "Cloud infrastructure" },
  { icon: Activity, label: "Monitor & improve" },
]

/** A release moves through testing, the pipeline and the cloud, then goes live. */
function DeployVisual({ on }: VisualProps) {
  const t = useTicker(on, TICK_MS, 5)

  return (
    <div className="flex flex-col gap-6">
      <ol className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {RELEASE.map((step, i) => {
          const Icon = step.icon
          return (
            <li
              key={step.label}
              className={reveal(
                t >= i + 1,
                "relative flex items-center gap-2 sm:flex-col sm:gap-3"
              )}
            >
              {i > 0 && (
                <span className="absolute top-7 right-[calc(50%+32px)] hidden h-0.5 w-[calc(100%-64px)] -translate-y-1/2 rounded-full bg-primary sm:block" />
              )}
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground min-[400px]:size-10 sm:size-14">
                <Icon className="size-4 sm:size-6" />
              </span>
              <span className="text-left text-xs leading-snug font-medium text-foreground sm:px-1 sm:text-center sm:text-sm">
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>

      <p
        className={reveal(
          t >= 5,
          "flex min-h-12 items-center justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
        )}
      >
        Live. We stay involved to keep improving it.
      </p>
    </div>
  )
}

/* --------------------------------- Stages ---------------------------------- */

const STAGES: ShowcaseStage[] = [
  {
    title: "Consult & architect",
    shortTitle: "Consult",
    icon: PencilRuler,
    description: "We turn business needs into a clear technical direction.",
    Visual: ArchitectVisual,
  },
  {
    title: "Develop",
    shortTitle: "Develop",
    icon: Code2,
    description:
      "Fast, responsive and secure, from the interface to the backend.",
    Visual: DevelopVisual,
  },
  {
    title: "Integrate",
    shortTitle: "Integrate",
    icon: Blocks,
    description: "Your platform connected to the systems around it.",
    Visual: IntegrateVisual,
  },
  {
    title: "Test, deploy & operate",
    shortTitle: "Deploy",
    icon: Rocket,
    description:
      "Automated testing and CI/CD pipelines release changes safely and consistently.",
    Visual: DeployVisual,
  },
]
