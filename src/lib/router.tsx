import * as React from "react"

// Minimal History-API router — enough for a handful of static pages.

const NAV_EVENT = "app:navigate"

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback)
  window.addEventListener(NAV_EVENT, callback)
  return () => {
    window.removeEventListener("popstate", callback)
    window.removeEventListener(NAV_EVENT, callback)
  }
}

export function usePath() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/"
  )
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href)
  const samePath = url.pathname === window.location.pathname

  window.history.pushState({}, "", url.pathname + url.search + url.hash)
  window.dispatchEvent(new Event(NAV_EVENT))

  // Wait for the new page to render before scrolling.
  requestAnimationFrame(() => {
    const target = url.hash ? document.querySelector(url.hash) : null
    if (target) {
      target.scrollIntoView({ behavior: samePath ? "smooth" : "auto" })
    } else {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  })
}

type LinkProps = React.ComponentProps<"a"> & { href: string }

export function Link({ href, onClick, ...props }: LinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return
        }
        event.preventDefault()
        navigate(href)
      }}
      {...props}
    />
  )
}
