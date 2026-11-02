import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRightIcon, ClipboardListIcon, XIcon } from "lucide-react"

import { isAppsPath } from "@/lib/apps"
import { CHANGELOG } from "@/lib/changelog"
import { navigate, usePath } from "@/lib/router"
import { getService, serviceHref } from "@/lib/services"
import { cn } from "@/lib/utils"

const SEEN_KEY = "dev-changelog-seen"

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY)
  } catch {
    return null
  }
}

const norm = (t: string | null) => (t ?? "").replace(/\s+/g, " ").trim()

/** The innermost element in the section whose text is exactly `text`. */
function findChanged(anchor: string, text: string) {
  const root = document.getElementById(anchor)
  if (!root) return null
  const hits = [...root.querySelectorAll("*")].filter(
    (el) => norm(el.textContent) === text
  )
  return (
    hits.find((el) => !hits.some((o) => o !== el && el.contains(o))) ?? null
  )
}

/** Floating "what changed" button for developers. */
export function DevChangelog() {
  const latest = CHANGELOG[0]?.id
  const path = usePath()
  const [open, setOpen] = React.useState(false)
  const [seen, setSeen] = React.useState(readSeen)
  const [picked, setPicked] = React.useState<string | null>(null)
  const [box, setBox] = React.useState<{
    el: Element
    rect: DOMRect
    label?: string
  } | null>(null)
  const findTimer = React.useRef<number>(0)

  // Keep the dotted box on its element while the page scrolls or resizes.
  React.useEffect(() => {
    if (!box) return
    const el = box.el
    const update = () =>
      setBox((b) => b && { ...b, rect: el.getBoundingClientRect() })
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    const timer = window.setTimeout(() => setBox(null), 8000)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box?.el])

  // One tab per page that has changes, in order of most recent change.
  const slugs = [...new Set(CHANGELOG.map((c) => c.slug))]

  // The changelog is for the website only, not the internal apps.
  if (!latest || isAppsPath(path)) return null

  const here = path.match(/^\/services\/([^/]+)\/?$/)?.[1]
  const active =
    picked && slugs.includes(picked)
      ? picked
      : here && slugs.includes(here)
        ? here
        : slugs[0]
  const entries = CHANGELOG.filter((c) => c.slug === active)
  const unseen = seen !== latest

  function toggle() {
    const next = !open
    setOpen(next)
    if (next) {
      setSeen(latest ?? null)
      try {
        localStorage.setItem(SEEN_KEY, latest ?? "")
      } catch {
        /* storage unavailable; the dot just stays */
      }
    }
  }

  function pickTab(slug: string) {
    setPicked(slug)
    setBox(null)
    navigate(serviceHref(slug))
  }

  function goTo(c: (typeof CHANGELOG)[number]) {
    setBox(null)
    setOpen(false) // get the panel out of the way of the highlighted text
    navigate(`${serviceHref(c.slug)}#${c.anchor}`)
    // Let the page render, then mark the change. Animated parts may not be on
    // screen yet, so keep looking for a while.
    window.clearInterval(findTimer.current)
    let tries = 0
    findTimer.current = window.setInterval(() => {
      const el = c.target
        ? document.querySelector(c.target)
        : findChanged(c.anchor, c.after)
      if (el) {
        window.clearInterval(findTimer.current)
        el.scrollIntoView({ behavior: "auto", block: "center" })
        setBox({ el, rect: el.getBoundingClientRect(), label: c.note })
      } else if (++tries > 50) {
        window.clearInterval(findTimer.current)
      }
    }, 300)
  }

  return (
    <>
      {box && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40 rounded-lg border-2 border-dashed border-primary"
          style={{
            top: box.rect.top - 8,
            left: box.rect.left - 8,
            width: box.rect.width + 16,
            height: box.rect.height + 16,
          }}
        >
          {box.label && (
            <span className="absolute bottom-full left-0 mb-2 rounded-md bg-primary px-3 py-1 text-xs font-medium whitespace-nowrap text-primary-foreground">
              {box.label}
            </span>
          )}
        </div>
      )}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformOrigin: "bottom left" }}
              aria-label="Text changes"
              className="flex max-h-[calc(100vh-96px)] w-120 max-w-[calc(100vw-32px)] flex-col gap-4 overflow-y-auto rounded-2xl border bg-background p-4 text-sm shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                <p className="font-semibold">Text changes</p>
                <button
                  type="button"
                  onClick={toggle}
                  aria-label="Close"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
              <div
                role="tablist"
                className="flex flex-wrap gap-2 border-b border-primary/20 pb-4"
              >
                {slugs.map((slug) => (
                  <button
                    key={slug}
                    role="tab"
                    type="button"
                    aria-selected={slug === active}
                    onClick={() => pickTab(slug)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      slug === active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {getService(slug)?.name ?? slug}
                  </button>
                ))}
              </div>
              <ul className="flex flex-col divide-y divide-primary/20">
                {entries.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <p className="text-xs text-muted-foreground">
                      {c.section} · {c.date}
                    </p>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Before
                      </span>
                      <p className="rounded-lg bg-muted px-3 py-2 text-muted-foreground line-through">
                        {c.before}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-primary">
                        Now
                      </span>
                      <p className="rounded-lg bg-primary/10 px-3 py-2 font-medium">
                        {c.after}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goTo(c)}
                      className="mt-1 flex items-center gap-2 self-start rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      Go to this section
                      <ArrowRightIcon className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={toggle}
          aria-label="Show text changes"
          aria-expanded={open}
          className="relative flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          <ClipboardListIcon className="size-5" />
          {unseen && (
            <span className="absolute top-0 right-0 size-3 rounded-full border-2 border-background bg-foreground" />
          )}
        </button>
      </div>
    </>
  )
}
