import type * as React from "react"

import { cn } from "cn"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading placeholders that mirror the real pages (same cards, same heights),
 * so nothing jumps when the content arrives. They fade in after 150ms
 * (`animate-delayed-in`), so a page that loads quickly never flashes them.
 */
function Placeholder({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn("animate-delayed-in", className)}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

/** A bordered card with a grey header band, like SectionPanel. */
function PanelSkeleton({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-5 py-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="hidden h-10 w-48 sm:block" />
      </div>
      {children && <div className="flex flex-col gap-4 p-5">{children}</div>}
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <Placeholder
      label="Loading analytics"
      className="flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-4 md:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-10 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-8" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))}
      </div>

      <PanelSkeleton>
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </PanelSkeleton>

      <PanelSkeleton>
        <Skeleton className="h-10 w-80 max-w-full" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </PanelSkeleton>
    </Placeholder>
  )
}

export function TrackerSkeleton() {
  return (
    <Placeholder label="Loading time tracker" className="flex w-full flex-col gap-4">
      {/* Notice banner and timer bar: white cards (the page behind them is the same grey as a skeleton). */}
      <div className="flex h-14 items-center gap-3 rounded-xl border border-border bg-card px-4">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex h-16 items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <Skeleton className="h-4 w-56 max-w-full" />
        <Skeleton className="h-10 w-72 max-w-full" />
      </div>

      <PanelSkeleton>
        <Skeleton className="h-10 w-full" />
      </PanelSkeleton>

      {Array.from({ length: 2 }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
          {Array.from({ length: 2 }, (_, row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-56 max-w-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="hidden h-4 w-40 md:block" />
            </div>
          ))}
        </div>
      ))}
    </Placeholder>
  )
}
