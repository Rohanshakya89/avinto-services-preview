import * as React from "react"
import { ChevronDown, MenuIcon } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { PillButton } from "@/components/pill-button"
import { Logo as Wordmark } from "@/components/logo"
import { Link, usePath } from "@/lib/router"
import { SERVICES, serviceHref } from "@/lib/services"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Customers", href: "#customers" },
  { label: "About Us", href: "#about" },
]

const NAV_ITEM =
  "ease inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"

/** Placeholder link: visible in the nav, but the page is not live yet. */
const inert = (event: React.MouseEvent) => event.preventDefault()

function ServicesMenu() {
  const path = usePath()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent px-3 font-normal text-foreground [&>svg]:size-3.5">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[36rem] grid-cols-2 gap-1 p-2">
              {SERVICES.map((service) => {
                const Icon = service.icon
                const href = serviceHref(service.slug)
                return (
                  <li key={service.slug}>
                    <NavigationMenuLink
                      render={<Link href={href} />}
                      active={path === href}
                      className="group/service items-start gap-3 p-3"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 ease-out group-hover/service:scale-105">
                        <Icon className="size-5 transition-transform duration-300 ease-out group-hover/service:-rotate-6" />
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-sm leading-none font-medium">
                          {service.name}
                        </span>
                        <span className="text-xs leading-snug text-muted-foreground">
                          {service.blurb}
                        </span>
                      </span>
                    </NavigationMenuLink>
                  </li>
                )
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function Logo() {
  return (
    <Link
      href={serviceHref(SERVICES[0].slug)}
      aria-label="Avinto home"
      className="flex items-center"
    >
      <Wordmark className="h-8 w-auto text-foreground" />
    </Link>
  )
}

/** EN / NO switch: a brand-coloured pill slides under the chosen language. */
function LanguageToggle() {
  const [lang, setLang] = React.useState<"EN" | "NO">("EN")

  return (
    <div
      role="group"
      aria-label="Language"
      className="relative grid h-10 w-28 grid-cols-2 rounded-full border border-border bg-background p-1 text-sm"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-full bg-primary transition-transform duration-300 [transition-timing-function:var(--ease-out)]",
          lang === "NO" && "translate-x-full"
        )}
      />
      {(["EN", "NO"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={cn(
            "relative z-10 rounded-full transition-colors duration-300",
            lang === code ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

export function SiteHeader() {
  return (
    <header
      id="top"
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 supports-backdrop-filter:backdrop-blur-md"
    >
      <div className="mx-auto flex h-18 max-w-[1232px] items-center justify-between px-6">
        <Logo />

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            <ServicesMenu />
            <button type="button" className={NAV_ITEM}>
              Solutions
              <ChevronDown className="size-3.5" />
            </button>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={inert}
                className={NAV_ITEM}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle />
          <PillButton label="Let's talk" size="sm" />
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="md:hidden" />
            }
          >
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 overflow-y-auto px-4">
              <span className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Services
              </span>
              {SERVICES.map((service) => {
                const Icon = service.icon
                return (
                  <SheetClose
                    key={service.slug}
                    nativeButton={false}
                    render={<Link href={serviceHref(service.slug)} />}
                    className="ease flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-muted"
                  >
                    <Icon className="size-4 text-primary" />
                    {service.name}
                  </SheetClose>
                )
              })}
              <span className="my-2 h-px bg-border" />
              <button
                type="button"
                className="ease flex items-center justify-between rounded-md px-3 py-3 text-left text-sm text-foreground transition-colors duration-150 hover:bg-muted"
              >
                Solutions
                <ChevronDown className="size-4" />
              </button>
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={<Link href={link.href} onClick={inert} />}
                  className="ease rounded-md px-3 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-muted"
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col items-start gap-4 p-4">
              <LanguageToggle />
              <PillButton label="Let's talk" className="w-full" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
