import * as React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteHero } from "@/components/site-hero"
import { VideoShowcase } from "@/components/video-showcase"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { Services } from "@/components/sections/services"
import { Work } from "@/components/sections/work"
import { Testimonials } from "@/components/sections/testimonials"
import { Pricing } from "@/components/sections/pricing"
import { Faq } from "@/components/sections/faq"
import { CtaBand } from "@/components/sections/cta-band"
import { SiteFooter } from "@/components/sections/site-footer"
import { AiDataPage } from "@/pages/ai-data-page"
import { AutomationPage } from "@/pages/automation-page"
import { BusinessAnalysisPage } from "@/pages/business-analysis-page"
import { DesignPage } from "@/pages/design-page"
import { DevOpsPage } from "@/pages/devops-page"
import { MaintenancePage } from "@/pages/maintenance-page"
import { MobileApplicationPage } from "@/pages/mobile-application-page"
import { ServicePlaceholder } from "@/pages/service-placeholder"
import { WebDevelopmentPage } from "@/pages/web-development-page"
import { usePath } from "@/lib/router"
import { getService } from "@/lib/services"

// Kept for later; currently unreachable.
export function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <SiteHero />
        <VideoShowcase />
        <LogoCloud />
        <Services />
        <Work />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  )
}

export function App() {
  const path = usePath()

  // Show the real address for the page we fall back to.
  React.useEffect(() => {
    if (!/^\/services\/[^/]+\/?$/.test(path)) {
      window.history.replaceState({}, "", "/services/design")
    }
  }, [path])
  const slug = path.match(/^\/services\/([^/]+)\/?$/)?.[1]
  const service = slug ? getService(slug) : undefined

  if (service?.slug === "design") return <DesignPage />
  if (service?.slug === "ai-and-data") return <AiDataPage />
  if (service?.slug === "automation") return <AutomationPage />
  if (service?.slug === "web-development") return <WebDevelopmentPage />
  if (service?.slug === "mobile-application") return <MobileApplicationPage />
  if (service?.slug === "devops") return <DevOpsPage />
  if (service?.slug === "maintenance") return <MaintenancePage />
  if (service?.slug === "business-analysis") return <BusinessAnalysisPage />
  if (service) return <ServicePlaceholder service={service} />
  // Only the service pages are live for now; anything else opens Design.
  return <DesignPage />
}

export default App
