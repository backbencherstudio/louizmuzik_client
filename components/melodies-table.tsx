"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Heart, Play, Download, Pause } from "lucide-react";
import { WaveformDisplay } from "@/components/waveform-display";
import Image from "next/image";

interface Melody {
  _id: string;
  name: string;
  producer: string;
  bpm: number;
  key: string;
  genre: string;
  audioUrl: string;
  image?: string;
  artistType?: string;
  isFavorite?: boolean;
}

interface MelodiesTableProps {
  melodies: Melody[];
  onPlayClick?: (melody: any) => void;
  onDownloadClick?: (melody: any) => void;
  onFavoriteClick?: (melodyId: string) => void;
  isFavorite?: (melodyId: string) => boolean;
  currentPlayingMelody?: any;
  currentTime?: number;
  duration?: number;
  currentMelodyId?: string | null;
}

export function MelodiesTable({ 
  melodies, 
  onPlayClick,
  onDownloadClick,
  onFavoriteClick,
  isFavorite,
  currentPlayingMelody,
  currentTime = 0,
  duration = 0,
  currentMelodyId
}: MelodiesTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400 w-[100px]"></TableHead>
            <TableHead className="text-zinc-400 w-[100px]"></TableHead>
            <TableHead className="text-zinc-400">Title</TableHead>
            <TableHead className="text-zinc-400">Waveform</TableHead>
            <TableHead className="text-zinc-400">BPM</TableHead>
            <TableHead className="text-zinc-400">Key</TableHead>
            <TableHead className="text-zinc-400">Genre</TableHead>
            <TableHead className="text-zinc-400">Artist Type</TableHead>
            <TableHead className="text-zinc-400 w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {melodies.map((melody) => (
            <TableRow
              key={melody._id}
              className="border-zinc-800 hover:bg-zinc-900/50"
            >
              <TableCell>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 rounded-full ${
                    currentPlayingMelody?._id === melody._id
                      ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  }`}
                  onClick={() => onPlayClick?.(melody)}
                >
                  {currentPlayingMelody?._id === melody._id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <Image
                    src={melody?.image || '/images/default-melody.png'}
                    alt={melody?.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-white">
                {melody.name}
              </TableCell>
              <TableCell>
                <WaveformDisplay
                  audioUrl={melody.audioUrl}
                  isPlaying={currentPlayingMelody?._id === melody._id}
                  onPlayPause={() => onPlayClick?.(melody)}
                  height={30}
                  width="200px"
                  isControlled={true}
                  currentTime={currentMelodyId === melody._id ? currentTime : 0}
                  duration={currentMelodyId === melody._id ? duration : 0}
                />
              </TableCell>
              <TableCell className="text-zinc-400">{melody.bpm}</TableCell>
              <TableCell className="text-zinc-400">{melody.key}</TableCell>
              <TableCell className="text-zinc-400">
                {Array.isArray(melody?.genre) 
                  ? melody.genre.join(', ') 
                  : melody?.genre}
              </TableCell>
              <TableCell className="text-zinc-400">
                {Array.isArray(melody?.artistType) 
                  ? melody.artistType.join(', ') 
                  : melody?.artistType}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 text-zinc-400 hover:text-red-500 ${
                      isFavorite?.(melody._id)
                        ? 'text-red-500'
                        : ''
                    }`}
                    onClick={() => onFavoriteClick?.(melody._id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite?.(melody._id)
                          ? 'fill-current'
                          : ''
                      }`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                    onClick={() => onDownloadClick?.(melody)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}