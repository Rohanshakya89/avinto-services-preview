import { MobileAppCanvas } from "@/components/service/mobile-app-canvas"
import { ServiceHero } from "@/components/service/service-hero"
import { ServicePage } from "@/components/service/service-page"
import { getService } from "@/lib/services"

const service = getService("mobile-application")!

export function MobileApplicationPage() {
  return (
    <ServicePage service={service}>
      <ServiceHero
        title="Mobile Application"
        description="We build reliable mobile apps for iOS and Android, from product development and integrations to store release and long-term support."
      >
        <MobileAppCanvas />
      </ServiceHero>
    </ServicePage>
  )
}
