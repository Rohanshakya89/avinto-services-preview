import * as React from "react"
import { animate, motion, useInView, useReducedMotion } from "motion/react"

import { fitPill } from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the Design page's "Our Approach". Two isometric pieces:   */
/*  Avinto's (indigo, with a knob) and the client's (pale, with the matching   */
/*  socket). They slide together with a little burst, the joined piece turns   */
/*  to face you, and app UI fills in across it: what the two of them build.    */
/*  One idea for every point: whatever the client brings, our work fits to it. */
/*  Plays on a loop while on screen. Purely visual, nothing here is            */
/*  interactive.                                                               */
/* -------------------------------------------------------------------------- */

const CLIENT_TOP = "#D6E0FF"
const CLIENT_SIDE = "#A3B7F8"
const SHADOW = "#1F2A9E"
const CONFETTI = ["var(--primary)", "#A3B7F8", "#FFC83D", "#F26B3A", "#D6E0FF"]

/** Pieces are drawn flat in a 300x180 plane, then mapped onto the page. */
const ISO = [0.866, 0.5, -0.866, 0.5, 250, 96]
/** The same plane facing the viewer, as a monitor's screen with room for its stand. */
const FRONT = [1.4, 0, 0, 1.4, 110, 64]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const planeAt = (t: number) =>
  `matrix(${ISO.map((v, i) => lerp(v, FRONT[i], t)).join(", ")})`

/** Avinto's piece, with a knob on its right edge. */
const OURS = "M0 0 L150 0 L150 66 A26 26 0 1 1 150 114 L150 180 L0 180 Z"
/** The client's piece, with the matching socket. */
const THEIRS = "M150 0 L300 0 L300 180 L150 180 L150 114 A26 26 0 1 0 150 66 Z"

const DEPTH = 20
/** How much of the thickness is left once the piece faces the viewer. */
const FRONT_DEPTH = 0.25
/** How far apart the pieces start, in plane units. */
const GAP = 44
const APART = { x: 0.866 * GAP, y: 0.5 * GAP }

/** Where the knob meets the socket, on screen, while the pieces are isometric. */
const SEAM = { x: 302, y: 208 }

/** Loop: apart, joined (burst), turned to face front, built. */
type Phase = 0 | 1 | 2 | 3
const PHASE_MS: Record<Phase, number> = { 0: 1800, 1: 1900, 2: 1200, 3: 3800 }

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** One layer of a piece's thickness: the shape, dropped down the screen. */
function Layer({
  d,
  fill,
  depth,
  turn,
  plane,
}: {
  d: string
  fill: string
  depth: number
  turn: number
  plane: string
}) {
  const drop = depth * lerp(1, FRONT_DEPTH, turn)

  return (
    <g transform={`translate(0 ${drop})`}>
      <path d={d} transform={plane} style={{ fill }} />
    </g>
  )
}

/** A flat shape given thickness: stacked layers in the side colour, then the top. */
function Slab({
  d,
  top,
  side,
  turn,
  plane,
}: {
  d: string
  top: string
  side: string
  turn: number
  plane: string
}) {
  return (
    <g>
      {Array.from({ length: DEPTH }, (_, i) => (
        <Layer
          key={i}
          d={d}
          fill={side}
          depth={DEPTH - i}
          turn={turn}
          plane={plane}
        />
      ))}
      <path d={d} transform={plane} style={{ fill: top }} />
    </g>
  )
}

export function DesignApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 3 : 0)

  // 0 = isometric, 1 = facing the viewer. Plain SVG `transform` attributes
  // are driven from this, so the matrix is read from the viewBox origin.
  const [turn, setTurn] = React.useState(reduceMotion ? 1 : 0)
  const turnRef = React.useRef(turn)
  const plane = planeAt(turn)

  // 0 = our own indigo, 1 = merged into the client's colours: the app is theirs.
  const [merge, setMerge] = React.useState(reduceMotion ? 1 : 0)
  const mergeRef = React.useRef(merge)
  const mergePct = Math.round(merge * 100)
  const ourTop = `color-mix(in oklch, ${CLIENT_TOP} ${mergePct}%, var(--primary))`
  const ourSide = `color-mix(in oklch, ${CLIENT_SIDE} ${mergePct}%, color-mix(in oklch, var(--primary), black 32%))`

  const joined = phase >= 1
  const facing = phase >= 2
  const built = phase === 3

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

  // Once the pieces lock together, the client's colours blend into ours.
  React.useEffect(() => {
    if (reduceMotion) return

    const controls = animate(mergeRef.current, joined ? 1 : 0, {
      duration: joined ? 0.5 : 0.4,
      delay: joined ? 0.85 : 0,
      ease: EASE_OUT,
      onUpdate: (value) => {
        mergeRef.current = value
        setMerge(value)
      },
    })
    return () => controls.stop()
  }, [joined, reduceMotion])

  // Turn the joined piece to face the viewer, and back again on reset.
  React.useEffect(() => {
    if (reduceMotion) return

    const controls = animate(turnRef.current, facing ? 1 : 0, {
      duration: facing ? 0.9 : 0.7,
      ease: EASE_IN_OUT,
      onUpdate: (value) => {
        turnRef.current = value
        setTurn(value)
      },
    })
    return () => controls.stop()
  }, [facing, reduceMotion])

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 420"
      role="img"
      aria-label="Two pieces, one from Avinto and one from the client, joining together and turning into an app"
      className="h-auto w-full"
    >
      <ellipse
        cx="322"
        cy={lerp(392, 388, turn)}
        rx={lerp(212, 140, turn)}
        ry={lerp(16, 10, turn)}
        fill={SHADOW}
        opacity="0.12"
      />

      <MonitorStand show={clamp01((turn - 0.55) / 0.45)} />

      {/* Avinto's piece rests on the ground. */}
      <Slab d={OURS} top={ourTop} side={ourSide} turn={turn} plane={plane} />

      {/* The client's piece slides in until the knob locks into its socket. */}
      <motion.g
        initial={false}
        animate={{
          transform: joined
            ? "translate(0px, 0px)"
            : `translate(${APART.x}px, ${APART.y}px)`,
        }}
        transition={{
          duration: reduceMotion ? 0 : joined ? 0.9 : 0.7,
          ease: EASE_IN_OUT,
        }}
      >
        <Slab
          d={THEIRS}
          top={CLIENT_TOP}
          side={CLIENT_SIDE}
          turn={turn}
          plane={plane}
        />
      </motion.g>

      {/* Once merged, one seamless top: no seam or knob left showing. */}
      <path
        d="M0 0 H300 V180 H0 Z"
        transform={plane}
        opacity={merge}
        style={{ fill: CLIENT_TOP }}
      />

      <MonitorBezel show={clamp01((turn - 0.55) / 0.45)} plane={plane} />

      <g transform={plane}>
        <AppUi built={built} instant={!!reduceMotion} />
      </g>

      {/* The moment they click together. */}
      {(phase === 1 || phase === 2) && !reduceMotion && <Celebration />}

      {/* Who's who: names while apart, then what they made. */}
      <Tag x={168} y={92} label="Avinto" dot="var(--primary)" show={!joined} />
      <Tag x={470} y={190} label="Client" dot={CLIENT_SIDE} show={!joined} />
      <Tag x={262} y={4} label="Your app" dot="var(--primary)" show={built} />
    </svg>
  )
}

/* --------------------------------- Pieces ---------------------------------- */

const BEZEL = "#171A36"

/** The screen's frame: a dark ring around the plane, with a slightly deeper chin. */
function MonitorBezel({ show, plane }: { show: number; plane: string }) {
  return (
    <g opacity={show}>
      <path
        transform={plane}
        fill={BEZEL}
        fillRule="evenodd"
        d="M2 -14 H298 A16 16 0 0 1 314 2 V184 A16 16 0 0 1 298 200 H2 A16 16 0 0 1 -14 184 V2 A16 16 0 0 1 2 -14 Z M4 0 H296 A4 4 0 0 1 300 4 V176 A4 4 0 0 1 296 180 H4 A4 4 0 0 1 0 176 V4 A4 4 0 0 1 4 0 Z"
      />
      <circle transform={plane} cx="150" cy="-7" r="2" fill="#3A406E" />
    </g>
  )
}

/** The neck and base, in screen coordinates under the bezel's chin. */
function MonitorStand({ show }: { show: number }) {
  const rise = (1 - show) * 8

  return (
    <g opacity={show} transform={`translate(0 ${rise})`}>
      <path d="M298 340 H342 L350 372 H290 Z" fill="#2B3057" />
      <rect x="262" y="370" width="116" height="14" rx="7" fill="#20244A" />
    </g>
  )
}

function Tag({
  x,
  y,
  label,
  dot,
  show,
}: {
  x: number
  y: number
  label: string
  dot: string
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
      <circle cx="19" cy="16" r="5" style={{ fill: dot }} />
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

/** The moment they click together: two ripples and a burst of confetti. */
const JOIN_DELAY = 0.85
const SHAPES = 5
const FIRST_WAVE = 14
const PARTICLE_COUNT = 20

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  // A fast fan first, then a few slow ones that float down behind it.
  const late = i >= FIRST_WAVE
  const angle =
    ((late
      ? -150 + (i - FIRST_WAVE) * (120 / 5)
      : -165 + i * (150 / (FIRST_WAVE - 1)) + ((i * 37) % 13) - 6) *
      Math.PI) /
    180
  const dist = late ? 40 + ((i * 41) % 50) : 64 + ((i * 53) % 56)

  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    fall: late ? 120 + ((i * 23) % 40) : 70 + ((i * 29) % 50),
    spin: ((i * 71) % 540) - 270,
    scale: 0.9 + ((i * 19) % 7) * 0.08,
    duration: late ? 1.9 : 1.3 + ((i * 17) % 7) * 0.07,
    delay: JOIN_DELAY + (late ? 0.12 : 0) + ((i * 13) % 5) * 0.015,
    color: CONFETTI[i % CONFETTI.length],
    shape: i % SHAPES,
  }
})

function Celebration() {
  return (
    <g>
      {[0, 0.12].map((extra, i) => (
        <motion.ellipse
          key={i}
          cx={SEAM.x}
          cy={SEAM.y}
          fill="none"
          strokeWidth={i === 0 ? 4 : 2}
          style={{ stroke: "var(--primary)" }}
          initial={{ rx: 8, ry: 4, opacity: 0 }}
          animate={{
            rx: i === 0 ? 84 : 120,
            ry: i === 0 ? 42 : 60,
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: 0.8,
            delay: JOIN_DELAY + extra,
            ease: EASE_OUT,
          }}
        />
      ))}

      <g transform={`translate(${SEAM.x} ${SEAM.y - 8})`}>
        {PARTICLES.map((p, i) => (
          <motion.g
            key={i}
            initial={{
              opacity: 0,
              transform: "translate(0px, 0px) rotate(0deg) scale(0.3)",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              transform: [
                "translate(0px, 0px) rotate(0deg) scale(0.3)",
                `translate(${p.x}px, ${p.y}px) rotate(${p.spin * 0.4}deg) scale(${p.scale})`,
                `translate(${p.x * 1.1}px, ${p.y + p.fall * 0.5}px) rotate(${p.spin * 0.8}deg) scale(${p.scale})`,
                `translate(${p.x * 1.2}px, ${p.y + p.fall}px) rotate(${p.spin}deg) scale(${p.scale * 0.8})`,
              ],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              times: [0, 0.3, 0.7, 1],
              ease: [EASE_OUT, "easeIn", "linear"],
            }}
          >
            {p.shape === 0 && (
              <rect
                x="-5"
                y="-3"
                width="10"
                height="6"
                rx="1.5"
                fill={p.color}
              />
            )}
            {p.shape === 1 && <circle r="4" fill={p.color} />}
            {p.shape === 2 && <polygon points="0,-6 6,5 -6,5" fill={p.color} />}
            {p.shape === 3 && (
              <path
                d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6 Z"
                fill={p.color}
              />
            )}
            {p.shape === 4 && (
              <rect
                x="-1.5"
                y="-7"
                width="3"
                height="14"
                rx="1.5"
                fill={p.color}
              />
            )}
          </motion.g>
        ))}
      </g>
    </g>
  )
}

/** One piece of the app's interface, fading in on the joined surface. */
function Part({
  index,
  built,
  instant,
  children,
}: {
  index: number
  built: boolean
  instant: boolean
  children: React.ReactNode
}) {
  return (
    <motion.g
      initial={false}
      animate={{
        opacity: built ? 1 : 0,
        transform: built ? "translate(0px, 0px)" : "translate(0px, -8px)",
      }}
      transition={{
        duration: instant ? 0 : built ? 0.4 : 0.2,
        delay: built && !instant ? 0.1 + index * 0.08 : 0,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.g>
  )
}

/** The app drawn across the merged screen, in the plane's flat coordinates. */
function AppUi({ built, instant }: { built: boolean; instant: boolean }) {
  const p = { built, instant }
  const white = "white"
  const ink = "var(--primary)"

  return (
    <g>
      <Part index={0} {...p}>
        <circle cx="22" cy="24" r="7" fill={ink} />
        <rect
          x="36"
          y="21"
          width="40"
          height="6"
          rx="3"
          fill={ink}
          opacity="0.55"
        />
      </Part>

      <Part index={1} {...p}>
        {[206, 234, 262].map((x) => (
          <rect
            key={x}
            x={x}
            y="21"
            width="20"
            height="6"
            rx="3"
            fill={ink}
            opacity="0.45"
          />
        ))}
      </Part>

      <Part index={2} {...p}>
        <rect x="14" y="52" width="100" height="10" rx="5" fill={ink} />
        <rect
          x="14"
          y="70"
          width="68"
          height="8"
          rx="4"
          fill={ink}
          opacity="0.4"
        />
      </Part>

      <Part index={3} {...p}>
        <rect x="14" y="92" width="60" height="20" rx="10" fill={ink} />
        <rect x="28" y="99" width="32" height="6" rx="3" fill={white} />
      </Part>

      <Part index={4} {...p}>
        <rect
          x="166"
          y="48"
          width="120"
          height="66"
          rx="8"
          fill={white}
          opacity="0.9"
        />
        <circle cx="198" cy="68" r="7" fill={ink} opacity="0.55" />
        <polygon
          points="180,104 214,78 236,96 252,84 274,104"
          fill={ink}
          opacity="0.45"
        />
      </Part>

      {[14, 158].map((x) => (
        <Part key={x} index={x === 14 ? 5 : 6} {...p}>
          <rect
            x={x}
            y="128"
            width="128"
            height="38"
            rx="8"
            fill={white}
            opacity="0.9"
          />
          <circle cx={x + 18} cy="147" r="7" fill={ink} />
          <rect
            x={x + 32}
            y="141"
            width="60"
            height="6"
            rx="3"
            fill={ink}
            opacity="0.85"
          />
          <rect
            x={x + 32}
            y="152"
            width="40"
            height="5"
            rx="2.5"
            fill={ink}
            opacity="0.4"
          />
        </Part>
      ))}
    </g>
  )
}
