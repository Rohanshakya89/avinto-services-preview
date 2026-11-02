import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { BusinessAnalysisApproachIllustration } from "@/components/service/business-analysis-approach-illustration"
import { BusinessAnalysisCanvas } from "@/components/service/business-analysis-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("business-analysis")!

const APPROACH: ApproachPoint[] = [
  {
    lead: "Understand the why.",
    text: "A requirement is only useful when we know the goal behind it. We dig into the problem, not just the request.",
  },
  {
    lead: "Talk to real users.",
    text: "Assumptions are cheaper to test early than to fix after launch.",
  },
  {
    lead: "Make it visible.",
    text: "Diagrams, prototypes, and clear language keep everyone, technical or not, on the same page.",
  },
  {
    lead: "Challenge, constructively.",
    text: "We question assumptions and explain trade-offs, so decisions are made with open eyes.",
  },
  {
    lead: "Stay close to delivery.",
    text: "Our analysts work with the developers and designers, so nothing is lost in translation.",
  },
]

export function BusinessAnalysisPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Business Analysis"
        description="We turn business goals into clear requirements and a plan that development can actually deliver."
      >
        <div id="hero-animation">
          <BusinessAnalysisCanvas />
        </div>
      </ServiceHero>

      <ApproachSection points={APPROACH}>
        <BusinessAnalysisApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
