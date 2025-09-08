"use client";

import { useState, useEffect } from "react";
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
  Download,
  Heart,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  ArrowUpDown,
  TrendingUp,
  Clock,
  Shuffle,
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
import {
  useMelodyPlayMutation,
  useMelodyDownloadMutation,
  useFavoriteMelodyMutation,
} from "@/app/store/api/melodyApis/melodyApis";
import { WaveformDisplay } from "@/components/waveform-display";
import { useAudioContext } from "@/components/audio-context";
import { CollabModal } from "@/components/collab-modal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { Pagination } from "@/components/ui/pagination";
import BpmFilter from "@/components/bpm-filter";
import { KeySelector } from "@/components/key-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useGetDiscographyQuery } from "@/app/store/api/discographyApis/discographyApis";

export default function ProfilePage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [selectedMelody, setSelectedMelody] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPacksPage, setCurrentPacksPage] = useState(1);
  const itemsPerPage = 20;
  const packsPerPage = 10;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedArtistType, setSelectedArtistType] = useState("");
  const [bpmFilter, setBpmFilter] = useState<{
    type: "exact" | "range";
    min?: number;
    max?: number;
  } | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
    type: "popular" | "recent" | "random" | "default";
  }>({
    key: "",
    direction: "desc",
    type: "popular",
  });

  // Popover states
  const [genrePopoverOpen, setGenrePopoverOpen] = useState(false);
  const [keyPopoverOpen, setKeyPopoverOpen] = useState(false);
  const [artistTypePopoverOpen, setArtistTypePopoverOpen] = useState(false);

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
  const userId = user?.data?._id;
  const { id } = useParams();

  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    refetch: refetchUserProfile,
  } = useGetUserProfileQuery(id as string);
  const [followUnFollowProducer, { isLoading: isFollowingLoading }] =
    useFollowUnFollowProducerMutation();

  const { data: discography } = useGetDiscographyQuery(id as string);
  const discographyData = discography?.data || [];

  const [melodyPlayCounter] = useMelodyPlayMutation();
  const [melodyDownloadCounter] = useMelodyDownloadMutation();
  const [favoriteMelody] = useFavoriteMelodyMutation();

  const isFollowing = user?.data?.following.includes(id as string);

  const userData = userProfile?.data?.userData;

  const melodies = userProfile?.data?.melodies;
  const premiumPacks = userProfile?.data?.packs;

  // Pagination logic for packs
  const totalPacks = premiumPacks?.length || 0;
  const totalPacksPages = Math.ceil(totalPacks / packsPerPage);
  const packsStartIndex = (currentPacksPage - 1) * packsPerPage;
  const packsEndIndex = packsStartIndex + packsPerPage;
  const currentPacks =
    premiumPacks?.slice(packsStartIndex, packsEndIndex) || [];

  const handlePacksPageChange = (page: number) => {
    setCurrentPacksPage(page);
  };

  // Extract unique genres and artist types from melodies
  const genres = Array.from(
    new Set(
      melodies?.flatMap((m: any) => {
        if (Array.isArray(m.genre)) {
          return m.genre;
        }
        return m.genre ? [m.genre] : [];
      }) || []
    )
  );
  const artistTypes = Array.from(
    new Set(
      melodies?.flatMap((m: any) => {
        if (Array.isArray(m.artistType)) {
          return m.artistType;
        }
        return m.artistType ? [m.artistType] : [];
      }) || []
    )
  );

  // Filter and sort melodies
  const filteredAndSortedMelodies = [...(melodies || [])]
    .filter((melody) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const melodyNameLower = melody.name.toLowerCase();
        const producerNameLower = melody.producer.toLowerCase();

        if (
          !melodyNameLower.includes(searchLower) &&
          !producerNameLower.includes(searchLower)
        ) {
          return false;
        }
      }

      if (selectedKey && melody.key !== selectedKey) {
        return false;
      }

      if (selectedGenre) {
        if (Array.isArray(melody.genre)) {
          if (!melody.genre.includes(selectedGenre)) {
            return false;
          }
        } else if (melody.genre !== selectedGenre) {
          return false;
        }
      }

      if (selectedArtistType) {
        if (Array.isArray(melody.artistType)) {
          if (!melody.artistType.includes(selectedArtistType)) {
            return false;
          }
        } else if (melody.artistType !== selectedArtistType) {
          return false;
        }
      }

      if (bpmFilter) {
        if (bpmFilter.type === "exact" && bpmFilter.min) {
          if (melody.bpm !== bpmFilter.min) {
            return false;
          }
        } else if (
          bpmFilter.type === "range" &&
          bpmFilter.min &&
          bpmFilter.max
        ) {
          if (melody.bpm < bpmFilter.min || melody.bpm > bpmFilter.max) {
            return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortConfig.type === "random") {
        return Math.random() - 0.5;
      }

      if (sortConfig.type === "recent") {
        const dateA = new Date(a.uploadDate || "").getTime();
        const dateB = new Date(b.uploadDate || "").getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (sortConfig.type === "popular") {
        return sortConfig.direction === "asc"
          ? a.plays - b.plays
          : b.plays - a.plays;
      }

      if (sortConfig.key === "bpm") {
        return sortConfig.direction === "asc" ? a.bpm - b.bpm : b.bpm - a.bpm;
      }

      const aValue = String(
        a[sortConfig.key as keyof typeof a] || ""
      ).toLowerCase();
      const bValue = String(
        b[sortConfig.key as keyof typeof b] || ""
      ).toLowerCase();

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Pagination logic
  const totalItems = filteredAndSortedMelodies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMelodies = filteredAndSortedMelodies.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter handlers
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    setSortConfig((currentConfig) => {
      if (currentConfig.key === field) {
        return {
          ...currentConfig,
          direction: currentConfig.direction === "asc" ? "desc" : "asc",
          type: "default",
        };
      }

      return {
        key: field,
        direction: "asc",
        type: "default",
      };
    });
    setCurrentPage(1);
  };

  const handleSortByType = (type: "popular" | "recent" | "random") => {
    setSortConfig({
      key: "",
      direction: "desc",
      type,
    });
    setCurrentPage(1);
  };

  const handleBpmFilterApply = (values: {
    type: "exact" | "range";
    min?: number;
    max?: number;
  }) => {
    setBpmFilter(values);
    setCurrentPage(1);
  };

  const handleBpmFilterClear = () => {
    setBpmFilter(null);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? "" : genre);
    setCurrentPage(1);
    setGenrePopoverOpen(false);
  };

  const handleArtistTypeSelect = (type: string) => {
    setSelectedArtistType(type === selectedArtistType ? "" : type);
    setCurrentPage(1);
    setArtistTypePopoverOpen(false);
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedKey("");
    setSelectedGenre("");
    setSelectedArtistType("");
    setBpmFilter(null);
    setCurrentPage(1);
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
      } catch (error) {
        console.error("Error playing melody:", error);
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

  const isMelodyFavorite = (melodyId: string) => {
    return user?.data?.favourite_melodies?.includes(melodyId) || false;
  };

  const toggleFavorite = async (melodyId: string) => {
    if (melodyId && userId) {
      await favoriteMelody({ id: melodyId, userId: userId }).unwrap();
      await Promise.all([refetchUser(), refetchUserProfile()]);
    }
  };

  const handleDownloadClick = async (melody: any) => {
    setSelectedMelody(melody);
    setIsCollabModalOpen(true);
  };

  const { currentTime, duration, currentMelodyId } = useAudioContext();

  const playNextMelody = () => {
    if (!currentPlayingMelody) return;

    const currentIndex = filteredAndSortedMelodies.findIndex(
      (melody: any) => melody._id === currentPlayingMelody._id
    );

    if (currentIndex < filteredAndSortedMelodies.length - 1) {
      const nextMelody = filteredAndSortedMelodies[currentIndex + 1];
      handlePlayClick(nextMelody);
    }
  };

  const playPreviousMelody = () => {
    if (!currentPlayingMelody) return;

    const currentIndex = filteredAndSortedMelodies.findIndex(
      (melody: any) => melody._id === currentPlayingMelody._id
    );

    if (currentIndex > 0) {
      const previousMelody = filteredAndSortedMelodies[currentIndex - 1];
      handlePlayClick(previousMelody);
    }
  };

  const handleFollowUnFollowProducer = async () => {
    await followUnFollowProducer({ userId, producerId: id as string });
    refetchUser();
    refetchUserProfile();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isAudioPlayerVisible) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          playNextMelody();
          break;
        case "ArrowUp":
          event.preventDefault();
          playPreviousMelody();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPlayingMelody, isAudioPlayerVisible]);

  return (
    <Layout>
      {isUserProfileLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-emerald-500 animate-spin">
            <AiOutlineLoading3Quarters size={32} />
          </div>
        </div>
      ) : (
        <div
          className={`${
            isAudioPlayerVisible ? "mb-10" : ""
          } min-h-screen bg-gradient-to-b from-black to-zinc-900/50`}
        >
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
                            ? "bg-emerald-500 hover:bg-emerald-600 font-bold"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                        onClick={() => handleFollowUnFollowProducer()}
                      >
                        {isFollowingLoading && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
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
                          {userData?.isPro && (
                            <Image
                              src="/verified-badge.png"
                              alt="Verified Producer"
                              width={28}
                              height={28}
                              className="object-contain"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {userData?.isPro && (
                          <span className="px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs md:text-sm font-medium md:-mt-11">
                            Verified Producer
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-sm md:text-base text-zinc-300">
                      <div className="hidden md:flex items-center gap-2">
                        <Music2 className="w-4 h-4 text-emerald-500" />
                        <span>{userData?.melodiesCounter || "0"} Melodies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-500" />
                        <span>
                          {userData?.followersCounter || "0"} Followers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{userData?.country || "N/A"}</span>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="hidden md:flex justify-center md:justify-start gap-2 mt-6">
                      {userData?.instagramUsername && (
                        <Link
                          href={`https://instagram.com/${userData?.instagramUsername}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                        </Link>
                      )}
                      {userData?.youtubeUsername && (
                        <Link
                          href={`https://youtube.com/@${userData?.youtubeUsername}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <Youtube className="w-5 h-5" />
                        </Link>
                      )}
                      {userData?.tiktokUsername && (
                        <Link
                          href={`https://tiktok.com/@${userData?.tiktokUsername}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <FaTiktok className="w-5 h-5" />
                        </Link>
                      )}
                      {userData?.beatstarsUsername && (
                        <Link
                          href={`https://beatstars.com/${userData?.beatstarsUsername}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      )}
                      {discographyData?.length > 0 && (
                        <div className=" inline">
                          <Button
                            asChild
                            variant="outline"
                            className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                          >
                            <Link
                              href={`/profile/discography/${id}`}
                              className="flex items-center gap-2"
                            >
                              View Discography
                            </Link>
                          </Button>
                        </div>
                      )}
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
            
              </div>
            </div>

            {/* Premium Packs Section */}
            {premiumPacks?.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    <span className="capitalize">
                      {" "}
                      {userData?.producer_name}
                    </span>{" "}
                    's Premium Packs
                  </h2>
                  {totalPacks > packsPerPage && (
                    <div className="text-sm text-zinc-400">
                      Showing {packsStartIndex + 1} to{" "}
                      {Math.min(packsEndIndex, totalPacks)} of {totalPacks}{" "}
                      packs
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {currentPacks?.map((pack: any) => (
                    <Link
                      key={pack._id}
                      href={`/product/${pack._id}`}
                      className="group relative block overflow-hidden rounded-xl bg-zinc-800/30 transition-all hover:bg-zinc-800/50"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={pack.thumbnail_image}
                          alt={pack.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Play/Pause Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 flex-shrink-0 rounded-full ${
                            currentPlayingPack?.id === pack._id
                              ? "bg-emerald-500 text-black hover:bg-emerald-600"
                              : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                          }`}
                          onClick={() => handlePackPlayClick(pack)}
                        >
                          {currentPlayingPack?.id === pack._id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
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

                {/* Packs Pagination */}
                {totalPacksPages > 1 && (
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePacksPageChange(currentPacksPage - 1)
                          }
                          disabled={currentPacksPage === 1}
                          className="h-8 px-3 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MdKeyboardArrowLeft />
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPacksPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPacksPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPacksPage <= 3) {
                                pageNum = i + 1;
                              } else if (
                                currentPacksPage >=
                                totalPacksPages - 2
                              ) {
                                pageNum = totalPacksPages - 4 + i;
                              } else {
                                pageNum = currentPacksPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    currentPacksPage === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePacksPageChange(pageNum)}
                                  className={`h-8 w-8 p-0 ${
                                    currentPacksPage === pageNum
                                      ? "bg-emerald-500 text-black hover:bg-emerald-600"
                                      : "border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800"
                                  }`}
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePacksPageChange(currentPacksPage + 1)
                          }
                          disabled={currentPacksPage === totalPacksPages}
                          className="h-8 px-3 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MdKeyboardArrowRight />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Melodies Section with Filters */}
            {melodies?.length > 0 && (
              <div className="mt-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    <span className="capitalize">
                      {userData?.producer_name}
                    </span>
                    's Melodies
                  </h2>

                  {/* Search Bar */}
                  <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search melodies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-black hover:bg-emerald-600"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 text-sm font-medium"
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {sortConfig.type === "popular"
                            ? "Most Popular"
                            : sortConfig.type === "recent"
                            ? "Most Recent"
                            : sortConfig.type === "random"
                            ? "Random"
                            : "Sort By"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuItem
                          onClick={() => handleSortByType("popular")}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Most Popular
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSortByType("recent")}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Most Recent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSortByType("random")}
                        >
                          <Shuffle className="mr-2 h-4 w-4" />
                          Random
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Popover
                    open={genrePopoverOpen}
                    onOpenChange={setGenrePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                      >
                        {selectedGenre || "GENRES"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="center">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {genres.map((genre) => (
                              <CommandItem
                                key={genre as string}
                                onSelect={() =>
                                  handleGenreSelect(genre as string)
                                }
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <div
                                  className={`flex-1 ${
                                    selectedGenre === genre
                                      ? "text-emerald-500"
                                      : "text-white"
                                  }`}
                                >
                                  {genre as string}
                                </div>
                                {selectedGenre === genre && (
                                  <Check className="h-4 w-4 text-emerald-500" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <BpmFilter
                    onApply={handleBpmFilterApply}
                    onClear={handleBpmFilterClear}
                  />

                  <Popover
                    open={keyPopoverOpen}
                    onOpenChange={setKeyPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                      >
                        {selectedKey || "KEY"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="center">
                      <KeySelector
                        value={selectedKey}
                        onChange={(key) => {
                          setSelectedKey(key);
                          setCurrentPage(1);
                          setKeyPopoverOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover
                    open={artistTypePopoverOpen}
                    onOpenChange={setArtistTypePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                      >
                        {selectedArtistType || "ARTIST TYPE"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="center">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {artistTypes.map((type) => (
                              <CommandItem
                                key={type as string}
                                onSelect={() =>
                                  handleArtistTypeSelect(type as string)
                                }
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <div
                                  className={`flex-1 ${
                                    selectedArtistType === type
                                      ? "text-emerald-500"
                                      : "text-white"
                                  }`}
                                >
                                  {type as string}
                                </div>
                                {selectedArtistType === type && (
                                  <Check className="h-4 w-4 text-emerald-500" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                    className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800"
                  >
                    Clear Filters
                  </Button>
                </div>
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#0F0F0F]">
                  <div className="overflow-x-auto">
                    {/* Desktop Table */}
                    <table className="w-full hidden md:table">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/50">
                          <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400"></th>
                          <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400"></th>
                          <th
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center gap-1">
                              NAME
                              <ChevronUp
                                className={`h-3 w-3 transition-transform ${
                                  sortConfig.key === "name"
                                    ? "text-emerald-500"
                                    : "text-zinc-600"
                                } ${
                                  sortConfig.key === "name" &&
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                            WAVEFORM
                          </th>
                          <th
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                            onClick={() => handleSort("bpm")}
                          >
                            <div className="flex items-center gap-1">
                              BPM
                              <ChevronUp
                                className={`h-3 w-3 transition-transform ${
                                  sortConfig.key === "bpm"
                                    ? "text-emerald-500"
                                    : "text-zinc-600"
                                } ${
                                  sortConfig.key === "bpm" &&
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                            onClick={() => handleSort("key")}
                          >
                            <div className="flex items-center gap-1">
                              KEY
                              <ChevronUp
                                className={`h-3 w-3 transition-transform ${
                                  sortConfig.key === "key"
                                    ? "text-emerald-500"
                                    : "text-zinc-600"
                                } ${
                                  sortConfig.key === "key" &&
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                            onClick={() => handleSort("genre")}
                          >
                            <div className="flex items-center gap-1">
                              GENRE
                              <ChevronUp
                                className={`h-3 w-3 transition-transform ${
                                  sortConfig.key === "genre"
                                    ? "text-emerald-500"
                                    : "text-zinc-600"
                                } ${
                                  sortConfig.key === "genre" &&
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </th>
                          <th
                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                            onClick={() => handleSort("artistType")}
                          >
                            <div className="flex items-center gap-1">
                              ARTIST TYPE
                              <ChevronUp
                                className={`h-3 w-3 transition-transform ${
                                  sortConfig.key === "artistType"
                                    ? "text-emerald-500"
                                    : "text-zinc-600"
                                } ${
                                  sortConfig.key === "artistType" &&
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMelodies.map((melody: any) => (
                          <tr
                            key={melody._id}
                            className="border-b border-zinc-800 hover:bg-zinc-900/30"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-full ${
                                  currentPlayingMelody?._id === melody._id
                                    ? "bg-emerald-500 text-black hover:bg-emerald-600"
                                    : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                }`}
                                onClick={() => handlePlayClick(melody)}
                              >
                                {currentPlayingMelody?._id === melody._id ? (
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
                                    "/images/default-melody.png"
                                  }
                                  alt={melody?.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                              {melody?.name?.slice(0, 18)}...
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <WaveformDisplay
                                audioUrl={melody.audioUrl}
                                isPlaying={
                                  currentPlayingMelody?._id === melody._id
                                }
                                onPlayPause={() => handlePlayClick(melody)}
                                height={30}
                                width="200px"
                                isControlled={true}
                                currentTime={
                                  currentMelodyId === melody._id
                                    ? currentTime
                                    : 0
                                }
                                duration={
                                  currentMelodyId === melody._id ? duration : 0
                                }
                              />
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                              {melody?.bpm}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                              {melody?.key}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                              {Array.isArray(melody?.genre)
                                ? melody.genre.join(", ")
                                : melody?.genre}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                              {Array.isArray(melody?.artistType)
                                ? melody.artistType.join(", ")
                                : melody?.artistType}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 text-zinc-400 hover:text-red-500 ${
                                    isMelodyFavorite(melody?._id)
                                      ? "text-red-500"
                                      : ""
                                  }`}
                                  onClick={() => toggleFavorite(melody?._id)}
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      isMelodyFavorite(melody._id)
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-zinc-400 hover:text-white"
                                  onClick={() => handleDownloadClick(melody)}
                                >
                                  <Download className="h-4 w-4" />
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
                        {currentMelodies.map((melody: any) => (
                          <tr
                            key={melody?._id}
                            className="border-b border-zinc-800 hover:bg-zinc-900/30"
                          >
                            <td className="px-4 py-3 flex items-center gap-3">
                              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={
                                    melody?.userId?.profile_image ||
                                    "/images/default-melody.png"
                                  }
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
                                onClick={() => handlePlayClick(melody)}
                              >
                                {currentPlayingMelody?._id === melody._id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {melody.name}
                                </p>
                                <p className="text-xs text-zinc-400 truncate mt-0.5">
                                  {melody?.producer?.slice(0, 20)}...
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-red-500 ${
                                    isMelodyFavorite(melody?._id)
                                      ? "text-red-500"
                                      : ""
                                  }`}
                                  onClick={() => toggleFavorite(melody?._id)}
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      isMelodyFavorite(melody?._id)
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-white"
                                  onClick={() => handleDownloadClick(melody)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 mb-24">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              </div>
            )}
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
          {selectedMelody && (
            <CollabModal
              melodyDownloadCounter={melodyDownloadCounter}
              isOpen={isCollabModalOpen}
              onClose={() => setIsCollabModalOpen(false)}
              melodyData={selectedMelody}
            />
          )}
        </div>
      )}
    </Layout>
  );
}
