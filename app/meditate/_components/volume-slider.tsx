"use client"

import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from "react"

interface VolumeSliderProps {
  defaultVolume?: number
  onChange: (volume: number) => void
}

export default function VolumeSlider({
  defaultVolume = 0.15,
  onChange
}: VolumeSliderProps) {
  const [volume, setVolume] = useState(defaultVolume)

  // Load saved volume from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem("meditation-music-volume")
    if (savedVolume) {
      const parsedVolume = parseFloat(savedVolume)
      setVolume(parsedVolume)
      onChange(parsedVolume)
    }
  }, [onChange])

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    onChange(newVolume)
    localStorage.setItem("meditation-music-volume", newVolume.toString())
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Background Music Volume</label>
        <span className="text-muted-foreground text-sm">
          {Math.round(volume * 100)}%
        </span>
      </div>
      <Slider
        defaultValue={[volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
      />
    </div>
  )
}
