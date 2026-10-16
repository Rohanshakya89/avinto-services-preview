import * as React from "react"

import { PillButton } from "@/components/pill-button"
import { navigate } from "@/lib/router"

/** Shared hero for service pages: title, description, CTA and a showcase slot. */
export function ServiceHero({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-16rem] left-1/2 h-[36rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] bg-[size:3rem_3rem] opacity-40" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h1 className="animate-fade-up text-4xl font-semibold tracking-tight [animation-delay:60ms] sm:text-5xl">
          {title}
        </h1>
        <p className="animate-fade-up mt-4 max-w-2xl text-base text-balance text-muted-foreground [animation-delay:120ms]">
          {description}
        </p>
        <div className="animate-fade-up mt-8 [animation-delay:180ms]">
          <PillButton
            label="Contact us"
            arrow
            onClick={() => navigate("#contact")}
          />
        </div>
      </div>

      <div className="animate-fade-up mx-auto mt-16 max-w-5xl px-6 [animation-delay:240ms]">
        {children}
      </div>
    </section>
  )
}
