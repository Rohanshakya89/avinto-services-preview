import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { AutomationApproachIllustration } from "@/components/service/automation-approach-illustration"
import { AutomationCanvas } from "@/components/service/automation-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("automation")!

const APPROACH: ApproachPoint[] = [
  {
    lead: "Automate what's worth automating.",
    text: "Not every process should be automated. We focus on where the return is clear.",
  },
  {
    lead: "Fit the way you work.",
    text: "We build around your tools and habits instead of asking your team to relearn everything.",
  },
  {
    lead: "Handle the exceptions.",
    text: "Real processes have edge cases. We design for them from the start so the automation doesn't break the first time something unusual happens.",
  },
  {
    lead: "Start small, grow steadily.",
    text: "One well-chosen automation proves the value and builds trust for the next.",
  },
  {
    lead: "Keep people in control.",
    text: "Where a human decision matters, we build the approval step in, with full visibility of what the automation has done.",
  },
]

export function AutomationPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Automation"
        description="We replace repetitive manual work with reliable automated workflows, so your team can spend its time on work that actually needs people."
      >
        <AutomationCanvas />
      </ServiceHero>

      <ApproachSection points={APPROACH}>
        <AutomationApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
