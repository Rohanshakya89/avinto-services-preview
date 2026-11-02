import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { DevOpsApproachIllustration } from "@/components/service/devops-approach-illustration"
import { DevOpsCanvas } from "@/components/service/devops-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("devops")!

const APPROACH: ApproachPoint[] = [
  {
    lead: "Automate the repeatable.",
    text: "If it's done by hand more than twice, it should be a pipeline.",
  },
  {
    lead: "Everything as code.",
    text: "Infrastructure and configuration live in version control, so environments are consistent and changes are traceable.",
  },
  {
    lead: "Security from the start.",
    text: "Secrets management, access control, and dependency scanning are part of the pipeline, not an afterthought.",
  },
  {
    lead: "Make it observable.",
    text: "You can't fix what you can't see. We make the health of the system visible to the whole team.",
  },
  {
    lead: "Share the knowledge.",
    text: "We document and hand over what we build, so your team isn't dependent on us.",
  },
]

export function DevOpsPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="DevOps"
        description="We build the pipelines, infrastructure, and monitoring that let teams ship software quickly, safely, and often."
      >
        <DevOpsCanvas />
      </ServiceHero>

      <ApproachSection points={APPROACH}>
        <DevOpsApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
