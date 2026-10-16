import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { Clock, Heart, Mail, Send, Zap } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"

/* ---------------- Shared demo plumbing ---------------- */

function useDemo(ref: React.RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { amount: 0.5 })
  const reduce = useReducedMotion()
  const [hovered, setHovered] = React.useState(false)
  return {
    enabled: inView && !hovered && !reduce,
    hoverBind: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  }
}

function useCenter(
  rootRef: React.RefObject<HTMLElement | null>,
  getTarget: () => HTMLElement | null,
  dep: unknown
) {
  const [pos, setPos] = React.useState({ x: 0, y: 0, ready: false })
  React.useLayoutEffect(() => {
    const root = rootRef.current
    const target = getTarget()
    if (!root || !target) return
    const r = root.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    const x = t.left - r.left + t.width / 2
    const y = t.top - r.top + t.height / 2
    setPos((prev) =>
      prev.ready && prev.x === x && prev.y === y ? prev : { x, y, ready: true }
    )
    // getTarget intentionally excluded: it's recreated each render; dep drives updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, rootRef])
  return pos
}

function FauxCursor({
  x,
  y,
  pulseKey,
  ready,
}: {
  x: number
  y: number
  pulseKey: React.Key
  ready: boolean
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-20"
      initial={false}
      animate={{
        transform: `translate(${x}px, ${y}px)`,
        opacity: ready ? 1 : 0,
      }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.12 }}
    >
      <div className="relative -translate-x-1 -translate-y-1">
        <motion.span
          key={pulseKey}
          className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
          initial={{ opacity: 0.6, scale: 0 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
        <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow">
          <path
            d="M4 2l15 7.2-6.3 1.9L10 18z"
            fill="white"
            stroke="black"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  )
}

function VisualShell({
  title,
  caption,
  rootRef,
  hoverBind,
  children,
}: {
  title: string
  caption: string
  rootRef: React.RefObject<HTMLDivElement | null>
  hoverBind: { onMouseEnter: () => void; onMouseLeave: () => void }
  children: React.ReactNode
}) {
  return (
    <div
      ref={rootRef}
      {...hoverBind}
      className="relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-background/40 p-6"
    >
      <div className="flex flex-col gap-1">
        <h4 className="font-heading text-base font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

/* ---------------- SEO ---------------- */

const KEYWORDS = [
  { term: "marketing agency", rank: 2 },
  { term: "growth marketing", rank: 1 },
  { term: "seo services", rank: 4 },
]

export function SeoVisual() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const { enabled, hoverBind } = useDemo(rootRef)
  const [selected, setSelected] = React.useState(0)
  const badgeRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  React.useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setSelected((p) => (p + 1) % KEYWORDS.length)
    }, 1800)
    return () => window.clearInterval(id)
  }, [enabled])

  const cursor = useCenter(rootRef, () => badgeRefs.current[selected], selected)
  const active = KEYWORDS[selected]

  return (
    <VisualShell
      title="We get you to the top of Google"
      caption="Each keyword is one we ranked for a client."
      rootRef={rootRef}
      hoverBind={hoverBind}
    >
      <div className="flex flex-wrap gap-2">
        {KEYWORDS.map((kw, i) => (
          <button
            key={kw.term}
            ref={(el) => {
              badgeRefs.current[i] = el
            }}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ease-out",
              i === selected
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            {kw.term}
          </button>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-4">
        <span className="font-heading text-6xl font-bold tracking-tight text-primary tabular-nums">
          #{active.rank}
        </span>
        <span className="text-sm text-muted-foreground">
          on Google for
          <br />
          <span className="text-foreground">“{active.term}”</span>
        </span>
      </div>

      <FauxCursor x={cursor.x} y={cursor.y} pulseKey={selected} ready={cursor.ready} />
    </VisualShell>
  )
}

/* ---------------- Paid ---------------- */

export function PaidVisual() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const { enabled, hoverBind } = useDemo(rootRef)
  const [spend, setSpend] = React.useState(12)
  const dir = React.useRef(1)

  React.useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setSpend((p) => {
        let next = p + dir.current * 2
        if (next >= 46) {
          next = 46
          dir.current = -1
        } else if (next <= 6) {
          next = 6
          dir.current = 1
        }
        return next
      })
    }, 90)
    return () => window.clearInterval(id)
  }, [enabled])

  const leads = Math.round((spend * 1000) / 45)
  const roas = ((leads * 180) / (spend * 1000)).toFixed(1)
  const pct = ((spend - 2) / (50 - 2)) * 100

  return (
    <VisualShell
      title="Every dollar works harder"
      caption="Watch the budget — and the return — move."
      rootRef={rootRef}
      hoverBind={hoverBind}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Ad spend</span>
        <span className="font-heading text-lg font-semibold tabular-nums">
          ${spend}k /mo
        </span>
      </div>

      <div className="relative mt-3">
        <input
          type="range"
          min={2}
          max={50}
          value={spend}
          onChange={(e) => setSpend(Number(e.target.value))}
          aria-label="Monthly ad spend"
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 z-20 transition-[left] duration-100 ease-linear"
          style={{ left: `${pct}%` }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="translate-x-1 translate-y-1 drop-shadow"
          >
            <path
              d="M4 2l15 7.2-6.3 1.9L10 18z"
              fill="white"
              stroke="black"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <Metric label="New leads / mo" value={leads.toLocaleString()} />
        <Metric label="Return on spend" value={`${roas}x`} highlight />
      </div>
    </VisualShell>
  )
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <span
        className={cn(
          "font-heading text-2xl font-bold tracking-tight tabular-nums",
          highlight && "text-primary"
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

/* ---------------- Social ---------------- */

const BASE_LIKES = 1240

export function SocialVisual() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const heartRef = React.useRef<HTMLButtonElement>(null)
  const { enabled, hoverBind } = useDemo(rootRef)
  const [liked, setLiked] = React.useState(false)
  const [pop, setPop] = React.useState(0)
  const likes = BASE_LIKES + (liked ? 1 : 0)

  React.useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setLiked((p) => !p)
      setPop((n) => n + 1)
    }, 1600)
    return () => window.clearInterval(id)
  }, [enabled])

  const toggle = () => {
    setLiked((p) => !p)
    setPop((n) => n + 1)
  }

  const cursor = useCenter(rootRef, () => heartRef.current, pop)

  return (
    <VisualShell
      title="Content people want to share"
      caption="Engagement grows on its own."
      rootRef={rootRef}
      hoverBind={hoverBind}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-medium text-primary">
          N
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Nova</span>
          <span className="text-xs text-muted-foreground">2h ago</span>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        How we turned a quiet brand into a category leader in 90 days.
      </p>

      <div className="mt-auto flex items-center gap-3">
        <button
          ref={heartRef}
          type="button"
          onClick={toggle}
          aria-pressed={liked}
          aria-label="Like"
          className={cn(
            "flex size-10 items-center justify-center rounded-full border transition-colors duration-200 ease-out",
            liked
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-border text-muted-foreground"
          )}
        >
          <motion.span
            key={pop}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Heart className="size-5" fill={liked ? "currentColor" : "none"} />
          </motion.span>
        </button>
        <span className="font-heading text-lg font-semibold tabular-nums">
          {likes.toLocaleString()} likes
        </span>
      </div>

      <FauxCursor x={cursor.x} y={cursor.y} pulseKey={pop} ready={cursor.ready} />
    </VisualShell>
  )
}

/* ---------------- Email ---------------- */

const FLOW = [
  { icon: Zap, label: "Lead signs up" },
  { icon: Clock, label: "Wait a day" },
  { icon: Mail, label: "Send welcome email" },
  { icon: Send, label: "Turn into a customer" },
]

export function EmailVisual() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const { enabled, hoverBind } = useDemo(rootRef)
  const [lit, setLit] = React.useState(-1)
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([])

  React.useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setLit((p) => (p + 1 > FLOW.length ? -1 : p + 1))
    }, 650)
    return () => window.clearInterval(id)
  }, [enabled])

  const cursorTargetIndex = Math.min(Math.max(lit, 0), FLOW.length - 1)
  const cursor = useCenter(
    rootRef,
    () => stepRefs.current[cursorTargetIndex],
    cursorTargetIndex
  )

  return (
    <VisualShell
      title="Emails that run themselves"
      caption="The flow fires step by step, automatically."
      rootRef={rootRef}
      hoverBind={hoverBind}
    >
      <div className="mt-auto flex flex-col gap-2">
        {FLOW.map((step, i) => {
          const Icon = step.icon
          const isLit = lit >= 0 && i <= lit
          return (
            <div
              key={step.label}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-300 ease-out",
                isLit ? "border-primary/40 bg-primary/10" : "border-border"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ease-out",
                  isLit
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
          )
        })}
      </div>

      <FauxCursor
        x={cursor.x}
        y={cursor.y}
        pulseKey={lit}
        ready={cursor.ready && lit >= 0}
      />
    </VisualShell>
  )
}

/* ---------------- Analytics ---------------- */

export function AnalyticsVisual() {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const runRef = React.useRef<HTMLSpanElement>(null)
  const { enabled, hoverBind } = useDemo(rootRef)
  const [running, setRunning] = React.useState(false)
  const [runKey, setRunKey] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setRunning(false)
      setRunKey((n) => n + 1)
      window.requestAnimationFrame(() => setRunning(true))
    }, 2600)
    return () => window.clearInterval(id)
  }, [enabled])

  const run = () => {
    setRunning(false)
    setRunKey((n) => n + 1)
    window.requestAnimationFrame(() => setRunning(true))
  }

  const cursor = useCenter(rootRef, () => runRef.current, 0)

  return (
    <VisualShell
      title="We test, then double down"
      caption="The winning version reveals itself."
      rootRef={rootRef}
      hoverBind={hoverBind}
    >
      <div className="flex items-center justify-end">
        <span ref={runRef} className="inline-flex">
          <Button variant="outline" size="xs" onClick={run}>
            Run test
          </Button>
        </span>
      </div>

      <div className="mt-auto flex items-end gap-6">
        <Bar label="Before" value="3.1%" pct={running ? 50 : 8} />
        <Bar label="After" value="4.7%" pct={running ? 100 : 8} highlight />
        <div className="flex flex-col pb-6">
          <span className="font-heading text-3xl font-bold tracking-tight text-primary">
            +52%
          </span>
          <span className="text-xs text-muted-foreground">more sales</span>
        </div>
      </div>

      <FauxCursor x={cursor.x} y={cursor.y} pulseKey={runKey} ready={cursor.ready} />
    </VisualShell>
  )
}

function Bar({
  label,
  value,
  pct,
  highlight,
}: {
  label: string
  value: string
  pct: number
  highlight?: boolean
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div className="flex h-28 w-full items-end">
        <div
          className={cn(
            "w-full rounded-t-lg transition-[height] duration-700 ease-out motion-reduce:transition-none",
            highlight ? "bg-primary" : "bg-muted-foreground/40"
          )}
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className="font-heading text-sm font-semibold tabular-nums">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
