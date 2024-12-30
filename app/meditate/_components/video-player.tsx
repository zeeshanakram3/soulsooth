"use client"

import { Play } from "lucide-react"
import { useRef, useState } from "react"

interface VideoPlayerProps {
  title: string
  description: string
  src: string
  poster: string
}

export function VideoPlayer({
  title,
  description,
  src,
  poster
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className="group rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-50/50">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        {!isPlaying && (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-all duration-300 hover:bg-black/30"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg transition-transform duration-300 hover:scale-110">
              <Play className="size-8" />
            </div>
          </button>
        )}
        <video
          ref={videoRef}
          className="size-full object-contain"
          poster={poster}
          onEnded={handleVideoEnded}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <p className="text-muted-foreground mt-4">"{description}"</p>
    </div>
  )
}
