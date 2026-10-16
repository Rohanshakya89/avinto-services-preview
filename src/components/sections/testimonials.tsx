import { Star } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nova rebuilt our entire acquisition strategy. Within two quarters we went from guessing to a predictable pipeline we can forecast.",
    name: "Sarah Chen",
    role: "VP Marketing, Lumina",
    initials: "SC",
  },
  {
    quote:
      "The only agency that actually cared about revenue, not vanity metrics. Our CAC dropped while we scaled spend 3x.",
    name: "Marcus Webb",
    role: "Founder, Vertex",
    initials: "MW",
  },
  {
    quote:
      "Clear reporting, zero fluff, and a team that feels like an extension of ours. Best marketing decision we've made.",
    name: "Priya Nair",
    role: "Head of Growth, Monarch",
    initials: "PN",
  },
  {
    quote:
      "They turned our newsletter into our second-biggest revenue channel in under six months. Genuinely remarkable.",
    name: "Daniel Okoro",
    role: "CMO, Northwind",
    initials: "DO",
  },
]

export function Testimonials() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by the teams we work with"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((item, i) => (
            <Reveal as="article" key={item.name} delay={(i % 2) * 0.08} className="h-full">
              <div className="group flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-8 transition-[transform,border-color] duration-300 ease-out hover:border-primary/30 [@media(hover:hover)]:hover:-translate-y-1">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="size-4 transition-transform duration-300 ease-out group-hover:scale-110"
                      style={{ transitionDelay: `${s * 40}ms` }}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <blockquote className="text-lg leading-relaxed text-balance">
                  "{item.quote}"
                </blockquote>
                <div className="mt-auto flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-muted font-heading text-sm font-medium text-foreground">
                    {item.initials}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
