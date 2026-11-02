import * as React from "react"
import { ArrowUpRight } from "lucide-react"

import { Logo } from "@/components/logo"
import { APPS } from "@/lib/apps"
import { Link } from "@/lib/router"

/** Light theme in the Avinto brand blue, same as the service pages. */
function useLightTheme() {
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.add("svc-light")
    root.style.setProperty("--svc-brand", "#4755eb")
    return () => {
      root.classList.remove("svc-light")
      root.style.removeProperty("--svc-brand")
    }
  }, [])
}

/** Launcher shown before entering any Avinto app. */
export function AppsHubPage() {
  useLightTheme()

  React.useEffect(() => {
    const previous = document.title
    document.title = "Avinto apps"
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-16rem] left-1/2 h-[36rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] bg-[size:3rem_3rem] opacity-40" />
      </div>

      <header className="mx-auto flex h-18 w-full max-w-[1232px] items-center px-6">
        <Logo className="h-8 w-auto text-foreground" />
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-6 pt-16 pb-24 sm:pt-24">
        <h1 className="animate-fade-up text-4xl font-semibold tracking-tight [animation-delay:60ms] sm:text-5xl">
          Where to?
        </h1>
        <p className="animate-fade-up mt-4 max-w-xl text-center text-base text-balance text-muted-foreground [animation-delay:120ms]">
          Pick an app to open. Everything Avinto uses lives here.
        </p>

        <ul className="mt-12 grid w-full gap-6 sm:grid-cols-2">
          {APPS.map((app, i) => (
            <li
              key={app.slug}
              className="animate-fade-up"
              style={{ animationDelay: `${180 + i * 60}ms` }}
            >
              <Link
                href={app.href}
                className="group/app flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow] duration-200 ease-out hover:border-primary/40 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  {app.logo()}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-medium tracking-tight">
                      {app.name}
                    </h2>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover/app:rotate-45" />
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {app.description}
                  </p>
                  <span className="mt-auto w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {app.audience}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
