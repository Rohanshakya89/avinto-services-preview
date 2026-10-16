import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import {
  Check,
  House,
  LayoutGrid,
  MoonIcon,
  Monitor,
  Search,
  Smartphone,
  SunIcon,
  Tablet,
  User,
} from "lucide-react"

import { cn } from "cn"

/* -------------------------------------------------------------------------- */
/*  Showcase hero for the Design page: a design-system board that plays        */
/*  itself. The brand colour stays fixed. A designer's cursor changes the      */
/*  corners, typeface, light/dark mode and the screen size, and works the      */
/*  components. Everything follows: the foundations (colour, type, spacing,    */
/*  radius), the components, and the screen in focus on the right, which       */
/*  resizes from phone to tablet to desktop and reflows at each size.          */
/*  Purely visual: nothing here is interactive for the visitor.                */
/* -------------------------------------------------------------------------- */

/** The Avinto brand colour. It never changes on this board. */
const BRAND = "#4755EB"

/** Radii for big surfaces, controls and small details, per corner style. */
const CORNERS = {
  sharp: {
    label: "Sharp",
    surface: 4,
    control: 2,
    small: 2,
    icon: "rounded-none",
  },
  soft: {
    label: "Soft",
    surface: 18,
    control: 10,
    small: 6,
    icon: "rounded-tl-[4px]",
  },
  round: {
    label: "Round",
    surface: 28,
    control: 999,
    small: 999,
    icon: "rounded-tl-[8px]",
  },
} as const

const FONTS = {
  sans: { label: "Sans", family: "var(--font-sans)" },
  mono: {
    label: "Mono",
    family: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
} as const

type CornerKey = keyof typeof CORNERS
type FontKey = keyof typeof FONTS
type Device = "phone" | "tablet" | "desktop"

const DEVICES = {
  phone: { icon: Smartphone, label: "Phone" },
  tablet: { icon: Tablet, label: "Tablet" },
  desktop: { icon: Monitor, label: "Desktop" },
} as const

const SEGMENTS = ["Day", "Week", "Month"]

type Look = {
  device: Device
  corner: CornerKey
  font: FontKey
  dark: boolean
  grid: boolean
  toggled: boolean
  checked: boolean
  radio: boolean
  segment: number
  pressed: boolean
}

const INITIAL_LOOK: Look = {
  device: "phone",
  corner: "soft",
  font: "sans",
  dark: false,
  grid: false,
  toggled: false,
  checked: false,
  radio: false,
  segment: 0,
  pressed: false,
}

/** What the designer "clicks", in order. A step may name fallbacks. */
const SCRIPT: { target: string[]; patch: Partial<Look> }[] = [
  { target: ["corner-round"], patch: { corner: "round" } },
  { target: ["toggle"], patch: { toggled: true } },
  { target: ["device-tablet"], patch: { device: "tablet" } },
  { target: ["segment-1"], patch: { segment: 1 } },
  { target: ["mode"], patch: { dark: true } },
  { target: ["device-desktop"], patch: { device: "desktop" } },
  { target: ["checkbox"], patch: { checked: true } },
  { target: ["corner-sharp"], patch: { corner: "sharp" } },
  { target: ["font-mono"], patch: { font: "mono" } },
  { target: ["grid"], patch: { grid: true } },
  { target: ["mode"], patch: { dark: false, grid: false } },
  { target: ["radio"], patch: { radio: true } },
  { target: ["btn", "cta"], patch: { pressed: true } },
  { target: ["device-phone"], patch: { device: "phone", pressed: false } },
  { target: ["corner-soft"], patch: { corner: "soft" } },
  {
    target: ["font-sans"],
    patch: {
      font: "sans",
      toggled: false,
      checked: false,
      radio: false,
      segment: 0,
    },
  },
]

const MOVE_MS = 800
const HOLD_MS = 1000
const RESIZE_MS = 700
/** The content reflows partway through the resize, not at the very start. */
const REFLOW_DELAY_MS = 280
/** One easing for every change on the board, so it all moves as one. */
const EASE = "[transition-timing-function:var(--ease-out)]"
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1]

type Register = (id: string) => (el: HTMLElement | null) => void

/** Colours of the surfaces on the board, for light and dark. */
function tokens(dark: boolean) {
  return dark
    ? {
        surface: "#0F1117",
        raised: "#1A1D27",
        text: "#F3F4F6",
        muted: "#9CA3AF",
        border: "rgba(255,255,255,0.12)",
        // Brand blue lightened so small text keeps 4.5:1+ on dark surfaces.
        accent: `color-mix(in oklch, ${BRAND}, white 40%)`,
      }
    : {
        surface: "#FFFFFF",
        raised: "#F3F4F8",
        text: "#111827",
        muted: "#5B6472",
        border: "rgba(0,0,0,0.09)",
        accent: BRAND,
      }
}

/** WCAG contrast of white text on the brand colour, and the level it reaches. */
function brandContrast() {
  const n = parseInt(BRAND.slice(1), 16)
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const lum =
    0.2126 * lin((n >> 16) & 255) +
    0.7152 * lin((n >> 8) & 255) +
    0.0722 * lin(n & 255)
  const ratio = 1.05 / (lum + 0.05)
  return {
    ratio: (Math.floor(ratio * 10) / 10).toFixed(1),
    level: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "AA Large",
  }
}

const CONTRAST = brandContrast()

const NARROW_QUERY = "(max-width: 1023px)"

/** True below the two-column layout, where the preview stage is narrower. */
function useNarrow() {
  return React.useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(NARROW_QUERY)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false
  )
}

export function DesignBoard() {
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const targets = React.useRef<Record<string, HTMLElement | null>>({})
  const inView = useInView(canvasRef, { margin: "-80px" })
  const reduceMotion = useReducedMotion()

  const [look, setLook] = React.useState<Look>(INITIAL_LOOK)
  const [cursor, setCursor] = React.useState({ x: 24, y: 96, flip: false })
  const [hot, setHot] = React.useState<string | null>(null)
  const [clicks, setClicks] = React.useState(0)

  const register = React.useCallback<Register>(
    (id) => (el) => {
      targets.current[id] = el
    },
    []
  )

  // Drive the script while the board is on screen.
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
      // Use the first target that is actually on screen at this size.
      const id = target.find((t) => {
        const el = targets.current[t]
        return el && el.getBoundingClientRect().width > 0
      })
      const el = id ? targets.current[id] : null

      if (canvas && el && id) {
        const c = canvas.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        const x = r.left - c.left + r.width / 2 - 2
        setCursor({
          x,
          y: r.top - c.top + r.height / 2 - 2,
          // Put the name tag on the left when the cursor is near the right edge.
          flip: x > c.width - 110,
        })
        setHot(id)
      }

      wait(el ? MOVE_MS : 200, () => {
        setLook((prev) => ({ ...prev, ...patch }))
        if (el) setClicks((n) => n + 1)
        wait(el ? HOLD_MS : 300, () => {
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
    <div
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none relative overflow-hidden rounded-3xl border border-border bg-muted/50 [background-image:radial-gradient(var(--color-border)_1.5px,transparent_1.5px)] [background-size:24px_24px] p-4 select-none sm:p-8"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
        {/* Left: the building blocks, kept quiet so the screen leads. */}
        <div className="hidden flex-col gap-5 lg:flex">
          <div>
            <Label>Foundations</Label>
            <div className="grid grid-cols-2 gap-3">
              <ColourCard />
              <TypeCard look={look} />
              <SpacingCard />
              <RadiusCard look={look} />
            </div>
          </div>
          <Components look={look} register={register} />
        </div>

        {/* Right: the screen in focus, resizing from phone to desktop, with
            the designer's toolbar right under it. */}
        <div className="flex flex-col">
          <Preview look={look} register={register} />
          <Toolbar look={look} hot={hot} register={register} />
        </div>
      </div>

      {!reduceMotion && (
        <Cursor
          position={cursor}
          clicks={clicks}
          color={BRAND}
          name="Designer"
        />
      )}
    </div>
  )
}

/* ------------------------------- Foundations ------------------------------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-medium text-muted-foreground">
      {children}
    </span>
  )
}

function FoundationCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-28 flex-col gap-2 rounded-xl border border-border bg-background p-4 shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  )
}

/** The fixed brand colour, with a contrast check on white text. */
function ColourCard() {
  const shades = [
    `color-mix(in oklch, ${BRAND}, black 25%)`,
    BRAND,
    `color-mix(in oklch, ${BRAND}, white 40%)`,
    `color-mix(in oklch, ${BRAND}, white 75%)`,
  ]
  return (
    <FoundationCard title="Colour">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-muted-foreground uppercase">
            {BRAND}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
            <Check className="size-3" strokeWidth={3} />
            {CONTRAST.ratio} {CONTRAST.level}
          </span>
        </div>
        <div className="flex overflow-hidden rounded-md">
          {shades.map((shade, i) => (
            <span
              key={i}
              className="h-7 flex-1"
              style={{ backgroundColor: shade }}
            />
          ))}
        </div>
      </div>
    </FoundationCard>
  )
}

function TypeCard({ look }: { look: Look }) {
  const font = FONTS[look.font]
  return (
    <FoundationCard title="Type">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-4xl leading-none font-semibold"
          style={{ fontFamily: font.family }}
        >
          Aa
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs text-muted-foreground">{font.label}</span>
          <span className="h-1.5 w-12 rounded-full bg-border" />
          <span className="h-1.5 w-8 rounded-full bg-border" />
        </div>
      </div>
    </FoundationCard>
  )
}

/** The 8-point spacing scale. */
function SpacingCard() {
  return (
    <FoundationCard title="Spacing">
      <div className="flex flex-col gap-1">
        {[4, 8, 16].map((size) => (
          <div key={size} className="flex items-center gap-2">
            <span className="w-5 text-right font-mono text-[11px] text-muted-foreground">
              {size}
            </span>
            <span
              className="h-1.5 rounded-full bg-primary/60"
              style={{ width: size * 4 }}
            />
          </div>
        ))}
      </div>
    </FoundationCard>
  )
}

/** The corner radii in use; follows the corner style live. */
function RadiusCard({ look }: { look: Look }) {
  const r = CORNERS[look.corner]
  return (
    <FoundationCard title="Radius">
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-end gap-2">
          {[
            { size: "size-9", radius: r.surface },
            { size: "size-7", radius: r.control === 999 ? 14 : r.control },
            { size: "size-5", radius: r.small === 999 ? 10 : r.small },
          ].map((box, i) => (
            <span
              key={i}
              className={cn(
                "border-2 border-primary bg-primary/10 transition-[border-radius] duration-[600ms]",
                EASE,
                box.size
              )}
              style={{ borderRadius: box.radius }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{r.label}</span>
      </div>
    </FoundationCard>
  )
}

/* --------------------------- Responsive preview ---------------------------- */

/** Frame width per device, as a share of the stage (wider on smaller screens). */
const FRAME_WIDTH = {
  wide: { phone: "44%", tablet: "72%", desktop: "100%" },
  narrow: { phone: "62%", tablet: "84%", desktop: "100%" },
}

/** Frame height; the stage around it keeps a fixed height. */
const FRAME_HEIGHT: Record<Device, string> = {
  phone: "100%",
  tablet: "340px",
  desktop: "300px",
}

function Preview({ look, register }: { look: Look; register: Register }) {
  const t = tokens(look.dark)
  const r = CORNERS[look.corner]
  const narrow = useNarrow()
  const move = `transition-[background-color,border-color,border-radius,color] duration-[600ms] ${EASE}`
  const resize = {
    transitionDuration: `${RESIZE_MS}ms`,
    transitionTimingFunction: "var(--ease-in-out)",
  }

  // The layout inside changes a moment after the frame starts resizing.
  const [layout, setLayout] = React.useState<Device>(look.device)
  React.useEffect(() => {
    const timer = setTimeout(() => setLayout(look.device), REFLOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [look.device])

  const radius =
    look.device === "phone"
      ? r.surface + 10
      : look.device === "tablet"
        ? r.surface + 2
        : Math.max(8, Math.round(r.surface / 2))

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
      {/* Soft spotlight so the screen reads as the focus of the board. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-3/4 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative">
        <span className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {(Object.keys(DEVICES) as Device[]).map((key) => (
            <span
              key={key}
              className={cn(
                "transition-colors duration-[600ms]",
                EASE,
                look.device === key
                  ? "text-foreground"
                  : "text-muted-foreground/50"
              )}
            >
              {DEVICES[key].label}
            </span>
          ))}
        </span>

        {/* Fixed-height stage: the frame resizes inside it without moving
            anything around it. */}
        <div className="flex h-[24rem] items-center justify-center sm:h-[26rem] lg:h-[28rem]">
          <div
            className="relative flex flex-col overflow-hidden border shadow-2xl transition-[width,height,border-radius,background-color,border-color,color]"
            style={{
              ...resize,
              width: (narrow ? FRAME_WIDTH.narrow : FRAME_WIDTH.wide)[
                look.device
              ],
              height: FRAME_HEIGHT[look.device],
              background: t.surface,
              color: t.text,
              borderColor: t.border,
              borderRadius: radius,
              fontFamily: FONTS[look.font].family,
            }}
          >
            {/* Device chrome: notch, nothing, or a browser bar. */}
            <div
              className="relative shrink-0 transition-[height,background-color]"
              style={{
                ...resize,
                height:
                  look.device === "desktop"
                    ? 28
                    : look.device === "phone"
                      ? 24
                      : 12,
                background:
                  look.device === "desktop" ? t.raised : "transparent",
                borderBottom:
                  look.device === "desktop" ? `1px solid ${t.border}` : "none",
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 flex items-center gap-1.5 px-3 transition-opacity duration-[400ms]",
                  look.device === "desktop" ? "opacity-100" : "opacity-0"
                )}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ background: t.border }}
                  />
                ))}
                <span
                  className="ml-2 h-3 flex-1 rounded-full"
                  style={{ background: t.surface }}
                />
              </div>
              <span
                className={cn(
                  "absolute top-2 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full transition-opacity duration-[400ms]",
                  look.device === "phone" ? "opacity-100" : "opacity-0"
                )}
                style={{ background: t.border }}
              />
            </div>

            <Screen
              look={look}
              layout={layout}
              register={register}
              move={move}
            />

            {/* 8-point grid overlay */}
            <span
              className={cn(
                "pointer-events-none absolute inset-0 transition-opacity duration-500",
                look.grid ? "opacity-100" : "opacity-0"
              )}
              style={{
                backgroundImage: `linear-gradient(to right, ${BRAND}33 1px, transparent 1px), linear-gradient(to bottom, ${BRAND}33 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const COLUMNS: Record<Device, string> = {
  phone: "grid-cols-1",
  tablet: "grid-cols-2",
  desktop: "grid-cols-3",
}

const ITEM_COUNT: Record<Device, number> = { phone: 3, tablet: 4, desktop: 6 }

/** The app screen: the same content, laid out for the current screen size. */
function Screen({
  look,
  layout,
  register,
  move,
}: {
  look: Look
  layout: Device
  register: Register
  move: string
}) {
  const t = tokens(look.dark)
  const r = CORNERS[look.corner]
  const rail = layout !== "phone"
  const glide = { duration: RESIZE_MS / 1000, ease: EASE_IN_OUT }

  const nav = (
    <div
      className={cn(
        "flex shrink-0 items-center transition-colors duration-[600ms]",
        rail
          ? "w-12 flex-col gap-5 border-r pt-4"
          : "h-12 justify-around border-t"
      )}
      style={{ borderColor: t.border }}
    >
      {[House, Search, User].map((Icon, i) => (
        <Icon
          key={i}
          className="size-5 transition-colors duration-[600ms]"
          style={{ color: i === 0 ? t.accent : t.muted }}
        />
      ))}
    </div>
  )

  return (
    <div className={cn("flex min-h-0 flex-1", rail ? "flex-row" : "flex-col")}>
      {rail && nav}

      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3">
        {layout !== "desktop" && (
          <motion.div
            layout="position"
            transition={glide}
            className="flex shrink-0 items-center gap-2"
          >
            <span
              className={cn("size-7 rounded-full", move)}
              style={{ background: BRAND, opacity: 0.25 }}
            />
            <span className="flex flex-col gap-1">
              <span
                className="h-1.5 w-16 rounded-full"
                style={{ background: t.border }}
              />
              <span
                className="h-1.5 w-10 rounded-full"
                style={{ background: t.border }}
              />
            </span>
          </motion.div>
        )}

        <motion.div
          layout
          transition={glide}
          className={cn("flex shrink-0 flex-col gap-3 p-4", move)}
          style={{
            borderRadius: r.surface,
            background: `linear-gradient(135deg, ${BRAND}, color-mix(in oklch, ${BRAND}, white 45%))`,
          }}
        >
          <span className="text-lg leading-tight font-semibold text-white">
            Welcome
          </span>
          <span
            ref={register("cta")}
            className={cn(
              "flex h-9 w-fit items-center px-4 text-xs font-medium",
              move
            )}
            style={{
              background: "#fff",
              color: BRAND,
              borderRadius: r.control,
            }}
          >
            Get started
          </span>
        </motion.div>

        <div className={cn("grid gap-2", COLUMNS[layout])}>
          {Array.from({ length: ITEM_COUNT[layout] }).map((_, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={glide}
              className={cn("flex items-center gap-3 p-2", move)}
              style={{ background: t.raised, borderRadius: r.small + 6 }}
            >
              <span
                className={cn("size-6 shrink-0 rounded-full", move)}
                style={{ background: BRAND, opacity: 0.3 }}
              />
              <span className="flex flex-1 flex-col gap-1">
                <span
                  className="h-1.5 w-4/5 rounded-full"
                  style={{ background: t.border }}
                />
                <span
                  className="h-1.5 w-1/2 rounded-full"
                  style={{ background: t.border }}
                />
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {!rail && nav}
    </div>
  )
}

/* ------------------------------- Components -------------------------------- */

function Components({ look, register }: { look: Look; register: Register }) {
  const t = tokens(look.dark)
  const r = CORNERS[look.corner]
  const font = FONTS[look.font].family
  const move = `transition-[background-color,border-color,border-radius,color,transform,filter,box-shadow] duration-[600ms] ${EASE}`
  const pill = (radius: number) => (radius === 999 ? 999 : radius + 4)

  return (
    <div>
      <Label>Components</Label>
      <div
        className={cn("flex flex-col gap-3 border p-4 shadow-sm", move)}
        style={{
          background: t.surface,
          color: t.text,
          borderColor: t.border,
          borderRadius: r.surface,
          fontFamily: font,
        }}
      >
        {/* Buttons */}
        <div className="flex gap-2">
          <span
            ref={register("btn")}
            className={cn(
              "flex h-9 flex-1 items-center justify-center text-sm font-medium text-white",
              move
            )}
            style={{
              background: BRAND,
              borderRadius: r.control,
              transform: look.pressed ? "scale(0.95)" : "scale(1)",
              filter: look.pressed ? "brightness(0.85)" : "none",
            }}
          >
            Primary
          </span>
          <span
            className={cn(
              "flex h-9 flex-1 items-center justify-center border-2 text-sm font-medium",
              move
            )}
            style={{
              borderColor: t.accent,
              color: t.accent,
              borderRadius: r.control,
            }}
          >
            Secondary
          </span>
        </div>

        {/* Toggle, checkbox, radio */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span
            ref={register("toggle")}
            className={cn("relative h-5 w-9 shrink-0 rounded-full", move)}
            style={{ background: look.toggled ? BRAND : t.border }}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-[500ms]",
                EASE
              )}
              style={{ transform: look.toggled ? "translateX(16px)" : "none" }}
            />
          </span>
          <span className="flex items-center gap-2">
            <span
              ref={register("checkbox")}
              className={cn(
                "flex size-4 shrink-0 items-center justify-center border-2",
                move
              )}
              style={{
                borderColor: look.checked ? BRAND : t.muted,
                background: look.checked ? BRAND : "transparent",
                borderRadius: Math.min(r.small, 6),
                color: "#fff",
              }}
            >
              <Check
                className={cn(
                  "size-2.5 transition-opacity duration-300",
                  look.checked ? "opacity-100" : "opacity-0"
                )}
                strokeWidth={4}
              />
            </span>
            Agree
          </span>
          <span className="flex items-center gap-2">
            <span
              ref={register("radio")}
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                move
              )}
              style={{ borderColor: look.radio ? BRAND : t.muted }}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-transform duration-[400ms]",
                  EASE
                )}
                style={{
                  background: BRAND,
                  transform: look.radio ? "scale(1)" : "scale(0)",
                }}
              />
            </span>
            Option
          </span>
        </div>

        {/* Segmented control. The labels are drawn twice: dark ones on the
            track, and white ones inside the sliding pill. The white row moves
            opposite to the pill, so each label is always readable, even
            halfway through the slide. */}
        <div
          className={cn("relative grid h-8 grid-cols-3 p-0.5 text-xs", move)}
          style={{ background: t.raised, borderRadius: r.control }}
        >
          {SEGMENTS.map((label, i) => (
            <span
              key={label}
              ref={register(`segment-${i}`)}
              className="relative flex items-center justify-center font-medium"
              style={{ color: t.text }}
            >
              {label}
            </span>
          ))}
          <span
            aria-hidden
            className={cn(
              "absolute top-0.5 bottom-0.5 left-0.5 w-[calc((100%-4px)/3)] overflow-hidden transition-[transform,border-radius] duration-[500ms]",
              EASE
            )}
            style={{
              background: BRAND,
              borderRadius: r.control,
              transform: `translateX(${look.segment * 100}%)`,
            }}
          >
            <span
              className={cn(
                "absolute top-0 left-0 grid h-full w-[300%] grid-cols-3 text-white transition-transform duration-[500ms]",
                EASE
              )}
              style={{ transform: `translateX(${(-look.segment * 100) / 3}%)` }}
            >
              {SEGMENTS.map((label) => (
                <span
                  key={label}
                  className="flex items-center justify-center font-medium"
                >
                  {label}
                </span>
              ))}
            </span>
          </span>
        </div>

        {/* Input */}
        <span
          className={cn("flex h-9 items-center border px-3 text-xs", move)}
          style={{
            borderColor: t.border,
            background: t.raised,
            color: t.muted,
            borderRadius: r.control === 999 ? 18 : r.control,
          }}
        >
          you@example.com
        </span>

        {/* Chips, avatars, badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <span
              className={cn("px-2.5 py-1 text-xs font-medium", move)}
              style={{
                background: `${BRAND}22`,
                color: t.accent,
                borderRadius: pill(r.small),
              }}
            >
              UX/UI
            </span>
            <span
              className={cn("border px-2.5 py-1 text-xs font-medium", move)}
              style={{
                borderColor: t.border,
                color: t.muted,
                borderRadius: pill(r.small),
              }}
            >
              Branding
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[0.85, 0.55, 0.3].map((opacity, i) => (
                <span
                  key={i}
                  className={cn(
                    "-ml-1.5 size-6 rounded-full border-2 first:ml-0",
                    move
                  )}
                  style={{
                    borderColor: t.surface,
                    background: `color-mix(in oklch, ${BRAND} ${opacity * 100}%, white)`,
                  }}
                />
              ))}
            </div>
            <span
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold text-white",
                move
              )}
              style={{ background: BRAND, borderRadius: pill(r.small) }}
            >
              New
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Cursor ---------------------------------- */

function Cursor({
  position,
  clicks,
  color,
  name,
}: {
  position: { x: number; y: number; flip: boolean }
  clicks: number
  color: string
  name: string
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
      <svg width="16" height="20" viewBox="0 0 16 20" fill={color}>
        <path
          d="M1 1v15l4.2-3.6L8.1 19l2.4-1.1-2.8-6.2H14z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "absolute top-4 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap text-white",
          position.flip ? "right-1" : "left-4"
        )}
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
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
  const pill = (id: string, active: boolean) =>
    cn(
      "flex size-7 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-[400ms] sm:size-8",
      EASE,
      active ? "bg-primary/10 text-primary" : "text-muted-foreground",
      hot === id && "scale-110"
    )

  return (
    <div className="relative mx-auto mt-4 flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-background p-1 shadow-lg sm:gap-3 sm:p-2">
      <div className="flex items-center gap-1">
        {(Object.keys(DEVICES) as Device[]).map((key) => {
          const Icon = DEVICES[key].icon
          return (
            <span
              key={key}
              ref={register(`device-${key}`)}
              className={pill(`device-${key}`, look.device === key)}
            >
              <Icon className="size-4" />
            </span>
          )
        })}
      </div>

      <span className="hidden h-6 w-px bg-border sm:block" />

      <div className="flex items-center gap-1">
        {(Object.keys(CORNERS) as CornerKey[]).map((key) => (
          <span
            key={key}
            ref={register(`corner-${key}`)}
            className={pill(`corner-${key}`, look.corner === key)}
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

      <span className="hidden h-6 w-px bg-border sm:block" />

      <div className="flex items-center gap-1">
        {(Object.keys(FONTS) as FontKey[]).map((key) => (
          <span
            key={key}
            ref={register(`font-${key}`)}
            className={pill(`font-${key}`, look.font === key)}
          >
            <span
              className="text-sm leading-none font-semibold"
              style={{ fontFamily: FONTS[key].family }}
            >
              Aa
            </span>
          </span>
        ))}
      </div>

      <span className="hidden h-6 w-px bg-border sm:block" />

      <div className="flex items-center gap-1">
        <span ref={register("mode")} className={pill("mode", look.dark)}>
          {look.dark ? (
            <MoonIcon className="size-4" />
          ) : (
            <SunIcon className="size-4" />
          )}
        </span>
        <span ref={register("grid")} className={pill("grid", look.grid)}>
          <LayoutGrid className="size-4" />
        </span>
      </div>
    </div>
  )
}
