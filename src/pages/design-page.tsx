import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Compass,
  Eye,
  Layers,
  LayoutTemplate,
  type LucideIcon,
  MessagesSquare,
  Rocket,
  ScanEye,
  Sparkles,
  Timer,
  UserCheck,
  Zap,
} from "lucide-react"

import { cn } from "cn"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { DesignBoard } from "@/components/service/design-board"
import { DesignCanvas } from "@/components/service/design-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { navigate } from "@/lib/router"
import { getService } from "@/lib/services"

const service = getService("design")!

/**
 * Only the hero is shown for now, like the other service pages. Set this to
 * `true` to bring back the sections below it (they are still in this file).
 */
const SHOW_LOWER_SECTIONS = false

export function DesignPage() {
  return (
    <ServicePage service={service}>
      <Hero />
      {SHOW_LOWER_SECTIONS && (
        <>
          <WhyClients />
          <WhatWeDo />
          <Approach />
          <Stack />
          <Scandinavian />
          <AiProcess />
          <Projects />
          <Cta />
        </>
      )}
    </ServicePage>
  )
}

/* ---------------------------------- Hero ----------------------------------- */

/**
 * Which hero showcase the page uses. The new design-system board is on; set
 * this to `false` to go back to the original single-card canvas, which is
 * still in the project (`design-canvas.tsx`).
 */
const USE_DESIGN_BOARD = true

function Hero() {
  return (
    <ServiceHero
      title="Design"
      description="We turn strategy, flows, and prototypes into polished digital experiences, from UX/UI and branding to marketing and visual communication."
    >
      {USE_DESIGN_BOARD ? <DesignBoard /> : <DesignCanvas />}
    </ServiceHero>
  )
}

/* ------------------------------ Why clients ------------------------------- */

function WhyClients() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 border-t border-border pt-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              Why clients come to us
            </h2>
          </Reveal>
          <Reveal
            delay={0.08}
            className="flex flex-col gap-6 text-lg text-muted-foreground"
          >
            <p>
              Most clients don't arrive with a finished specification. They show
              up with a rough prototype, a handful of screenshots, or just an
              idea of what the product should feel like. Some have an existing
              app that's grown clunky and needs a rethink.
            </p>
            <p className="text-foreground">
              Wherever the starting point is, the design team picks up from
              there instead of asking clients to arrive design-ready.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- What we do ------------------------------- */

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Compass,
    title: "Discovery",
    text: "We understand your users, business goals, and challenges to define the right problem to solve.",
  },
  {
    icon: Sparkles,
    title: "AI Prototyping",
    text: "We turn ideas into AI-powered prototypes that are easy to validate.",
  },
  {
    icon: LayoutTemplate,
    title: "High-fidelity Design",
    text: "We refine validated concepts into polished, scalable interfaces with a strong focus on usability.",
  },
  {
    icon: Rocket,
    title: "Implementation",
    text: "We work with development to bring the solution to life and ensure a polished final product.",
  },
]

function WhatWeDo() {
  return (
    <section className="bg-muted/50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="What we do"
          title="From problem to final experience"
          description="We turn ideas into clear, usable digital products through a structured design process, from understanding the problem to creating and delivering the final experience."
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 0.08}
                className="group/step"
              >
                <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-background p-6 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover/step:scale-105">
                      <Icon className="size-6 transition-transform duration-300 ease-out group-hover/step:-rotate-6" />
                    </span>
                    <span className="font-heading text-sm font-medium text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-medium tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------- Our approach ------------------------------ */

const APPROACH = [
  {
    lead: "Flexes to what the client already has.",
    text: "No two engagements start from the same place, so the process doesn't force one.",
  },
  {
    lead: "Strong direction? We sharpen it.",
    text: "If the client has a strong direction, the team works from that foundation and sharpens it, rather than overriding it.",
  },
  {
    lead: "Only a problem to solve? We lead.",
    text: "The team leads the design from a blank page, building structure and direction from scratch.",
  },
  {
    lead: "Sometimes it's genuinely shared.",
    text: "Clients co-create parts of the interface alongside our designers.",
  },
]

function Approach() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <SectionHeading
          align="left"
          eyebrow="Our approach"
          title="We meet you where you are"
          description="Whatever you bring to the table, the process bends to fit it."
        />
        <ul className="flex flex-col">
          {APPROACH.map((item, i) => (
            <Reveal
              as="li"
              key={item.lead}
              delay={i * 0.06}
              className="group/item"
            >
              <div className="flex gap-6 border-t border-border py-6">
                <span className="font-heading text-sm font-medium text-primary">
                  0{i + 1}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium tracking-tight">
                    {item.lead}
                  </h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------ Stacks & methods ---------------------------- */

const TOOLS = [
  {
    name: "Claude",
    role: "AI-assisted mockups and first drafts",
    mark: "C",
    tint: "#D97757",
  },
  {
    name: "tldraw",
    role: "Quick sketches and flow diagrams",
    mark: "t",
    tint: "#1F2937",
  },
  {
    name: "Figma",
    role: "Wireframes and high-fidelity design",
    mark: "F",
    tint: "#A259FF",
  },
]

function Stack() {
  return (
    <section className="bg-muted/50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <SectionHeading
          align="left"
          eyebrow="Stacks & methods"
          title="The right tool for each stage"
          description="We use Claude and Figma Make for AI-assisted mockups, with Figma for wireframing and high-fidelity design, and adapt our tools and talent on demand as projects evolve."
        />
        <ul className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <Reveal
              as="li"
              key={tool.name}
              delay={i * 0.08}
              className="group/tool"
            >
              <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-background p-6 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40">
                <span
                  className="flex size-12 items-center justify-center rounded-xl font-heading text-xl font-semibold text-white transition-transform duration-300 ease-out group-hover/tool:scale-105 group-hover/tool:-rotate-6"
                  style={{ backgroundColor: tool.tint }}
                >
                  {tool.mark}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tool.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------ Scandinavian ------------------------------- */

const PRINCIPLES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Zap,
    title: "Function before flourish",
    text: "Every screen is built to do its job clearly first. Visual polish comes after usability, not instead of it.",
  },
  {
    icon: ScanEye,
    title: "Restraint as a design choice, not a limitation",
    text: "Removing unnecessary elements isn't about minimalism for its own sake. It's about making sure nothing gets in the way of what the user actually needs to do.",
  },
  {
    icon: UserCheck,
    title: "Accessibility built in, not bolted on",
    text: "Scandinavian design has long prioritized designing for everyone, not just the average user, a principle that shapes how interfaces are built from the start rather than patched later.",
  },
  {
    icon: Eye,
    title: "Honesty in interaction",
    text: "Interfaces behave the way they look like they'll behave. No hidden gestures, no decorative elements pretending to be functional ones.",
  },
]

function Scandinavian() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Our philosophy"
          title="Scandinavian design, applied to software"
          description="Most people picture whitespace and pale wood. Scandinavian design is really a functional philosophy: form follows function, nothing without purpose. That's the standard we design to."
          className="max-w-3xl"
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal
                as="li"
                key={p.title}
                delay={(i % 2) * 0.08}
                className="group/principle"
              >
                <div className="flex h-full gap-6 rounded-2xl border border-border p-6 transition-[border-color,background-color] duration-300 ease-out hover:border-primary/40 hover:bg-primary/5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover/principle:scale-105">
                    <Icon className="size-6 transition-transform duration-300 ease-out group-hover/principle:-rotate-6" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium tracking-tight text-balance">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------- AI in process ----------------------------- */

const AI_POINTS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Timer,
    title: "Faster first drafts",
    text: "Instead of starting from a blank canvas, AI helps generate initial design directions the team can react to and refine, turning the first hours of a project into a meaningful starting point rather than a blank page. It gives designers something concrete so more time can be spent improving the right direction.",
  },
  {
    icon: ScanEye,
    title: "Validation before build",
    text: "Clickable AI prototypes let users and stakeholders test real flows before development starts, so assumptions are checked while changes are still cheap.",
  },
  {
    icon: MessagesSquare,
    title: "Prototypes, built in real time",
    text: "In workshops we turn the conversation into working screens on the spot, so clients react to something tangible instead of imagining it.",
  },
  {
    icon: Layers,
    title: "Human direction, AI execution",
    text: "Designers own the problem, the constraints and the taste. AI speeds up the execution, and every decision is still made and reviewed by a person.",
  },
]

const AI_STEP_SECONDS = 6

/** Auto-playing showcase: cycles through the four points while on screen. */
function AiProcess() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-120px" })
  const reduceMotion = useReducedMotion()
  const playing = inView && !reduceMotion
  const [active, setActive] = React.useState(0)

  return (
    <section className="bg-muted/50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="AI in our process"
          title="How AI shapes our design process"
          description="AI plays a specific, deliberate role in our design process: not a shortcut, but a tool used at the right stage."
        />

        <div ref={ref} className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <div
            role="tablist"
            aria-label="How we use AI"
            className="flex flex-col gap-2"
          >
            {AI_POINTS.map((p, i) => {
              const TabIcon = p.icon
              const selected = i === active
              return (
                <button
                  key={p.title}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-200 ease-out",
                    selected
                      ? "border-primary/40 bg-background"
                      : "border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl transition-[background-color,color] duration-200 ease-out",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <TabIcon className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "font-heading text-base font-medium tracking-tight transition-colors duration-200",
                      selected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {p.title}
                  </span>
                  {selected && playing && (
                    <motion.span
                      key={`${active}-progress`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1 origin-left bg-primary/40"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AI_STEP_SECONDS, ease: "linear" }}
                      onAnimationComplete={() =>
                        setActive((n) => (n + 1) % AI_POINTS.length)
                      }
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* All panels share one grid cell, so the box is as tall as the
              longest text and never jumps when the active point changes. */}
          <div
            role="tabpanel"
            className="relative grid overflow-hidden rounded-3xl border border-border bg-background p-6 sm:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl"
            />
            {AI_POINTS.map((p, i) => {
              const Icon = p.icon
              const selected = i === active
              return (
                <div
                  key={p.title}
                  aria-hidden={!selected}
                  className={cn(
                    "relative flex flex-col gap-6 transition-[opacity,transform] duration-500 ease-out [grid-area:1/1]",
                    selected
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  )}
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="size-7" />
                  </span>
                  <h3 className="text-2xl font-medium tracking-tight text-balance sm:text-3xl">
                    {p.title}
                  </h3>
                  <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {p.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- Projects ------------------------------- */

const PROJECTS = [
  {
    name: "Hugo Assist",
    text: "Hugo Assist is an AI-powered platform that guides entrepreneurs in shaping their business ideas and strategies.",
    tags: ["Web app", "Mobile App"],
    Visual: HugoVisual,
  },
  {
    name: "Bring Driver App",
    text: "The Bring Cargo Driver app is a vital component of daily operations for Bring Supply Base Logistics.",
    tags: ["Web app", "Mobile App"],
    Visual: BringVisual,
  },
]

function Projects() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Related projects"
          title="Design in the real world"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <Reveal
              as="article"
              key={project.name}
              delay={i * 0.08}
              className="group/project"
            >
              <a
                href="#"
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-primary/15 to-primary/5">
                  <project.Visual />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-medium tracking-tight">
                      {project.name}
                    </h3>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover/project:rotate-45" />
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.text}
                  </p>
                  <div className="mt-auto flex gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function HugoVisual() {
  return (
    <div className="absolute inset-x-8 top-8 bottom-0 flex flex-col gap-3 rounded-t-2xl border border-b-0 border-border bg-background p-4 shadow-lg transition-transform duration-500 ease-out group-hover/project:-translate-y-1">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          H
        </span>
        <span className="text-sm font-medium">Hugo</span>
      </div>
      <span className="max-w-[75%] self-start rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-sm">
        What problem does your idea solve?
      </span>
      <span className="max-w-[75%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        Helping cafés cut food waste.
      </span>
      <span className="max-w-[75%] self-start rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-sm">
        Great. Let's size the market next.
      </span>
    </div>
  )
}

function BringVisual() {
  return (
    <div className="absolute top-8 left-1/2 h-full w-48 -translate-x-1/2">
      <div className="flex size-full flex-col gap-2 rounded-t-3xl border border-b-0 border-border bg-background p-3 shadow-lg transition-transform duration-500 ease-out group-hover/project:-translate-y-1">
        <div className="relative h-24 overflow-hidden rounded-xl bg-primary/10">
          <svg viewBox="0 0 160 96" className="size-full" fill="none">
            <path
              d="M12 76 C48 76 40 28 80 40 S120 70 148 20"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 8"
              className="text-primary"
            />
            <circle cx="12" cy="76" r="6" className="fill-primary" />
            <circle
              cx="148"
              cy="20"
              r="6"
              className="fill-background stroke-primary"
              strokeWidth="3"
            />
          </svg>
        </div>
        {["Stop 1 · Oslo", "Stop 2 · Drammen", "Stop 3 · Asker"].map(
          (stop, i) => (
            <span
              key={stop}
              className={cn(
                "flex h-8 items-center rounded-lg px-3 text-xs",
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {stop}
            </span>
          )
        )}
      </div>
    </div>
  )
}

/* ----------------------------------- CTA ----------------------------------- */

function Cta() {
  return (
    <section className="pb-16 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground sm:px-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_70%_at_50%_0%,black,transparent)] bg-[size:3rem_3rem]" />
          </div>
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              Ready to build something great?
            </h2>
            <p className="text-lg text-balance text-primary-foreground/80">
              Let's talk about where your business could go with the right tech
              team behind it.
            </p>
            <button
              type="button"
              onClick={() => navigate("#contact")}
              className="group/cta mt-2 inline-flex h-12 items-center gap-3 rounded-full bg-primary-foreground py-1 pr-1 pl-5 text-base font-medium text-primary transition-transform duration-200 ease-out focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none active:translate-y-px"
            >
              Let's talk
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ArrowUpRight
                  className="size-5 transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover/cta:rotate-45"
                  strokeWidth={2.5}
                />
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
