"use client"

import { useAudioContext } from "@/components/audio-context"
import AudioPlayer from "@/components/audio-player"

export default function AudioPlayerContainer() {
  const { currentMelodyId, setAudioState } = useAudioContext()

  return (
    <AudioPlayer
      isVisible={!!currentMelodyId}
      melody={null} // You'll need to pass the actual melody data here
      onClose={() => setAudioState({
        currentTime: 0,
        duration: 0,
        isPlaying: false,
        currentMelodyId: null,
      })}
    />
  )
}

