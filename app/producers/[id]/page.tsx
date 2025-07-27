"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Instagram,
  Youtube,
  Music2,
  Users,
  MapPin,
  ExternalLink,
  Play,
  Pause,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/audio-player";
import Layout from "@/components/layout";
import { MelodiesTable } from "@/components/melodies-table";
import Skeleton from "react-loading-skeleton";
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";
import {
  useFollowUnFollowProducerMutation,
  useGetUserProfileQuery,
} from "@/app/store/api/userManagementApis/userManagementApis";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [activeSection, setActiveSection] = useState<"packs" | "discography">(
    "packs"
  );
  const [playingPackId, setPlayingPackId] = useState<number | null>(null);
  const { data: user, refetch: refetchUser } = useLoggedInUserQuery(null);
  console.log("user", user);
  const userId = user?.data?._id;
  const { id } = useParams();

  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    refetch: refetchUserProfile,
  } = useGetUserProfileQuery(id as string);
  console.log("userProfile", userProfile);
  const [followUnFollowProducer, { isLoading: isFollowingLoading }] =
    useFollowUnFollowProducerMutation();

  const isFollowing = user?.data?.following.includes(id as string);

  const userData = userProfile?.data?.userData;
  console.log("userData", userData);

  const melodies = userProfile?.data?.melodies;
  console.log("melodies", melodies);
  const premiumPacks = userProfile?.data?.packs;
  console.log("packs", premiumPacks);

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

  const handleFollowUnFollowProducer = async () => {
    await followUnFollowProducer({ userId, producerId: id as string });
    refetchUser();
    refetchUserProfile();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900/50">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full overflow-hidden">
          {isUserProfileLoading && (
            <Skeleton
              height={400}
              width="100%"
              highlightColor="#27272a"
              className="mb-4"
            />
          )}
          {!isUserProfileLoading && (
            <>
              {/* Banner Image */}
              <Image
                src={userData?.profile_image}
                alt="Profile Banner"
                fill
                className="object-cover"
                priority
              />
            </>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

          {/* Profile Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                {/* Profile Image and Follow Button */}
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="relative w-28 h-28 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-black shadow-[0_0_40px_rgba(0,0,0,0.3)] -mt-8 md:-mt-24">
                    <Image
                      src={
                        userData?.profile_image ||
                        "/images/profiles/banner-profile.jpg"
                      }
                      alt="Thunder Beatz"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {userId !== id && (
                    <Button
                      className={`bg-emerald-500 text-black hover:bg-emerald-600 w-full px-8 h-10 md:h-11 min-w-[180px] md:min-w-[200px] ${
                        isFollowing
                          ? "bg-zinc-400 hover:bg-zinc-50 font-bold"
                          : "bg-emerald-500 hover:bg-emerald-600"
                      }`}
                      onClick={() => handleFollowUnFollowProducer()}
                    >
                      {isFollowingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4 mb-3 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <h1 className="text-2xl md:text-5xl font-bold text-white capitalize">
                        {userData?.producer_name || "John Doe"}
                      </h1>
                      <div className="relative w-5 h-5 md:w-7 md:h-7 mt-0.5 md:mt-1">
                        <Image
                          src="/verified-badge.png"
                          alt="Verified Producer"
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs md:text-sm font-medium">
                        Verified Producer
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-sm md:text-base text-zinc-300">
                    <div className="hidden md:flex items-center gap-2">
                      <Music2 className="w-4 h-4 text-emerald-500" />
                      <span>{userData?.melodiesCounter || "0"} Melodies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>{userData?.followersCounter || "0"} Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{userData?.country || "N/A"}</span>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="hidden md:flex justify-center md:justify-start gap-2 mt-6">
                    <Link
                      href="https://instagram.com"
                      target="_blank"
                      className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </Link>
                    <Link
                      href="https://youtube.com"
                      target="_blank"
                      className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </Link>
                    <Link
                      href="https://beatstars.com"
                      target="_blank"
                      className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12">
          {/* Bio Section */}
          <div className="mb-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-lg text-zinc-300 leading-relaxed">
                {userData?.about || "N/A"}
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <Link
                    href="/profile/discography"
                    className="flex items-center gap-2"
                  >
                    View Discography
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Premium Packs Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 ">
              <span className="capitalize"> {userData?.producer_name}</span> 's
              Premium Packs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {premiumPacks?.map((pack: any) => (
                <Link
                  key={pack._id}
                  href=""
                  className="group relative block overflow-hidden rounded-xl bg-zinc-800/30 transition-all hover:bg-zinc-800/50"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={pack.thumbnail_image}
                      alt={pack.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Play/Pause Button */}
                    <button
                      onClick={() => handlePackPlayClick(pack)}
                      className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform translate-y-1 group-hover:translate-y-0"
                    >
                      {playingPackId === pack?._id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 translate-x-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white group-hover:text-emerald-500 line-clamp-1">
                      {pack?.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-emerald-500">
                      ${pack?.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-zinc-800/30">
            {melodies?.length > 0 && <MelodiesTable melodies={melodies} />}
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
        />
      </div>
    </Layout>
  );
}
