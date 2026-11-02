import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import {
  Cube,
  EASE_OUT,
  EDGE,
  PALE,
  SHADOW,
  Tag,
} from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the Automation page's "Our Approach". An isometric board  */
/*  with a workflow on it: items stream through an automated station, an odd   */
/*  one is sent to a person for a decision and then rejoins, and a second      */
/*  station is added alongside. One picture for the whole approach: automate   */
/*  the work that's worth it, handle the exceptions, keep people in control,   */
/*  and grow one step at a time. Plays on a loop while on screen. Purely       */
/*  visual, nothing is interactive.                                            */
/* -------------------------------------------------------------------------- */

const AMBER = { top: "#FFD369", left: "#F2B33D", right: "#E09A1F" }

/** The board is a 300x180 plane, drawn flat then mapped to isometric. */
const PLANE = "matrix(0.866 0.5 -0.866 0.5 250 96)"
const BOARD = "M0 0 H300 V180 H0 Z"
const DEPTH = 20

/** Plane coordinates to screen coordinates. */
const toScreen = (u: number, v: number) => ({
  x: 250 + 0.866 * (u - v),
  y: 96 + 0.5 * (u + v),
})

/** The track runs along the board at v = 90. */
const START = toScreen(20, 90)
const STATION_ONE = toScreen(110, 90)
const STATION_TWO = toScreen(200, 90)
const PAWN = toScreen(110, 170)

/** How far an item travels along the track, in screen pixels. */
const ALONG = { x: 0.866 * 260, y: 0.5 * 260 }
/** From the track to the branch where the person waits. */
const TO_STATION = { x: 0.866 * 90, y: 0.5 * 90 }
const TO_BRANCH = { x: TO_STATION.x - 0.866 * 50, y: TO_STATION.y + 0.5 * 50 }

/** Loop: items flow, an exception goes to a person, a step is added. */
type Phase = 0 | 1 | 2 | 3
const PHASE_MS: Record<Phase, number> = { 0: 1400, 1: 2400, 2: 4200, 3: 3200 }

const at = (dx: number, dy: number) =>
  `translate(${START.x + dx}px, ${START.y + dy}px)`

export function AutomationApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 3 : 0)
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

  // While the exception is handled: 1 = caught at the station, 2 = with the person.
  const [stage, setStage] = React.useState<0 | 1 | 2>(reduceMotion ? 2 : 0)
  React.useEffect(() => {
    if (reduceMotion) return

    const timers: ReturnType<typeof setTimeout>[] = []
    if (phase === 0) timers.push(setTimeout(() => setStage(0), 0))
    if (phase === 2) {
      timers.push(setTimeout(() => setStage(1), 1000))
      timers.push(setTimeout(() => setStage(2), 2400))
    }
    return () => timers.forEach(clearTimeout)
  }, [phase, reduceMotion])

  const reviewed = phase >= 2
  const grown = phase === 3

  return (
    <svg
      ref={ref}
      viewBox="24 84 520 336"
      role="img"
      aria-label="A workflow on a board: items pass through an automated station, an unusual one is sent to a person for approval, and a second station is added"
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
            style={{ fill: "color-mix(in oklch, var(--primary), black 32%)" }}
          />
        </g>
      ))}
      <path d={BOARD} transform={PLANE} style={{ fill: "var(--primary)" }} />

      {/* The track, the branch to the person, and the start and end pads. */}
      <g transform={PLANE}>
        <g fill="none" strokeLinecap="round">
          <path
            d="M40 90 H262 M110 90 V160"
            stroke="white"
            strokeWidth="16"
            opacity="0.18"
          />
          <path
            d="M40 90 H262 M110 90 V160"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="8 10"
            opacity="0.55"
          />
        </g>
        <rect
          x="4"
          y="72"
          width="36"
          height="36"
          rx="8"
          fill="white"
          opacity="0.95"
        />
        <rect
          x="260"
          y="72"
          width="36"
          height="36"
          rx="8"
          fill="white"
          opacity="0.95"
        />
        <circle cx="110" cy="170" r="14" fill="white" opacity="0.25" />
      </g>

      {/* Items travel underneath the stations, as if passing through them. */}
      {!instant && phase === 1 && <Stream delays={[0, 0.4, 0.8]} />}
      {!instant && phase === 2 && (
        <>
          <Exception />
          <Alert />
        </>
      )}
      {!instant && grown && <Stream delays={[1, 1.45]} />}

      <Station
        pos={STATION_ONE}
        shown
        arriving={false}
        running={phase !== 0}
        instant={instant}
      />
      <Station
        pos={STATION_TWO}
        shown={grown}
        arriving
        running={grown}
        instant={instant}
      />

      <Reviewer show={reviewed} instant={instant} />

      <Tag x={40} y={112} label="Your tools" show />
      <Tag x={244} y={88} label="Automation" show />
      <Tag x={96} y={150} label="Exception" show={stage === 1} />
      <Tag x={30} y={268} label="Human approval" show={stage === 2} />
      <Tag x={312} y={130} label="Add a step" show={grown} />
    </svg>
  )
}

/* --------------------------------- Pieces ---------------------------------- */

/** Ordinary items: straight through, nobody touches them. */
function Stream({ delays }: { delays: number[] }) {
  return (
    <g>
      {delays.map((delay) => (
        <motion.g
          key={delay}
          initial={{ opacity: 0, transform: at(0, 0) }}
          animate={{
            opacity: [0, 1, 1, 0],
            transform: [
              at(0, 0),
              at(0, 0),
              at(ALONG.x, ALONG.y),
              at(ALONG.x, ALONG.y),
            ],
          }}
          transition={{
            duration: 1.6,
            delay,
            times: [0, 0.08, 0.92, 1],
            ease: "linear",
          }}
        >
          <Cube x={0} y={0} s={14} {...PALE} />
        </motion.g>
      ))}
    </g>
  )
}

/** The unusual one: it leaves the track for a person, then carries on. */
const EXCEPTION_MS = 3.8
const EXCEPTION_DELAY = 0.2
const EXCEPTION_TIMES = [0, 0.06, 0.3, 0.42, 0.72, 0.82, 0.97, 1]

function Exception() {
  const timing = {
    duration: EXCEPTION_MS,
    delay: EXCEPTION_DELAY,
    ease: "linear" as const,
  }
  const keys = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    TO_STATION,
    TO_BRANCH,
    TO_BRANCH,
    TO_STATION,
    { x: ALONG.x, y: ALONG.y },
    { x: ALONG.x, y: ALONG.y },
  ]

  return (
    <motion.g
      initial={{ opacity: 0, transform: at(0, 0) }}
      animate={{
        opacity: [0, 1, 1, 1, 1, 1, 1, 0],
        transform: keys.map((k) => at(k.x, k.y)),
      }}
      transition={{ ...timing, times: EXCEPTION_TIMES }}
    >
      <Cube x={0} y={0} s={18} {...AMBER} />

      {/* A warning flag until the person approves it, then a tick. */}
      <g transform="translate(0 -44)">
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{ ...timing, times: [0, 0.06, 0.58, 0.64, 1] }}
        >
          <circle r="10" fill="#E09A1F" stroke="white" strokeWidth="2" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="700"
            fill="white"
          >
            !
          </text>
        </motion.g>
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ ...timing, times: [0, 0.58, 0.64, 0.97, 1] }}
        >
          <circle
            r="10"
            stroke="white"
            strokeWidth="2"
            style={{ fill: "var(--primary)" }}
          />
          <path
            d="M-4 0 L-1 3 L4 -3"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </g>
    </motion.g>
  )
}

/** A ring that flashes at the station the moment it catches the odd one. */
function Alert() {
  return (
    <motion.ellipse
      cx={STATION_ONE.x}
      cy={STATION_ONE.y}
      fill="none"
      strokeWidth="4"
      stroke="#FFD369"
      initial={{ rx: 14, ry: 7, opacity: 0 }}
      animate={{ rx: 58, ry: 29, opacity: [0, 0.9, 0] }}
      transition={{ duration: 0.7, delay: 1.2, ease: EASE_OUT }}
    />
  )
}

/** A machine on the track: a raised block with a gear that turns while it works. */
function Station({
  pos,
  shown,
  arriving,
  running,
  instant,
}: {
  pos: { x: number; y: number }
  shown: boolean
  /** The added station drops in from above instead of being there from the start. */
  arriving: boolean
  running: boolean
  instant: boolean
}) {
  const hidden = "translate(0px, -64px)"

  return (
    <motion.g
      initial={false}
      animate={{
        opacity: shown ? 1 : 0,
        transform: shown || !arriving ? "translate(0px, 0px)" : hidden,
      }}
      transition={{
        duration: instant ? 0 : 0.6,
        delay: shown && arriving && !instant ? 0.3 : 0,
        ease: EASE_OUT,
      }}
    >
      <Cube x={pos.x} y={pos.y} s={40} {...PALE} />
      <g transform={`translate(${pos.x} ${pos.y - 40})`}>
        <motion.g
          animate={{ rotate: running && !instant ? 360 : 0 }}
          transition={
            running && !instant
              ? { duration: 3, repeat: Infinity, ease: "linear" }
              : { duration: 0 }
          }
        >
          <circle
            r="6"
            fill="none"
            strokeWidth="3"
            style={{ stroke: "var(--primary)" }}
          />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <rect
              key={deg}
              x="-2"
              y="-11"
              width="4"
              height="5"
              rx="1"
              transform={`rotate(${deg})`}
              style={{ fill: "var(--primary)" }}
            />
          ))}
        </motion.g>
      </g>
    </motion.g>
  )
}

/** The person who decides on the exception, and the tick they give it. */
function Reviewer({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <>
      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(${PAWN.x}px, ${show ? PAWN.y : PAWN.y + 12}px)`,
        }}
        transition={{ duration: instant ? 0 : 0.4, ease: EASE_OUT }}
      >
        <g transform="scale(1.4)">
          <ellipse cy="2" rx="13" ry="6" fill={SHADOW} opacity="0.3" />
          <path
            d="M-11 0 C-11 -10 -6 -16 -4 -19 H4 C6 -16 11 -10 11 0 Z"
            fill={PALE.top}
            stroke={EDGE}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle
            cy="-27"
            r="8"
            fill={PALE.top}
            stroke={EDGE}
            strokeWidth="2"
          />
        </g>
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(${PAWN.x}px, ${PAWN.y - 66}px) scale(${show ? 1 : 0.6})`,
        }}
        transition={{
          duration: instant ? 0 : 0.35,
          delay: show && !instant ? 2.5 : 0,
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
