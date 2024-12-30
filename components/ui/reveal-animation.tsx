"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface RevealAnimationProps {
  children: ReactNode
  width?: "100%" | "fit-content"
  delay?: number
}

export function RevealAnimation({
  children,
  width = "100%",
  delay = 0
}: RevealAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      style={{ width }}
    >
      {children}
    </motion.div>
  )
}
