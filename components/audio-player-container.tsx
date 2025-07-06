"use client"

import { useAudio } from "@/components/audio-context"
import AudioPlayer from "@/components/audio-player"

export default function AudioPlayerContainer() {
  const { isPlayerOpen, currentTrack, playlist, nextTrack, previousTrack, closePlayer } = useAudio()

  return (
    <AudioPlayer
      isOpen={isPlayerOpen}
      onClose={closePlayer}
      currentTrack={currentTrack}
      playlist={playlist}
      onNext={nextTrack}
      onPrevious={previousTrack}
    />
  )
}

