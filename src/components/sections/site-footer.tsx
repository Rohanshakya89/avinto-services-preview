import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { Link } from "@/lib/router"
import { SERVICES, serviceHref } from "@/lib/services"

const FOOTER_LINKS = [
  {
    heading: "Services",
    links: SERVICES.map((service) => ({
      label: service.name,
      href: serviceHref(service.slug),
    })),
  },
  {
    heading: "Company",
    links: ["About", "Work", "Careers", "Contact"].map((label) => ({
      label,
      href: "#",
    })),
  },
  {
    heading: "Resources",
    links: ["Blog", "Guides", "Case studies", "Newsletter"].map((label) => ({
      label,
      href: "#",
    })),
  },
]

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="svc-dark scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-6">
            <Link
              href={serviceHref(SERVICES[0].slug)}
              aria-label="Avinto home"
              className="flex w-fit items-center"
            >
              <Logo className="h-8 w-auto text-foreground" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              A growth marketing partner for teams who'd rather close deals than
              chase clicks.
            </p>
            <form
              className="flex w-full max-w-sm items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="you@company.com"
                aria-label="Email address"
                className="h-10 flex-1"
              />
              <Button type="submit" className="h-10 px-4">
                Subscribe
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h3 className="text-sm font-medium">{column.heading}</h3>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={
                          link.href === "#"
                            ? (event) => event.preventDefault()
                            : undefined
                        }
                        className="ease text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Nova. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="ease transition-colors duration-150 hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="ease transition-colors duration-150 hover:text-foreground"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
