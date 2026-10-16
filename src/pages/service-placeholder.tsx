import { ChipButton } from "@/components/chip-button"
import { ServicePage } from "@/components/service/service-page"
import { Link, navigate } from "@/lib/router"
import type { ServiceInfo } from "@/lib/services"

export function ServicePlaceholder({ service }: { service: ServiceInfo }) {
  const Icon = service.icon

  return (
    <ServicePage service={service}>
      <section className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 pt-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-8" />
        </span>
        <h1 className="text-5xl font-medium tracking-tight sm:text-6xl">
          {service.name}
        </h1>
        <p className="max-w-md text-lg text-balance text-muted-foreground">
          This page is on its way. Meanwhile, tell us what you need and we'll
          get back to you.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ChipButton label="Contact us" onClick={() => navigate("#contact")} />
          <Link
            href="/services/design"
            className="ease text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            See our Design service
          </Link>
        </div>
      </section>
    </ServicePage>
  )
}
