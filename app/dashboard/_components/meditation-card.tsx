"use client"

import { MeditationScript, SelectMeditation } from "@/db/schema"
import { formatDate } from "@/lib/utils"

interface MeditationCardProps {
  meditation: SelectMeditation
}

export default function MeditationCard({ meditation }: MeditationCardProps) {
  const meditationScript = meditation.meditationScript as MeditationScript

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {formatDate(meditation.createdAt)}
        </div>
        <div className="text-muted-foreground text-sm">
          {meditationScript?.title || "Untitled Meditation"}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Your Input</h3>
        <p className="text-muted-foreground">{meditation.userInput}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Meditation Segments</h3>
        <div className="space-y-2">
          {meditationScript?.segments?.map((segment, index) => (
            <div key={index} className="rounded border p-2">
              {segment.type === "speech" ? (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🗣️</span>
                  <p className="text-muted-foreground">{segment.content}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">⏸️</span>
                  <p className="text-muted-foreground">
                    {segment.duration} second pause
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {meditation.audioFilePath && (
        <div>
          <audio controls src={meditation.audioFilePath} className="w-full" />
        </div>
      )}
    </div>
  )
}
