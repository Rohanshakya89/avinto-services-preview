import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import type { LucideIcon } from "lucide-react"
import { BarChart3, Mail, Megaphone, Search, Share2 } from "lucide-react"

import { cn } from "cn"
import { SectionHeading } from "@/components/section-heading"
import {
  AnalyticsVisual,
  EmailVisual,
  PaidVisual,
  SeoVisual,
  SocialVisual,
} from "@/components/sections/service-visuals"

type Service = {
  icon: LucideIcon
  title: string
  description: string
  Visual: () => React.JSX.Element
}

// Characteristic one-shot motion played when a service becomes active.
const ICON_ACTIVE_ANIM: Record<number, Record<string, number[]>> = {
  0: { rotate: [0, -16, 10, 0] }, // search — scans
  1: { rotate: [0, -14, 8, 0] }, // megaphone — announces
  2: { scale: [1, 1.22, 1] }, // social — pulses
  3: { scale: [1, 0.84, 1.12, 1] }, // email — sends
  4: { scaleY: [1, 1.3, 1] }, // analytics — bars grow
}

const SERVICES: Service[] = [
  {
    icon: Search,
    title: "Search & SEO",
    description:
      "Rank for the terms your buyers actually search — and stay there as it compounds.",
    Visual: SeoVisual,
  },
  {
    icon: Megaphone,
    title: "Paid Advertising",
    description:
      "ROI-positive campaigns across Google, Meta, and LinkedIn, optimized daily.",
    Visual: PaidVisual,
  },
  {
    icon: Share2,
    title: "Social Media",
    description:
      "Build an audience that trusts you with content worth sharing.",
    Visual: SocialVisual,
  },
  {
    icon: Mail,
    title: "Email & Automation",
    description:
      "Lifecycle flows that nurture leads into customers on autopilot.",
    Visual: EmailVisual,
  },
  {
    icon: BarChart3,
    title: "Analytics & CRO",
    description:
      "Turn traffic into conversions with rigorous testing and clear reporting.",
    Visual: AnalyticsVisual,
  },
]

export function Services() {
  return (
    <section id="services" className="scroll-mt-24">
      <PinnedServices />
      <StackedServices />
    </section>
  )
}

/* ---------------- Desktop: pinned scroll-driven ---------------- */

function PinnedServices() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(SERVICES.length - 1, Math.floor(p * SERVICES.length))
    setActive(idx)
  })

  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = window.scrollY + el.getBoundingClientRect().top
    const scrollable = el.offsetHeight - window.innerHeight
    const target = top + (i / SERVICES.length) * scrollable + scrollable / (SERVICES.length * 2)
    window.scrollTo({ top: target, behavior: "smooth" })
  }

  const ActiveVisual = SERVICES[active].Visual

  return (
    <div
      ref={ref}
      className="relative hidden px-6 lg:block"
      style={{ height: `${SERVICES.length * 70}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
              What we do
            </span>
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Everything you need to grow
            </h2>
          </div>

          <div className="grid grid-cols-2 items-center gap-12">
            <ul className="flex flex-col gap-2">
              {SERVICES.map((service, i) => {
                const Icon = service.icon
                const isActive = i === active
                return (
                  <li key={service.title}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className="group relative flex w-full items-start gap-4 rounded-2xl p-4 text-left"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeService"
                          className="absolute inset-0 rounded-2xl border border-primary/40 bg-primary/10"
                          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border transition-[border-color,background-color,transform] duration-300 ease-out group-hover:scale-110",
                          isActive
                            ? "border-primary/40 bg-background text-primary"
                            : "border-border bg-card text-muted-foreground"
                        )}
                      >
                        <motion.span
                          animate={isActive ? ICON_ACTIVE_ANIM[i] : { rotate: 0, scale: 1, scaleY: 1 }}
                          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                          className="flex"
                        >
                          <Icon className="size-5" />
                        </motion.span>
                      </span>
                      <span className="relative z-10 flex flex-col gap-1">
                        <span
                          className={cn(
                            "font-heading text-lg font-medium tracking-tight transition-colors duration-300",
                            isActive ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {service.title}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-relaxed transition-colors duration-300",
                            isActive
                              ? "text-muted-foreground"
                              : "text-muted-foreground/40"
                          )}
                        >
                          {service.description}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="h-[24rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, transform: "translateY(12px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0, transform: "translateY(-12px)" }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full"
                >
                  <ActiveVisual />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Mobile: simple stacked cards ---------------- */

function StackedServices() {
  return (
    <div className="px-6 py-24 lg:hidden">
      <SectionHeading
        eyebrow="What we do"
        title="Everything you need to grow"
        description="One team handling the full funnel, end to end."
        align="left"
      />
      <div className="mx-auto mt-12 flex max-w-xl flex-col gap-8">
        {SERVICES.map((service) => {
        const Icon = service.icon
        const Visual = service.Visual
        return (
          <div key={service.title} className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-background text-primary">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-xl font-medium tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>
            <div className="h-[20rem]">
              <Visual />
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
