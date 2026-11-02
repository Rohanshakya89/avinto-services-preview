import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { EASE_OUT, EDGE, Tag } from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the DevOps page's "Our Approach". A delivery pipeline     */
/*  (Code, Build, Test, Deploy) that stays on screen while each beat adds one  */
/*  thing to it, one per point in the list:                                    */
/*    1 a change runs through every stage by itself       (automate)           */
/*    2 a config file creates the servers, with its history (as code)          */
/*    3 a shield lands on every stage                      (security)          */
/*    4 a health dashboard is fed by every stage           (observable)        */
/*    5 documentation is handed to the client's team       (share knowledge)   */
/*  Plays on a loop while on screen. Purely visual, nothing is interactive.    */
/* -------------------------------------------------------------------------- */

const AMBER = "#F2B33D"
const SOFT = "#C7D4FA"

const ink = { fill: "var(--primary)" }

/** Loop, one beat per point in the list. */
type Phase = 0 | 1 | 2 | 3 | 4
const PHASE_MS: Record<Phase, number> = {
  0: 3000,
  1: 3200,
  2: 2400,
  3: 3000,
  4: 3200,
}

const CAPTIONS = [
  "Automate the repeatable",
  "Everything as code",
  "Security from the start",
  "Make it observable",
  "Share the knowledge",
] as const

/** The pipeline: four stages in a row, each 64 square. */
const STAGES = [
  { label: "Code", x: 108 },
  { label: "Build", x: 204 },
  { label: "Test", x: 300 },
  { label: "Deploy", x: 396 },
] as const
const STAGE = { y: 168, size: 64 }
const centre = (x: number) => x + STAGE.size / 2

export function DevOpsApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 4 : 0)
  const instant = !!reduceMotion

  // How many stages the change has passed through (they light up in turn).
  const [lit, setLit] = React.useState(reduceMotion ? 4 : 0)

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

  // Beat 1: the stages light up one after another as the change reaches them.
  React.useEffect(() => {
    if (reduceMotion || phase !== 0) return

    const timers = [
      setTimeout(() => setLit(0), 0),
      ...STAGES.map((_, i) => setTimeout(() => setLit(i + 1), 700 + i * 520)),
    ]
    return () => timers.forEach(clearTimeout)
  }, [phase, reduceMotion])

  return (
    <svg
      ref={ref}
      viewBox="88 76 460 344"
      role="img"
      aria-label="A delivery pipeline of four stages: a change runs through it automatically, a config file creates the servers, a shield lands on every stage, a dashboard shows the health of the system, and documentation is handed to the client's team"
      className="mx-auto h-auto w-full max-w-md"
    >
      <Connectors lit={lit} />

      {!instant && phase === 0 && <Change />}

      {STAGES.map((stage, i) => (
        <Stage key={stage.label} index={i} lit={lit > i} />
      ))}

      <Servers show={phase >= 1} instant={instant} />
      <ConfigFile show={phase === 1} instant={instant} />
      <Shields show={phase >= 2} instant={instant} />
      <Dashboard show={phase === 3} instant={instant} />
      <Handover show={phase === 4} instant={instant} />

      {CAPTIONS.map((caption, i) => (
        <Tag
          key={caption}
          x={318}
          y={382}
          label={caption}
          show={phase === i}
          center
        />
      ))}
    </svg>
  )
}

/* ---------------------------------- Pipeline ------------------------------- */

/** The lines between the stages; each turns solid once the change has passed. */
function Connectors({ lit }: { lit: number }) {
  return (
    <g strokeWidth="4" strokeLinecap="round">
      {STAGES.slice(0, -1).map((stage, i) => (
        <line
          key={stage.label}
          x1={stage.x + STAGE.size + 4}
          x2={STAGES[i + 1].x - 4}
          y1={STAGE.y + STAGE.size / 2}
          y2={STAGE.y + STAGE.size / 2}
          style={{
            stroke: lit > i + 1 ? "var(--primary)" : EDGE,
            transition: "stroke 0.3s",
          }}
        />
      ))}
    </g>
  )
}

/** The change: a small block that runs the length of the pipeline on its own. */
function Change() {
  return (
    <motion.circle
      cy={STAGE.y + STAGE.size / 2}
      r="8"
      fill={AMBER}
      stroke="white"
      strokeWidth="3"
      initial={{ opacity: 0, cx: 84 }}
      animate={{ opacity: [0, 1, 1, 0], cx: [84, 84, 484, 484] }}
      transition={{
        duration: 2.4,
        delay: 0.3,
        times: [0, 0.08, 0.92, 1],
        ease: "linear",
      }}
    />
  )
}

/** One stage: a square with its mark and its name; it fills in when it's been run. */
function Stage({ index, lit }: { index: number; lit: boolean }) {
  const stage = STAGES[index]

  return (
    <g
      transform={`translate(${stage.x} ${STAGE.y})`}
      style={{
        color: lit ? "white" : "var(--primary)",
        transition: "color 0.3s",
      }}
    >
      <rect
        width={STAGE.size}
        height={STAGE.size}
        rx="16"
        strokeWidth="2"
        style={{
          fill: lit ? "var(--primary)" : "white",
          stroke: lit ? "var(--primary)" : EDGE,
          transition: "fill 0.3s, stroke 0.3s",
        }}
      />
      {/* Icon and label as one pair, with the same space above and below. */}
      <g
        transform="translate(32 23.7)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {index === 0 && (
          <path d="M-5 -5 L-10 0 L-5 5 M5 -5 L10 0 L5 5 M1.5 -8 L-1.5 8" />
        )}
        {index === 1 && (
          <path d="M0 -8 L7.5 -4 V4 L0 8 L-7.5 4 V-4 Z M0 0 V8 M0 0 L7.5 -4 M0 0 L-7.5 -4" />
        )}
        {index === 2 && (
          <>
            <circle r="7.5" />
            <path d="M-3.5 0 L-1 2.5 L3.5 -3" />
          </>
        )}
        {index === 3 && <path d="M0 8 V-8 M-6 -2 L0 -8 L6 -2" />}
      </g>
      <text
        x="32"
        y="49.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="currentColor"
      >
        {stage.label}
      </text>
    </g>
  )
}

/* ---------------------------------- Beat 2 --------------------------------- */

const SERVER_AT = { x: 484, y: 176 }

/** The servers the config file creates, built one after another. */
function Servers({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{
            opacity: show ? 1 : 0,
            transform: show ? "translate(0px, 0px)" : "translate(0px, -12px)",
          }}
          transition={{
            duration: instant ? 0 : 0.4,
            delay: show && !instant ? 1.2 + i * 0.25 : 0,
            ease: EASE_OUT,
          }}
        >
          <rect
            x={SERVER_AT.x}
            y={SERVER_AT.y + i * 20}
            width="44"
            height="14"
            rx="5"
            fill="white"
            stroke={EDGE}
            strokeWidth="2"
          />
          <circle
            cx={SERVER_AT.x + 9}
            cy={SERVER_AT.y + i * 20 + 7}
            r="2.5"
            style={ink}
          />
        </motion.g>
      ))}
    </g>
  )
}

/** A config file with its history, and a line that carries it down to the servers. */
function ConfigFile({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      <motion.path
        d="M236 124 H506 V170"
        fill="none"
        stroke={EDGE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 7"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{
          duration: instant ? 0 : show ? 0.7 : 0.2,
          delay: show && !instant ? 0.6 : 0,
          ease: EASE_OUT,
        }}
      />

      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: show ? "translate(0px, 0px)" : "translate(0px, 8px)",
        }}
        transition={{
          duration: instant ? 0 : 0.4,
          delay: show && !instant ? 0.2 : 0,
          ease: EASE_OUT,
        }}
      >
        <rect
          x="108"
          y="92"
          width="128"
          height="64"
          rx="12"
          fill="white"
          stroke={EDGE}
          strokeWidth="2"
        />
        {/* The history: one dot per commit, joined by a line. */}
        <line
          x1="124"
          y1="110"
          x2="124"
          y2="138"
          stroke={SOFT}
          strokeWidth="2"
        />
        {[110, 124, 138].map((y) => (
          <circle key={y} cx="124" cy={y} r="3.5" style={ink} />
        ))}
        <rect x="136" y="107" width="76" height="6" rx="3" style={ink} />
        <rect
          x="136"
          y="121"
          width="54"
          height="6"
          rx="3"
          style={ink}
          opacity="0.5"
        />
        <rect
          x="136"
          y="135"
          width="64"
          height="6"
          rx="3"
          style={ink}
          opacity="0.5"
        />
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 3 --------------------------------- */

/** A shield over each stage: security is part of the pipeline, not added after. */
function Shields({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      {STAGES.map((stage, i) => (
        <motion.g
          key={stage.label}
          initial={false}
          animate={{
            opacity: show ? 1 : 0,
            transform: `translate(${centre(stage.x)}px, ${show ? 146 : 134}px)`,
          }}
          transition={{
            duration: instant ? 0 : 0.4,
            delay: show && !instant ? 0.2 + i * 0.18 : 0,
            ease: EASE_OUT,
          }}
        >
          <g transform="scale(0.8)">
            <path
              d="M0 -14 L11 -10 V2 C11 9 5 13 0 16 C-5 13 -11 9 -11 2 V-10 Z"
              fill="white"
              stroke="var(--primary)"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path
              d="M-4.5 0 L-1 3.5 L5 -4"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </motion.g>
      ))}
    </g>
  )
}

/* ---------------------------------- Beat 4 --------------------------------- */

/** A health dashboard, fed by every stage. */
function Dashboard({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <g>
      {STAGES.map((stage, i) => (
        <motion.line
          key={stage.label}
          x1={centre(stage.x)}
          x2={centre(stage.x)}
          y1="236"
          y2="270"
          stroke={EDGE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 7"
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{
            duration: instant ? 0 : 0.3,
            delay: show && !instant ? 0.15 + i * 0.1 : 0,
          }}
        />
      ))}

      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: show ? "translate(0px, 0px)" : "translate(0px, 10px)",
        }}
        transition={{
          duration: instant ? 0 : 0.4,
          delay: show && !instant ? 0.3 : 0,
          ease: EASE_OUT,
        }}
      >
        <rect
          x="108"
          y="272"
          width="352"
          height="78"
          rx="14"
          fill="white"
          stroke={EDGE}
          strokeWidth="2"
        />

        {/* The chart: it draws itself in. */}
        <motion.path
          d="M126 330 L152 318 L178 324 L204 302 L230 312 L256 292 L282 300 L308 286"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: "var(--primary)" }}
          initial={false}
          animate={{ pathLength: show ? 1 : 0 }}
          transition={{
            duration: instant ? 0 : 1,
            delay: show && !instant ? 0.7 : 0,
            ease: "easeOut",
          }}
        />

        {/* Status lights: all well, apart from one that needs a look. */}
        {[
          { y: 292, c: "var(--primary)" },
          { y: 312, c: "var(--primary)" },
          { y: 332, c: AMBER },
        ].map((light, i) => (
          <g key={light.y}>
            <rect
              x="348"
              y={light.y - 7}
              width="94"
              height="14"
              rx="7"
              style={ink}
              opacity="0.12"
            />
            <circle cx="358" cy={light.y} r="4.5" style={{ fill: light.c }} />
            <rect
              x="370"
              y={light.y - 2}
              width={56 - i * 10}
              height="4"
              rx="2"
              style={ink}
              opacity="0.45"
            />
          </g>
        ))}
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 5 --------------------------------- */

/** Documentation moves from our side to the client's team, and they've got it. */
function Handover({ show, instant }: { show: boolean; instant: boolean }) {
  const move = show && !instant

  return (
    <g>
      <motion.g
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: instant ? 0 : 0.3 }}
      >
        {/* Us, on the left. */}
        <circle cx="124" cy="312" r="16" style={ink} />
        <circle cx="124" cy="307" r="5" fill="white" />
        <path d="M114 322 C114 315 134 315 134 322" fill="white" />

        {/* The client's team, on the right. */}
        {[404, 432, 460].map((x) => (
          <g key={x}>
            <circle
              cx={x}
              cy="312"
              r="16"
              fill={SOFT}
              stroke="white"
              strokeWidth="3"
            />
            <circle cx={x} cy="307" r="5" fill="white" />
            <path
              d={`M${x - 10} 322 C${x - 10} 315 ${x + 10} 315 ${x + 10} 322`}
              fill="white"
            />
          </g>
        ))}
      </motion.g>

      <motion.path
        d="M150 312 H382"
        fill="none"
        stroke={EDGE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 7"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{
          duration: instant ? 0 : 0.6,
          delay: move ? 0.3 : 0,
          ease: EASE_OUT,
        }}
      />

      {/* The documentation, carried across. */}
      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(${show ? 340 : 150}px, 278px)`,
        }}
        transition={{
          opacity: { duration: instant ? 0 : 0.3 },
          transform: {
            duration: instant ? 0 : 1.2,
            delay: move ? 0.5 : 0,
            ease: [0.77, 0, 0.175, 1],
          },
        }}
      >
        <rect
          width="52"
          height="68"
          rx="9"
          fill="white"
          stroke={EDGE}
          strokeWidth="2"
        />
        <rect x="8" y="9" width="36" height="8" rx="4" style={ink} />
        <rect
          x="8"
          y="26"
          width="30"
          height="5"
          rx="2.5"
          style={ink}
          opacity="0.45"
        />
        <rect
          x="8"
          y="36"
          width="36"
          height="5"
          rx="2.5"
          style={ink}
          opacity="0.45"
        />
        <rect
          x="8"
          y="46"
          width="24"
          height="5"
          rx="2.5"
          style={ink}
          opacity="0.45"
        />
      </motion.g>

      {/* They have it. */}
      <motion.g
        initial={false}
        animate={{
          opacity: show ? 1 : 0,
          transform: `translate(432px, ${show ? 280 : 290}px) scale(${show ? 1 : 0.6})`,
        }}
        transition={{
          duration: instant ? 0 : 0.35,
          delay: move ? 1.9 : 0,
          ease: EASE_OUT,
        }}
      >
        <circle r="12" style={ink} />
        <path
          d="M-5 0 L-1.5 3.5 L5.5 -4"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </g>
  )
}
