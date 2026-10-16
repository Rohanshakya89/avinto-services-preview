import { cn } from "cn"
import { Reveal } from "@/components/reveal"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground text-balance">
          {description}
        </p>
      )}
    </Reveal>
  )
}
