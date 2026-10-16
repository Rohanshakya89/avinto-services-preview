import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { WebDevCanvas } from "@/components/service/web-dev-canvas"
import { getService } from "@/lib/services"

const service = getService("web-development")!

export function WebDevelopmentPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Web Development"
        description="We build reliable web products, from early ideas and MVPs to complex platforms, integrations, and long-term product development."
      >
        <WebDevCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
