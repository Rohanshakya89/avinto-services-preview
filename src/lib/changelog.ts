/**
 * Newest first. Add an entry whenever content changes so devs can spot it.
 * `slug` is the service page (it becomes a tab); `anchor` is the element id of
 * the section on that page; `section` is its readable name.
 */
export type ChangeEntry = {
  id: string
  date: string
  slug: string
  section: string
  anchor: string
  before: string
  after: string
  /** CSS selector to mark instead of the `after` text (e.g. where something was removed). */
  target?: string
  /** Label shown on the dotted box. */
  note?: string
}

export const CHANGELOG: ChangeEntry[] = [
  {
    id: "2026-10-30-ba-card-removed",
    date: "2026-10-30",
    slug: "business-analysis",
    section: "Hero animation · Discovery card",
    anchor: "hero-animation",
    before: "Pay for it",
    after: "Removed",
    target: "#discovery-voices",
    note: 'Removed: the "Pay for it" card was the third card here',
  },
  {
    id: "2026-10-30-ba-text",
    date: "2026-10-30",
    slug: "business-analysis",
    section: "Hero animation · Discovery text",
    anchor: "hero-animation",
    before: "We talk to the people who use, run and pay for the system.",
    after: "We talk to the people who use and run the system.",
  },
  {
    id: "2026-10-30-design-strong",
    date: "2026-10-30",
    slug: "design",
    section: "Our approach",
    anchor: "our-approach",
    before: "Strong direction? We sharpen it.",
    after: "Sharpen a strong direction.",
  },
  {
    id: "2026-10-30-design-problem",
    date: "2026-10-30",
    slug: "design",
    section: "Our approach",
    anchor: "our-approach",
    before: "Only a problem to solve? We lead.",
    after: "Lead the design.",
  },
  {
    id: "2026-10-30-design-restraint",
    date: "2026-10-30",
    slug: "design",
    section: "Scandinavian design",
    anchor: "scandinavian",
    before: "Restraint as a design choice, not a limitation",
    after: "Only what's needed",
  },
  {
    id: "2026-10-30-maintenance-prevent",
    date: "2026-10-30",
    slug: "maintenance",
    section: "Our approach",
    anchor: "our-approach",
    before: "Prevent, don't just fix.",
    after: "Fix it before it breaks.",
  },
  {
    id: "2026-10-30-mobile-ownership",
    date: "2026-10-30",
    slug: "mobile-application",
    section: "Our approach",
    anchor: "our-approach",
    before: "Take ownership, not just tickets.",
    after: "Take ownership.",
  },
]
