"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Track {
  id: string
  title: string
  artist: string
  coverImage: string
  audioUrl: string
}

interface AudioContextType {
  isPlayerOpen: boolean
  currentTrack: Track | null
  playlist: Track[]
  playTrack: (track: Track, newPlaylist?: Track[]) => void
  pauseTrack: () => void
  nextTrack: () => void
  previousTrack: () => void
  closePlayer: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const playTrack = (track: Track, newPlaylist?: Track[]) => {
    setCurrentTrack(track)
    if (newPlaylist) {
      setPlaylist(newPlaylist)
    } else if (!playlist.some((t) => t.id === track.id)) {
      setPlaylist((prev) => [...prev, track])
    }
    setIsPlayerOpen(true)
    setIsPlaying(true)
  }

  const pauseTrack = () => {
    setIsPlaying(false)
  }

  const nextTrack = () => {
    if (!currentTrack || playlist.length === 0) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentTrack(playlist[nextIndex])
    setIsPlaying(true)
  }

  const previousTrack = () => {
    if (!currentTrack || playlist.length === 0) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const previousIndex = (currentIndex - 1 + playlist.length) % playlist.length
    setCurrentTrack(playlist[previousIndex])
    setIsPlaying(true)
  }

  const closePlayer = () => {
    setIsPlayerOpen(false)
    setIsPlaying(false)
  }

  return (
    <AudioContext.Provider
      value={{
        isPlayerOpen,
        currentTrack,
        playlist,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

