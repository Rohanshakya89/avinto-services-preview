import { DataCanvas } from "@/components/service/data-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("ai-and-data")!

export function AiDataPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="AI & Data"
        description="We build AI-powered products and data foundations that solve real business problems, from first experiments to production systems."
      >
        <DataCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
