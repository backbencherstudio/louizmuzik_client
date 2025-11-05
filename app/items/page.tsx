"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Search,
  ArrowLeft,
  Pencil,
  Trash,
  Loader2,
  Loader,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioPlayer } from "@/components/audio-player";
import { WaveformDisplay } from "@/components/waveform-display";
import Layout from "@/components/layout";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import {
  useDeletePackMutation,
  useGetProducerPackQuery,
} from "../store/api/packApis/packApis";
import { toast } from "sonner";
import {
  useDeleteMelodyMutation,
  useGetMelodyByUserIdQuery,
} from "../store/api/melodyApis/melodyApis";
import DeleteModal from "@/components/Modals/DeleteModal";
import { useRouter } from "next/navigation";
import { useAudioContext } from "@/components/audio-context";
import { MelodiesItemsTable } from "@/components/melodies-items-table";

export default function ItemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packToDelete, setPackToDelete] = useState<any>(null);
  const [melodyToDelete, setMelodyToDelete] = useState<any>(null);
  const { data: user } = useLoggedInUser();
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const userId = user?.data?._id;
  const { currentTime, duration, currentMelodyId } = useAudioContext();
  const {
    data: packData,
    refetch,
    isLoading: isLoadingPacks,
  } = useGetProducerPackQuery(userId);
  const [deletePack, { isLoading: isDeleting }] = useDeletePackMutation();

  const {
    data: melodiesData,
    refetch: refetchMelodies,
    isLoading: isLoadingMelodies,
  } = useGetMelodyByUserIdQuery(userId);
  const melodies = melodiesData?.data;

  // Filter melodies based on search query
  const filteredMelodies =
    melodies?.filter((melody: any) => {
      if (!searchQuery.trim()) return true;
      return melody?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];
  const [deleteMelody, { isLoading: isDeletingMelody }] =
    useDeleteMelodyMutation();

  const handleDeletePack = async (packId: string) => {
    try {
      await deletePack(packId).unwrap();
      toast.success("Pack deleted successfully");
      refetch();
      setDeleteModalOpen(false);
      setPackToDelete(null);
    } catch (error) {
      toast.error("Failed to delete pack");
    }
  };

  const handleDeleteConfirm = () => {
    if (packToDelete) {
      handleDeletePack(packToDelete._id);
    }
  };

  const handleDeleteMelody = async (melodyId: string) => {
    try {
      await deleteMelody({ id: melodyId, userId: userId }).unwrap();
      toast.success("Melody deleted successfully");
      refetchMelodies();
      setDeleteModalOpen(false);
      setMelodyToDelete(null);
    } catch (error) {
      toast.error("Failed to delete melody");
    }
  };
  const handleDeleteConfirmMelody = () => {
    if (melodyToDelete) {
      handleDeleteMelody(melodyToDelete._id);
    }
  };

  // Play functions

  const handlePlayClick = (melody: any) => {
    if (currentPlayingMelody?._id === melody._id) {
      setCurrentPlayingMelody(null);
      setCurrentPlayingPack(null);
      setIsAudioPlayerVisible(false);
      setShouldAutoPlay(false);
    } else {
      const melodyToPlay = {
        id: melody._id,
        _id: melody._id,
        name: melody.name,
        producer: melody.producer,
        image: melody.image,
        audio: melody.audio_path || melody.audio || melody.audioUrl,
        audioUrl: melody.audio_path || melody.audio || melody.audioUrl,
        bpm: melody.bpm || 120,
        key: melody.key || "C Maj",
        genre: melody.genre || "Unknown",
        artistType: melody.artistType || "Producer",
      };

      setCurrentPlayingMelody(melodyToPlay);
      setCurrentPlayingPack(null);
      setIsAudioPlayerVisible(true);
      setShouldAutoPlay(true); // <-- set to true on user click
    }
  };

  const handlePackPlayClick = (pack: any) => {
    if (currentPlayingPack?._id === pack._id) {
      setCurrentPlayingPack(null);
      setCurrentPlayingMelody(null);
      setIsAudioPlayerVisible(false);
    } else {
      const packToPlay = {
        id: pack._id,
        _id: pack._id,
        name: pack.title,
        producer: pack.producer,
        image: pack.thumbnail_image,
        audio: pack.audio_path || pack.audio,
        audioUrl: pack.audio_path || pack.audio,
        bpm: pack.bpm || 120,
        key: pack.key || "C Maj",
        genre: pack.genre || "Unknown",
        artistType: "Producer",
      };

      setCurrentPlayingPack(packToPlay);
      setCurrentPlayingMelody(null);
      setIsAudioPlayerVisible(true);
    }
  };

  return (
    <>
      {isLoadingPacks || isLoadingMelodies ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="text-2xl text-emerald-500 animate-spin" />
        </div>
      ) : (
        <Layout>
          <div
            className={`min-h-screen bg-gradient-to-b from-black to-zinc-900/50 ${
              isAudioPlayerVisible ? "pb-12" : ""
            }`}
          >
            {/* Back Button */}
            <div className="mx-auto max-w-7xl px-4 py-8">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white"
                asChild
              >
                <Link href="/profile" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Profile
                </Link>
              </Button>
            </div>

            {/* Sample Packs Section */}
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Sample Packs
              </h2>
              {packData?.data?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {packData?.data?.map((pack: any) => (
                    <div
                      key={pack._id}
                      className="group relative overflow-hidden rounded-xl bg-zinc-800/30 transition-all hover:bg-zinc-800/50"
                    >
                      <Link href={`/product/${pack._id}`} className="block">
                        <div className="relative aspect-square">
                          <Image
                            src={pack?.thumbnail_image || "/placeholder.svg"}
                            alt={pack.title}
                            fill
                            className="object-cover transition-all group-hover:scale-105 group-hover:opacity-75"
                          />
                          {/* Play button on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePackPlayClick(pack);
                              }}
                              className="rounded-full bg-emerald-500/90 p-3 text-black hover:bg-emerald-500"
                            >
                              {currentPlayingPack?._id === pack._id ? (
                                <Pause className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="mb-1 text-sm sm:text-base font-medium text-white group-hover:text-emerald-500 line-clamp-1">
                            {pack?.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-emerald-500">
                            {pack?.producer}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm sm:text-base font-bold text-white">
                              ${pack?.price.toFixed(2)}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.location.href = `/new-pack?edit=${pack._id}`;
                                }}
                                className="text-xs sm:text-sm bg-emerald-500/10 text-emerald-500 hover:bg-emerald-600 hover:text-black transition-colors"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeleteModalOpen(true);
                                  setPackToDelete(pack);
                                }}
                                className="bg-red-500 text-white"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-500 text-center">
                  Your sample crate is empty. Time to fill it up
                </p>
              )}
            </div>

            {/* Melodies Section */}
            <div className="mx-auto max-w-7xl px-4 py-8">
              <h2 className="text-2xl font-bold text-white mb-6">Melodies</h2>

              {/* Search Input */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Search melodies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Melodies Table */}
              <MelodiesItemsTable
                melodies={filteredMelodies}
                currentPlayingMelody={currentPlayingMelody}
                onPlayClick={handlePlayClick}
                onEditClick={(melodyId) => {
                  router.push(`/upload?edit=${melodyId}`);
                }}
                onDeleteClick={(melody) => {
                  setMelodyToDelete(melody);
                  setDeleteModalOpen(true);
                }}
                currentTime={currentTime}
                duration={duration}
                currentMelodyId={currentMelodyId}
              />
            </div>

            {/* Audio Player */}
            {isAudioPlayerVisible &&
              (currentPlayingMelody || currentPlayingPack) && (
                <AudioPlayer
                  key={
                    (currentPlayingMelody || currentPlayingPack)?.audioUrl ||
                    (currentPlayingMelody || currentPlayingPack)?._id
                  }
                  isVisible={isAudioPlayerVisible}
                  melody={currentPlayingMelody || currentPlayingPack}
                  shouldAutoPlay={shouldAutoPlay}
                  onClose={() => {
                    setCurrentPlayingMelody(null);
                    setCurrentPlayingPack(null);
                    setIsAudioPlayerVisible(false);
                    setShouldAutoPlay(false);
                  }}
                />
              )}
          </div>

          <DeleteModal
            isOpen={deleteModalOpen}
            itemToDelete={packToDelete || melodyToDelete}
            isDeleting={isDeleting || isDeletingMelody}
            onCancel={() => {
              setDeleteModalOpen(false);
              setPackToDelete(null);
              setMelodyToDelete(null);
            }}
            onConfirm={() => {
              if (packToDelete) {
                handleDeleteConfirm();
              } else if (melodyToDelete) {
                handleDeleteConfirmMelody();
              }
            }}
          />
        </Layout>
      )}
    </>
  );
}
