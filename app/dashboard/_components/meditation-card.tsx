"use client"

import { MeditationScript, SelectMeditation } from "@/db/schema"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Clock, Music2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MeditationPlayer from "@/app/meditate/_components/meditation-player"

interface MeditationCardProps {
  meditation: SelectMeditation & { meditationScript: MeditationScript }
}

export default function MeditationCard({ meditation }: MeditationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:border-blue-500/20 hover:bg-blue-50/50">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Music2 className="size-5 text-violet-500" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {meditation.meditationScript?.title || "Untitled Meditation"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="shrink-0 transition-transform duration-200 hover:bg-blue-100/50 group-hover:bg-blue-100/80"
              >
                {isExpanded ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="size-4" />
              <span>{formatDate(meditation.createdAt)}</span>
            </div>

            <p className="text-muted-foreground line-clamp-2 text-sm">
              {meditation.userInput}
            </p>
          </div>
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
