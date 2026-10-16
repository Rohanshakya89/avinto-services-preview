import { Check } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { ChipButton } from "@/components/chip-button"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

export type Plan = {
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  featured?: boolean
  cta: string
}

export const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$2,500",
    cadence: "/mo",
    description: "For early teams finding their first channel.",
    features: [
      "1 primary growth channel",
      "Monthly strategy call",
      "Performance dashboard",
      "Email support",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    price: "$6,000",
    cadence: "/mo",
    description: "For teams ready to scale what works.",
    features: [
      "Up to 3 growth channels",
      "Weekly strategy calls",
      "Conversion rate optimization",
      "Dedicated account lead",
      "Priority support",
    ],
    featured: true,
    cta: "Scale with Growth",
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "",
    description: "For established brands with ambitious targets.",
    features: [
      "Full-funnel management",
      "Daily optimization",
      "Custom attribution modeling",
      "Embedded growth team",
      "Quarterly business reviews",
    ],
    cta: "Talk to sales",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent plans"
          description="No long-term lock-in. Scale up or down as your goals change."
        />
        <div className="mt-16 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  "group flex h-full flex-col gap-8 rounded-2xl border p-8 transition-[transform,border-color] duration-300 ease-out",
                  plan.featured
                    ? "border-primary/50 bg-card shadow-2xl shadow-primary/10 lg:-translate-y-4 [@media(hover:hover)]:hover:lg:-translate-y-5"
                    : "border-border bg-card hover:border-primary/30 [@media(hover:hover)]:hover:-translate-y-1"
                )}
              >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-medium tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.cadence}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 ease-out group-hover:scale-110">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {plan.featured ? (
                  <ChipButton label={plan.cta} className="w-full justify-between" />
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-full text-base"
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
