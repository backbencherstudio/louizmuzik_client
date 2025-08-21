"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudioContext } from "@/components/audio-context"

interface PlayButtonProps {
  track: {
    id: string
    title: string
    artist: string
    coverImage: string
    audioUrl: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
  onPlay?: () => void
}

export default function PlayButton({
  track,
  variant = "default",
  size = "default",
  className = "",
  showText = true,
  onPlay,
}: PlayButtonProps) {
  const { setAudioState } = useAudioContext()

  const handlePlay = () => {
    setAudioState({
      currentTime: 0,
      duration: 0,
      isPlaying: true,
      currentMelodyId: track.id,
    })
    onPlay?.()
  }

  return (
    <Button variant={variant} size={size} className={`gap-2 ${className}`} onClick={handlePlay}>
      <Play className="h-4 w-4" />
      {showText && <span>Play</span>}
    </Button>
  )
}

