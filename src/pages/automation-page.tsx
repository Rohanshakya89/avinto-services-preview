import { AutomationCanvas } from "@/components/service/automation-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("automation")!

export function AutomationPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Automation"
        description="We replace repetitive manual work with reliable automated workflows, so your team can spend its time on work that actually needs people."
      >
        <AutomationCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
