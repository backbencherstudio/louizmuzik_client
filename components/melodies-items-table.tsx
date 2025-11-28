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
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#0F0F0F]">
      <div className="overflow-x-auto lg:overflow-x-visible">
        {/* Desktop Table */}
        <table className="w-full hidden md:table table-fixed">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="w-12 px-2 py-3 text-center text-xs font-medium text-zinc-400"></th>
              <th className="w-14 px-2 py-3 text-left text-xs font-medium text-zinc-400"></th>
              <th className="w-32 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                NAME
              </th>
              <th className="w-28 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                PRODUCER
              </th>
              <th className="hidden lg:table-cell w-32 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                WAVEFORM
              </th>
              <th className="hidden lg:table-cell w-16 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                BPM
              </th>
              <th className="hidden lg:table-cell w-20 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                KEY
              </th>
              <th className="hidden lg:table-cell w-24 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                GENRE
              </th>
              <th className="hidden lg:table-cell w-28 px-2 py-3 text-left text-xs font-medium text-zinc-400">
                ARTIST TYPE
              </th>
              <th className="w-24 px-2 py-3 text-center text-xs font-medium text-zinc-400">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {melodies.map((melody) => (
              <tr
                key={melody?._id}
                className="border-b border-zinc-800 hover:bg-zinc-900/30"
              >
                <td className="px-2 py-3 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    id={melody?._id}
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
                <td className="px-2 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={
                        melody?.userId?.profile_image ||
                        "/logo.png"
                      }
                      alt={melody?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-2 py-3 text-sm font-medium text-white truncate">
                  {melody?.name}
                </td>
                <td className="px-2 py-3 text-sm text-zinc-400 truncate">
                  <Link
                    href={`/producers/${melody?.userId?._id
                      ?.toLowerCase()
                      ?.replace(/\s+/g, "-") || "#"}`}
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {melody?.producer}
                  </Link>
                </td>
                <td className="hidden lg:table-cell px-2 py-3">
                  <WaveformDisplay
                    key={melody.audioUrl || melody._id}
                    audioUrl={melody?.audio_path || melody?.audio || melody?.audioUrl || ""}
                    isPlaying={currentPlayingMelody?._id === melody._id}
                    onPlayPause={() => onPlayClick(melody)}
                    height={30}
                    isControlled={true}
                    currentTime={currentMelodyId === melody._id ? currentTime : 0}
                    duration={currentMelodyId === melody._id ? duration : 0}
                  />
                </td>
                <td className="hidden lg:table-cell px-2 py-3 text-sm text-zinc-400">
                  {melody?.bpm}
                </td>
                <td className="hidden lg:table-cell px-2 py-3 text-sm text-zinc-400">
                  {melody?.key}
                </td>
                <td className="hidden lg:table-cell px-2 py-3 text-sm text-zinc-400 truncate">
                  {Array.isArray(melody?.genre)
                    ? melody.genre.join(", ")
                    : melody?.genre}
                </td>
                <td className="hidden lg:table-cell px-2 py-3 text-sm text-zinc-400 truncate">
                  {Array.isArray(melody?.artistType)
                    ? melody.artistType.join(", ")
                    : melody?.artistType}
                </td>
                <td className="px-2 py-3 text-center">
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

        {/* Mobile Table */}
        <table className="w-full md:hidden">
          <tbody>
            {melodies.map((melody) => (
              <tr
                key={melody?._id}
                className="border-b border-zinc-800 hover:bg-zinc-900/30"
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={melody?.userId?.profile_image || "/images/default-melody.png"}
                      alt={melody?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 flex-shrink-0 rounded-full ${
                      currentPlayingMelody?._id === melody._id
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {melody?.name?.slice(0, 18)}...
                    </p>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      <Link
                        href={`/producers/${melody?.userId?._id
                          ?.toLowerCase()
                          ?.replace(/\s+/g, "-") || "#"}`}
                        className="hover:text-emerald-500 transition-colors"
                      >
                        {melody?.producer?.slice(0, 10)}...
                      </Link>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-emerald-500"
                      onClick={() => onEditClick(melody._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-red-500"
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
    </div>
  );
}
