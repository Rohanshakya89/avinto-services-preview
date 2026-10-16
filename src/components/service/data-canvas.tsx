import { Check, Database, FlaskConical, Rocket, Sparkles } from "lucide-react"

import { cn } from "cn"
import { reveal } from "@/components/service/reveal"
import {
  StageShowcase,
  type ShowcaseStage,
} from "@/components/service/stage-showcase"
import { useTicker } from "@/components/service/use-stage-player"

/* -------------------------------------------------------------------------- */
/*  Showcase hero for the AI & Data page. Everything shown comes from the      */
/*  page's own "What we do" and "Technologies We Use" content: the four        */
/*  stages from first experiment to production, what each one involves, and    */
/*  the technology behind it. It plays itself, and each stage marker can be    */
/*  clicked to revisit that stage.                                             */
/* -------------------------------------------------------------------------- */

type StageContent = {
  items: string[]
  /** Label + chips for the technology used at this stage. */
  tech?: { label: string; chips: string[] }
  /** Shown instead of technology when a stage has none. */
  note?: string
}

const CONTENT: StageContent[] = [
  {
    items: [
      "Find where AI makes a measurable difference",
      "Test the idea with a working prototype",
      "See real results early",
    ],
    note: "We're honest when an idea isn't ready.",
  },
  {
    items: [
      "Conversational interfaces",
      "Document understanding",
      "Recommendations",
      "Search",
      "Classification",
      "Personalised experiences",
    ],
    tech: { label: "AI models", chips: ["OpenAI", "Anthropic"] },
  },
  {
    items: ["Bring your data together", "Clean it", "Keep it flowing reliably"],
    tech: {
      label: "Technology",
      chips: ["Python", "FastAPI", "Django", "PostgreSQL", "Vector search"],
    },
  },
  {
    items: [
      "Monitoring",
      "Evaluation",
      "Cost control",
      "Refine prompts and models",
    ],
    tech: { label: "Cloud", chips: ["Azure"] },
  },
]

/**
 * How long each stage stays up. Kept brisk on purpose, a little under the
 * time it takes to read it fully; sized from:
 * words on screen / 3.5 words per second (about 210 wpm, a little under the
 * 238 wpm adult average because this is UI text) + 2s to notice the change.
 *   Explore & validate 27 words, Build AI features 16,
 *   Data & integration 19, Deploy & improve 12.
 */
const STAGE_MS = [6500, 4500, 5000, 4000]

const ITEM_STEP_MS = 320

export function DataCanvas() {
  // Reduced motion: rest on the "Build AI features" stage and stay still.
  return <StageShowcase stages={STAGES} durations={STAGE_MS} restStage={1} />
}

/** Items appear one by one, then the technology (or note) that goes with them. */
function makeVisual(content: StageContent) {
  return function StageVisual({ on }: { on: boolean }) {
    const n = content.items.length
    // The first item is there from the start; the rest follow quickly.
    const t = useTicker(on, ITEM_STEP_MS, n)

    return (
      <div className="flex flex-col gap-5">
        <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {content.items.map((item, i) => (
            <li
              key={item}
              className={reveal(
                t >= i,
                "flex items-center gap-3 text-sm",
                true
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* The divider, label and chips all come in together. */}
        <div
          className={reveal(
            t >= n,
            "flex flex-wrap items-center gap-2 border-t border-border pt-4",
            true
          )}
        >
          {content.tech ? (
            <>
              <span className="mr-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {content.tech.label}
              </span>
              {content.tech.chips.map((chip, i) => (
                <span
                  key={chip}
                  className={cn(
                    "rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary transition-[opacity,translate] duration-[450ms] [transition-timing-function:var(--ease-out)]",
                    t >= n
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  )}
                  style={{
                    transitionDelay: t >= n ? `${100 + i * 70}ms` : "0ms",
                  }}
                >
                  {chip}
                </span>
              ))}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              {content.note}
            </span>
          )}
        </div>
      </div>
    )
  }
}

const STAGES: ShowcaseStage[] = [
  {
    title: "Explore & validate",
    shortTitle: "Explore",
    icon: FlaskConical,
    Visual: makeVisual(CONTENT[0]),
  },
  {
    title: "Build AI features",
    shortTitle: "Build",
    icon: Sparkles,
    Visual: makeVisual(CONTENT[1]),
  },
  {
    title: "Data & integration",
    shortTitle: "Data",
    icon: Database,
    Visual: makeVisual(CONTENT[2]),
  },
  {
    title: "Deploy & improve",
    shortTitle: "Deploy",
    icon: Rocket,
    Visual: makeVisual(CONTENT[3]),
  },
]
