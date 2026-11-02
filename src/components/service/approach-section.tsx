import * as React from "react"
import { CircleCheck } from "lucide-react"

import { cn } from "cn"
import { Reveal } from "@/components/reveal"

export type ApproachPoint = {
  /** Bold opening phrase, including its full stop. */
  lead: string
  text: string
}

type ApproachSectionProps = {
  points: ApproachPoint[]
  /** The illustration shown on the right. */
  children: React.ReactNode
  /** The section heading. */
  title?: string
  /** A short intro under the heading. */
  description?: string
  /**
   * For long lists: start the illustration level with the heading instead of
   * centring it, so the right side isn't empty as the section scrolls in.
   */
  tall?: boolean
}

/**
 * "Our Approach": heading and checklist on the left, an illustration on the
 * right. Shared by the service pages; each page passes its own points and
 * illustration.
 */
export function ApproachSection({
  points,
  children,
  title = "Our Approach",
  description,
  tall,
}: ApproachSectionProps) {
  return (
    <section id="our-approach" className="scroll-mt-16 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-4">
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              {title}
            </h2>
            {description && (
              <p className="text-base text-muted-foreground">{description}</p>
            )}
          </Reveal>

          <ul className="flex flex-col gap-4">
            {points.map((point, i) => (
              <Reveal
                as="li"
                key={point.lead}
                delay={i * 0.06}
                className="flex items-start gap-4"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-sm font-medium text-muted-foreground">
                  <CircleCheck className="size-4" />
                </span>
                <p className="pt-1 text-base text-muted-foreground">
                  <strong className="font-medium text-foreground">
                    {point.lead}
                  </strong>{" "}
                  {point.text}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* The cell is as tall as the list; the illustration sits in it and, on
            wide screens, stays in view as a long list scrolls past. */}
        <div
          className={cn(
            "lg:flex lg:flex-col lg:self-stretch",
            tall ? "lg:justify-start" : "lg:justify-center"
          )}
        >
          <div className="lg:sticky lg:top-[max(7rem,calc(50vh_-_9rem))]">
            <Reveal delay={0.12}>{children}</Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
