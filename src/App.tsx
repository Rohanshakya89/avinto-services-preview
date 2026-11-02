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
import { AppsHubPage } from "@/pages/apps-hub-page"
import { TrackerShell } from "@/apps/timetracker/tracker-shell"
import {
  AnalyticsSkeleton,
  TrackerSkeleton,
} from "@/apps/timetracker/skeletons"
import { TrackerComingSoon } from "@/apps/timetracker/coming-soon"
import { isAppsPath } from "@/lib/apps"
import { usePath } from "@/lib/router"
import { getService } from "@/lib/services"

// Charts are heavy, so the analytics page loads on demand.
const AnalyticsPage = React.lazy(() =>
  import("@/apps/timetracker/analytics/analytics-page").then((m) => ({
    default: m.AnalyticsPage,
  }))
)

const TrackerPage = React.lazy(() =>
  import("@/apps/timetracker/tracker/tracker-page").then((m) => ({
    default: m.TrackerPage,
  }))
)

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

/**
 * Which part of the site a path belongs to. The page fades in when this
 * changes (home, a service page, the tracker), but moving between pages
 * inside the tracker keeps the same key, so its sidebar never re-animates.
 */
const routeKey = (path: string) => path.split("/").slice(0, 3).join("/")

export function App() {
  const path = usePath()

  // The chooser is the home page. /apps and unknown addresses land on it too,
  // so show its real address.
  React.useEffect(() => {
    const isHubAlias = /^\/apps\/?$/.test(path)
    const isUnknown = !isAppsPath(path) && !/^\/services\/[^/]+\/?$/.test(path)
    if (isHubAlias || isUnknown) window.history.replaceState({}, "", "/")
  }, [path])

  return (
    <div key={routeKey(path)} className="animate-page-fade">
      <Routes path={path} />
    </div>
  )
}

function Routes({ path }: { path: string }) {
  // Home is the app chooser; each app lives under /apps/<name>.
  if (path === "/" || /^\/apps\/?$/.test(path)) return <AppsHubPage />
  if (/^\/apps\/timetracker(\/.*)?$/.test(path)) {
    return (
      <TrackerShell>
        {/^\/apps\/timetracker\/analytics\/?$/.test(path) ? (
          <React.Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsPage />
          </React.Suspense>
        ) : /^\/apps\/timetracker\/?$/.test(path) ? (
          <React.Suspense fallback={<TrackerSkeleton />}>
            <TrackerPage />
          </React.Suspense>
        ) : (
          <TrackerComingSoon />
        )}
      </TrackerShell>
    )
  }
  if (isAppsPath(path)) return <AppsHubPage />

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
  // Anything unknown goes to the app chooser.
  return <AppsHubPage />
}

export default App
