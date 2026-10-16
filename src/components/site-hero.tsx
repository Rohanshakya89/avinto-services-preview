import { PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChipButton } from "@/components/chip-button"

export function SiteHero() {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-[-14rem] left-1/2 h-[34rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="animate-fade-up mt-6 text-5xl font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Marketing that <span className="text-primary">moves the needle</span>
        </h1>

        <p className="animate-fade-up [animation-delay:90ms] mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
          We plan, launch, and optimize digital campaigns that turn attention
          into pipeline — so your team can focus on closing, not chasing
          clicks.
        </p>

        <div className="animate-fade-up [animation-delay:170ms] mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <ChipButton label="Get a free growth audit" />
          <Button
            variant="outline"
            size="lg"
            className="h-12 gap-2 rounded-full px-6 text-base"
          >
            <PlayIcon className="size-4 transition-transform duration-200 ease-out group-hover/button:scale-110" fill="currentColor" />
            Watch showreel
          </Button>
        </div>
      </div>
    </section>
  )
}
