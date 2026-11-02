import * as React from "react"
import { animate, motion, useInView, useReducedMotion } from "motion/react"

import { EASE_OUT, EDGE, Tag } from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the Maintenance page's "Our Approach". A whiteboard with  */
/*  one scene per point in the list:                                           */
/*    1 tickets fade away; we adopt the product            (take ownership)    */
/*    2 shields stop problems before they arrive           (prevent)           */
/*    3 a plain-language report beside the product         (be transparent)    */
/*    4 a new module slots onto a tidy stack               (plan for change)   */
/*    5 a slider from light to dedicated, people join      (flex to your needs)*/
/*  Plays on a loop while on screen. Purely visual, nothing is interactive.    */
/* -------------------------------------------------------------------------- */

const SOFT = "#C7D4FA"
/** Cards are soft fills, with no outline. */
const CARD = "#E8EEFC"
const MID = "#8FA7F5"
const AMBER = "#F2B33D"

const ink = { fill: "var(--primary)" }

/** Where the scenes sit; each is drawn in its own 376 x 256 coordinates. */
const BOARD = { x: 96, y: 96, w: 376, h: 256 }

/** Loop, one beat per point in the list. */
type Phase = 0 | 1 | 2 | 3 | 4
const PHASE_MS: Record<Phase, number> = {
  0: 3200,
  1: 3400,
  2: 3000,
  3: 3000,
  4: 3600,
}

const CAPTIONS = [
  "Take ownership",
  "Fix it before it breaks",
  "Be transparent",
  "Plan for change",
  "Flex to your needs",
] as const

/** A scene's elements fade in after `delay` and out with the scene. */
const pop = (show: boolean, instant: boolean, delay: number, from = 8) => ({
  initial: false as const,
  animate: {
    opacity: show ? 1 : 0,
    transform: show ? "translate(0px, 0px)" : `translate(0px, ${from}px)`,
  },
  transition: {
    duration: instant ? 0 : 0.4,
    delay: show && !instant ? delay : 0,
    ease: EASE_OUT,
  },
})

export function MaintenanceApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 4 : 0)
  const instant = !!reduceMotion

  // Beat 5: where the slider is, from 0 (light) to 1 (dedicated).
  const [level, setLevel] = React.useState(reduceMotion ? 1 : 0)

  // Loop through the phases while the illustration is on screen.
  React.useEffect(() => {
    if (!inView || reduceMotion) return

    let timer: ReturnType<typeof setTimeout>
    const next = (current: Phase) => {
      timer = setTimeout(() => {
        const following = ((current + 1) % 5) as Phase
        setPhase(following)
        next(following)
      }, PHASE_MS[current])
    }
    next(phase)

    return () => clearTimeout(timer)
    // `phase` is read once at start; the chain carries it from there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion])

  // The slider moves from a light safety net to a dedicated team.
  React.useEffect(() => {
    if (reduceMotion) return

    if (phase !== 4) {
      const reset = setTimeout(() => setLevel(0), 400)
      return () => clearTimeout(reset)
    }

    const controls = animate(0, [0, 0, 0.5, 0.5, 1], {
      duration: 2.6,
      delay: 0.6,
      times: [0, 0.1, 0.4, 0.55, 0.95],
      ease: "easeInOut",
      onUpdate: setLevel,
    })
    return () => controls.stop()
  }, [phase, reduceMotion])

  return (
    <svg
      ref={ref}
      viewBox="72 76 424 344"
      role="img"
      aria-label="A whiteboard: tickets fade away as the product is taken on, shields stop problems before they arrive, a plain-language report sits beside the product, a new module slots onto a tidy stack, and a slider moves from a light safety net to a dedicated team"
      className="mx-auto h-auto w-full max-w-md"
    >
      <g transform={`translate(${BOARD.x} ${BOARD.y})`}>
        <Ownership show={phase === 0} instant={instant} />
        <Prevent show={phase === 1} instant={instant} />
        <Report show={phase === 2} instant={instant} />
        <Modules show={phase === 3} instant={instant} />
        <Flex show={phase === 4} instant={instant} level={level} />
      </g>

      {CAPTIONS.map((caption, i) => (
        <Tag
          key={caption}
          x={284}
          y={382}
          label={caption}
          show={phase === i}
          center
        />
      ))}
    </svg>
  )
}

/* ---------------------------------- Shared --------------------------------- */

/** The product: a small app window. */
function Product({
  x,
  y,
  w = 112,
  h = 150,
}: {
  x: number
  y: number
  w?: number
  h?: number
}) {
  const inner = w - 28

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="16" fill={CARD} />
      {[16, 26, 36].map((cx) => (
        <circle key={cx} cx={cx} cy="16" r="3" fill={SOFT} />
      ))}
      <rect x="14" y="32" width={inner} height="10" rx="5" style={ink} />
      <rect
        x="14"
        y="52"
        width={inner}
        height={(h - 100) / 2}
        rx="8"
        fill="white"
      />
      <rect
        x="14"
        y={60 + (h - 100) / 2}
        width={inner}
        height={(h - 100) / 2}
        rx="8"
        fill="white"
      />
      <rect
        x="14"
        y={h - 30}
        width={inner * 0.6}
        height="14"
        rx="7"
        style={ink}
      />
    </g>
  )
}

/** A person: a round avatar with head and shoulders. */
function Person({
  x,
  y,
  r,
  fill,
}: {
  x: number
  y: number
  r: number
  fill: string
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={fill} />
      <circle cy={-r * 0.22} r={r * 0.3} fill="white" />
      <path
        d={`M${-r * 0.55} ${r * 0.7} C${-r * 0.55} ${r * 0.18} ${r * 0.55} ${r * 0.18} ${r * 0.55} ${r * 0.7} Z`}
        fill="white"
      />
    </g>
  )
}

function Label({
  x,
  y,
  children,
  anchor = "middle",
}: {
  x: number
  y: number
  children: React.ReactNode
  anchor?: "start" | "middle" | "end"
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="12"
      fontWeight="500"
      fill="var(--muted-foreground)"
    >
      {children}
    </text>
  )
}

/** A small round badge with a tick. */
function Tick({ x, y, r = 10 }: { x: number; y: number; r?: number }) {
  const k = r / 10
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r="10" style={ink} />
      <path
        d="M-4 0 L-1.2 3 L4.5 -3.5"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

/* ---------------------------------- Beat 1 --------------------------------- */

const TICKETS = [76, 112, 148]

/** The queue of tickets fades away; the product is ours now. */
function Ownership({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      <motion.g {...pop(show, instant, 0.2)}>
        <Product x={132} y={53} />
        <Label x={188} y={226}>
          Your product
        </Label>
      </motion.g>

      {/* The queue of tickets, there at first, then gone. */}
      {TICKETS.map((y, i) => (
        <motion.g
          key={y}
          initial={false}
          animate={{
            opacity: show ? [0, 1, 1, 0] : 0,
            transform: show
              ? [
                  "translate(0px, 6px)",
                  "translate(0px, 0px)",
                  "translate(0px, 0px)",
                  "translate(-16px, 0px)",
                ]
              : "translate(0px, 6px)",
          }}
          transition={{
            duration: instant ? 0 : 2,
            delay: show && !instant ? 0.4 + i * 0.15 : 0,
            times: [0, 0.2, 0.7, 1],
            ease: "easeOut",
          }}
        >
          <rect x="40" y={y} width="60" height="28" rx="7" fill={CARD} />
          <rect
            x="49"
            y={y + 8}
            width="36"
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.45"
          />
          <rect
            x="49"
            y={y + 16}
            width="24"
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.25"
          />
        </motion.g>
      ))}

      {/* Our person, and a heart: we treat it as our own. */}
      <motion.g {...pop(show, instant, 1.5)}>
        <line
          x1="252"
          x2="296"
          y1="128"
          y2="128"
          stroke={EDGE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 6"
        />
        <Person x={316} y={128} r={20} fill="var(--primary)" />
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(236px, 60px) scale(${show ? 1 : 0.5})`,
        }}
        transition={{
          duration: instant ? 0 : 0.35,
          delay: show && !instant ? 2 : 0,
          ease: EASE_OUT,
        }}
      >
        <circle r="14" fill={CARD} />
        <path
          d="M0 6 C-9 -1 -8 -9 -3 -8 C-1 -7 0 -5 0 -5 C0 -5 1 -7 3 -8 C8 -9 9 -1 0 6 Z"
          style={ink}
        />
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 2 --------------------------------- */

/** Shields on both sides stop problems before they reach the product. */
function Prevent({ show, instant }: { show: boolean; instant: boolean }) {
  const side = (dir: 1 | -1, delay: number) => {
    const cx = dir === 1 ? 292 : 84
    const from = dir === 1 ? 350 : 26
    const stop = dir === 1 ? 316 : 60

    return (
      <g key={dir}>
        <motion.g {...pop(show, instant, 0.3)}>
          <g transform={`translate(${cx} 128) scale(0.65)`}>
            <path
              d="M0 -22 L17 -16 V3 C17 14 8 20 0 25 C-8 20 -17 14 -17 3 V-16 Z"
              fill="white"
              stroke="var(--primary)"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M-6 0 L-1.5 4.5 L7 -5"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </motion.g>

        {/* The problem arrives, and stops at the shield. */}
        {show && !instant && (
          <motion.g
            initial={{ opacity: 0, transform: `translate(${from}px, 128px)` }}
            animate={{
              opacity: [0, 1, 1, 0],
              transform: [
                `translate(${from}px, 128px)`,
                `translate(${from}px, 128px)`,
                `translate(${stop}px, 128px)`,
                `translate(${stop}px, 128px)`,
              ],
            }}
            transition={{
              duration: 1.3,
              delay,
              times: [0, 0.1, 0.8, 1],
              ease: "easeIn",
            }}
          >
            <circle r="10" fill={AMBER} />
            <rect
              x="-1.2"
              y="-5"
              width="2.4"
              height="6"
              rx="1.2"
              fill="white"
            />
            <circle cy="5" r="1.4" fill="white" />
          </motion.g>
        )}

        {show && !instant && (
          <motion.circle
            cx={stop}
            cy="128"
            fill="none"
            stroke={AMBER}
            strokeWidth="2"
            initial={{ r: 8, opacity: 0 }}
            animate={{ r: 26, opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.6, delay: delay + 1.05, ease: EASE_OUT }}
          />
        )}
      </g>
    )
  }

  return (
    <g>
      <motion.g {...pop(show, instant, 0.1)}>
        <Product x={132} y={53} />
      </motion.g>

      {side(-1, 0.8)}
      {side(1, 1.5)}

      {/* All well. */}
      <motion.g {...pop(show, instant, 2.6)}>
        <rect x="146" y="14" width="84" height="26" rx="13" fill={CARD} />
        <Tick x={162} y={27} r={7} />
        <text
          x="174"
          y="27"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="600"
          fill="var(--foreground)"
        >
          Healthy
        </text>
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 3 --------------------------------- */

const REPORT = ["Done", "Found", "Next"]

/** A plain-language report: what we did, what we found, what we recommend. */
function Report({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      <motion.g {...pop(show, instant, 0.2)}>
        <Product x={36} y={63} w={96} h={130} />
      </motion.g>

      <motion.line
        x1="136"
        x2="190"
        y1="128"
        y2="128"
        stroke={EDGE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 6"
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3, delay: show && !instant ? 0.7 : 0 }}
      />

      <motion.g {...pop(show, instant, 0.8)}>
        <rect x="190" y="40" width="150" height="176" rx="14" fill={CARD} />
        <text
          x="206"
          y="66"
          fontSize="13"
          fontWeight="600"
          fill="var(--foreground)"
        >
          Report
        </text>
      </motion.g>

      {REPORT.map((label, i) => (
        <motion.g key={label} {...pop(show, instant, 1.2 + i * 0.5, 0)}>
          <rect
            x="204"
            y={82 + i * 44}
            width="122"
            height="36"
            rx="9"
            fill="white"
          />
          <circle cx="220" cy={100 + i * 44} r="6" style={ink} />
          <text
            x="234"
            y={100 + i * 44}
            dominantBaseline="central"
            fontSize="12"
            fontWeight="600"
            fill="var(--foreground)"
          >
            {label}
          </text>
          <rect
            x="282"
            y={97 + i * 44}
            width="32"
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.35"
          />
        </motion.g>
      ))}
    </g>
  )
}

/* ---------------------------------- Beat 4 --------------------------------- */

const MODULES = [36, 86, 136]

/** A tidy stack of modules, and a new one that slots in without disturbing the rest. */
function Modules({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      {MODULES.map((y, i) => (
        <motion.g key={y} {...pop(show, instant, 0.2 + i * 0.2)}>
          <rect x="88" y={y} width="200" height="40" rx="10" fill={CARD} />
          <circle cx="108" cy={y + 20} r="6" style={ink} />
          <rect
            x="124"
            y={y + 14}
            width={90 - i * 14}
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.6"
          />
          <rect
            x="124"
            y={y + 24}
            width={60 - i * 8}
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.3"
          />
        </motion.g>
      ))}

      {/* The new module slides in from the side. */}
      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: show ? "translate(0px, 0px)" : "translate(48px, 0px)",
        }}
        transition={{
          duration: instant ? 0 : 0.6,
          delay: show && !instant ? 1.3 : 0,
          ease: EASE_OUT,
        }}
      >
        <rect x="88" y="186" width="200" height="40" rx="10" fill={AMBER} />
        <text
          x="188"
          y="206"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="600"
          fill="white"
        >
          New feature
        </text>
      </motion.g>

      {/* Each module is plugged into the next. */}
      {[78, 128, 178].map((y, i) => (
        <motion.circle
          key={y}
          cx="188"
          cy={y + 4}
          r="3.5"
          style={ink}
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{
            duration: 0.2,
            delay: show && !instant ? (i === 2 ? 1.9 : 0.7 + i * 0.2) : 0,
          }}
        />
      ))}
    </g>
  )
}

/* ---------------------------------- Beat 5 --------------------------------- */

const TRACK = { x1: 48, x2: 328, y: 150 }

/** A slider from a light safety net to a dedicated team; people join as it moves. */
function Flex({
  show,
  instant,
  level,
}: {
  show: boolean
  instant: boolean
  level: number
}) {
  const knob = TRACK.x1 + (TRACK.x2 - TRACK.x1) * level
  const team = [
    { x: 148, on: true },
    { x: 188, on: level >= 0.45 },
    { x: 228, on: level >= 0.95 },
  ]

  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: instant ? 0 : 0.3 }}
    >
      {team.map((p, i) => (
        <motion.g
          key={p.x}
          initial={false}
          animate={{
            opacity: p.on ? 1 : 0,
            transform: p.on ? "translate(0px, 0px)" : "translate(0px, 8px)",
          }}
          transition={{ duration: instant ? 0 : 0.35, ease: EASE_OUT }}
        >
          <Person
            x={p.x}
            y={92}
            r={17}
            fill={i === 0 ? "var(--primary)" : i === 1 ? MID : SOFT}
          />
        </motion.g>
      ))}

      {/* The track, filled up to where the slider is. */}
      <line
        x1={TRACK.x1}
        x2={TRACK.x2}
        y1={TRACK.y}
        y2={TRACK.y}
        stroke={SOFT}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1={TRACK.x1}
        x2={knob}
        y1={TRACK.y}
        y2={TRACK.y}
        stroke="var(--primary)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {[0, 0.5, 1].map((stop) => (
        <circle
          key={stop}
          cx={TRACK.x1 + (TRACK.x2 - TRACK.x1) * stop}
          cy={TRACK.y}
          r="4"
          fill={level >= stop ? "white" : "var(--primary)"}
          opacity={level >= stop ? 1 : 0.35}
        />
      ))}
      <circle
        cx={knob}
        cy={TRACK.y}
        r="12"
        fill="white"
        stroke="var(--primary)"
        strokeWidth="3"
      />

      <Label x={TRACK.x1} y={186} anchor="start">
        Light
      </Label>
      <Label x={TRACK.x2} y={186} anchor="end">
        Dedicated team
      </Label>
    </motion.g>
  )
}
