import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "cn"
import { StagePipeline } from "@/components/service/stage-pipeline"
import { useStagePlayer } from "@/components/service/use-stage-player"

export type ShowcaseStage = {
  title: string
  /** One-word label for the checkpoint row; the card keeps the full title. */
  shortTitle?: string
  icon: LucideIcon
  /** One line under the title, in the page's own words. */
  description?: string
  /** Small self-playing visual; `on` is true while the stage is showing. */
  Visual: React.ComponentType<{ on: boolean }>
}

const NARROW_QUERY = "(max-width: 639px)"

/** True on phone-sized screens. */
function useNarrow() {
  return React.useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(NARROW_QUERY)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false
  )
}

/**
 * Hero showcase shared by the service pages: the page's stages as clickable
 * checkpoints on top, and one card below showing the current stage. It plays
 * itself (each stage for its own duration) and each checkpoint can be clicked
 * to revisit a stage. With reduced motion it rests on `restStage`.
 */
export function StageShowcase({
  stages,
  durations,
  restStage,
}: {
  stages: ShowcaseStage[]
  durations: number[]
  restStage: number
}) {
  const { ref, active, select, run, playing } = useStagePlayer(
    durations,
    restStage
  )
  const narrow = useNarrow()
  const cardRef = React.useRef<HTMLDivElement>(null)

  // On phones the card follows the current stage's own height (and eases
  // between heights) instead of always being as tall as the tallest stage,
  // which would leave a big empty gap under short stages. On larger screens
  // the height stays fixed, so the page below never moves.
  React.useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return
    if (!narrow) {
      card.style.height = ""
      return
    }
    const stage = card.children[active] as HTMLElement | undefined
    if (!stage) return
    const style = getComputedStyle(card)
    const chrome =
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth)
    const apply = () => {
      card.style.height = `${stage.offsetHeight + chrome}px`
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [narrow, active, stages.length])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-border bg-muted/50 [background-image:radial-gradient(var(--color-border)_1.5px,transparent_1.5px)] [background-size:24px_24px] p-4 select-none sm:p-8"
    >
      <StagePipeline
        stages={stages}
        active={active}
        onSelect={select}
        progress={playing ? { ms: durations[active], id: run } : null}
      />

      <div className="mx-auto mt-8 max-w-2xl">
        {/* All stages share one grid cell. From `sm` up the card is as tall
            as the tallest stage and never changes size; on phones it takes
            the height of the current stage. */}
        <div
          ref={cardRef}
          className="grid items-start overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-lg [transition-property:height] duration-[500ms] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none sm:items-stretch sm:overflow-visible sm:p-6"
        >
          {stages.map((stage, i) => (
            <StageDetail
              key={stage.title}
              stage={stage}
              index={i}
              total={stages.length}
              on={i === active}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * The outgoing stage fades out quickly; the incoming one waits for it, then
 * eases in with a small rise. They never overlap, so the swap stays clean.
 */
function StageDetail({
  stage,
  index,
  total,
  on,
}: {
  stage: ShowcaseStage
  index: number
  total: number
  on: boolean
}) {
  const Icon = stage.icon
  return (
    <div
      aria-hidden={!on}
      className={cn(
        "flex min-w-0 flex-col gap-5 [transition-property:opacity,translate] [transition-timing-function:var(--ease-out)] [grid-area:1/1] motion-reduce:transition-none",
        on
          ? "translate-y-0 opacity-100 delay-[140ms] duration-[500ms]"
          : "pointer-events-none translate-y-2 opacity-0 duration-[160ms]"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-10">
            <Icon className="size-4 sm:size-5" />
          </span>
          <span className="min-w-0 font-heading text-lg leading-tight font-medium tracking-tight break-words sm:text-xl sm:leading-none">
            {stage.title}
          </span>
          <span className="ml-auto shrink-0 text-sm whitespace-nowrap text-muted-foreground tabular-nums">
            {index + 1} / {total}
          </span>
        </div>
        {stage.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {stage.description}
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center border-t border-border pt-5">
        <stage.Visual on={on} />
      </div>
    </div>
  )
}
