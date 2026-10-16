import * as React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/sections/site-footer"
import type { ServiceInfo } from "@/lib/services"

/**
 * Shared shell for service pages: forces the white theme and exposes the
 * service's brand colour as `--primary` for everything on the page
 * (including portalled popovers, since it's applied on <html>).
 */
export function ServicePage({
  service,
  children,
}: {
  service: ServiceInfo
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.add("svc-light")
    root.style.setProperty("--svc-brand", service.brand)
    return () => {
      root.classList.remove("svc-light")
      root.style.removeProperty("--svc-brand")
    }
  }, [service.brand])

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
