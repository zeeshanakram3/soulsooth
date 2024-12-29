"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MeditationScript } from "@/db/schema"
import VolumeSlider from "./volume-slider"
import DurationSelector from "./duration-selector"
import { Loader2, Music, Sparkles, Volume2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import MeditationPlayer from "./meditation-player"
import {
  checkCreditsAction,
  deductCreditAction
} from "@/actions/db/profiles-actions"
import { toast } from "sonner"
import { ApiKeyInput } from "./api-key-input"
import { setApiKeyAction } from "@/actions/api-key-actions"
import { createPortal } from "react-dom"

type GenerationStep =
  | "idle"
  | "generating-script"
  | "script-ready"
  | "generating-speech"
  | "generating-silence"
  | "combining-audio"
  | "adding-music"
  | "complete"

interface UserInputFormProps {
  userId: string
}

export default function UserInputForm({ userId }: UserInputFormProps) {
  const [input, setInput] = useState("")
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [duration, setDuration] = useState(5)
  const [generationStep, setGenerationStep] = useState<GenerationStep>("idle")
  const [progress, setProgress] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)
  const [meditation, setMeditation] = useState<{
    meditationScript: MeditationScript
    audioFilePath?: string | null
  } | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)

  const isLoading = generationStep !== "idle" && generationStep !== "complete"

  // Smooth progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout

    // Update target progress based on step
    let newTarget = 0
    switch (generationStep) {
      case "generating-script":
        newTarget = Math.max(15, targetProgress)
        break
      case "script-ready":
        newTarget = Math.max(20, targetProgress)
        break
      case "generating-speech":
        newTarget = Math.max(60, targetProgress)
        break
      case "generating-silence":
        newTarget = Math.max(70, targetProgress)
        break
      case "combining-audio":
        newTarget = Math.max(85, targetProgress)
        break
      case "adding-music":
        newTarget = Math.max(95, targetProgress)
        break
      case "complete":
        newTarget = 100
        break
      default:
        newTarget = 0
    }
    setTargetProgress(newTarget)

    // Smoothly animate to target
    if (progress < targetProgress) {
      interval = setInterval(() => {
        setProgress(current => {
          const next = current + 0.5
          return next <= targetProgress ? next : current
        })
      }, 50)
    }

    return () => clearInterval(interval)
  }, [generationStep, progress, targetProgress])

  const handleApiKeyChange = async (key: string | null) => {
    setApiKey(key)
    const result = await setApiKeyAction(key)
    if (!result.isSuccess) {
      toast.error(result.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      // Only check credits if not using personal API key
      if (!apiKey) {
        const creditsResult = await checkCreditsAction(userId)
        if (!creditsResult.isSuccess || !creditsResult.data.hasCredits) {
          toast.error("You don't have enough credits to generate a meditation")
          return
        }
      }

      // Reset state
      setMeditation(null)
      setProgress(0)
      setTargetProgress(0)
      setGenerationStep("generating-script")

      // Start script generation with streaming response
      const response = await fetch("/api/generate-meditation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userInput: input,
          musicVolume,
          durationMinutes: duration
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate meditation")
      }

      // Set up event source for progress updates
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        const updates = text.split("\n").filter(Boolean)

        for (const update of updates) {
          try {
            const data = JSON.parse(update)

            if (data.type === "script") {
              // Show script immediately when it's generated
              setGenerationStep("script-ready")
              setMeditation(data.meditation)
            } else if (data.type === "progress") {
              // Update progress based on backend status
              setGenerationStep(data.step as GenerationStep)
              // Only update target if it's higher than current
              setTargetProgress(prev => Math.max(prev, data.progress))
            } else if (data.type === "complete") {
              // Update final meditation data and deduct credit
              setGenerationStep("complete")
              setTargetProgress(100)
              setMeditation(data.meditation)

              // Only deduct credit if not using personal API key
              if (!apiKey) {
                const deductResult = await deductCreditAction(userId)
                if (!deductResult.isSuccess) {
                  toast.error("Failed to deduct credit")
                }
              }
              break
            }
          } catch (e) {
            console.error("Error parsing update:", e)
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setGenerationStep("idle")
      toast.error("Failed to generate meditation")
    }
  }

  // Handle layout animation when meditation appears
  useEffect(() => {
    if (meditation) {
      // Get elements
      const container = document.getElementById("meditation-container")
      const inputContainer = document.getElementById("input-container")

      // Show meditation container
      if (container) {
        container.style.display = "block"
        // Trigger reflow
        void container.offsetHeight
        container.style.opacity = "1"
      }

      // Animate input to the left
      if (inputContainer) {
        inputContainer.classList.add("lg:translate-x-0")
        inputContainer.classList.remove("lg:translate-x-1/4")
      }
    }
  }, [meditation])

  // Initialize centered position
  useEffect(() => {
    const inputContainer = document.getElementById("input-container")
    if (inputContainer && !meditation) {
      inputContainer.classList.add("lg:translate-x-1/4")
    }
  }, [])

  // Render meditation in the right column
  const renderMeditation = () => {
    const container = document.getElementById("meditation-container")
    if (!container || !meditation) return null

    return createPortal(
      <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="sticky top-0 z-10 mb-4 flex items-center justify-between rounded-lg border bg-white/80 p-4 backdrop-blur">
          <h3 className="text-xl font-semibold">
            {meditation.meditationScript.title}
          </h3>
          <span className="text-muted-foreground text-sm">
            {duration} minute meditation
          </span>
        </div>

        <div className="h-[calc(100vh-16rem)] overflow-y-auto rounded-lg border bg-white p-6">
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
              {meditation.meditationScript.segments.map((segment, index) => (
                <div
                  key={index}
                  className="animate-in fade-in slide-in-from-bottom-4 rounded-lg border p-4 transition-all duration-300 hover:border-blue-500/20 hover:bg-blue-500/5"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {segment.type === "speech" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <Volume2 className="size-4 text-blue-500" />
                      </div>
                      <p className="text-gray-600">{segment.content}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                        <span className="size-2 animate-pulse rounded-full bg-current text-emerald-500" />
                      </div>
                      <p className="text-gray-600">
                        {segment.duration} second pause - Take a deep breath
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {generationStep !== "complete" && meditation.audioFilePath && (
            <div className="bg-muted/50 mt-6 flex items-center gap-4 rounded-lg border px-6 py-4">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                {generationStep === "generating-speech" &&
                  "Converting meditation script to soothing voice..."}
                {generationStep === "adding-music" &&
                  "Adding soothing background music..."}
              </span>
            </div>
          )}
        </div>
      </div>,
      container
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ApiKeyInput onApiKeyChange={handleApiKeyChange} />

          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="How are you feeling today? What's on your mind?"
            className="min-h-[100px]"
            disabled={isLoading}
          />

          <DurationSelector
            duration={duration}
            onChange={setDuration}
            disabled={isLoading}
          />

          <VolumeSlider defaultVolume={musicVolume} onChange={setMusicVolume} />

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
                {generationStep === "generating-speech" &&
                  "Generating voice..."}
                {generationStep === "generating-silence" &&
                  "Adding mindful pauses..."}
                {generationStep === "combining-audio" &&
                  "Combining audio segments..."}
                {generationStep === "adding-music" &&
                  "Adding soothing background music..."}
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
                      Crafting your personalized meditation script
                    </>
                  )}
                  {generationStep === "generating-speech" && (
                    <>
                      <Volume2 className="size-4" />
                      Converting script to calming voice
                    </>
                  )}
                  {generationStep === "generating-silence" && (
                    <>
                      <Volume2 className="size-4" />
                      Adding mindful pauses
                    </>
                  )}
                  {generationStep === "combining-audio" && (
                    <>
                      <Music className="size-4" />
                      Combining audio segments
                    </>
                  )}
                  {generationStep === "adding-music" && (
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

      {/* Render meditation in right column */}
      {meditation && renderMeditation()}
    </div>
  )
}
