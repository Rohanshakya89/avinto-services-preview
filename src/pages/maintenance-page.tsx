import { MaintenanceCanvas } from "@/components/service/maintenance-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("maintenance")!

export function MaintenancePage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Maintenance"
        description="We keep your software secure, up to date, and improving long after launch."
      >
        <MaintenanceCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
