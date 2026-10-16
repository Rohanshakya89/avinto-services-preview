import type { CSSProperties } from "react"

import { Reveal } from "@/components/reveal"

const LOGOS = [
  "Northwind",
  "Lumina",
  "Hexagon",
  "Vertex",
  "Quanta",
  "Monarch",
  "Aperture",
  "Beacon",
]

function LogoTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center"
    >
      {LOGOS.map((logo) => (
        <li
          key={logo}
          className="px-8 font-heading text-xl font-bold tracking-tight whitespace-nowrap text-muted-foreground/70"
        >
          {logo}
        </li>
      ))}
    </ul>
  )
}

export function LogoCloud() {
  return (
    <section className="border-y border-border/60 py-12">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-8">
        <p className="px-6 text-sm text-muted-foreground">
          Trusted by fast-growing teams worldwide
        </p>

        <div className="group/marquee relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="flex w-max animate-marquee"
            style={{ "--marquee-duration": "38s" } as CSSProperties}
          >
            <LogoTrack />
            <LogoTrack ariaHidden />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
