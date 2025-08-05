"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { Card } from "@/components/ui/card";
import { MelodiesTable } from "@/components/melodies-table";
import { SamplePackCard } from "@/components/sample-pack-card";
import { AudioPlayer } from "@/components/audio-player";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import {
  useFavoritePackMutation,
} from "../store/api/packApis/packApis";
import { useGetUserFavoriteMelodiesQuery } from "../store/api/userManagementApis/userManagementApis";
import { useMelodyPlayMutation, useMelodyDownloadMutation, useFavoriteMelodyMutation } from "@/app/store/api/melodyApis/melodyApis";
import { useAudioContext } from "@/components/audio-context";

export default function FavoritesPage() {
  const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [playingPackId, setPlayingPackId] = useState<number | null>(null);

  const { data: user, refetch: refetchUser } = useLoggedInUser();
  const userId = user?.data?._id;
  
  const { data: favoritedata, refetch: refetchFavorites } =
    useGetUserFavoriteMelodiesQuery({ userId }, { skip: !userId });

  const melodies = favoritedata?.data?.melodies || [];
  const packs = favoritedata?.data?.packs || [];

  const [favorite] = useFavoritePackMutation();
  const [melodyPlayCounter] = useMelodyPlayMutation();
  const [melodyDownloadCounter] = useMelodyDownloadMutation();
  const [favoriteMelody] = useFavoriteMelodyMutation();

  const handleFavoriteClick = async (packId: string) => {
    try {
      await favorite({ id: packId, userId: userId });
      await Promise.all([refetchUser(), refetchFavorites()]);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  
  const isPackFavorite = (packId: string) => {
    return user?.data?.favourite_packs?.includes(packId) || false;
  };

  const isMelodyFavorite = (melodyId: string) => {
    return user?.data?.favourite_melodies?.includes(melodyId) || false;
  };

  const toggleFavorite = async (melodyId: string) => {
    if (melodyId && userId) {
      await favoriteMelody({ id: melodyId, userId: userId }).unwrap();
      await Promise.all([refetchUser(), refetchFavorites()]);
    }
  };

  const handlePlayClick = async (melody: any) => {
    if (currentPlayingMelody?._id === melody._id) {
      setCurrentPlayingMelody(null);
      setCurrentPlayingPack(null);
      setIsAudioPlayerVisible(false);
      setShouldAutoPlay(false);
    } else {
      try {
        const response = await melodyPlayCounter(melody._id).unwrap();
        console.log("melodyPlayCounter", response);
      } catch (error) {
        console.log("error", error);
      }
      
      const melodyToPlay = {
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
      setShouldAutoPlay(true);
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

      console.log("Playing pack:", packToPlay);
      setCurrentPlayingPack(packToPlay);
      setCurrentPlayingMelody(null);
      setIsAudioPlayerVisible(true);
    }
  };

  const handleDownloadClick = async (melody: any) => {
    try {
      const response = await melodyDownloadCounter(melody._id).unwrap();
      console.log("melodyDownloadCounter", response);
      
      const audioUrl = melody.audioUrl;  
      if (audioUrl) {
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = audioUrl.split('/').pop(); 
        link.click();
      } else {
        console.error("No audio URL found!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const { currentTime, duration, currentMelodyId } = useAudioContext();

  const playNextMelody = () => {
    if (!currentPlayingMelody) return;

    const currentIndex = melodies.findIndex(
      (melody: any) => melody._id === currentPlayingMelody._id
    );

    if (currentIndex < melodies.length - 1) {
      const nextMelody = melodies[currentIndex + 1];
      handlePlayClick(nextMelody);
    }
  };

  const playPreviousMelody = () => {
    if (!currentPlayingMelody) return;

    const currentIndex = melodies.findIndex(
      (melody: any) => melody._id === currentPlayingMelody._id
    );

    if (currentIndex > 0) {
      const previousMelody = melodies[currentIndex - 1];
      handlePlayClick(previousMelody);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isAudioPlayerVisible) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          playNextMelody();
          break;
        case 'ArrowUp':
          event.preventDefault();
          playPreviousMelody();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPlayingMelody, isAudioPlayerVisible]);

  useEffect(() => {
    if (userId) {
      refetchFavorites();
    }
  }, [userId, refetchFavorites]);

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
            <p className="mt-2 text-zinc-400">
              Your favorite melodies and packs in one place.
            </p>
          </div>

          {/* Favorite Sample Packs Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Favorite Packs
            </h2>
            {packs.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">
                No favorite packs yet. Start exploring to add some!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {packs.map((pack: any) => (
                  <SamplePackCard
                    key={pack._id}
                    title={pack.title}
                    producer={pack.producer}
                    price={pack.price}
                    imageUrl={pack.thumbnail_image}
                    isFavorite={isPackFavorite(pack._id)}
                    id={pack._id}
                    handleFavoriteClick={() => handleFavoriteClick(pack._id)}
                    onPlayClick={() => handlePackPlayClick(pack)}
                    isPlaying={currentPlayingPack?._id === pack._id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Favorite Melodies Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Favorite Melodies
            </h2>
            <Card className="border-0 bg-[#0F0F0F] overflow-hidden">
              {melodies.length === 0 ? (
                <p className="text-zinc-400 text-center py-8">
                  No favorite melodies yet. Start exploring to add some!
                </p>
              ) : (
                <MelodiesTable 
                  melodies={melodies} 
                  onPlayClick={handlePlayClick}
                  onDownloadClick={handleDownloadClick}
                  onFavoriteClick={toggleFavorite}
                  isFavorite={isMelodyFavorite}
                  currentPlayingMelody={currentPlayingMelody}
                  currentTime={currentTime}
                  duration={duration}
                  currentMelodyId={currentMelodyId}
                />
              )}
            </Card>
          </div>
        </div>

        {/* Audio Player */}
        <AudioPlayer
          key={currentPlayingMelody?.audioUrl || currentPlayingPack?.audioUrl}
          isVisible={isAudioPlayerVisible}
          melody={currentPlayingMelody || currentPlayingPack}
          shouldAutoPlay={shouldAutoPlay}
          onClose={() => {
            setCurrentPlayingMelody(null);
            setCurrentPlayingPack(null);
            setIsAudioPlayerVisible(false);
            setShouldAutoPlay(false);
          }}
          isFavorite={
            currentPlayingMelody
              ? isMelodyFavorite(currentPlayingMelody._id)
              : false
          }
          onFavoriteClick={(melodyId) => toggleFavorite(melodyId)}
          playNextMelody={playNextMelody}
          playPreviousMelody={playPreviousMelody}
          onEnded={playNextMelody}
          handleDownloadClick={handleDownloadClick}
        />
      </div>
    </Layout>
  );
}
