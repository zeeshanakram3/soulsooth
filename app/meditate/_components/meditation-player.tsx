"use client"

import { MeditationScript } from "@/db/schema"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MeditationPlayerProps {
  meditation: {
    meditationScript: MeditationScript
    audioFilePath?: string | null
  }
}

// Helper function to format time in MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function MeditationPlayer({
  meditation
}: MeditationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [segmentTimes, setSegmentTimes] = useState<
    Array<{ start: number; duration: number }>
  >([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Calculate actual audio duration and update segment times
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      const totalDuration = audio.duration
      const segments = meditation.meditationScript.segments
      let currentTime = 0
      const times = segments.map((segment, index) => {
        const start = currentTime
        let duration

        if (segment.type === "pause") {
          duration = segment.duration
        } else {
          // For speech segments, calculate proportional duration
          // based on character count relative to total characters
          const totalChars = segments
            .filter(s => s.type === "speech")
            .reduce((sum, s) => sum + s.content.length, 0)
          const totalPauseDuration = segments
            .filter(s => s.type === "pause")
            .reduce((sum, s) => sum + s.duration, 0)
          const totalSpeechDuration = totalDuration - totalPauseDuration
          duration = (segment.content.length / totalChars) * totalSpeechDuration
        }

        currentTime += duration
        return { start, duration }
      })

      setSegmentTimes(times)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    return () =>
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
  }, [meditation.meditationScript.segments])

  // Autoplay when component mounts
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      audio.play().catch(error => {
        console.error("Autoplay failed:", error)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || segmentTimes.length === 0) return

    const updateSegment = () => {
      const currentTime = audio.currentTime
      const newIndex = segmentTimes.findIndex(
        (timing, index) =>
          currentTime >= timing.start &&
          currentTime < timing.start + timing.duration
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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      // ... existing segment time calculations ...
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("play", () => setIsPlaying(true))
    audio.addEventListener("pause", () => setIsPlaying(false))
    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentSegmentIndex(0)
      setCurrentTime(0)
    })

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("play", () => setIsPlaying(true))
      audio.removeEventListener("pause", () => setIsPlaying(false))
      audio.removeEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentSegmentIndex(0)
        setCurrentTime(0)
      })
    }
  }, [segmentTimes])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const playFromSegment = (index: number) => {
    const audio = audioRef.current
    if (!audio || !segmentTimes[index]) return

    audio.currentTime = segmentTimes[index].start
    audio.play()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayPause}
          className="size-12 rounded-full"
        >
          {isPlaying ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5 pl-1" />
          )}
        </Button>
        <div className="text-muted-foreground text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="bg-secondary relative h-1 w-full overflow-hidden rounded-full">
        <div
          className="h-full bg-blue-600 transition-all duration-100"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <div className="space-y-4">
        {meditation.meditationScript.segments.map((segment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => playFromSegment(index)}
            className={cn(
              "cursor-pointer rounded-lg border p-4 transition-all duration-300",
              currentSegmentIndex === index && isPlaying
                ? "border-blue-500 bg-blue-50/50"
                : "hover:border-blue-500/20 hover:bg-blue-50/20"
            )}
          >
            {segment.type === "speech" ? (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    currentSegmentIndex === index && isPlaying
                      ? "bg-blue-100"
                      : "bg-blue-50"
                  )}
                >
                  <Volume2
                    className={cn(
                      "size-4 transition-colors",
                      currentSegmentIndex === index && isPlaying
                        ? "text-blue-600"
                        : "text-blue-400"
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "flex-1 transition-colors",
                    currentSegmentIndex === index && isPlaying
                      ? "text-blue-950"
                      : "text-gray-600"
                  )}
                >
                  {segment.content}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    currentSegmentIndex === index && isPlaying
                      ? "bg-emerald-100"
                      : "bg-emerald-50"
                  )}
                >
                  <motion.div
                    animate={
                      currentSegmentIndex === index && isPlaying
                        ? { scale: [1, 1.2, 1] }
                        : { scale: 1 }
                    }
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      currentSegmentIndex === index && isPlaying
                        ? "bg-emerald-600"
                        : "bg-emerald-400"
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "flex-1 transition-colors",
                    currentSegmentIndex === index && isPlaying
                      ? "text-emerald-950"
                      : "text-gray-600"
                  )}
                >
                  {segment.duration} second pause - Take a deep breath
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {meditation.audioFilePath && (
        <audio
          ref={audioRef}
          src={meditation.audioFilePath}
          className="hidden"
          preload="metadata"
        />
      )}
    </div>
  )
}
