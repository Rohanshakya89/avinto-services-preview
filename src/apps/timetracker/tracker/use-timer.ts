import * as React from "react"

/**
 * One running timer shared by the sidebar and the timer bar, so the two can
 * never disagree. The clock only ticks while something is subscribed, and
 * nothing happens at import time (the marketing site shares this bundle).
 *
 * Demo: it starts already running, 28m 50s in, like the live tracker.
 */
type Snapshot = { startedAt: number | null; now: number }

let snapshot: Snapshot = {
  startedAt: Date.now() - (28 * 60 + 50) * 1000,
  now: Date.now(),
}
const listeners = new Set<() => void>()
let intervalId: number | undefined

function emit(next: Snapshot) {
  snapshot = next
  listeners.forEach((l) => l())
}

function syncTicking() {
  const shouldTick = snapshot.startedAt !== null && listeners.size > 0
  if (shouldTick && intervalId === undefined) {
    intervalId = window.setInterval(
      () => emit({ ...snapshot, now: Date.now() }),
      1000
    )
  } else if (!shouldTick && intervalId !== undefined) {
    window.clearInterval(intervalId)
    intervalId = undefined
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // The clock may have been idle: bring it up to date before first paint.
  emit({ ...snapshot, now: Date.now() })
  syncTicking()
  return () => {
    listeners.delete(listener)
    syncTicking()
  }
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

export function startTimer() {
  emit({ startedAt: Date.now(), now: Date.now() })
  syncTicking()
}

export function stopTimer() {
  emit({ startedAt: null, now: Date.now() })
  syncTicking()
}

export function useTimer() {
  const snap = React.useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => snapshot
  )
  const running = snap.startedAt !== null
  const seconds = running ? (snap.now - snap.startedAt!) / 1000 : 0
  return { running, seconds, display: formatClock(seconds) }
}
