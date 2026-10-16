import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

const FAQS = [
  {
    q: "How quickly will we see results?",
    a: "It depends on the channel. Paid campaigns can show signal within weeks, while SEO and content compound over 3–6 months. We set clear milestones upfront so you always know what to expect.",
  },
  {
    q: "Do you work with our existing team?",
    a: "Absolutely. We operate as an extension of your team — collaborating in your tools, joining your standups when useful, and handing off anything you'd rather own internally.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No lock-in. We work on a rolling monthly basis. If we're not driving value, you can pause or leave with 30 days' notice.",
  },
  {
    q: "What does reporting look like?",
    a: "You get a live dashboard tied to revenue metrics, plus a written summary each month covering what we did, what we learned, and what's next.",
  },
  {
    q: "Which industries do you specialize in?",
    a: "We've driven growth across SaaS, e-commerce, and fintech, but our playbooks adapt to any business with a clear path from attention to revenue.",
  },
]

export function Faq() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          align="left"
          className="lg:sticky lg:top-24 lg:self-start"
        />
        <Reveal>
          <Accordion className="w-full">
            {FAQS.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="py-5 text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
