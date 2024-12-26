"use client"

import { SelectMeditation } from "@/db/schema"
import { formatDate } from "@/lib/utils"

interface MeditationCardProps {
  meditation: SelectMeditation
}

export default function MeditationCard({ meditation }: MeditationCardProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="text-muted-foreground text-sm">
        {formatDate(meditation.createdAt)}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Your Input</h3>
        <p className="text-muted-foreground">{meditation.userInput}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Meditation Script</h3>
        <p className="text-muted-foreground">{meditation.meditationScript}</p>
      </div>

      {meditation.audioFilePath && (
        <div>
          <audio controls src={meditation.audioFilePath} className="w-full" />
        </div>
      )}
    </div>
  )
}
