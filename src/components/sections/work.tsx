import { ArrowUpRight } from "lucide-react"

import { cn } from "cn"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

type CaseStudy = {
  client: string
  category: string
  title: string
  metric: string
  metricLabel: string
  gradient: string
}

const CASES: CaseStudy[] = [
  {
    client: "Lumina",
    category: "SaaS",
    title: "Scaled inbound pipeline with a content engine",
    metric: "+312%",
    metricLabel: "organic traffic",
    gradient: "from-orange-500/30 to-amber-400/10",
  },
  {
    client: "Vertex",
    category: "E-commerce",
    title: "Cut acquisition cost while tripling ad spend",
    metric: "-41%",
    metricLabel: "cost per acquisition",
    gradient: "from-rose-500/30 to-orange-400/10",
  },
  {
    client: "Monarch",
    category: "Fintech",
    title: "Rebuilt lifecycle emails into a revenue channel",
    metric: "6.2x",
    metricLabel: "return on investment",
    gradient: "from-amber-500/30 to-yellow-300/10",
  },
]

export function Work() {
  return (
    <section id="work" className="scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our work"
          title="Results that speak for themselves"
          description="A few of the teams we've helped turn marketing into a growth engine."
        />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((item, i) => (
            <Reveal
              as="article"
              key={item.client}
              delay={i * 0.08}
              className="group/case"
            >
              <a
                href="#work"
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden bg-gradient-to-br",
                    item.gradient
                  )}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
                  <div className="absolute bottom-6 left-6">
                    <div className="font-heading text-4xl font-bold tracking-tight text-foreground">
                      {item.metric}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.metricLabel}
                    </div>
                  </div>
                  <span className="absolute top-6 left-6 inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="flex flex-1 items-start justify-between gap-4 p-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      {item.client}
                    </span>
                    <h3 className="font-heading text-lg font-medium tracking-tight text-balance">
                      {item.title}
                    </h3>
                  </div>
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border text-muted-foreground transition-colors duration-300 group-hover/case:border-primary/40 group-hover/case:text-primary">
                    <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover/case:-translate-y-px group-hover/case:translate-x-px" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
