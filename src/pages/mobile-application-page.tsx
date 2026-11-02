import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { MobileAppCanvas } from "@/components/service/mobile-app-canvas"
import { MobileApproachIllustration } from "@/components/service/mobile-approach-illustration"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("mobile-application")!

const APPROACH: ApproachPoint[] = [
  {
    lead: "Take ownership.",
    text: "We work to understand the product and the problem behind the requirement, and take responsibility for finding a good technical solution.",
  },
  {
    lead: "Consult as well as build.",
    text: "Our role does not stop at implementation. We challenge assumptions, explain trade-offs, and help clients make decisions about architecture, technology, and product development.",
  },
  {
    lead: "Think beyond the app.",
    text: "Mobile applications are part of a larger system. We consider the backend, integrations, data, infrastructure, and processes that make the product work as a whole.",
  },
  {
    lead: "Build for what comes next.",
    text: "We aim for technology that is practical today and flexible enough to support the product as requirements, users, and technology change.",
  },
  {
    lead: "Stay involved.",
    text: "Launch is not the finish line. We can continue to maintain, improve, and develop the product as your needs evolve.",
  },
]

export function MobileApplicationPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Mobile Application"
        description="We build reliable mobile apps for iOS and Android, from product development and integrations to store release and long-term support."
      >
        <MobileAppCanvas />
      </ServiceHero>

      <ApproachSection points={APPROACH} tall>
        <MobileApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
