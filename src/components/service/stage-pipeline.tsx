import { Check, type LucideIcon } from "lucide-react"

import { cn } from "cn"

/**
 * The stages of a service as numbered nodes on a line. Earlier stages show as
 * done, the current one is filled, and the line to the next stage fills slowly
 * so you can see when it will be reached. Each stage can be clicked to jump to it. Shared by the
 * service-page showcases.
 */
export function StagePipeline({
  stages,
  active,
  onSelect,
  progress,
}: {
  stages: { title: string; shortTitle?: string; icon: LucideIcon }[]
  active: number
  onSelect: (index: number) => void
  /**
   * While autoplay runs, the line to the next stage fills over `ms` and
   * reaches that stage exactly when autoplay moves on. `id` restarts it.
   */
  progress?: { ms: number; id: number } | null
}) {
  return (
    <ol
      className="mx-auto grid max-w-2xl"
      style={{
        gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
      }}
    >
      {stages.map((stage, i) => {
        const Icon = stage.icon
        const done = i < active
        const current = i === active
        return (
          <li key={stage.title} className="relative">
            {/* line to the previous node, ending at each node's edge */}
            {i > 0 && (
              <span className="absolute top-6 right-[calc(50%+28px)] h-0.5 w-[calc(100%-56px)] -translate-y-1/2 overflow-hidden rounded-full bg-border">
                <span
                  key={i === active + 1 && progress ? progress.id : "static"}
                  className={cn(
                    "block h-full origin-left bg-primary transition-transform duration-[550ms] [transition-timing-function:var(--ease-out)]",
                    i <= active || (i === active + 1 && progress)
                      ? "scale-x-100"
                      : "scale-x-0"
                  )}
                  style={
                    i === active + 1 && progress
                      ? {
                          animation: `progress-fill ${progress.ms}ms linear forwards`,
                        }
                      : undefined
                  }
                />
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Show ${stage.title}`}
              aria-current={current ? "step" : undefined}
              className="group/stage flex w-full flex-col items-center gap-3 rounded-xl pb-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  "relative flex size-12 items-center justify-center rounded-full border-2 transition-[background-color,border-color,color,transform,box-shadow] duration-[500ms] [transition-timing-function:var(--ease-out)]",
                  current &&
                    "scale-110 border-primary bg-primary text-primary-foreground shadow-lg",
                  done &&
                    "border-primary bg-background text-primary group-hover/stage:bg-primary/10",
                  !current &&
                    !done &&
                    "border-border bg-background text-muted-foreground group-hover/stage:border-primary/50 group-hover/stage:text-primary"
                )}
              >
                {done ? (
                  <Check className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
              </span>
              <span
                className={cn(
                  "text-center text-[11px] leading-snug font-medium transition-colors duration-[500ms] [transition-timing-function:var(--ease-out)] sm:px-1 sm:text-sm",
                  current
                    ? "text-foreground"
                    : "text-muted-foreground group-hover/stage:text-foreground"
                )}
              >
                {/* One-word label; the card below carries the full name. */}
                {stage.shortTitle ?? stage.title}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
