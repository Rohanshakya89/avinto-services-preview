import { motion } from "motion/react"

/** Pieces shared by the isometric "Our Approach" illustrations. */

export const SHADOW = "#1F2A9E"
export const EDGE = "#A3B7F8"
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** The pale block colours used for chips, stations, people and items. */
export const PALE = { top: "#F4F7FF", left: "#C7D4FA", right: EDGE }

/** An isometric cube whose base is centred on (x, y). */
export function Cube({
  x,
  y,
  s,
  height = s,
  top,
  left,
  right,
}: {
  x: number
  y: number
  s: number
  /** Defaults to `s`, a true cube. */
  height?: number
  top: string
  left: string
  right: string
}) {
  const w = 0.866 * s
  const h = 0.5 * s
  const pts = (list: [number, number][]) =>
    list.map((p) => p.join(",")).join(" ")

  return (
    <g strokeLinejoin="round">
      <polygon
        points={pts([
          [x - w, y],
          [x, y + h],
          [x, y + h - height],
          [x - w, y - height],
        ])}
        fill={left}
      />
      <polygon
        points={pts([
          [x, y + h],
          [x + w, y],
          [x + w, y - height],
          [x, y + h - height],
        ])}
        fill={right}
      />
      <polygon
        points={pts([
          [x, y - h - height],
          [x + w, y - height],
          [x, y + h - height],
          [x - w, y - height],
        ])}
        fill={top}
      />
    </g>
  )
}

/** Space around the content of a pill, so both sides match. */
const PAD = 14
const DOT_X = PAD + 5
const TEXT_X = DOT_X + 5 + 8

/**
 * Sets a pill's width from its real text, so the padding is even on both
 * sides. A pill marked `data-center` is also centred on its x position.
 */
export function fitPill(g: SVGGElement | null) {
  if (!g) return

  const fit = () => {
    const text = g.querySelector("text")
    const rect = g.querySelector("rect")
    if (!text || !rect) return

    const width = TEXT_X + text.getComputedTextLength() + PAD
    rect.setAttribute("width", String(width))
    g.querySelector("g[data-pill-inner]")?.setAttribute(
      "transform",
      g.hasAttribute("data-center") ? `translate(${-width / 2} 0)` : ""
    )
  }

  fit()
  // The font may not be ready on first paint; measure again once it is.
  void document.fonts?.ready.then(fit)
}

/** A white pill with a dot, fading in at (x, y): names things in the picture. */
export function Tag({
  x,
  y,
  label,
  show,
  center,
}: {
  x: number
  y: number
  label: string
  show: boolean
  /** Centre the pill on `x` instead of starting at it. */
  center?: boolean
}) {
  return (
    <motion.g
      ref={fitPill}
      data-center={center ? "" : undefined}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        transform: `translate(${x}px, ${show ? y : y + 6}px)`,
      }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: show ? 0.15 : 0 }}
    >
      <g data-pill-inner>
        <rect
          width={TEXT_X + label.length * 8 + PAD}
          height="32"
          rx="16"
          fill="white"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <circle cx={DOT_X} cy="16" r="5" style={{ fill: "var(--primary)" }} />
        <text
          x={TEXT_X}
          y="16"
          dominantBaseline="central"
          fontSize="16"
          fontWeight="500"
          fill="var(--foreground)"
        >
          {label}
        </text>
      </g>
    </motion.g>
  )
}

/** Board coordinates (a 300x180 plane) to screen coordinates. */
export const toScreen = (u: number, v: number) => ({
  x: 250 + 0.866 * (u - v),
  y: 96 + 0.5 * (u + v),
})

/**
 * A box standing on the board: its footprint runs a (along u) by b (along v)
 * from (u, v), and it is h tall. Draws the top and the two faces you can see.
 */
export function Box({
  u,
  v,
  a,
  b,
  h,
  top,
  left,
  right,
}: {
  u: number
  v: number
  a: number
  b: number
  h: number
  top: string
  left: string
  right: string
}) {
  const p = (uu: number, vv: number, z = 0) => {
    const s = toScreen(uu, vv)
    return `${s.x},${s.y - z}`
  }

  return (
    <g strokeLinejoin="round">
      <polygon
        points={[
          p(u, v + b),
          p(u + a, v + b),
          p(u + a, v + b, h),
          p(u, v + b, h),
        ].join(" ")}
        fill={left}
      />
      <polygon
        points={[
          p(u + a, v + b),
          p(u + a, v),
          p(u + a, v, h),
          p(u + a, v + b, h),
        ].join(" ")}
        fill={right}
      />
      <polygon
        points={[
          p(u, v, h),
          p(u + a, v, h),
          p(u + a, v + b, h),
          p(u, v + b, h),
        ].join(" ")}
        fill={top}
      />
    </g>
  )
}
