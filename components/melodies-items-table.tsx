"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformDisplay } from "@/components/waveform-display";

interface Melody {
  _id: string;
  name: string;
  producer: string;
  bpm: number;
  key: string;
  genre: string | string[];
  artistType: string | string[];
  audioUrl?: string;
  audio_path?: string;
  audio?: string;
  userId?: {
    _id: string;
    profile_image?: string;
  };
  [key: string]: any;
}

interface MelodiesItemsTableProps {
  melodies: Melody[];
  currentPlayingMelody?: any;
  onPlayClick: (melody: any) => void;
  onEditClick: (melodyId: string) => void;
  onDeleteClick: (melody: any) => void;
  currentTime?: number;
  duration?: number;
  currentMelodyId?: string | null;
}

export function MelodiesItemsTable({
  melodies,
  currentPlayingMelody,
  onPlayClick,
  onEditClick,
  onDeleteClick,
  currentTime = 0,
  duration = 0,
  currentMelodyId,
}: MelodiesItemsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400"></th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400"></th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
              Name
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
              Producer
            </th>
            <th className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
              Waveform
            </th>
            <th className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
              BPM
            </th>
            <th className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
              Key
            </th>
            <th className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
              Genre
            </th>
            <th className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
              Artist Type
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400"></th>
          </tr>
        </thead>
        <tbody>
          {melodies.map((melody) => (
            <tr
              key={melody?._id}
              className="border-b border-zinc-800 hover:bg-zinc-900/30"
            >
              <td className="whitespace-nowrap px-4 py-3 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${
                    currentPlayingMelody?._id === melody?._id
                      ? "bg-emerald-500 text-black hover:bg-emerald-600"
                      : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  }`}
                  onClick={() => onPlayClick(melody)}
                >
                  {currentPlayingMelody?._id === melody?._id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <Image
                    src={
                      melody?.userId?.profile_image ||
                      "/placeholder.svg"
                    }
                    alt={melody?.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                {melody?.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                <Link
                  href={`/producer/${melody?.producer
                    ?.toLowerCase()
                    ?.replace(/\s+/g, "-") || "#"}`}
                  className="hover:text-emerald-500 transition-colors"
                >
                  {melody?.producer}
                </Link>
              </td>
              <td className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3">
                <WaveformDisplay
                  key={melody.audioUrl || melody._id}
                  audioUrl={melody?.audio_path || melody?.audio || melody?.audioUrl || ""}
                  isPlaying={currentPlayingMelody?._id === melody._id}
                  onPlayPause={() => onPlayClick(melody)}
                  height={30}
                  width="200px"
                  isControlled={true}
                  currentTime={currentMelodyId === melody._id ? currentTime : 0}
                  duration={currentMelodyId === melody._id ? duration : 0}
                />
              </td>
              <td className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                {melody.bpm}
              </td>
              <td className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                {melody.key}
              </td>
              <td className="hidden 2xl:table-cell whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                {Array.isArray(melody?.genre)
                  ? melody.genre.join(", ")
                  : melody?.genre}
              </td>
              <td className="hidden 2xl:table-cell px-4 py-3 text-sm text-zinc-400">
                {Array.isArray(melody?.artistType)
                  ? melody.artistType.join(", ")
                  : melody?.artistType}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-emerald-500"
                    onClick={() => onEditClick(melody._id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-red-500"
                    onClick={() => onDeleteClick(melody)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
