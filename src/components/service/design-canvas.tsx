import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { Check, MoonIcon, SunIcon } from "lucide-react"

import { cn } from "cn"
import { PLANS } from "@/components/sections/pricing"

/* -------------------------------------------------------------------------- */
/*  Showcase hero for the Design page: a tiny Figma-style canvas that plays    */
/*  itself. A designer's cursor glides to the toolbar and the card, "clicks"   */
/*  colours, corners and light/dark mode, and the design updates live.         */
/*  Purely visual: nothing here is interactive for the visitor.                */
/* -------------------------------------------------------------------------- */

const SWATCHES = [
  { name: "Indigo", value: "#4755EB" },
  { name: "Teal", value: "#0E9F9A" },
  { name: "Orange", value: "#F26B3A" },
  { name: "Pink", value: "#E04A8B" },
  { name: "Ink", value: "#1F2937" },
]

const CORNERS = {
  sharp: { frame: 4, inner: 2, button: 2, icon: "rounded-none" },
  soft: { frame: 20, inner: 12, button: 12, icon: "rounded-tl-[4px]" },
  round: { frame: 32, inner: 20, button: 999, icon: "rounded-tl-[8px]" },
} as const

type CornerKey = keyof typeof CORNERS

type Look = {
  color: string
  corner: CornerKey
  dark: boolean
  added: boolean
}

const INITIAL_LOOK: Look = {
  color: SWATCHES[0].value,
  corner: "soft",
  dark: false,
  added: false,
}

/** What the designer "clicks", in order, and the change each click makes. */
const SCRIPT: { target: string; patch: Partial<Look> }[] = [
  { target: "swatch-1", patch: { color: SWATCHES[1].value } },
  { target: "corner-round", patch: { corner: "round" } },
  { target: "mode", patch: { dark: true } },
  { target: "swatch-2", patch: { color: SWATCHES[2].value } },
  { target: "cta", patch: { added: true } },
  { target: "corner-sharp", patch: { corner: "sharp" } },
  { target: "swatch-3", patch: { color: SWATCHES[3].value } },
  { target: "mode", patch: { dark: false } },
  { target: "corner-soft", patch: { corner: "soft" } },
  {
    target: "swatch-0",
    patch: { color: SWATCHES[0].value, added: false },
  },
]

const MOVE_MS = 900
const HOLD_MS = 1100

type Register = (id: string) => (el: HTMLElement | null) => void

export function DesignCanvas() {
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const targets = React.useRef<Record<string, HTMLElement | null>>({})
  const inView = useInView(canvasRef, { margin: "-80px" })
  const reduceMotion = useReducedMotion()

  const [look, setLook] = React.useState<Look>(INITIAL_LOOK)
  const [cursor, setCursor] = React.useState({ x: 24, y: 96 })
  const [hot, setHot] = React.useState<string | null>(null)
  const [clicks, setClicks] = React.useState(0)

  const register = React.useCallback<Register>(
    (id) => (el) => {
      targets.current[id] = el
    },
    []
  )

  // Drive the script while the canvas is on screen.
  React.useEffect(() => {
    if (!inView || reduceMotion) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let step = 0

    const wait = (ms: number, then: () => void) => {
      timer = setTimeout(() => {
        if (!cancelled) then()
      }, ms)
    }

    const run = () => {
      const { target, patch } = SCRIPT[step % SCRIPT.length]
      const canvas = canvasRef.current
      const el = targets.current[target]

      if (canvas && el) {
        const c = canvas.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        setCursor({
          x: r.left - c.left + r.width / 2 - 2,
          y: r.top - c.top + r.height / 2 - 2,
        })
        setHot(target)
      }

      wait(MOVE_MS, () => {
        setLook((prev) => ({ ...prev, ...patch }))
        setClicks((n) => n + 1)
        wait(HOLD_MS, () => {
          setHot(null)
          step += 1
          run()
        })
      })
    }

    wait(600, run)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [inView, reduceMotion])

  return (
    <div>
      <div
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none relative h-[32rem] overflow-hidden rounded-3xl border border-border bg-muted/50 [background-image:radial-gradient(var(--color-border)_1.5px,transparent_1.5px)] [background-size:24px_24px] select-none"
      >
        <div className="absolute inset-x-0 top-16 flex justify-center">
          <PlanCard look={look} register={register} />
        </div>

        <div className="absolute top-24 left-12 hidden lg:block">
          <ColourStyles color={look.color} />
        </div>
        <div className="absolute top-24 right-12 hidden lg:block">
          <Components look={look} />
        </div>

        <Toolbar look={look} hot={hot} register={register} />

        {!reduceMotion && (
          <DrivingCursor
            name="Designer"
            color="#F26B3A"
            position={cursor}
            clicks={clicks}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------- Main frame -------------------------------- */

/** The site's own Starter plan (from the Pricing section), restyled live. */
const PLAN = PLANS[0]

function PlanCard({ look, register }: { look: Look; register: Register }) {
  const c = CORNERS[look.corner]
  const muted = look.dark ? "text-white/60" : "text-slate-500"

  return (
    <div className="relative">
      <span className="absolute -top-6 left-0 text-xs font-medium text-muted-foreground">
        Pricing card
      </span>

      <div
        className={cn(
          "relative flex w-64 flex-col gap-4 border p-5 shadow-xl transition-[background-color,border-color,border-radius,color] duration-[600ms] [transition-timing-function:var(--ease-out)] sm:w-72",
          look.dark
            ? "border-white/10 bg-[#12141A] text-white"
            : "border-black/5 bg-white text-slate-900"
        )}
        style={{
          borderRadius: c.frame,
          outline: `2px solid ${look.color}`,
          outlineOffset: 4,
        }}
      >
        {/* selection handles */}
        {[
          "-top-3 -left-3",
          "-top-3 -right-3",
          "-bottom-3 -left-3",
          "-right-3 -bottom-3",
        ].map((pos) => (
          <span
            key={pos}
            className={cn(
              "absolute size-2 border-2 bg-white transition-colors duration-[600ms] [transition-timing-function:var(--ease-out)]",
              pos
            )}
            style={{ borderColor: look.color }}
          />
        ))}

        <div className="flex flex-col gap-3">
          <span
            className="w-fit px-3 py-1 text-xs font-medium text-white transition-[background-color,border-radius] duration-[600ms] [transition-timing-function:var(--ease-out)]"
            style={{ backgroundColor: look.color, borderRadius: c.inner }}
          >
            {PLAN.name}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-4xl leading-none font-semibold">
              {PLAN.price}
            </span>
            <span className={cn("text-sm", muted)}>{PLAN.cadence}</span>
          </div>
          <p className={cn("text-sm leading-snug", muted)}>
            {PLAN.description}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {PLAN.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check
                className="size-4 shrink-0 transition-colors duration-[600ms] [transition-timing-function:var(--ease-out)]"
                style={{ color: look.color }}
              />
              {feature}
            </li>
          ))}
        </ul>

        <span
          ref={register("cta")}
          className="flex h-12 items-center justify-center gap-2 text-sm font-medium text-white transition-[background-color,border-radius] duration-[600ms] [transition-timing-function:var(--ease-out)]"
          style={{ backgroundColor: look.color, borderRadius: c.button }}
        >
          {look.added ? (
            <>
              <Check className="size-4" /> Plan selected
            </>
          ) : (
            PLAN.cta
          )}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------ Side stickers ------------------------------ */

function ColourStyles({ color }: { color: string }) {
  const shades = [
    `color-mix(in oklch, ${color}, black 25%)`,
    color,
    `color-mix(in oklch, ${color}, white 40%)`,
    `color-mix(in oklch, ${color}, white 75%)`,
  ]
  return (
    <div className="relative">
      <span className="absolute -top-6 left-0 text-xs font-medium text-muted-foreground">
        Colour styles
      </span>
      <div className="flex w-48 flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-heading text-3xl leading-none font-semibold">
            Aa
          </span>
          <span className="font-mono text-xs text-muted-foreground uppercase">
            {color}
          </span>
        </div>
        <div className="flex overflow-hidden rounded-lg">
          {shades.map((shade, i) => (
            <span
              key={i}
              className="h-10 flex-1 transition-colors duration-[600ms] [transition-timing-function:var(--ease-out)]"
              style={{ backgroundColor: shade }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Components({ look }: { look: Look }) {
  const c = CORNERS[look.corner]
  return (
    <div className="relative">
      <span className="absolute -top-6 left-0 text-xs font-medium text-muted-foreground">
        Components
      </span>
      <div className="flex w-48 flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-lg">
        <span
          className="flex h-10 items-center justify-center text-sm font-medium text-white transition-[background-color,border-radius] duration-[600ms] [transition-timing-function:var(--ease-out)]"
          style={{ backgroundColor: look.color, borderRadius: c.button }}
        >
          Primary
        </span>
        <span
          className="flex h-10 items-center justify-center border-2 text-sm font-medium transition-[border-color,color,border-radius] duration-[600ms] [transition-timing-function:var(--ease-out)]"
          style={{
            borderColor: look.color,
            color: look.color,
            borderRadius: c.button,
          }}
        >
          Secondary
        </span>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Toggle</span>
          <span
            className="flex h-6 w-10 items-center justify-end rounded-full p-1 transition-colors duration-[600ms] [transition-timing-function:var(--ease-out)]"
            style={{ backgroundColor: look.color }}
          >
            <span className="size-4 rounded-full bg-white" />
          </span>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Cursors --------------------------------- */

function CursorShape({ name, color }: { name: string; color: string }) {
  return (
    <>
      <svg width="16" height="20" viewBox="0 0 16 20" fill={color}>
        <path
          d="M1 1v15l4.2-3.6L8.1 19l2.4-1.1-2.8-6.2H14z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute top-4 left-4 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap text-white"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </>
  )
}

/** The cursor that "operates" the design: glides to a target, then clicks. */
function DrivingCursor({
  name,
  color,
  position,
  clicks,
}: {
  name: string
  color: string
  position: { x: number; y: number }
  clicks: number
}) {
  return (
    <motion.div
      className="absolute top-0 left-0 z-30"
      initial={position}
      animate={position}
      transition={{ duration: MOVE_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
    >
      {clicks > 0 && (
        <motion.span
          key={clicks}
          className="absolute -top-2 -left-2 size-6 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scale: 0.3, opacity: 0.5 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        />
      )}
      <CursorShape name={name} color={color} />
    </motion.div>
  )
}

/* --------------------------------- Toolbar --------------------------------- */

function Toolbar({
  look,
  hot,
  register,
}: {
  look: Look
  hot: string | null
  register: Register
}) {
  return (
    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-border bg-background p-1 shadow-lg sm:gap-3 sm:p-2">
      <div className="flex items-center gap-1 px-1 sm:gap-2">
        {SWATCHES.map((swatch, i) => {
          const id = `swatch-${i}`
          const selected = swatch.value === look.color
          return (
            <span
              key={swatch.value}
              ref={register(id)}
              className={cn(
                "size-5 rounded-full ring-offset-2 ring-offset-background transition-[box-shadow,transform] duration-[400ms] [transition-timing-function:var(--ease-out)] sm:size-6",
                selected ? "ring-2" : "ring-0",
                hot === id && "scale-110"
              )}
              style={{
                backgroundColor: swatch.value,
                ["--tw-ring-color" as string]: swatch.value,
              }}
            />
          )
        })}
      </div>

      <span className="h-6 w-px bg-border" />

      <div className="flex items-center gap-1">
        {(Object.keys(CORNERS) as CornerKey[]).map((key) => (
          <span
            key={key}
            ref={register(`corner-${key}`)}
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-[400ms] [transition-timing-function:var(--ease-out)] sm:size-8",
              look.corner === key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground",
              hot === `corner-${key}` && "scale-110"
            )}
          >
            <span
              className={cn(
                "size-4 border-t-2 border-l-2 border-current",
                CORNERS[key].icon
              )}
            />
          </span>
        ))}
      </div>

      <span className="h-6 w-px bg-border" />

      <span
        ref={register("mode")}
        className={cn(
          "flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-transform duration-[400ms] [transition-timing-function:var(--ease-out)] sm:size-8",
          hot === "mode" && "scale-110"
        )}
      >
        {look.dark ? (
          <MoonIcon className="size-4" />
        ) : (
          <SunIcon className="size-4" />
        )}
      </span>
    </div>
  )
}
