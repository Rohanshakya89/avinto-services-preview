import * as React from "react"
import { motion } from "motion/react"

type RevealProps = {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "article"
}

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const Component = motion[as]

  return (
    <Component
      initial={{ opacity: 0, transform: "translateY(16px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
