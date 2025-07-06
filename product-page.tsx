"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Pause, SkipBack, Volume2, ChevronDown, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function ProductPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-screen w-64 bg-black p-6">
        <div className="mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melody%20Collab%20Final-01-wJ6u6o1bnpgNgz28mdTurjWFCWIgGe.png"
            alt="Melody Collab Logo"
            width={180}
            height={180}
            priority
            className="mb-8 w-[70%]"
          />
        </div>
        <div className="mt-16 space-y-6">
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Dashboard
          </Link>
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Browse
          </Link>
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Producers
          </Link>
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Marketplace
          </Link>
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Genres
          </Link>
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Profile
          </Link>
          <Link href="#" className="block text-zinc-400 hover:text-white">
            Become a PRO
          </Link>
        </div>
      </nav>

      {/* Top Bar */}
      <header className="fixed left-64 right-0 top-0 z-50 flex h-16 items-center justify-end bg-black px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            asChild
            className="rounded-md bg-emerald-500 px-6 text-sm font-medium text-black hover:bg-emerald-600"
          >
            <Link href="/upload">Upload Melody</Link>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full border border-emerald-500 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1729819215.jpg-uoM6NdN5hMe9otOwiONDKGITdU1L3H.jpeg"
                alt="Profile"
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span>Profile</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-16">
        {/* Product Info */}
        <div className="p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
            {/* Product Image and Actions */}
            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png"
                alt="Music Sample Pack"
                width={300}
                height={300}
                className="rounded-lg"
              />
              <div className="mt-4 space-y-2">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Buy This Pack</Button>
                <Button className="w-full border border-white bg-black text-white hover:bg-zinc-900">
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-emerald-500">Jungle Tekno</h1>
                <Link href="#" className="flex items-center gap-3 group">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1729819215.jpg-uoM6NdN5hMe9otOwiONDKGITdU1L3H.jpeg"
                      alt="Thunder Beatz profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-lg font-medium text-zinc-400 group-hover:text-white">Thunder Beatz</span>
                </Link>
              </div>
              <div className="mb-4 text-2xl font-bold">$6.00</div>
              <p className="mb-8 text-zinc-400">
                It is a long established fact that a reader will be distracted by the readable content of a page when
                looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution
                of letters, as opposed to using Content here, content here
              </p>

              {/* Audio Demo */}
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">Audio Demo</h3>
                <Card className="bg-zinc-900 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white"
                        onClick={() => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0
                            setCurrentTime(0)
                          }
                        }}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={[currentTime]}
                          max={audioRef.current?.duration || 100}
                          step={0.1}
                          onValueChange={handleSeek}
                          className="cursor-pointer"
                        />
                      </div>
                      <span className="min-w-[40px] text-sm text-zinc-400">{formatTime(currentTime)}</span>
                      <Volume2 className="h-4 w-4 text-zinc-400" />
                    </div>
                    <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)}>
                      <source src="/demo-audio.mp3" type="audio/mpeg" />
                    </audio>
                  </div>
                </Card>
              </div>

              {/* Video Demo */}
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">Video Overview</h3>
                <Card className="overflow-hidden bg-zinc-900">
                  <div className="aspect-video w-full">
                    <video className="h-full w-full" controls poster="/placeholder.svg">
                      <source src="your-video-url.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

