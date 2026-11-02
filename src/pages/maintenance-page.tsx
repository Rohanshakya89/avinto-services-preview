import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { MaintenanceApproachIllustration } from "@/components/service/maintenance-approach-illustration"
import { MaintenanceCanvas } from "@/components/service/maintenance-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("maintenance")!

const APPROACH: ApproachPoint[] = [
  {
    lead: "Take ownership.",
    text: "We treat your product as if it were our own, not as a queue of tickets.",
  },
  {
    lead: "Fix it before it breaks.",
    text: "Regular updates and monitoring prevent most emergencies before they happen.",
  },
  {
    lead: "Be transparent.",
    text: "You'll know what we've done, what we've found, and what we recommend, in plain language.",
  },
  {
    lead: "Plan for change.",
    text: "We keep the codebase healthy, so adding the next feature stays affordable.",
  },
  {
    lead: "Flex to your needs.",
    text: "From a light safety net to a dedicated team, support fits how much you need.",
  },
]

export function MaintenancePage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Maintenance"
        description="We keep your software secure, up to date, and improving long after launch."
      >
        <MaintenanceCanvas />
      </ServiceHero>

      <ApproachSection points={APPROACH}>
        <MaintenanceApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
