"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MeditationScript } from "@/db/schema"
import VolumeSlider from "./_components/volume-slider"
import { Loader2, Music, Sparkles, Volume2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import MeditationPlayer from "./_components/meditation-player"

type GenerationStep =
  | "idle"
  | "generating-script"
  | "script-ready"
  | "generating-audio"
  | "mixing-audio"
  | "complete"

export default function MeditatePage() {
  const [input, setInput] = useState("")
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [generationStep, setGenerationStep] = useState<GenerationStep>("idle")
  const [progress, setProgress] = useState(0)
  const [meditation, setMeditation] = useState<{
    meditationScript: MeditationScript
    audioFilePath?: string | null
  } | null>(null)

  const isLoading = generationStep !== "idle" && generationStep !== "complete"

  // Smooth progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout
    let targetProgress = 0

    switch (generationStep) {
      case "generating-script":
        targetProgress = 40
        break
      case "script-ready":
        targetProgress = 50
        break
      case "generating-audio":
        targetProgress = 80
        break
      case "mixing-audio":
        targetProgress = 95
        break
      case "complete":
        targetProgress = 100
        break
      default:
        targetProgress = 0
    }

    if (progress < targetProgress) {
      interval = setInterval(() => {
        setProgress(current => {
          const next = current + 0.5
          return next <= targetProgress ? next : current
        })
      }, 50)
    } else if (progress > targetProgress) {
      setProgress(targetProgress)
    }

    return () => clearInterval(interval)
  }, [generationStep, progress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      // Reset state
      setMeditation(null)
      setProgress(0)
      setGenerationStep("generating-script")

      // Start script generation
      const startTime = Date.now()
      const response = await fetch("/api/generate-meditation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userInput: input,
          musicVolume
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate meditation")
      }

      // Calculate how long the script generation took
      const scriptGenerationTime = Date.now() - startTime

      // Show script
      setGenerationStep("script-ready")
      setMeditation(data.data)

      // Adjust timing based on script generation time
      const audioGenerationDelay = Math.max(2000, scriptGenerationTime / 2)
      const mixingDelay = Math.max(1000, scriptGenerationTime / 4)

      // Simulate remaining steps with proportional timing
      setGenerationStep("generating-audio")
      await new Promise(resolve => setTimeout(resolve, audioGenerationDelay))
      setGenerationStep("mixing-audio")
      await new Promise(resolve => setTimeout(resolve, mixingDelay))
      setGenerationStep("complete")
    } catch (error) {
      console.error("Error:", error)
      setGenerationStep("idle")
      // Handle error (could add a toast notification here)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Generate Your Meditation</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="How are you feeling today? What's on your mind?"
              className="min-h-[100px]"
              disabled={isLoading}
            />
            <VolumeSlider
              defaultVolume={musicVolume}
              onChange={setMusicVolume}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {generationStep === "generating-script" &&
                    "Crafting your meditation..."}
                  {generationStep === "script-ready" && "Processing..."}
                  {generationStep === "generating-audio" &&
                    "Generating voice..."}
                  {generationStep === "mixing-audio" &&
                    "Adding background music..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Generate Meditation
                </div>
              )}
            </Button>

            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-muted-foreground flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {generationStep === "generating-script" && (
                      <>
                        <Sparkles className="size-4" />
                        Crafting personalized meditation script
                      </>
                    )}
                    {generationStep === "generating-audio" && (
                      <>
                        <Volume2 className="size-4" />
                        Converting script to calming voice
                      </>
                    )}
                    {generationStep === "mixing-audio" && (
                      <>
                        <Music className="size-4" />
                        Adding soothing background music
                      </>
                    )}
                  </div>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            )}
          </form>
        </Card>

        {meditation && (
          <Card className="overflow-hidden">
            <div className="p-6">
              {generationStep === "complete" ? (
                <MeditationPlayer meditation={meditation} />
              ) : (
                <div
                  className={`space-y-4 transition-opacity duration-500 ${
                    generationStep === "generating-script"
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <h3 className="text-xl font-semibold">
                    {meditation.meditationScript.title}
                  </h3>
                  <div className="space-y-4">
                    {meditation.meditationScript.segments.map(
                      (segment, index) => (
                        <div
                          key={index}
                          className="rounded-lg border p-4 transition-all duration-300 hover:border-blue-500/20 hover:bg-blue-500/5"
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
                                {segment.duration} second pause - Take a deep
                                breath
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {generationStep !== "complete" && meditation.audioFilePath && (
              <div className="bg-muted/50 flex items-center gap-4 border-t px-6 py-4">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  {generationStep === "generating-audio" &&
                    "Converting meditation script to soothing voice..."}
                  {generationStep === "mixing-audio" &&
                    "Adding calming background music..."}
                </span>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
