import { AiApproachIllustration } from "@/components/service/ai-approach-illustration"
import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { DataCanvas } from "@/components/service/data-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("ai-and-data")!

const APPROACH: ApproachPoint[] = [
  {
    lead: "Start with your goals.",
    text: "We take the time to understand your challenges, objectives, and requirements before identifying the right approach and technology.",
  },
  {
    lead: "Prove it early.",
    text: "Quick prototypes let you and your users react to something real before committing to a full build.",
  },
  {
    lead: "Evaluate, don't assume.",
    text: "We test AI output against real examples and measure quality, so decisions are based on evidence.",
  },
  {
    lead: "Keep humans in the loop.",
    text: "AI accelerates the work; people stay in control of decisions that matter.",
  },
  {
    lead: "Build for what comes next.",
    text: "Models change quickly. We design systems so you can swap or upgrade them without starting over.",
  },
]

export function AiDataPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="AI & Data"
        description="We build AI-powered products and data foundations that solve real business problems, from first experiments to production systems."
      >
        <DataCanvas />
      </ServiceHero>

      <ApproachSection points={APPROACH}>
        <AiApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
