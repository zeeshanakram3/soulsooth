"use client"

import { MeditationScript, SelectMeditation } from "@/db/schema"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MeditationPlayer from "@/app/meditate/_components/meditation-player"

interface MeditationCardProps {
  meditation: SelectMeditation & { meditationScript: MeditationScript }
}

export default function MeditationCard({ meditation }: MeditationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">
              {meditation.meditationScript?.title || "Untitled Meditation"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {formatDate(meditation.createdAt)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {meditation.userInput}
          </p>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-6 border-t pt-6">
                <MeditationPlayer meditation={meditation} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
