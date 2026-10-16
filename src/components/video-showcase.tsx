import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { PlayIcon } from "lucide-react"

export function VideoShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "center 0.6"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [28, 14])

  return (
    <section ref={sectionRef} id="showreel" className="px-6 pb-24 sm:pb-32">
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { scale, borderRadius: radius, transformOrigin: "center top" }
        }
        className="relative mx-auto aspect-video w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/8%,transparent_70%)]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Play showreel"
            className="group/play flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
          >
            <PlayIcon
              className="size-6 translate-x-0.5 transition-transform duration-200 ease-out group-hover/play:scale-110"
              fill="currentColor"
            />
          </button>
          <p className="text-sm text-muted-foreground">
            Video placeholder — drop in your showreel
          </p>
        </div>
      </motion.div>
    </section>
  )
}
