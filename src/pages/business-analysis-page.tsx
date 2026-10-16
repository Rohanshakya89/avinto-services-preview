import { BusinessAnalysisCanvas } from "@/components/service/business-analysis-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("business-analysis")!

export function BusinessAnalysisPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Business Analysis"
        description="We turn business goals into clear requirements and a plan that development can actually deliver."
      >
        <BusinessAnalysisCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
