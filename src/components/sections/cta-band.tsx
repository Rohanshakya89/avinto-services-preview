import { ChipButton } from "@/components/chip-button"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

export function CtaBand() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-20 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute top-[-8rem] left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_50%_60%_at_50%_0%,black,transparent)]" />
        </div>
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Ready to turn attention into revenue?
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Book a free growth audit and we'll show you exactly where your
            biggest opportunities are — no strings attached.
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <ChipButton label="Get a free growth audit" />
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-6 text-base"
            >
              View pricing
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
