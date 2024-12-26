"use client"

import { MeditationScript } from "@/db/schema"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface MeditationDisplayProps {
  meditation: {
    meditationScript: MeditationScript
    audioFilePath?: string | null
  }
}

export default function MeditationDisplay({
  meditation
}: MeditationDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Calculate segment durations and start times
  const segmentTimes = meditation.meditationScript.segments.reduce<
    Array<{ start: number; duration: number }>
  >((acc, segment, index) => {
    const prevEnd =
      index > 0 ? acc[index - 1].start + acc[index - 1].duration : 0
    if (segment.type === "speech") {
      // Estimate speech duration (roughly 5 words per second)
      const wordCount = segment.content.split(/\s+/).length
      const duration = Math.ceil(wordCount / 5)
      acc.push({ start: prevEnd, duration })
    } else {
      acc.push({ start: prevEnd, duration: segment.duration })
    }
    return acc
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateSegment = () => {
      const currentTime = audio.currentTime
      const newIndex = segmentTimes.findIndex(
        (timing, index) =>
          currentTime >= timing.start &&
          currentTime <
            timing.start +
              timing.duration +
              (index < segmentTimes.length - 1 ? 0 : 1)
      )
      if (newIndex !== -1) {
        setCurrentSegmentIndex(newIndex)
      }
    }

    audio.addEventListener("timeupdate", updateSegment)
    audio.addEventListener("play", () => setIsPlaying(true))
    audio.addEventListener("pause", () => setIsPlaying(false))
    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentSegmentIndex(0)
    })

    return () => {
      audio.removeEventListener("timeupdate", updateSegment)
      audio.removeEventListener("play", () => setIsPlaying(true))
      audio.removeEventListener("pause", () => setIsPlaying(false))
      audio.removeEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentSegmentIndex(0)
      })
    }
  }, [segmentTimes])

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold">
          {meditation.meditationScript.title}
        </h3>
        <div className="space-y-4">
          {meditation.meditationScript.segments.map((segment, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 transition-colors ${
                currentSegmentIndex === index && isPlaying
                  ? "border-blue-500 bg-blue-50"
                  : ""
              }`}
            >
              {segment.type === "speech" ? (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🗣️</span>
                  <p className="text-gray-600">{segment.content}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">⏸️</span>
                  <p className="text-gray-600">
                    {segment.duration} second pause - Take a deep breath
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {meditation.audioFilePath && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Listen</h3>
          <audio
            ref={audioRef}
            controls
            className="w-full"
            src={meditation.audioFilePath}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </Card>
  )
}
