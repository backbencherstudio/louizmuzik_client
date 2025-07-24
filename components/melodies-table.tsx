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
import { Heart, Play, Download } from "lucide-react";
import {
  useFavoriteMelodyMutation,
  useGetFavoriteMelodyQuery,
  useMelodyDownloadMutation,
} from "@/app/store/api/melodyApis/melodyApis";
import { toast } from "sonner";
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";

interface Melody {
  _id: string;
  name: string;
  producer: string;
  bpm: number;
  key: string;
  genre: string;
  audioUrl: string;
  isFavorite: boolean;
}

interface MelodiesTableProps {
  melodies: Melody[];
}

export function MelodiesTable({ melodies }: MelodiesTableProps) {
  const { data: user, refetch: refetchUser } = useLoggedInUserQuery(null);
  const userId = user?.data?._id;
  
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const [melodyDownloadCounter] = useMelodyDownloadMutation();
  const [favoriteMelody, { isLoading: isFavoriteLoading }] = useFavoriteMelodyMutation();
  const { refetch: refetchMelodies } = useGetFavoriteMelodyQuery(userId || "");
  const handleDownloadClick = async (melody: any) => {
    try {
      const response = await melodyDownloadCounter(melody._id).unwrap();
      console.log("melodyDownloadCounter", response);

      const audioUrl = melody.audioUrl;
      if (audioUrl) {
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = audioUrl.split("/").pop() || "melody";
        link.click();
      } else {
        toast.error("No audio URL found!");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to download melody");
    }
  };

  const isMelodyFavorite = (melodyId: string) => {
    return user?.data?.favourite_melodies?.includes(melodyId) || false;
  };

  const toggleFavorite = async (melodyId: string) => {
    try {
      const response = await favoriteMelody({ 
        id: melodyId, 
        userId: userId 
      }).unwrap();
      await Promise.all([refetchUser(), refetchMelodies()]);
      toast.info(response?.message);
    } catch (error: any) {
      console.log("favorite error", error);
      toast.error(error?.data?.message || "Failed to update favorite");
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400 w-[100px]"></TableHead>
            <TableHead className="text-zinc-400">Title</TableHead>
            <TableHead className="text-zinc-400">Producer</TableHead>
            <TableHead className="text-zinc-400">BPM</TableHead>
            <TableHead className="text-zinc-400">Key</TableHead>
            <TableHead className="text-zinc-400">Genre</TableHead>
            <TableHead className="text-zinc-400 w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {melodies.map((melody) => (
            <TableRow
              key={melody._id}
              className="border-zinc-800 hover:bg-zinc-900/50"
            >
              <TableCell className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-black/50"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-black/50"
                  onClick={() => toggleFavorite(melody._id)}
                  disabled={isFavoriteLoading}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isMelodyFavorite(melody._id)
                        ? "fill-emerald-500 text-emerald-500"
                        : "text-white hover:text-emerald-500"
                    }`}
                  />
                </Button>
              </TableCell>
              <TableCell className="font-medium text-white">
                {melody.name}
              </TableCell>
              <TableCell className="text-zinc-400">{melody.producer}</TableCell>
              <TableCell className="text-zinc-400">{melody.bpm}</TableCell>
              <TableCell className="text-zinc-400">{melody.key}</TableCell>
              <TableCell className="text-zinc-400">{melody.genre}</TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-black/50"
                  onClick={() => handleDownloadClick(melody)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}