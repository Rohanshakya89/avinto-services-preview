import * as React from "react"

type TrackerTheme = "light" | "dark"

const STORAGE_KEY = "tt-theme"

function readTheme(): TrackerTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light"
  } catch {
    return "light"
  }
}

/**
 * Avinto Time theme: always sits on the white `svc-light` base in the brand
 * blue, with an optional `tt-dark` layer. Applied on <html> so portalled
 * menus follow it too. The choice is remembered in this browser.
 */
export function useTrackerTheme() {
  const [theme, setTheme] = React.useState<TrackerTheme>(readTheme)

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.add("svc-light", "tt")
    root.style.setProperty("--svc-brand", "#4755eb")
    return () => {
      root.classList.remove("svc-light", "tt", "tt-dark")
      root.style.removeProperty("--svc-brand")
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("tt-dark", theme === "dark")
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Private mode: the choice just won't persist.
    }
  }, [theme])

  const toggle = React.useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  )

  return { theme, toggle }
}
