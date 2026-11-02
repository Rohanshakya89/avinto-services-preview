import * as React from "react"

import { cn } from "cn"

/**
 * One section of the analytics page: a header band (what this is, plus its
 * controls) over a separate body. Every section uses it, so they read as
 * distinct blocks with the same anatomy.
 */
export function SectionPanel({
  id,
  title,
  description,
  actions,
  bodyClassName,
  children,
}: {
  id: string
  title: string
  description: string
  /** Controls that belong to the whole section (help, switches, legend). */
  actions?: React.ReactNode
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border bg-muted/40 px-5 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id={id} tabIndex={-1} className="text-lg font-semibold outline-none">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {actions}
          </div>
        )}
      </header>
      <div className={cn("flex flex-col gap-4 p-5", bodyClassName)}>
        {children}
      </div>
    </section>
  )
}
