"use client"

import { Pause, Play } from "lucide-react"
import { useRef, useState } from "react"
import styles from "./video-player.module.css"

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

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  return (
    <div className="group rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-50/50">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <button
              onClick={handlePlayClick}
              className="pointer-events-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg transition-transform duration-300 hover:scale-110"
            >
              <Play className="size-8" />
            </button>
          </div>
        )}
        <video
          ref={videoRef}
          className={`size-full object-contain ${styles.videoPlayer}`}
          poster={poster}
          onEnded={handleVideoEnded}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          controls
          controlsList="nodownload"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <p className="text-muted-foreground mt-4">"{description}"</p>
    </div>
  )
}
