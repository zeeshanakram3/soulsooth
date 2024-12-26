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
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load and decode audio file
  useEffect(() => {
    if (!meditation.audioFilePath) {
      setIsLoading(false)
      return
    }

    const loadAudio = async () => {
      try {
        const response = await fetch(meditation.audioFilePath as string)
        const arrayBuffer = await response.arrayBuffer()
        const context = new AudioContext()
        const buffer = await context.decodeAudioData(arrayBuffer)

        audioContextRef.current = context
        setAudioBuffer(buffer)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading audio:", error)
        setIsLoading(false)
      }
    }

    loadAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [meditation.audioFilePath])

  // Play audio with pauses
  const playAudioWithPauses = async () => {
    if (!audioContextRef.current || !audioBuffer) return

    setIsPlaying(true)
    setCurrentSegmentIndex(0)

    const context = audioContextRef.current
    let currentTime = context.currentTime
    let segmentStartTime = currentTime

    // Create gain node for smooth transitions
    const gainNode = context.createGain()
    gainNode.connect(context.destination)

    // Process each segment
    for (let i = 0; i < meditation.meditationScript.segments.length; i++) {
      const segment = meditation.meditationScript.segments[i]

      if (segment.type === "speech") {
        // Play speech segment
        const source = context.createBufferSource()
        source.buffer = audioBuffer
        source.connect(gainNode)

        // Fade in
        gainNode.gain.setValueAtTime(0, segmentStartTime)
        gainNode.gain.linearRampToValueAtTime(1, segmentStartTime + 0.1)

        source.start(segmentStartTime)

        // Calculate duration based on word count
        const wordCount = segment.content.split(/\s+/).length
        const duration = Math.ceil(wordCount / 2) // Adjust timing as needed

        // Fade out
        gainNode.gain.setValueAtTime(1, segmentStartTime + duration - 0.1)
        gainNode.gain.linearRampToValueAtTime(0, segmentStartTime + duration)

        segmentStartTime += duration
      } else if (segment.type === "pause") {
        // Add pause duration
        segmentStartTime += segment.duration
      }

      // Schedule segment index update
      setTimeout(
        () => {
          setCurrentSegmentIndex(i)
        },
        (segmentStartTime - currentTime) * 1000
      )
    }

    // Reset at the end
    setTimeout(
      () => {
        setIsPlaying(false)
        setCurrentSegmentIndex(0)
      },
      (segmentStartTime - currentTime) * 1000
    )
  }

  const stopAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = new AudioContext()
    }
    setIsPlaying(false)
    setCurrentSegmentIndex(0)
  }

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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Listen</h3>
          {isLoading ? (
            <div className="text-muted-foreground">Loading audio...</div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={isPlaying ? stopAudio : playAudioWithPauses}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                {isPlaying ? "Stop" : "Play"}
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
