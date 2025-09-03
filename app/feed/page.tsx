"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Download,
  Play,
  Pause,
  MoreVertical,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";
import { CollabModal } from "@/components/collab-modal";
import BpmFilter from "@/components/bpm-filter";
import { AudioPlayer } from "@/components/audio-player";
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
import { Pagination } from "@/components/ui/pagination";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useLoggedInUserQuery } from "../store/api/authApis/authApi";
import { useFollowingProducerContentQuery } from "../store/api/userManagementApis/userManagementApis";
import {
  useFavoriteMelodyMutation,
  useMelodyDownloadMutation,
  useMelodyPlayMutation,
} from "../store/api/melodyApis/melodyApis";
import { toast } from "sonner";
import { WaveformDisplay } from "@/components/waveform-display";
import { useAudioContext } from "@/components/audio-context";

interface AudioItem {
  id: number;
  name: string;
  producer: string;
  waveform: string;
  bpm: number;
  key: string;
  image: string;
  _id?: string;
  audioUrl?: string;
  artistType?: string;
  genre?: string;
  plays?: number;
  downloads?: number;
  favorites?: number;
  createdAt?: string;
  userId?: {
    _id: string;
    producer_name: string;
    email: string;
    profile_image: string;
  };
}

interface Pack extends Omit<AudioItem, "name" | "userId"> {
  title: string;
  price: number;
  date: string;
  thumbnail_image: string;
  userId: {
    _id: string;
  };
}

interface Melody extends AudioItem {
  genre: string;
  artistType: string;
}

interface CollabModalData {
  name: string;
  splitPercentage: string;
  producerName: string;
  beatstarsUsername: string;
  soundeeUsername?: string;
  instagramUsername: string;
  youtubeChannel: string;
}

export default function FeedPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentMelodiesPage, setCurrentMelodiesPage] = useState(1); // Changed to 1-based
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [selectedMelody, setSelectedMelody] = useState<CollabModalData | null>(
    null
  );
  const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [favoriteMelodies, setFavoriteMelodies] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedArtistType, setSelectedArtistType] = useState("");
  const [selectedPopularity, setSelectedPopularity] = useState("");
  const [bpmFilter, setBpmFilter] = useState<{
    type: "exact" | "range";
    min?: number;
    max?: number;
  } | null>(null);

  // Add these new state variables for controlling filter popovers
  const [popularityPopoverOpen, setPopularityPopoverOpen] = useState(false);
  const [genrePopoverOpen, setGenrePopoverOpen] = useState(false);
  const [keyPopoverOpen, setKeyPopoverOpen] = useState(false);
  const [artistTypePopoverOpen, setArtistTypePopoverOpen] = useState(false);

  const { data: user, refetch: refetchUser } = useLoggedInUserQuery(null);
  const userId = user?.data?._id;

  const {
    data: followingProducerContent,
    isLoading: isFollowingProducerContentLoading,
    refetch,
  } = useFollowingProducerContentQuery({ userId });
  const melodies = followingProducerContent?.data?.melodies || [];
  const packs = followingProducerContent?.data?.packs || [];

  const [favoriteMelody, { isLoading: isFavoriteMelodyLoading }] =
    useFavoriteMelodyMutation();

  const isMelodyFavorite = (melodyId: string) => {
    return user?.data?.favourite_melodies?.includes(melodyId) || false;
  };

  const toogleFavorite = async (melody: any) => {
    if (melody && userId) {
      await favoriteMelody({ id: melody, userId: userId }).unwrap();
      await Promise.all([refetchUser(), refetch()]);
    }
  };

  const [melodyDownloadCounter] = useMelodyDownloadMutation();
  const [melodyPlayCounter] = useMelodyPlayMutation();

  const handleDownloadClick = async (melody: any) => {
    setSelectedMelody(melody);
    setIsCollabModalOpen(true);
  };

  const { currentTime, duration, currentMelodyId } = useAudioContext();

  const playNextMelody = () => {
    if (!currentPlayingMelody) return;

    const currentIndex = filteredAndSortedMelodies.findIndex(
      (melody) => melody._id === currentPlayingMelody._id
    );

    if (currentIndex < filteredAndSortedMelodies.length - 1) {
      const nextMelody = filteredAndSortedMelodies[currentIndex + 1];
      handlePlayClick(nextMelody);
    }
  };

  const playPreviousMelody = () => {
    if (!currentPlayingMelody) return;

    const currentIndex = filteredAndSortedMelodies.findIndex(
      (melody) => melody._id === currentPlayingMelody._id
    );

    if (currentIndex > 0) {
      const previousMelody = filteredAndSortedMelodies[currentIndex - 1];
      handlePlayClick(previousMelody);
    }
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

  const itemsPerPage = 6;
  const melodiesPerPage = 10;

  // Extract unique values for filter options
  const genres = useMemo(() => {
    const uniqueGenres = new Set<string>();
    melodies.forEach((melody: any) => {
      if (melody.genre && Array.isArray(melody.genre)) {
        melody.genre.forEach((g: string) => uniqueGenres.add(g));
      } else if (melody.genre) {
        uniqueGenres.add(melody.genre);
      }
    });
    return Array.from(uniqueGenres).sort();
  }, [melodies]);

  const artistTypes = useMemo(() => {
    const uniqueTypes = new Set<string>();
    melodies.forEach((melody: any) => {
      if (melody.artistType && Array.isArray(melody.artistType)) {
        melody.artistType.forEach((type: string) => uniqueTypes.add(type));
      } else if (melody.artistType) {
        uniqueTypes.add(melody.artistType);
      }
    });
    return Array.from(uniqueTypes).sort();
  }, [melodies]);

  const popularityOptions = [
    { value: "plays", label: "Most Played" },
    { value: "downloads", label: "Most Downloaded" },
    { value: "favorites", label: "Most Favorited" },
    { value: "recent", label: "Recently Added" },
  ];

  const handlePrevious = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNext = () => {
    const maxPage = Math.ceil(packs.length / itemsPerPage) - 1;
    setCurrentPage(Math.min(maxPage, currentPage + 1));
  };

  // Updated pagination handlers for melodies
  const handleMelodiesPageChange = (page: number) => {
    setCurrentMelodiesPage(page);
  };

  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    return packs.slice(start, start + itemsPerPage);
  };

  const getCurrentMelodies = () => {
    const start = (currentMelodiesPage - 1) * melodiesPerPage; // Changed to 1-based
    return filteredAndSortedMelodies.slice(start, start + melodiesPerPage);
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

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Filter and sort melodies
  const filteredAndSortedMelodies = useMemo(() => {
    let filtered = [...melodies];

    // Apply filters
    if (selectedKey) {
      filtered = filtered.filter((melody: any) => melody.key === selectedKey);
    }

    if (selectedGenre) {
      filtered = filtered.filter((melody: any) => {
        if (Array.isArray(melody.genre)) {
          return melody.genre.includes(selectedGenre);
        }
        return melody.genre === selectedGenre;
      });
    }

    if (selectedArtistType) {
      filtered = filtered.filter((melody: any) => {
        if (Array.isArray(melody.artistType)) {
          return melody.artistType.includes(selectedArtistType);
        }
        return melody.artistType === selectedArtistType;
      });
    }

    if (bpmFilter) {
      if (bpmFilter.type === "exact" && bpmFilter.min) {
        filtered = filtered.filter(
          (melody: any) => melody.bpm === bpmFilter.min
        );
      } else if (bpmFilter.type === "range" && bpmFilter.min && bpmFilter.max) {
        filtered = filtered.filter(
          (melody: any) =>
            melody.bpm >= bpmFilter.min! && melody.bpm <= bpmFilter.max!
        );
      }
    }

    // Apply popularity sorting
    if (selectedPopularity) {
      if (selectedPopularity === "recent") {
        filtered.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        filtered.sort((a: any, b: any) => {
          const aValue = a[selectedPopularity] || 0;
          const bValue = b[selectedPopularity] || 0;
          return bValue - aValue;
        });
      }
    } else {
      // Apply regular sorting
      filtered.sort((a: any, b: any) => {
        if (sortConfig.key === "bpm") {
          return sortConfig.direction === "asc" ? a.bpm - b.bpm : b.bpm - a.bpm;
        }

        const aValue =
          a[sortConfig.key as keyof typeof a]?.toString().toLowerCase() || "";
        const bValue =
          b[sortConfig.key as keyof typeof b]?.toString().toLowerCase() || "";

        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    return filtered;
  }, [
    melodies,
    selectedKey,
    selectedGenre,
    selectedArtistType,
    bpmFilter,
    selectedPopularity,
    sortConfig,
  ]);

  const handleBpmFilterApply = (values: {
    type: "exact" | "range";
    min?: number;
    max?: number;
  }) => {
    setBpmFilter(values);
    setCurrentMelodiesPage(1); // Reset to first page
  };

  const handleBpmFilterClear = () => {
    setBpmFilter(null);
    setCurrentMelodiesPage(1); // Reset to first page
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? "" : genre);
    setCurrentMelodiesPage(1); // Reset to first page
    setGenrePopoverOpen(false); // Close the popover after selection
  };

  const handleArtistTypeSelect = (type: string) => {
    setSelectedArtistType(type === selectedArtistType ? "" : type);
    setCurrentMelodiesPage(1); // Reset to first page
    setArtistTypePopoverOpen(false); // Close the popover after selection
  };

  const handlePopularitySelect = (popularity: string) => {
    setSelectedPopularity(popularity === selectedPopularity ? "" : popularity);
    setCurrentMelodiesPage(1); // Reset to first page
    setPopularityPopoverOpen(false); // Close the popover after selection
  };

  const handleClearAllFilters = () => {
    setSelectedKey("");
    setSelectedGenre("");
    setSelectedArtistType("");
    setSelectedPopularity("");
    setBpmFilter(null);
    setCurrentMelodiesPage(1); // Reset to first page
  };

  // Pagination calculations for melodies
  const totalMelodies = filteredAndSortedMelodies.length;
  const totalMelodiesPages = Math.ceil(totalMelodies / melodiesPerPage);

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-8 lg:mt-12">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">
              What&apos;s new from your favorite producers
            </h1>
            <p className="text-zinc-400">
              Here you will find all the new content from your favorite
              producers. You can see the latest melodies they've uploaded and
              the newest sample packs they've released.
            </p>
          </div>

          {/* Latest Products Title */}
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-500">
              Latest Products
            </h2>
          </div>

          {/* Packs Section */}
          <div className="relative px-6 mb-24">
            {/* Mobile Slider */}
            <div className="block md:hidden relative">
              <div className="grid grid-cols-2 gap-4">
                {getCurrentItems()
                  .slice(0, 2)
                  .map((item: Pack) => (
                    <Link
                      key={item._id}
                      className="bg-zinc-950 rounded-xl overflow-hidden group cursor-pointer"
                      href={`/product/${item._id}`}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={item?.thumbnail_image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayClick(item);
                            }}
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-white mb-1">
                          {item.title}
                        </h3>
                        <Link
                          href={`/producers/${item?.userId?._id}`}
                          className="text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-medium"
                        >
                          {item.producer}
                        </Link>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-white">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {/* Mobile Navigation Dots */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {Array.from({
                  length: Math.ceil(packs.length / 2),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentPage === index
                        ? "w-4 bg-emerald-500"
                        : "w-2 bg-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* Mobile Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={currentPage >= Math.ceil(packs.length / 2) - 1}
                className="absolute -right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
              {getCurrentItems().map((item: Pack) => (
                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                  className="bg-zinc-950 rounded-xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.thumbnail_image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayClick(item);
                        }}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <Link
                      href={`/producers/${item?.userId?._id}`}
                      className="text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-medium"
                    >
                      {item.producer}
                    </Link>
                    <div className="mt-2">
                      <span className="text-xl font-bold text-white">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="absolute -left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={
                  currentPage >= Math.ceil(packs.length / itemsPerPage) - 1
                }
                className="absolute -right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Latest Melodies Title */}
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-500">
              Latest Melodies
            </h2>
          </div>

          {/* Melodies Section */}
          <div className="mb-32">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {/* Popularity Filter */}
              <Popover open={popularityPopoverOpen} onOpenChange={setPopularityPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                  >
                    {selectedPopularity
                      ? popularityOptions.find(
                          (opt) => opt.value === selectedPopularity
                        )?.label
                      : "POPULARITY"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="center">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {popularityOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() =>
                              handlePopularitySelect(option.value)
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`flex-1 ${
                                selectedPopularity === option.value
                                  ? "text-emerald-500"
                                  : "text-white"
                              }`}
                            >
                              {option.label}
                            </div>
                            {selectedPopularity === option.value && (
                              <Check className="h-4 w-4 text-emerald-500" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Genre Filter */}
              <Popover open={genrePopoverOpen} onOpenChange={setGenrePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                  >
                    {selectedGenre || "GENRES"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="center">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {genres.map((genre) => (
                          <CommandItem
                            key={genre}
                            onSelect={() => handleGenreSelect(genre)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`flex-1 ${
                                selectedGenre === genre
                                  ? "text-emerald-500"
                                  : "text-white"
                              }`}
                            >
                              {genre}
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

              {/* BPM Filter */}
              <BpmFilter
                onApply={handleBpmFilterApply}
                onClear={handleBpmFilterClear}
              />

              {/* Key Filter */}
              <Popover open={keyPopoverOpen} onOpenChange={setKeyPopoverOpen}>
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
                      setCurrentMelodiesPage(1); // Reset to first page
                      setKeyPopoverOpen(false); // Close the popover after selection
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* Artist Type Filter */}
              <Popover open={artistTypePopoverOpen} onOpenChange={setArtistTypePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                  >
                    {selectedArtistType || "ARTIST TYPE"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="center">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {artistTypes.map((type) => (
                          <CommandItem
                            key={type}
                            onSelect={() => handleArtistTypeSelect(type)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`flex-1 ${
                                selectedArtistType === type
                                  ? "text-emerald-500"
                                  : "text-white"
                              }`}
                            >
                              {type}
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
                className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800"
                onClick={handleClearAllFilters}
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
                      <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                        #
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                        Thumbnail
                      </th>
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
                        Waveform
                      </th>
                      <th
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                        onClick={() => handleSort("producer")}
                      >
                        <div className="flex items-center gap-1">
                          PRODUCER
                          <ChevronUp
                            className={`h-3 w-3 transition-transform ${
                              sortConfig.key === "producer"
                                ? "text-emerald-500"
                                : "text-zinc-600"
                            } ${
                              sortConfig.key === "producer" &&
                              sortConfig.direction === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
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
                    {getCurrentMelodies().map((melody: any) => (
                      <tr
                        key={melody._id || melody.id}
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
                              src={melody.userId?.profile_image || "/placeholder.svg"}
                              alt={melody.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                          {melody.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <WaveformDisplay
                            audioUrl={
                              melody.audio_path ||
                              melody.audio ||
                              melody.audioUrl
                            }
                            isPlaying={currentPlayingMelody?._id === melody._id}
                            onPlayPause={() => handlePlayClick(melody)}
                            height={30}
                            width="200px"
                            isControlled={true}
                            currentTime={
                              currentMelodyId === melody._id ? currentTime : 0
                            }
                            duration={
                              currentMelodyId === melody._id ? duration : 0
                            }
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                          {melody.producer}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                          {melody.bpm}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                          {melody.key}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                          {Array.isArray(melody.genre)
                            ? melody.genre.join(", ")
                            : melody.genre}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                          {Array.isArray(melody.artistType)
                            ? melody.artistType.join(", ")
                            : melody.artistType}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              onClick={() => toogleFavorite(melody._id)}
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 text-zinc-400 hover:text-red-500 ${
                                isMelodyFavorite(melody._id)
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              {isMelodyFavorite(melody._id) ? (
                                <FaHeart size={20} color="red" />
                              ) : (
                                <FaRegHeart size={20} />
                              )}
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
                    {getCurrentMelodies().map((melody: any) => (
                      <tr
                        key={melody._id || melody.id}
                        className="border-b border-zinc-800 hover:bg-zinc-900/30"
                      >
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={melody.userId?.profile_image || "/placeholder.svg"}
                              alt={melody.name}
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
                              {melody.producer}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-red-500 ${
                                isMelodyFavorite(melody._id) ? "" : ""
                              }`}
                              onClick={() => toogleFavorite(melody._id)}
                            >
                              {isMelodyFavorite(melody._id) ? (
                                <FaHeart size={20} color="red" />
                              ) : (
                                <FaRegHeart size={20} />
                              )}
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

            {/* Melodies Pagination */}
            <div className="mt-6 mb-24">
              <Pagination
                currentPage={currentMelodiesPage}
                totalPages={totalMelodiesPages}
                onPageChange={handleMelodiesPageChange}
                totalItems={totalMelodies}
                itemsPerPage={melodiesPerPage}
              />
            </div>
          </div>
        </div>

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
              isFavorite={
                currentPlayingMelody
                  ? isMelodyFavorite(currentPlayingMelody._id)
                  : false
              }
              onFavoriteClick={(melodyId) => toogleFavorite(melodyId)}
              playNextMelody={playNextMelody}
              playPreviousMelody={playPreviousMelody}
              onEnded={playNextMelody}
              handleDownloadClick={handleDownloadClick}
            />
          )}
        {selectedMelody && (
          <CollabModal
            melodyDownloadCounter={melodyDownloadCounter}
            isOpen={isCollabModalOpen}
            onClose={() => setIsCollabModalOpen(false)}
            melodyData={selectedMelody}
          />
        )}
      </div>
    </Layout>
  );
}
