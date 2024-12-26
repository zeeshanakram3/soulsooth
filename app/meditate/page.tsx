"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function MeditatePage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [meditation, setMeditation] = useState<{
    meditationScript: string
    audioFilePath?: string | null
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/generate-meditation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userInput: input
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate meditation")
      }

      setMeditation(data.data)
    } catch (error) {
      console.error("Error:", error)
      // Handle error (could add a toast notification here)
    } finally {
      setIsLoading(false)
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
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Generating..." : "Generate Meditation"}
            </Button>
          </form>
        </Card>

        {meditation && (
          <Card className="space-y-6 p-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Your Meditation</h3>
              <p className="whitespace-pre-wrap text-gray-600">
                {meditation.meditationScript}
              </p>
            </div>

            {meditation.audioFilePath && (
              <div>
                <h3 className="mb-2 text-lg font-semibold">Listen</h3>
                <audio
                  controls
                  className="w-full"
                  src={meditation.audioFilePath}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
