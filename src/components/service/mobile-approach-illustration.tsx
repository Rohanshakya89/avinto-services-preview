import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import {
  EASE_OUT,
  EDGE,
  SHADOW,
  Tag,
} from "@/components/service/illustration-parts"

/* -------------------------------------------------------------------------- */
/*  Illustration for the Mobile Application page's "Our Approach". A large     */
/*  phone, facing you, with one beat per point in the list:                    */
/*    1 tickets slide in and become real screens in the app   (ownership)      */
/*    2 a short chat: a question, options, a decision          (consult)       */
/*    3 the phone connects to API, Data and Cloud              (beyond the app)*/
/*    4 a new feature docks in and a tablet runs the same app  (what's next)   */
/*    5 a version badge ticks up in a turning ring             (stay involved) */
/*  Plays on a loop while on screen. Purely visual, nothing is interactive.    */
/* -------------------------------------------------------------------------- */

const AMBER = "#F2B33D"
const BODY = "#171A36"
const SCREEN = "#F4F7FF"
const SOFT = "#C7D4FA"

/** The phone, in the picture's coordinates; its parts are placed relative to it. */
const PHONE = { x: 216, y: 96, w: 136, h: 256 }

/** Loop, one beat per point in the list. */
type Phase = 0 | 1 | 2 | 3 | 4
const PHASE_MS: Record<Phase, number> = {
  0: 3000,
  1: 3300,
  2: 2800,
  3: 3000,
  4: 3200,
}

const CAPTIONS = [
  "Take ownership",
  "Consult as well as build",
  "Think beyond the app",
  "Build for what comes next",
  "Stay involved",
] as const

const ink = { fill: "var(--primary)" }

export function MobileApproachIllustration() {
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? 4 : 0)
  const instant = !!reduceMotion

  // The app is built afresh at the start of every loop, once it's been seen.
  const [loop, setLoop] = React.useState(0)
  const seen = useInView(ref, { margin: "-80px", once: true })
  const ready = seen || instant

  // Loop through the phases while the illustration is on screen.
  React.useEffect(() => {
    if (!inView || reduceMotion) return

    let timer: ReturnType<typeof setTimeout>
    const next = (current: Phase) => {
      timer = setTimeout(() => {
        const following = ((current + 1) % 5) as Phase
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

  return (
    <svg
      ref={ref}
      viewBox="24 76 520 344"
      role="img"
      aria-label="A phone: tickets slide in and become screens, a client and a team settle a question in a chat, the app connects to API, data and cloud services, a new feature and a tablet join it, and a version badge ticks up as it keeps being improved"
      className="mx-auto h-auto w-full max-w-md"
    >
      <ellipse cx="284" cy="362" rx="96" ry="9" fill={SHADOW} opacity="0.14" />

      {!instant && phase === 0 && <Tickets />}

      <Phone
        key={loop}
        ready={ready}
        instant={instant}
        hasNewCard={phase >= 3}
      />

      <Chat show={phase === 1} instant={instant} />
      <Backend
        show={phase >= 2}
        live={phase === 2 && !instant}
        instant={instant}
      />
      <Tablet show={phase >= 3} instant={instant} />
      <Version show={phase === 4} instant={instant} />

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

/* ---------------------------------- The phone ------------------------------ */

/** Where each ticket lands: the centre of the part of the screen it becomes. */
const TARGETS = [147, 186, 234, 321]
const TICKET_DELAYS = [0.2, 0.6, 1.0, 1.4]

/** Tickets slide in from the left and disappear behind the phone. */
function Tickets() {
  return (
    <g>
      {TARGETS.map((y, i) => (
        <motion.g
          key={y}
          initial={{ opacity: 0, transform: "translate(40px, 0px)" }}
          animate={{
            opacity: [0, 1, 1, 1],
            transform: [
              "translate(40px, 0px)",
              "translate(40px, 0px)",
              "translate(200px, 0px)",
              "translate(200px, 0px)",
            ],
          }}
          transition={{
            duration: 0.9,
            delay: TICKET_DELAYS[i],
            times: [0, 0.1, 0.9, 1],
            ease: "linear",
          }}
        >
          <rect
            y={y - 15}
            width="58"
            height="30"
            rx="7"
            fill="white"
            stroke={EDGE}
            strokeWidth="2"
          />
          <rect
            x="8"
            y={y - 6}
            width="12"
            height="12"
            rx="3"
            style={ink}
            opacity="0.2"
          />
          <rect x="26" y={y - 7} width="24" height="5" rx="2.5" style={ink} />
          <rect
            x="26"
            y={y + 2}
            width="16"
            height="5"
            rx="2.5"
            style={ink}
            opacity="0.45"
          />
        </motion.g>
      ))}
    </g>
  )
}

/** A big phone facing you, its screen filling in as each ticket arrives. */
function Phone({
  ready,
  instant,
  hasNewCard,
}: {
  ready: boolean
  instant: boolean
  hasNewCard: boolean
}) {
  const part = (delay: number) => ({
    initial: instant ? (false as const) : { opacity: 0 },
    animate: { opacity: ready ? 1 : 0 },
    transition: {
      duration: instant ? 0 : 0.3,
      delay: ready && !instant ? delay : 0,
    },
  })

  return (
    <g transform={`translate(${PHONE.x} ${PHONE.y})`}>
      <rect width={PHONE.w} height={PHONE.h} rx="28" fill={BODY} />
      <rect
        x="7"
        y="7"
        width={PHONE.w - 14}
        height={PHONE.h - 14}
        rx="22"
        fill={SCREEN}
      />

      {/* The notch, the status bar and the home bar. */}
      <rect x="49" y="12" width="38" height="10" rx="5" fill={BODY} />
      <circle cx="22" cy="30" r="2.5" fill={SOFT} />
      <circle cx="114" cy="30" r="2.5" fill={SOFT} />
      <rect x="48" y="238" width="40" height="4" rx="2" fill={SOFT} />

      <motion.g {...part(1.15)}>
        <rect x="18" y="44" width="100" height="14" rx="7" style={ink} />
      </motion.g>
      <motion.g {...part(1.55)}>
        <rect
          x="18"
          y="70"
          width="100"
          height="40"
          rx="10"
          style={ink}
          opacity="0.15"
        />
        <circle cx="38" cy="90" r="9" style={ink} />
        <rect x="54" y="82" width="46" height="6" rx="3" style={ink} />
        <rect
          x="54"
          y="93"
          width="30"
          height="6"
          rx="3"
          style={ink}
          opacity="0.45"
        />
      </motion.g>
      <motion.g {...part(1.95)}>
        <rect
          x="18"
          y="118"
          width="100"
          height="40"
          rx="10"
          style={ink}
          opacity="0.15"
        />
        <circle cx="38" cy="138" r="9" style={ink} />
        <rect x="54" y="130" width="46" height="6" rx="3" style={ink} />
        <rect
          x="54"
          y="141"
          width="30"
          height="6"
          rx="3"
          style={ink}
          opacity="0.45"
        />
      </motion.g>
      <motion.g {...part(2.35)}>
        <rect x="34" y="214" width="68" height="22" rx="11" style={ink} />
      </motion.g>

      {/* Added in "what comes next". */}
      <motion.g
        initial={false}
        animate={{
          opacity: hasNewCard ? 1 : 0,
          transform: hasNewCard
            ? "translate(0px, 0px)"
            : "translate(28px, 0px)",
        }}
        transition={{
          duration: instant ? 0 : 0.5,
          delay: hasNewCard && !instant ? 0.4 : 0,
          ease: EASE_OUT,
        }}
      >
        <rect x="18" y="166" width="100" height="40" rx="10" fill={AMBER} />
        <circle cx="38" cy="186" r="9" fill="white" opacity="0.9" />
        <rect x="54" y="178" width="46" height="6" rx="3" fill="white" />
        <rect
          x="54"
          y="189"
          width="30"
          height="6"
          rx="3"
          fill="white"
          opacity="0.6"
        />
      </motion.g>
    </g>
  )
}

/* ---------------------------------- Beat 2 --------------------------------- */

/** A short chat: the client asks, the team offers options, and one is chosen. */
function Chat({ show, instant }: { show: boolean; instant: boolean }) {
  const pop = (delay: number) => ({
    initial: false as const,
    animate: {
      opacity: show ? 1 : 0,
      transform: show ? "translate(0px, 0px)" : "translate(0px, 8px)",
    },
    transition: {
      duration: instant ? 0 : 0.35,
      delay: show && !instant ? delay : 0,
      ease: EASE_OUT,
    },
  })
  const chosen = show && !instant

  return (
    <g>
      <motion.g {...pop(0.3)}>
        <circle cx="46" cy="172" r="12" fill={SOFT} />
        <rect
          x="64"
          y="154"
          width="62"
          height="36"
          rx="12"
          fill="white"
          stroke={EDGE}
          strokeWidth="2"
        />
        <text
          x="95"
          y="172"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          fontWeight="700"
          style={ink}
        >
          ?
        </text>
      </motion.g>

      <motion.g {...pop(1.1)}>
        <rect
          x="46"
          y="206"
          width="124"
          height="68"
          rx="12"
          fill="white"
          stroke={EDGE}
          strokeWidth="2"
        />
        <circle cx="190" cy="258" r="12" style={ink} />
        <rect
          x="58"
          y="244"
          width="52"
          height="5"
          rx="2.5"
          style={ink}
          opacity="0.45"
        />
        <rect
          x="58"
          y="254"
          width="36"
          height="5"
          rx="2.5"
          style={ink}
          opacity="0.3"
        />
        <rect
          x="58"
          y="214"
          width="46"
          height="22"
          rx="11"
          style={ink}
          opacity="0.15"
        />
        <rect
          x="112"
          y="214"
          width="46"
          height="22"
          rx="11"
          style={ink}
          opacity="0.15"
        />
        <text
          x="81"
          y="225"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="700"
          style={ink}
        >
          A
        </text>
      </motion.g>

      {/* The chosen option fills in. */}
      <motion.g
        initial={false}
        animate={{ opacity: chosen ? 1 : 0 }}
        transition={{ duration: 0.3, delay: chosen ? 2.1 : 0 }}
      >
        <rect x="112" y="214" width="46" height="22" rx="11" style={ink} />
        <path
          d="M128 225 L133 230 L142 220"
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

/* ---------------------------------- Beat 3 --------------------------------- */

const SERVICES = [
  {
    label: "API",
    y: 140,
    d: "M352 224 H368 V162 H384",
    via: [
      [352, 224],
      [368, 224],
      [368, 162],
      [384, 162],
    ],
  },
  {
    label: "Data",
    y: 204,
    d: "M352 224 H384",
    via: [
      [352, 224],
      [384, 224],
    ],
  },
  {
    label: "Cloud",
    y: 268,
    d: "M352 224 H368 V290 H384",
    via: [
      [352, 224],
      [368, 224],
      [368, 290],
      [384, 290],
    ],
  },
] as const

/** The services around the app, connected to it, with data moving along. */
function Backend({
  show,
  live,
  instant,
}: {
  show: boolean
  live: boolean
  instant: boolean
}) {
  return (
    <g>
      {SERVICES.map((svc, i) => (
        <motion.path
          key={svc.label}
          d={svc.d}
          fill="none"
          stroke={EDGE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
          transition={{
            duration: instant ? 0 : show ? 0.5 : 0.2,
            delay: show && !instant ? i * 0.1 : 0,
            ease: EASE_OUT,
          }}
        />
      ))}

      {SERVICES.map((svc, i) => (
        <motion.g
          key={svc.label}
          initial={false}
          animate={{
            opacity: show ? 1 : 0,
            transform: show ? "translate(0px, 0px)" : "translate(14px, 0px)",
          }}
          transition={{
            duration: instant ? 0 : 0.4,
            delay: show && !instant ? 0.35 + i * 0.12 : 0,
            ease: EASE_OUT,
          }}
        >
          <rect
            x="384"
            y={svc.y}
            width="112"
            height="44"
            rx="12"
            fill="white"
            stroke={EDGE}
            strokeWidth="2"
          />
          <circle cx="406" cy={svc.y + 22} r="9" style={ink} opacity="0.15" />
          <circle cx="406" cy={svc.y + 22} r="4" style={ink} />
          <text
            x="424"
            y={svc.y + 22}
            dominantBaseline="central"
            fontSize="15"
            fontWeight="600"
            fill="var(--foreground)"
          >
            {svc.label}
          </text>
        </motion.g>
      ))}

      {live &&
        SERVICES.map((svc, i) => (
          <motion.circle
            key={svc.label}
            r="5"
            fill="#FFD369"
            initial={{ opacity: 0 }}
            animate={{
              opacity: svc.via.map((_, k) =>
                k === 0 || k === svc.via.length - 1 ? 0 : 1
              ),
              cx: svc.via.map((p) => p[0]),
              cy: svc.via.map((p) => p[1]),
            }}
            transition={{
              duration: 1.1,
              delay: 0.9 + i * 0.2,
              ease: "linear",
            }}
          />
        ))}
    </g>
  )
}

/* ---------------------------------- Beat 4 --------------------------------- */

/** A tablet runs the same app: new devices, one product. */
function Tablet({ show, instant }: { show: boolean; instant: boolean }) {
  return (
    <motion.g
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        transform: show ? "translate(36px, 168px)" : "translate(36px, 184px)",
      }}
      transition={{
        duration: instant ? 0 : 0.5,
        delay: show && !instant ? 0.8 : 0,
        ease: EASE_OUT,
      }}
    >
      <rect width="150" height="108" rx="13" fill={BODY} />
      <rect x="6" y="6" width="138" height="96" rx="8" fill={SCREEN} />
      <rect x="16" y="16" width="118" height="9" rx="4.5" style={ink} />
      <rect
        x="16"
        y="32"
        width="118"
        height="26"
        rx="7"
        style={ink}
        opacity="0.15"
      />
      <circle cx="30" cy="45" r="6" style={ink} />
      <rect x="42" y="41" width="40" height="5" rx="2.5" style={ink} />
      <rect x="16" y="64" width="118" height="26" rx="7" fill={AMBER} />
      <circle cx="30" cy="77" r="6" fill="white" opacity="0.9" />
      <rect x="42" y="73" width="40" height="5" rx="2.5" fill="white" />
    </motion.g>
  )
}

/* ---------------------------------- Beat 5 --------------------------------- */

/** The version badge ticks up inside a ring that keeps turning. */
function Version({ show, instant }: { show: boolean; instant: boolean }) {
  const label = {
    textAnchor: "middle" as const,
    dominantBaseline: "central" as const,
    fontSize: 14,
    fontWeight: 700,
    style: { fill: "var(--primary)" },
  }

  return (
    <motion.g
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        transform: `translate(452px, ${show ? 110 : 120}px)`,
      }}
      transition={{
        duration: instant ? 0 : 0.4,
        delay: show && !instant ? 0.2 : 0,
        ease: EASE_OUT,
      }}
    >
      <motion.circle
        r="26"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="10 12"
        style={{ stroke: "var(--primary)" }}
        initial={false}
        animate={{ strokeDashoffset: show && !instant ? -44 : 0 }}
        transition={
          show && !instant
            ? { duration: 1.6, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
        opacity="0.5"
      />
      <circle r="19" fill="white" stroke="var(--primary)" strokeWidth="3" />
      <motion.text
        {...label}
        initial={false}
        animate={{ opacity: show && !instant ? [1, 1, 0] : 0 }}
        transition={{ duration: 1.6, delay: 0.3, times: [0, 0.7, 0.85] }}
      >
        v2
      </motion.text>
      <motion.text
        {...label}
        initial={false}
        animate={{ opacity: instant ? 1 : show ? [0, 0, 1] : 0 }}
        transition={{ duration: 1.6, delay: 0.3, times: [0, 0.7, 0.85] }}
      >
        v3
      </motion.text>
    </motion.g>
  )
}
