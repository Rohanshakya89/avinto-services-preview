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
/*  Illustration for the Web Development page's "Built for the modern web".    */
/*  An isometric board with a platform on it, built as a stack of layers.      */
/*  Traffic ramps up and the stack gains a layer (scalable), traces connect it */
/*  to a database, payments and AI (connected), and a shield at the gate       */
/*  blocks a bad request while normal traffic passes (secure). Plays on a      */
/*  loop while on screen. Purely visual, nothing is interactive.               */
/* -------------------------------------------------------------------------- */

const NEW_LAYER = { top: "#FFD369", left: "#F2B33D", right: "#E09A1F" }
const THREAT = "#F26B3A"

/** The board is a 300x180 plane, drawn flat then mapped to isometric. */
const PLANE = "matrix(0.866 0.5 -0.866 0.5 250 96)"
const BOARD = "M0 0 H300 V180 H0 Z"
const DEPTH = 20

/** Plane coordinates to screen coordinates. */
const toScreen = (u: number, v: number) => ({
  x: 250 + 0.866 * (u - v),
  y: 96 + 0.5 * (u + v),
})

/** The platform: a stack of layers in the middle of the board. */
const STACK = toScreen(150, 90)
const LAYER = { s: 46, h: 16 }
const BASE_LAYERS = 3

const GATE = toScreen(70, 90)

/** Loop, one beat per point in the list: built, scaled, connected, secured. */
type Phase = 0 | 1 | 2 | 3
const PHASE_MS: Record<Phase, number> = { 0: 2600, 1: 2900, 2: 3000, 3: 3400 }

/** The three systems the platform connects to: where each trace ends. */
const LINKS = [
  {
    d: "M160 67 V32 H236",
    pad: { x: 236, y: 17 },
    via: [
      [160, 67],
      [160, 32],
      [236, 32],
    ],
  },
  {
    d: "M173 90 H236",
    pad: { x: 236, y: 75 },
    via: [
      [173, 90],
      [236, 90],
    ],
  },
  {
    d: "M160 113 V148 H236",
    pad: { x: 236, y: 133 },
    via: [
      [160, 113],
      [160, 148],
      [236, 148],
    ],
  },
] as const

export function WebApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 3 : 0)
  const instant = !!reduceMotion

  // The stack is built afresh at the start of every loop, once it's been seen.
  const [loop, setLoop] = React.useState(0)
  const seen = useInView(ref, { margin: "-80px", once: true })
  const ready = seen || instant

  // Loop through the phases while the illustration is on screen.
  React.useEffect(() => {
    if (!inView || reduceMotion) return

    let timer: ReturnType<typeof setTimeout>
    const next = (current: Phase) => {
      timer = setTimeout(() => {
        const following = ((current + 1) % 4) as Phase
        setPhase(following)
        if (following === 0) setLoop((n) => n + 1)
        next(following)
      }, PHASE_MS[current])
    }
    next(phase)

    return () => clearTimeout(timer)
    // `phase` is read once at start; the chain carries it from there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion])

  const grown = phase >= 1
  const connected = phase >= 2
  const secured = phase === 3

  return (
    <svg
      ref={ref}
      viewBox="24 84 520 336"
      role="img"
      aria-label="A web platform: a stack of modern layers is built, gains a layer as traffic grows, connects to a database, payments and AI, and is protected by a shield that blocks a bad request"
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

      {/* Everything flat on the board. */}
      <g transform={PLANE}>
        <g fill="none" strokeLinecap="round">
          <path
            d="M30 90 H127"
            stroke="white"
            strokeWidth="14"
            opacity="0.18"
          />
          <path
            d="M30 90 H127"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="8 10"
            opacity="0.55"
          />
        </g>
        <rect
          x="4"
          y="76"
          width="28"
          height="28"
          rx="7"
          fill="white"
          opacity="0.95"
        />

        <Integrations show={connected} instant={instant} live={phase === 2} />

        {!instant && phase === 1 && (
          <Traffic delays={[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2]} />
        )}
        {!instant && secured && <Traffic delays={[0.7, 1.9, 2.3]} />}
        {!instant && secured && <Intruder />}
        {!instant && phase === 1 && <GrowthRing />}
      </g>

      {/* The platform: base layers dropped in one by one, a layer added when
          demand grows, and a screen on top. */}
      {Array.from({ length: BASE_LAYERS }, (_, i) => (
        <BaseLayer
          key={`${loop}-${i}`}
          index={i}
          ready={ready}
          instant={instant}
        />
      ))}
      <AddedLayer shown={grown} instant={instant} />
      <Screen key={loop} raised={grown} ready={ready} instant={instant} />

      <Shield show={secured} instant={instant} />

      <Tag x={40} y={112} label="Users" show />
      <Tag x={316} y={88} label="Modern technology" show={phase === 0} />
      <Tag x={316} y={88} label="Scalable by design" show={phase === 1} />
      <Tag x={316} y={88} label="Seamlessly connected" show={phase === 2} />
      <Tag x={316} y={88} label="Secure & Compliant" show={secured} />
    </svg>
  )
}

/* --------------------------------- Pieces ---------------------------------- */

/** One of the stack's first layers, dropping into place at the start of a loop. */
function BaseLayer({
  index,
  ready,
  instant,
}: {
  index: number
  ready: boolean
  instant: boolean
}) {
  return (
    <motion.g
      initial={
        instant ? false : { opacity: 0, transform: "translate(0px, -56px)" }
      }
      animate={{
        opacity: ready ? 1 : 0,
        transform: ready ? "translate(0px, 0px)" : "translate(0px, -56px)",
      }}
      transition={{
        duration: instant ? 0 : 0.5,
        delay: ready && !instant ? 0.3 + index * 0.4 : 0,
        ease: EASE_OUT,
      }}
    >
      <Cube
        x={STACK.x}
        y={STACK.y - index * LAYER.h}
        s={LAYER.s}
        height={LAYER.h}
        {...PALE}
      />
    </motion.g>
  )
}

/** A new layer lands on the stack when demand grows. */
function AddedLayer({ shown, instant }: { shown: boolean; instant: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate(0px, 0px)" : "translate(0px, -56px)",
      }}
      transition={{
        duration: instant ? 0 : 0.6,
        delay: shown && !instant ? 1.4 : 0,
        ease: EASE_OUT,
      }}
    >
      <Cube
        x={STACK.x}
        y={STACK.y - BASE_LAYERS * LAYER.h}
        s={LAYER.s}
        height={LAYER.h}
        {...NEW_LAYER}
      />
    </motion.g>
  )
}

/** The front end: a little page on top of the stack, which rises with it. */
function Screen({
  raised,
  ready,
  instant,
}: {
  raised: boolean
  ready: boolean
  instant: boolean
}) {
  const top = BASE_LAYERS * LAYER.h

  return (
    <motion.g
      initial={false}
      animate={{
        transform: `translate(0px, ${-top - (raised ? LAYER.h : 0)}px)`,
      }}
      transition={{
        duration: instant ? 0 : 0.6,
        delay: raised && !instant ? 1.4 : 0,
        ease: EASE_OUT,
      }}
    >
      <motion.g
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{
          duration: instant ? 0 : 0.3,
          delay: ready && !instant ? 1.7 : 0,
        }}
      >
        <g transform="matrix(0.866 0.5 -0.866 0.5 302 216) translate(-150 -90)">
          {[
            { x: 134, y: 78, w: 32 },
            { x: 134, y: 87, w: 22 },
            { x: 134, y: 96, w: 28 },
          ].map((line) => (
            <rect
              key={line.y}
              x={line.x}
              y={line.y}
              width={line.w}
              height="5"
              rx="2.5"
              style={{ fill: "var(--primary)" }}
              opacity="0.85"
            />
          ))}
        </g>
      </motion.g>
    </motion.g>
  )
}

/** Small dots of traffic running along the lane into the platform. */
function Traffic({ delays }: { delays: number[] }) {
  return (
    <g>
      {delays.map((delay) => (
        <motion.circle
          key={delay}
          cy="90"
          r="4"
          fill="white"
          initial={{ opacity: 0, cx: 14 }}
          animate={{ opacity: [0, 1, 1, 0], cx: [14, 14, 124, 124] }}
          transition={{
            duration: 1.1,
            delay,
            times: [0, 0.1, 0.85, 1],
            ease: "linear",
          }}
        />
      ))}
    </g>
  )
}

/** The bad request: it runs at the gate, is stopped, and fades away. */
function Intruder() {
  return (
    <motion.circle
      cy="90"
      r="5"
      fill={THREAT}
      initial={{ opacity: 0, cx: 14 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        cx: [14, 14, 60, 50, 34],
      }}
      transition={{
        duration: 1.3,
        delay: 1.2,
        times: [0, 0.1, 0.55, 0.7, 1],
        ease: "linear",
      }}
    />
  )
}

/** A ring that spreads from the stack as the load picks up. */
function GrowthRing() {
  return (
    <motion.circle
      cx="150"
      cy="90"
      fill="none"
      strokeWidth="4"
      stroke="white"
      initial={{ r: 28, opacity: 0 }}
      animate={{ r: 70, opacity: [0, 0.55, 0] }}
      transition={{ duration: 0.8, delay: 1.4, ease: EASE_OUT }}
    />
  )
}

/** The systems the platform connects to: traces, pads, and data moving along them. */
function Integrations({
  show,
  instant,
  live,
}: {
  show: boolean
  instant: boolean
  live: boolean
}) {
  return (
    <g>
      {LINKS.map((link, i) => (
        <motion.path
          key={link.d}
          d={link.d}
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.55 : 0 }}
          transition={{
            duration: instant ? 0 : show ? 0.6 : 0.2,
            delay: show && !instant ? i * 0.12 : 0,
            ease: EASE_OUT,
          }}
        />
      ))}

      {LINKS.map((link, i) => (
        <motion.g
          key={link.pad.y}
          initial={false}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{
            duration: instant ? 0 : 0.3,
            delay: show && !instant ? 0.5 + i * 0.12 : 0,
          }}
        >
          <rect
            x={link.pad.x}
            y={link.pad.y}
            width="30"
            height="30"
            rx="7"
            fill="white"
            opacity="0.95"
          />
          <PadGlyph kind={i} cx={link.pad.x + 15} cy={link.pad.y + 15} />
        </motion.g>
      ))}

      {live &&
        !instant &&
        LINKS.map((link, i) => (
          <React.Fragment key={link.d}>
            <motion.circle
              r="4"
              fill="#FFD369"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                cx: link.via.map((p) => p[0]),
                cy: link.via.map((p) => p[1]),
              }}
              transition={{
                duration: 1,
                delay: 0.9 + i * 0.2,
                times: link.via.length === 3 ? [0, 0.3, 1] : [0, 1],
                ease: "linear",
              }}
            />
            <motion.circle
              cx={link.pad.x + 15}
              cy={link.pad.y + 15}
              fill="none"
              strokeWidth="3"
              stroke="white"
              initial={{ r: 14, opacity: 0 }}
              animate={{ r: 28, opacity: [0, 0.7, 0] }}
              transition={{
                duration: 0.6,
                delay: 1.85 + i * 0.2,
                ease: EASE_OUT,
              }}
            />
          </React.Fragment>
        ))}
    </g>
  )
}

/** A simple mark on each pad: a database, a card, and a spark for AI. */
function PadGlyph({ kind, cx, cy }: { kind: number; cx: number; cy: number }) {
  const ink = { fill: "var(--primary)" }

  return (
    <g transform={`translate(${cx} ${cy})`}>
      {kind === 0 && (
        <>
          <rect x="-9" y="-9" width="18" height="5" rx="2.5" style={ink} />
          <rect x="-9" y="-2" width="18" height="5" rx="2.5" style={ink} />
          <rect x="-9" y="5" width="18" height="5" rx="2.5" style={ink} />
        </>
      )}
      {kind === 1 && (
        <>
          <rect x="-10" y="-7" width="20" height="14" rx="3" style={ink} />
          <rect x="-10" y="-3" width="20" height="3" fill="white" />
        </>
      )}
      {kind === 2 && (
        <path
          d="M0 -10 Q2 -2 10 0 Q2 2 0 10 Q-2 2 -10 0 Q-2 -2 0 -10 Z"
          style={ink}
        />
      )}
    </g>
  )
}

/** The shield at the gate: it lets normal traffic through and stops the bad request. */
function Shield({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        transform: `translate(${GATE.x}px, ${show ? GATE.y - 6 : GATE.y - 26}px)`,
      }}
      transition={{
        duration: instant ? 0 : 0.5,
        delay: show && !instant ? 0.3 : 0,
        ease: EASE_OUT,
      }}
    >
      <ellipse cy="12" rx="14" ry="6" fill={SHADOW} opacity="0.3" />
      <path
        d="M0 -26 L18 -19 V2 C18 13 9 21 0 26 C-9 21 -18 13 -18 2 V-19 Z"
        fill={PALE.top}
        stroke={EDGE}
        strokeWidth="2.5"
        strokeLinejoin="round"
        transform="scale(1.1) translate(0 -8)"
      />
      <path
        d="M-6 -8 L-1 -3 L7 -13"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0 -2)"
      />
    </motion.g>
  )
}
