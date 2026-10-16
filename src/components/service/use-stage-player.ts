import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

/**
 * Autoplay for the service showcases. Each stage stays on screen for its own
 * duration in `durations` (sized to the time it takes to read), then the next
 * one starts. It never pauses on its own: it only stops while the element is
 * off screen. Picking a stage jumps to it, and that stage then gets its full
 * duration before autoplay moves on. With reduced motion it rests on
 * `restStage` instead of playing.
 */
export function useStagePlayer(durations: number[], restStage: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const reduceMotion = useReducedMotion()

  const playing = inView && !reduceMotion

  // `run` changes on every pick so re-picking the same stage restarts it.
  const [{ stage: playStage, run }, setState] = React.useState({
    stage: 0,
    run: 0,
  })
  const active = reduceMotion ? restStage : playStage

  React.useEffect(() => {
    if (!playing) return
    const timer = setTimeout(
      () =>
        setState((s) => ({
          stage: (s.stage + 1) % durations.length,
          run: s.run + 1,
        })),
      durations[playStage]
    )
    return () => clearTimeout(timer)
  }, [playStage, run, playing, durations])

  const select = React.useCallback((index: number) => {
    setState((s) => ({ stage: index, run: s.run + 1 }))
  }, [])

  return { ref, active, select, run, playing }
}

/**
 * Counts 0..max while `on`. `ms` is the wait before each step: one number for
 * even pacing, or a list (step 0->1, 1->2, ...) to give each step the time it
 * needs to be read. Falls back to 0 shortly after it stops. With reduced
 * motion it jumps straight to the finished state.
 */
export function useTicker(on: boolean, ms: number | number[], max: number) {
  const reduceMotion = useReducedMotion()
  const [t, setT] = React.useState(0)
  const tRef = React.useRef(0)
  const resetTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => {
    if (!on || reduceMotion) return
    // Coming back before a pending reset fires keeps the finished state.
    clearTimeout(resetTimer.current)

    let timer: ReturnType<typeof setTimeout>
    const advance = () => {
      if (tRef.current >= max) return
      const wait = Array.isArray(ms)
        ? (ms[tRef.current] ?? ms[ms.length - 1])
        : ms
      timer = setTimeout(() => {
        tRef.current += 1
        setT(tRef.current)
        advance()
      }, wait)
    }
    advance()

    return () => {
      clearTimeout(timer)
      // Reset only once the stage has finished fading out, so it doesn't
      // visibly snap back to its first step while disappearing.
      resetTimer.current = setTimeout(() => {
        tRef.current = 0
        setT(0)
      }, 600)
    }
  }, [on, ms, max, reduceMotion])

  return reduceMotion && on ? max : t
}
