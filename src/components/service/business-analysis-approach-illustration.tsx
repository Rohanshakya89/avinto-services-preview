import * as React from "react"
import { animate, motion, useInView, useReducedMotion } from "motion/react"

import { EASE_OUT, EDGE, Tag } from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the Business Analysis page's "Our Approach". A            */
/*  whiteboard with one scene per point in the list:                           */
/*    1 a request, a "why?", and the goal behind it       (understand the why) */
/*    2 users speak and their insights collect on a card  (real users)         */
/*    3 a process flow beside a wireframe                 (make it visible)    */
/*    4 a balance weighs two options and settles          (challenge)          */
/*    5 a requirement card passes between three people    (close to delivery)  */
/*  Plays on a loop while on screen. Purely visual, nothing is interactive.    */
/* -------------------------------------------------------------------------- */

const SOFT = "#C7D4FA"
/** Cards are soft fills, with no outline. */
const CARD = "#E8EEFC"
const MID = "#8FA7F5"
const NOTE = "#FFE9A8"
const NOTE_INK = "#D9A21B"

const ink = { fill: "var(--primary)" }

/** Where the scenes sit; each is drawn in its own 376 x 256 coordinates. */
const BOARD = { x: 96, y: 96, w: 376, h: 256 }

/** Loop, one beat per point in the list. */
type Phase = 0 | 1 | 2 | 3 | 4
const PHASE_MS: Record<Phase, number> = {
  0: 3200,
  1: 3400,
  2: 3200,
  3: 3600,
  4: 3400,
}

const CAPTIONS = [
  "Understand the why",
  "Talk to real users",
  "Make it visible",
  "Challenge, constructively",
  "Stay close to delivery",
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

export function BusinessAnalysisApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 4 : 0)
  const instant = !!reduceMotion

  // Beat 4: how far the balance is tipped, in degrees.
  const [tilt, setTilt] = React.useState(reduceMotion ? 0 : -12)

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

  // The balance swings one way, then the other, and settles level.
  React.useEffect(() => {
    if (reduceMotion) return

    if (phase !== 3) {
      const reset = setTimeout(() => setTilt(-12), 400)
      return () => clearTimeout(reset)
    }

    const controls = animate(-12, [-12, 10, -4, 0], {
      duration: 2.2,
      delay: 0.7,
      times: [0, 0.4, 0.75, 1],
      ease: "easeInOut",
      onUpdate: setTilt,
    })
    return () => controls.stop()
  }, [phase, reduceMotion])

  return (
    <svg
      ref={ref}
      viewBox="72 76 424 344"
      role="img"
      aria-label="Five scenes: a request leads back to the goal behind it, users' insights collect on a card, a process flow and wireframe take shape, a balance weighs two options and settles, and a requirement card passes between an analyst, a designer and a developer"
      className="mx-auto h-auto w-full max-w-md"
    >
      <g transform={`translate(${BOARD.x} ${BOARD.y})`}>
        <Why show={phase === 0} instant={instant} />
        <Users show={phase === 1} instant={instant} />
        <Visible show={phase === 2} instant={instant} />
        <Balance show={phase === 3} instant={instant} tilt={tilt} />
        <Delivery show={phase === 4} instant={instant} />
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
  anchor?: "start" | "middle"
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

function Tick({
  x,
  y,
  show,
  delay,
  instant,
}: {
  x: number
  y: number
  show: boolean
  delay: number
  instant: boolean
}) {
  return (
    <motion.g
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        transform: `translate(${x}px, ${y}px) scale(${show ? 1 : 0.5})`,
      }}
      transition={{
        duration: instant ? 0 : 0.3,
        delay: show && !instant ? delay : 0,
        ease: EASE_OUT,
      }}
    >
      <circle r="10" style={ink} />
      <path
        d="M-4 0 L-1.2 3 L4.5 -3.5"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.g>
  )
}

/* ---------------------------------- Beat 1 --------------------------------- */

/** A request, a "why?", and the goal behind it. */
function Why({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      <motion.g {...pop(show, instant, 0.2)}>
        <rect x="36" y="92" width="100" height="72" rx="10" fill={NOTE} />
        <rect
          x="48"
          y="108"
          width="60"
          height="6"
          rx="3"
          fill={NOTE_INK}
          opacity="0.8"
        />
        <rect
          x="48"
          y="122"
          width="44"
          height="6"
          rx="3"
          fill={NOTE_INK}
          opacity="0.5"
        />
        <rect
          x="48"
          y="136"
          width="52"
          height="6"
          rx="3"
          fill={NOTE_INK}
          opacity="0.5"
        />
        <Label x={86} y={186}>
          Request
        </Label>
      </motion.g>

      <motion.g {...pop(show, instant, 0.7)}>
        <rect x="162" y="84" width="58" height="26" rx="13" fill={CARD} />
        <text
          x="191"
          y="97.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="600"
          style={ink}
        >
          Why?
        </text>
      </motion.g>

      <motion.path
        d="M146 128 H236"
        fill="none"
        stroke={EDGE}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{
          duration: instant ? 0 : show ? 0.6 : 0.2,
          delay: show && !instant ? 1 : 0,
          ease: EASE_OUT,
        }}
      />
      <motion.polygon
        points="236,121 250,128 236,135"
        fill={EDGE}
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.2, delay: show && !instant ? 1.5 : 0 }}
      />

      <motion.g {...pop(show, instant, 1.6, 0)}>
        <circle cx="304" cy="128" r="36" style={ink} opacity="0.1" />
        <circle cx="304" cy="128" r="24" style={ink} opacity="0.2" />
        <circle cx="304" cy="128" r="11" style={ink} />
        <Label x={304} y={186}>
          Goal
        </Label>
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 2 --------------------------------- */

const USERS = [56, 128, 200]

/** Users speak, and what they say collects on a card. */
function Users({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      {USERS.map((y, i) => (
        <g key={y}>
          <motion.g {...pop(show, instant, 0.3 + i * 0.7)}>
            <Person x={54} y={y} r={17} fill={SOFT} />
            <rect
              x="80"
              y={y - 17}
              width="82"
              height="34"
              rx="12"
              fill={CARD}
            />
            <rect
              x="92"
              y={y - 7}
              width="44"
              height="5"
              rx="2.5"
              style={ink}
              opacity="0.5"
            />
            <rect
              x="92"
              y={y + 3}
              width="30"
              height="5"
              rx="2.5"
              style={ink}
              opacity="0.3"
            />
          </motion.g>
          <motion.line
            x1="166"
            x2="188"
            y1={y}
            y2={y}
            stroke={EDGE}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 6"
            initial={false}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{
              duration: 0.2,
              delay: show && !instant ? 0.6 + i * 0.7 : 0,
            }}
          />
        </g>
      ))}

      <motion.g {...pop(show, instant, 0.2)}>
        <rect x="188" y="32" width="152" height="192" rx="14" fill={CARD} />
        <text
          x="204"
          y="58"
          fontSize="13"
          fontWeight="600"
          fill="var(--foreground)"
        >
          Insights
        </text>
      </motion.g>

      {USERS.map((y, i) => (
        <motion.g key={y} {...pop(show, instant, 0.9 + i * 0.7, 0)}>
          <rect
            x="200"
            y={80 + i * 46}
            width="128"
            height="36"
            rx="9"
            fill="white"
          />
          <circle cx="216" cy={98 + i * 46} r="6" style={ink} />
          <rect
            x="230"
            y={91 + i * 46}
            width="72"
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.8"
          />
          <rect
            x="230"
            y={101 + i * 46}
            width="48"
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

/* ---------------------------------- Beat 3 --------------------------------- */

const FLOW = [44, 109, 174]

/** A process flow beside a wireframe: everyone can see what's meant. */
function Visible({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      {FLOW.map((y, i) => (
        <motion.g key={y} {...pop(show, instant, 0.3 + i * 0.5)}>
          <rect x="36" y={y} width="116" height="38" rx="10" fill={CARD} />
          <circle cx="52" cy={y + 19} r="5" style={ink} />
          <rect
            x="64"
            y={y + 16}
            width="64"
            height="6"
            rx="3"
            style={ink}
            opacity="0.6"
          />
        </motion.g>
      ))}

      {[82, 147].map((y, i) => (
        <motion.g
          key={y}
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{
            duration: 0.2,
            delay: show && !instant ? 0.6 + i * 0.5 : 0,
          }}
        >
          <line
            x1="94"
            x2="94"
            y1={y}
            y2={y + 21}
            stroke={EDGE}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon
            points={`88,${y + 19} 94,${y + 27} 100,${y + 19}`}
            fill={EDGE}
          />
        </motion.g>
      ))}

      <motion.line
        x1="156"
        x2="190"
        y1="128"
        y2="128"
        stroke={EDGE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 6"
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3, delay: show && !instant ? 1.6 : 0 }}
      />

      <motion.g {...pop(show, instant, 1.8)}>
        <rect x="190" y="36" width="150" height="184" rx="16" fill={CARD} />
        <rect x="204" y="52" width="122" height="10" rx="5" style={ink} />
        <rect x="204" y="72" width="122" height="54" rx="8" fill="white" />
        <polygon
          points="218,116 240,92 258,108 274,98 312,116"
          style={ink}
          opacity="0.3"
        />
        <rect
          x="204"
          y="138"
          width="92"
          height="6"
          rx="3"
          style={ink}
          opacity="0.5"
        />
        <rect
          x="204"
          y="150"
          width="64"
          height="6"
          rx="3"
          style={ink}
          opacity="0.3"
        />
        <rect x="204" y="176" width="60" height="22" rx="11" style={ink} />
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 4 --------------------------------- */

const PIVOT = { x: 188, y: 70 }
const ARM = 100

/** A balance weighs two options, swings, and settles level: a decision made with open eyes. */
function Balance({
  show,
  instant,
  tilt,
}: {
  show: boolean
  instant: boolean
  tilt: number
}) {
  const rad = (tilt * Math.PI) / 180
  const dy = Math.sin(rad) * ARM
  const dx = Math.cos(rad) * ARM
  const left = { x: PIVOT.x - dx, y: PIVOT.y - dy }
  const right = { x: PIVOT.x + dx, y: PIVOT.y + dy }

  /** A pan hangs level from one end of the beam. */
  const pan = (
    end: { x: number; y: number },
    label: string,
    blocks: number,
    colour: string
  ) => (
    <g>
      <path
        d={`M${end.x} ${end.y} L${end.x - 30} ${end.y + 56} M${end.x} ${end.y} L${end.x + 30} ${end.y + 56}`}
        fill="none"
        stroke={EDGE}
        strokeWidth="1.5"
      />
      <rect
        x={end.x - 36}
        y={end.y + 56}
        width="72"
        height="8"
        rx="4"
        fill={CARD}
      />
      {Array.from({ length: blocks }, (_, i) => (
        <rect
          key={i}
          x={end.x - (blocks * 22 - 4) / 2 + i * 22}
          y={end.y + 40}
          width="18"
          height="16"
          rx="4"
          fill={colour}
        />
      ))}
      <Label x={end.x} y={end.y + 86}>
        {label}
      </Label>
    </g>
  )

  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: instant ? 0 : 0.3 }}
    >
      <line
        x1={PIVOT.x}
        x2={PIVOT.x}
        y1={PIVOT.y}
        y2="206"
        stroke={EDGE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="148" y="206" width="80" height="10" rx="5" fill={SOFT} />

      <line
        x1={left.x}
        y1={left.y}
        x2={right.x}
        y2={right.y}
        stroke="var(--primary)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx={PIVOT.x} cy={PIVOT.y} r="6" style={ink} />

      {pan(left, "Option A", 3, MID)}
      {pan(right, "Option B", 2, NOTE_INK)}

      <Tick
        x={PIVOT.x}
        y={PIVOT.y - 28}
        show={show}
        delay={3}
        instant={instant}
      />
    </motion.g>
  )
}

/* ---------------------------------- Beat 5 --------------------------------- */

const ANALYST = { x: 188, y: 60 }
const DESIGNER = { x: 92, y: 192 }
const DEVELOPER = { x: 284, y: 192 }

/** A requirement card passes from analyst to designer to developer, and nothing gets lost. */
function Delivery({ show, instant }: { show: boolean; instant: boolean }) {
  const at = (p: { x: number; y: number }) =>
    `translate(${p.x - 12}px, ${p.y - 9}px)`

  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: instant ? 0 : 0.3 }}
    >
      <path
        d={`M${ANALYST.x} ${ANALYST.y} L${DESIGNER.x} ${DESIGNER.y} L${DEVELOPER.x} ${DEVELOPER.y} Z`}
        fill="none"
        stroke={EDGE}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />

      <Person x={ANALYST.x} y={ANALYST.y} r={20} fill="var(--primary)" />
      <Person x={DESIGNER.x} y={DESIGNER.y} r={20} fill={SOFT} />
      <Person x={DEVELOPER.x} y={DEVELOPER.y} r={20} fill={MID} />
      <Label x={ANALYST.x + 30} y={ANALYST.y + 4} anchor="start">
        Analyst
      </Label>
      <Label x={DESIGNER.x} y={DESIGNER.y + 40}>
        Designer
      </Label>
      <Label x={DEVELOPER.x} y={DEVELOPER.y + 40}>
        Developer
      </Label>

      {show && !instant && (
        <motion.g
          initial={{ opacity: 0, transform: at(ANALYST) }}
          animate={{
            opacity: [0, 1, 1, 1, 1, 1, 1, 0],
            transform: [
              at(ANALYST),
              at(ANALYST),
              at(DESIGNER),
              at(DESIGNER),
              at(DEVELOPER),
              at(DEVELOPER),
              at(ANALYST),
              at(ANALYST),
            ],
          }}
          transition={{
            duration: 3,
            delay: 0.3,
            times: [0, 0.05, 0.3, 0.38, 0.63, 0.7, 0.95, 1],
            ease: "easeInOut",
          }}
        >
          <rect
            width="24"
            height="18"
            rx="4"
            fill="white"
            stroke="var(--primary)"
            strokeWidth="1.5"
          />
          <rect x="5" y="5" width="14" height="3" rx="1.5" style={ink} />
          <rect
            x="5"
            y="10.5"
            width="9"
            height="3"
            rx="1.5"
            style={ink}
            opacity="0.5"
          />
        </motion.g>
      )}

      <Tick
        x={DESIGNER.x + 20}
        y={DESIGNER.y - 18}
        show={show}
        delay={1.2}
        instant={instant}
      />
      <Tick
        x={DEVELOPER.x + 20}
        y={DEVELOPER.y - 18}
        show={show}
        delay={2}
        instant={instant}
      />
    </motion.g>
  )
}
