import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bot,
  BrainCircuit,
  Code2,
  PenTool,
  Server,
  Smartphone,
  Wrench,
} from "lucide-react"

export type ServiceInfo = {
  slug: string
  name: string
  blurb: string
  icon: LucideIcon
  /** Brand colour used for the service's white-theme page. */
  brand: string
  /** Whether the full page has been built yet. */
  ready: boolean
}

export const SERVICES: ServiceInfo[] = [
  {
    slug: "design",
    name: "Design",
    blurb: "UX/UI, branding and prototypes",
    icon: PenTool,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "ai-and-data",
    name: "AI & Data",
    blurb: "Models, pipelines and insight",
    icon: BrainCircuit,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "automation",
    name: "Automation",
    blurb: "Workflows that run themselves",
    icon: Bot,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "web-development",
    name: "Web Development",
    blurb: "Fast, scalable web platforms",
    icon: Code2,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "mobile-application",
    name: "Mobile Application",
    blurb: "Native and cross-platform apps",
    icon: Smartphone,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "devops",
    name: "DevOps",
    blurb: "Reliable delivery and cloud",
    icon: Server,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "business-analysis",
    name: "Business Analysis",
    blurb: "Turn needs into clear scope",
    icon: BarChart3,
    brand: "#4755EB",
    ready: true,
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    blurb: "Keep your product healthy",
    icon: Wrench,
    brand: "#4755EB",
    ready: true,
  },
]

export const serviceHref = (slug: string) => `/services/${slug}`
export const getService = (slug: string) =>
  SERVICES.find((service) => service.slug === slug)
