import {
  ApproachSection,
  type ApproachPoint,
} from "@/components/service/approach-section"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { WebApproachIllustration } from "@/components/service/web-approach-illustration"
import { WebDevCanvas } from "@/components/service/web-dev-canvas"
import { getService } from "@/lib/services"

const service = getService("web-development")!

const MODERN_WEB: ApproachPoint[] = [
  {
    lead: "Modern technology.",
    text: "We choose technologies that fit the product rather than following a fixed stack. Modern frameworks, cloud infrastructure, and AI-powered development tools help us build platforms that are efficient to develop, easy to maintain, and ready to evolve.",
  },
  {
    lead: "Scalable by design.",
    text: "A platform should not need to be rebuilt every time the business grows. We design the architecture, infrastructure, and data layer to handle increasing users, traffic, and functionality, whether you're serving a hundred users or a hundred thousand.",
  },
  {
    lead: "Seamlessly connected.",
    text: "Your web platform rarely exists on its own. We connect it to the systems, services, and data your business already relies on, creating a single experience for customers, teams, and partners while keeping information flowing between the different parts of your operation.",
  },
  {
    lead: "Secure & Compliant.",
    text: "Security is part of the platform from the beginning. We use secure authentication, encrypted data, access controls, and appropriate infrastructure to protect your users and keep your platform reliable. We also build with GDPR and relevant industry standards in mind, helping your platform meet the compliance requirements your business depends on.",
  },
]

export function WebDevelopmentPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Web Development"
        description="We build reliable web products, from early ideas and MVPs to complex platforms, integrations, and long-term product development."
      >
        <WebDevCanvas />
      </ServiceHero>

      <ApproachSection
        title="Built for the modern web"
        description="Every platform we build is designed to be reliable today and ready to evolve tomorrow, with the performance, scalability, security, and flexibility needed to support a growing business."
        points={MODERN_WEB}
        tall
      >
        <WebApproachIllustration />
      </ApproachSection>
    </ServicePage>
  )
}
