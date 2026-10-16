import { DevOpsCanvas } from "@/components/service/devops-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("devops")!

export function DevOpsPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="DevOps"
        description="We build the pipelines, infrastructure, and monitoring that let teams ship software quickly, safely, and often."
      >
        <DevOpsCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
