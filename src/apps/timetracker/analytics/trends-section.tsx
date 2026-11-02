import * as React from "react"
import { format } from "date-fns"
import { CircleHelp, Maximize2 } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { cn } from "cn"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { SegmentedList, SegmentedTab } from "./segmented-tabs"
import { TYPICAL, type DayStat } from "./analytics-data"
import { SectionPanel } from "./section-panel"

type Metric = {
  key: string
  title: string
  description: string
  pick: (d: DayStat) => number
  typical: number
}

const GROUPS: { id: string; label: string; metrics: Metric[] }[] = [
  {
    id: "volume",
    label: "Volume",
    metrics: [
      {
        key: "entries",
        title: "Entries per day",
        description:
          "Very few on a long day can mean a timer left running. Very many can mean fragmented tracking.",
        pick: (d) => d.entries,
        typical: TYPICAL.entries,
      },
      {
        key: "hours",
        title: "Tracked hours per day",
        description: "Total time logged on a working day.",
        pick: (d) => d.hours,
        typical: TYPICAL.hours,
      },
    ],
  },
  {
    id: "shape",
    label: "Day shape",
    metrics: [
      {
        key: "avg-entry",
        title: "Average entry length (h)",
        description:
          "Long entries often mean the timer isn't stopped between tasks.",
        pick: (d) => d.avgEntryHours,
        typical: TYPICAL.avgEntryHours,
      },
      {
        key: "projects",
        title: "Projects per day",
        description:
          "How many projects you touch in a day, a rough sign of context switching.",
        pick: (d) => d.projects,
        typical: TYPICAL.projects,
      },
    ],
  },
  {
    id: "habits",
    label: "Logging habits",
    metrics: [
      {
        key: "overtime",
        title: "Overtime hours per day",
        description: "Time on entries tagged OverTime, averaged over working days.",
        pick: (d) => d.overtimeHours,
        typical: TYPICAL.overtimeHours,
      },
    ],
  },
]

type Series = { you: boolean; typical: boolean }

const CONFIG: ChartConfig = {
  you: { label: "You", color: "var(--primary)" },
  typical: { label: "Typical", color: "var(--muted-foreground)" },
}

function TrendChart({
  metric,
  days,
  series,
  className,
}: {
  metric: Metric
  days: DayStat[]
  series: Series
  className?: string
}) {
  // A line needs a few points to say anything.
  if (days.length < 3) {
    return (
      <div
        className={cn(
          "flex items-center justify-center px-6 text-center text-sm text-muted-foreground",
          className
        )}
      >
        {days.length === 0
          ? "No data for this period."
          : "Not enough working days yet to show a trend."}
      </div>
    )
  }

  const data = days.map((d) => ({
    label: format(d.date, "d MMM"),
    you: metric.pick(d),
    typical: metric.typical,
  }))

  return (
    <ChartContainer config={CONFIG} className={cn("aspect-auto", className)}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.typical && (
          <Line
            dataKey="typical"
            type="linear"
            stroke="var(--color-typical)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
        )}
        {series.you && (
          <Line
            dataKey="you"
            type="linear"
            stroke="var(--color-you)"
            strokeWidth={2}
            dot={days.length <= 14}
          />
        )}
      </LineChart>
    </ChartContainer>
  )
}

function TrendCard({
  metric,
  days,
  series,
  wide,
}: {
  metric: Metric
  days: DayStat[]
  series: Series
  wide: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-5",
        wide && "lg:col-span-2"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-medium">{metric.title}</h3>
          <p className="text-sm text-muted-foreground">{metric.description}</p>
        </div>
        <button
          type="button"
          aria-label={`Expand ${metric.title}`}
          onClick={() => setOpen(true)}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>
      <TrendChart
        metric={metric}
        days={days}
        series={series}
        className="h-48 w-full"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{metric.title}</DialogTitle>
            <DialogDescription>{metric.description}</DialogDescription>
          </DialogHeader>
          <TrendChart
            metric={metric}
            days={days}
            series={series}
            className="h-80 w-full"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LegendToggle({
  label,
  dashed,
  on,
  onClick,
}: {
  label: string
  dashed?: boolean
  on: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        on
          ? "border-border bg-card text-foreground tt-dark:border-primary/40 tt-dark:bg-primary/15"
          : "border-dashed border-border text-muted-foreground"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "w-4 border-t-2",
          dashed
            ? "border-dashed border-muted-foreground"
            : "border-primary",
          !on && "opacity-40"
        )}
      />
      {label}
    </button>
  )
}

/**
 * Charts, one group at a time. The long explanation lives behind a help
 * popover instead of above the charts.
 */
export function TrendsSection({ days }: { days: DayStat[] }) {
  const [series, setSeries] = React.useState<Series>({
    you: true,
    typical: true,
  })

  // Keep at least one line visible.
  const toggle = (key: keyof Series) =>
    setSeries((s) => {
      const next = { ...s, [key]: !s[key] }
      return next.you || next.typical ? next : s
    })

  return (
    <SectionPanel
      id="trends-title"
      title="Your trends"
      description="How your logging changes over time, next to what's typical."
      actions={
        <>
          <Popover>
            <PopoverTrigger className="inline-flex h-8 items-center gap-2 rounded-md bg-muted px-3 text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <CircleHelp className="size-3" />
              How to read these
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 gap-2 p-4 text-sm">
              <span className="font-medium">How to read these charts</span>
              <span className="text-muted-foreground">
                The dashed line is what's typical: the median across everyone
                who logged time. It's left out when too few people logged time
                to keep individual figures private.
              </span>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
            <LegendToggle
              label="You"
              on={series.you}
              onClick={() => toggle("you")}
            />
            <LegendToggle
              label="Typical"
              dashed
              on={series.typical}
              onClick={() => toggle("typical")}
            />
          </div>
        </>
      }
    >
      <Tabs defaultValue={GROUPS[0].id} className="gap-4">
        <SegmentedList>
          {GROUPS.map((g) => (
            <SegmentedTab key={g.id} value={g.id}>
              {g.label}
            </SegmentedTab>
          ))}
        </SegmentedList>

        {GROUPS.map((g) => (
          <TabsContent
            key={g.id}
            value={g.id}
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          >
            {g.metrics.map((metric, i) => (
              <TrendCard
                key={metric.key}
                metric={metric}
                days={days}
                series={series}
                wide={g.metrics.length % 2 === 1 && i === g.metrics.length - 1}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </SectionPanel>
  )
}
