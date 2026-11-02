import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { fitPill } from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the AI & Data page's "Our Approach". An isometric board:  */
/*  data flows into a model, a result comes out, a person reviews it, and the  */
/*  model is swapped for the next one without touching the rest. One picture   */
/*  for the whole approach: start from real data, show a working result early, */
/*  check it, keep people in control, and stay ready to swap the model.        */
/*  Plays on a loop while on screen. Purely visual, nothing is interactive.    */
/* -------------------------------------------------------------------------- */

const SHADOW = "#1F2A9E"
const EDGE = "#A3B7F8"

/** The old model chip: pale. The next one: warm, so the swap reads at a glance. */
const OLD_CHIP = { top: "#F4F7FF", left: "#C7D4FA", right: EDGE }
const NEW_CHIP = { top: "#FFD369", left: "#F2B33D", right: "#E09A1F" }

/** The board is a 300x180 plane, drawn flat then mapped to isometric. */
const PLANE = "matrix(0.866 0.5 -0.866 0.5 250 96)"
const BOARD = "M0 0 H300 V180 H0 Z"
const DEPTH = 20

/** Where the chip sits on screen: the middle of the board. */
const CHIP = { x: 302, y: 216, s: 40 }

/** Loop: data flows in, a person reviews, the model is swapped. */
type Phase = 0 | 1 | 2 | 3
const PHASE_MS: Record<Phase, number> = { 0: 1500, 1: 2800, 2: 1900, 3: 2900 }

const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** An isometric cube whose base is centred on (x, y). */
function Cube({
  x,
  y,
  s,
  top,
  left,
  right,
}: {
  x: number
  y: number
  s: number
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
          [x, y + h - s],
          [x - w, y - s],
        ])}
        fill={left}
      />
      <polygon
        points={pts([
          [x, y + h],
          [x + w, y],
          [x + w, y - s],
          [x, y + h - s],
        ])}
        fill={right}
      />
      <polygon
        points={pts([
          [x, y - h - s],
          [x + w, y - s],
          [x, y + h - s],
          [x - w, y - s],
        ])}
        fill={top}
      />
    </g>
  )
}

export function AiApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 2 : 0)
  const instant = !!reduceMotion

  // Loop through the phases while the illustration is on screen.
  React.useEffect(() => {
    if (!inView || reduceMotion) return

    let timer: ReturnType<typeof setTimeout>
    const next = (current: Phase) => {
      timer = setTimeout(() => {
        const following = ((current + 1) % 4) as Phase
        setPhase(following)
        next(following)
      }, PHASE_MS[current])
    }
    next(phase)

    return () => clearTimeout(timer)
    // `phase` is read once at start; the chain carries it from there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion])

  const hasResult = phase >= 1
  const reviewed = phase >= 2
  const swapped = phase === 3

  return (
    <svg
      ref={ref}
      viewBox="24 84 520 336"
      role="img"
      aria-label="Data flowing into an AI model and producing a result, which a person reviews, before the model is swapped for a newer one"
      className="mx-auto h-auto w-full max-w-md"
    >
      <ellipse
        cx="322"
        cy="392"
        rx="212"
        ry="16"
        fill={SHADOW}
        opacity="0.12"
      />

      {/* The board, with its thickness. */}
      {Array.from({ length: DEPTH }, (_, i) => (
        <g key={i} transform={`translate(0 ${DEPTH - i})`}>
          <path
            d={BOARD}
            transform={PLANE}
            style={{
              fill: "color-mix(in oklch, var(--primary), black 32%)",
            }}
          />
        </g>
      ))}
      <path d={BOARD} transform={PLANE} style={{ fill: "var(--primary)" }} />

      {/* Everything flat on the board. */}
      <g transform={PLANE}>
        <Circuit hasResult={hasResult} instant={instant} />

        {!instant && phase === 1 && <Packets delay={0} />}
        {!instant && swapped && <Packets delay={1.1} />}
        {!instant && (phase === 1 || swapped) && (
          <Pulse delay={phase === 1 ? 1.2 : 1.9} />
        )}
      </g>

      {/* The model: the old chip lifts away, the next one drops in. */}
      <Chip
        colours={OLD_CHIP}
        shown={!swapped}
        swapIn={false}
        instant={instant}
      />
      <Chip colours={NEW_CHIP} shown={swapped} swapIn instant={instant} />

      <Reviewer show={reviewed} instant={instant} />

      <Tag x={36} y={96} label="Your data" show />
      <Tag x={258} y={112} label="Model" show={!swapped} />
      <Tag x={235} y={112} label="Next model" show={swapped} />
      <Tag x={372} y={322} label="Human review" show={reviewed} />
    </svg>
  )
}

/* --------------------------------- Pieces ---------------------------------- */

/** Input nodes, traces, and the result card: the flat layer of the board. */
const LANES = [36, 90, 144]

function Circuit({
  hasResult,
  instant,
}: {
  hasResult: boolean
  instant: boolean
}) {
  return (
    <g>
      <g
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.35"
      >
        {LANES.map((y) => (
          <path key={y} d={`M38 ${y} H96 V90 H130`} />
        ))}
        <path d="M170 90 H236" />
      </g>

      {LANES.map((y) => (
        <rect
          key={y}
          x="22"
          y={y - 8}
          width="16"
          height="16"
          rx="4"
          fill="white"
          opacity="0.95"
        />
      ))}

      {/* The result card, empty until the model has answered. */}
      <rect
        x="236"
        y="50"
        width="54"
        height="80"
        rx="8"
        fill="white"
        opacity="0.95"
      />
      {[
        { y: 64, w: 36 },
        { y: 78, w: 28 },
        { y: 92, w: 34 },
        { y: 106, w: 20 },
      ].map((line, i) => (
        <motion.rect
          key={line.y}
          x="245"
          y={line.y}
          height="6"
          rx="3"
          style={{ fill: "var(--primary)" }}
          initial={false}
          animate={{
            width: hasResult ? line.w : 0,
            opacity: hasResult ? 0.85 : 0,
          }}
          transition={{
            duration: instant ? 0 : hasResult ? 0.4 : 0.2,
            delay: hasResult && !instant ? 1.3 + i * 0.1 : 0,
            ease: EASE_OUT,
          }}
        />
      ))}
    </g>
  )
}

/** Small blocks of data travelling along the traces into the chip. */
function Packets({ delay }: { delay: number }) {
  return (
    <g>
      {LANES.map((y, i) => (
        <motion.rect
          key={y}
          width="10"
          height="10"
          rx="2"
          fill="#FFD369"
          initial={{ opacity: 0, transform: `translate(31px, ${y - 5}px)` }}
          animate={{
            opacity: [0, 1, 1, 0],
            transform: [
              `translate(31px, ${y - 5}px)`,
              `translate(91px, ${y - 5}px)`,
              `translate(91px, 85px)`,
              `translate(124px, 85px)`,
            ],
          }}
          transition={{
            duration: 1.3,
            delay: delay + i * 0.22,
            times: [0, 0.4, 0.6, 1],
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  )
}

/** A ring that spreads from the chip when it takes the data in. */
function Pulse({ delay }: { delay: number }) {
  return (
    <motion.circle
      cx="150"
      cy="90"
      fill="none"
      strokeWidth="4"
      stroke="white"
      initial={{ r: 26, opacity: 0 }}
      animate={{ r: 64, opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    />
  )
}

/** The model chip: a raised block with a spark on top. */
function Chip({
  colours,
  shown,
  swapIn,
  instant,
}: {
  colours: { top: string; left: string; right: string }
  shown: boolean
  /** The incoming chip waits above the board; the outgoing one leaves upward. */
  swapIn: boolean
  instant: boolean
}) {
  const away = "translate(0px, -64px)"
  const here = "translate(0px, 0px)"

  return (
    <motion.g
      initial={false}
      animate={{ opacity: shown ? 1 : 0, transform: shown ? here : away }}
      transition={{
        duration: instant ? 0 : 0.6,
        delay: shown && swapIn && !instant ? 0.45 : 0,
        ease: EASE_OUT,
      }}
    >
      <Cube x={CHIP.x} y={CHIP.y} s={CHIP.s} {...colours} />
      <path
        transform={`translate(${CHIP.x} ${CHIP.y - CHIP.s})`}
        d="M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12 Z"
        style={{ fill: "var(--primary)" }}
      />
    </motion.g>
  )
}

/** A person at the edge of the board, and the tick they give the result. */
function Reviewer({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <>
      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(341px, ${show ? 298 : 310}px)`,
        }}
        transition={{ duration: instant ? 0 : 0.4, ease: EASE_OUT }}
      >
        <g transform="scale(1.4)">
          <ellipse cy="2" rx="13" ry="6" fill={SHADOW} opacity="0.3" />
          <path
            d="M-11 0 C-11 -10 -6 -16 -4 -19 H4 C6 -16 11 -10 11 0 Z"
            fill={OLD_CHIP.top}
            stroke={EDGE}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle
            cy="-27"
            r="8"
            fill={OLD_CHIP.top}
            stroke={EDGE}
            strokeWidth="2"
          />
        </g>
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(404px, 238px) scale(${show ? 1 : 0.6})`,
        }}
        transition={{
          duration: instant ? 0 : 0.35,
          delay: show && !instant ? 0.5 : 0,
          ease: EASE_OUT,
        }}
      >
        <circle r="15" fill="white" stroke="var(--primary)" strokeWidth="3" />
        <path
          d="M-6 0 L-2 5 L7 -5"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </>
  )
}

function Tag({
  x,
  y,
  label,
  show,
}: {
  x: number
  y: number
  label: string
  show: boolean
}) {
  const width = 32 + label.length * 8 + 14

  return (
    <motion.g
      ref={fitPill}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        transform: `translate(${x}px, ${show ? y : y + 6}px)`,
      }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: show ? 0.15 : 0 }}
    >
      <rect
        width={width}
        height="32"
        rx="16"
        fill="white"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <circle cx="19" cy="16" r="5" style={{ fill: "var(--primary)" }} />
      <text
        x="32"
        y="16"
        dominantBaseline="central"
        fontSize="16"
        fontWeight="500"
        fill="var(--foreground)"
      >
        {label}
      </text>
    </motion.g>
  )
}
