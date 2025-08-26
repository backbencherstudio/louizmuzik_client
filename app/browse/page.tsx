/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ChevronDown,
  ChevronUp,
  Heart,
  MoreVertical,
  Play,
  Pause,
  Search,
  Check,
  ArrowUpDown,
  TrendingUp,
  Clock,
  Shuffle,
} from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CollabModal } from "@/components/collab-modal";
import BpmFilter from "@/components/bpm-filter";
import { AudioPlayer } from "@/components/audio-player";
import Layout from "@/components/layout";
import { KeySelector } from "@/components/key-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WaveformDisplay } from "@/components/waveform-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import {
  useFavoriteMelodyMutation,
  useGetMelodiesQuery,
  useMelodyDownloadMutation,
  useMelodyPlayMutation,
} from "../store/api/melodyApis/melodyApis";
import { toast } from "sonner";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import { useAudioContext } from "@/components/audio-context";

export default function BrowsePage() {
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [selectedMelody, setSelectedMelody] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
    type: "popular" | "recent" | "random" | "default";
  }>({
    key: "",
    direction: "desc",
    type: "popular",
  });
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedArtistType, setSelectedArtistType] = useState("");
  const [bpmFilter, setBpmFilter] = useState<{
    type: "exact" | "range";
    min?: number;
    max?: number;
  } | null>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);

  // Get user
  const { data: user, refetch: refetchUser } = useLoggedInUser();
  const userId = user?.data?._id;
  // Get melodies
  const { data: melodiesData, refetch: refetchMelodies } =
    useGetMelodiesQuery(null);
  const melodies = melodiesData?.data;
  console.log("melodies", melodies);

  // Mutations
  const [melodyPlayCounter] = useMelodyPlayMutation();
  const [melodyDownloadCounter] = useMelodyDownloadMutation();

  const [favoriteMelody] = useFavoriteMelodyMutation();
  const isMelodyFavorite = (melodyId: string) => {
    return user?.data?.favourite_melodies?.includes(melodyId) || false;
  };

  const toogleFavorite = async (melody: any) => {
    if (melody && userId) {
      await favoriteMelody({ id: melody, userId: userId }).unwrap();
      await Promise.all([refetchUser(), refetchMelodies()]);
    }
  };

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

  const handleDownloadClick = async (melody: any) => {
    setSelectedMelody(melody);
    setIsCollabModalOpen(true);
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

  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching for:", searchQuery);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field: string) => {
    setSortConfig((currentConfig) => {
      if (currentConfig.key === field) {
        // Si es el mismo campo, cambiamos la dirección
        return {
          ...currentConfig,
          direction: currentConfig.direction === "asc" ? "desc" : "asc",
          type: "default",
        };
      }
      // Si es un campo nuevo, ordenamos ascendente
      return {
        key: field,
        direction: "asc",
        type: "default",
      };
    });
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleSortByType = (type: "popular" | "recent" | "random") => {
    setSortConfig({
      key: "",
      direction: "desc",
      type,
    });
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleBpmFilterApply = (values: {
    type: "exact" | "range";
    min?: number;
    max?: number;
  }) => {
    setBpmFilter(values);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleBpmFilterClear = () => {
    setBpmFilter(null);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? "" : genre);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleArtistTypeSelect = (type: string) => {
    setSelectedArtistType(type === selectedArtistType ? "" : type);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedKey("");
    setSelectedGenre("");
    setSelectedArtistType("");
    setBpmFilter(null);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const filteredAndSortedMelodies = [...(melodies || [])]
    .filter((melody) => {
      if (
        searchQuery &&
        !melody.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
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

      // Ordenamiento por campo específico
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

  // Pagination
  const totalItems = filteredAndSortedMelodies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMelodies = filteredAndSortedMelodies.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const { currentTime, duration, currentMelodyId } = useAudioContext();

  return (
    <Layout>
      <div
        className={`${
          isAudioPlayerVisible ? "mb-10" : ""
        } min-h-screen p-4 sm:p-6 lg:p-8 mt-8 lg:mt-12`}
      >
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            All Melodies
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-3xl mb-6 md:mb-8">
            Find the perfect melody for your next collaboration with producers
            from around the world. Collaborate and take your music to the next
            level with these top-tier producers' melodies.
          </p>

          <div className="flex flex-col md:flex-row w-full max-w-3xl gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search Melodies or Producers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 rounded-lg bg-emerald-500 px-6 text-base font-medium text-black hover:bg-emerald-600 md:w-auto w-full"
            >
              Search Now
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
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
                <DropdownMenuItem onClick={() => handleSortByType("popular")}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortByType("recent")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortByType("random")}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Random
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Popover>
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
                        onSelect={() => handleGenreSelect(genre as string)}
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

          <Popover>
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
                  setCurrentPage(1); // Reset to first page when key changes
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover>
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
                        onSelect={() => handleArtistTypeSelect(type as string)}
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
                {currentMelodies.map((melody) => (
                  <tr
                    key={melody._id}
                    className="border-b border-zinc-800 hover:bg-zinc-900/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        id={melody?._id}
                        className={`h-8 w-8 rounded-full ${
                          currentPlayingMelody?._id === melody._id
                            ? "bg-emerald-500 text-black hover:bg-emerald-600"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        }`}
                        // disabled={document.getElementById(`audio-${melody._id}`)?.onload ? false : true}
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
                          src={melody?.image || "/images/default-melody.png"}
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
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="hover:text-emerald-500 transition-colors"
                      >
                        {melody?.producer}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <WaveformDisplay
                        audioUrl={melody.audioUrl}
                        isPlaying={currentPlayingMelody?._id === melody._id}
                        onPlayPause={() => handlePlayClick(melody)}
                        height={30}
                        width="200px"
                        isControlled={true}
                        currentTime={
                          currentMelodyId === melody._id ? currentTime : 0
                        }
                        duration={currentMelodyId === melody._id ? duration : 0}
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
                            isMelodyFavorite(melody?._id) ? "text-red-500" : ""
                          }`}
                          onClick={() => toogleFavorite(melody?._id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isMelodyFavorite(melody._id) ? "fill-current" : ""
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
                {currentMelodies.map((melody) => (
                  <tr
                    key={melody?._id}
                    className="border-b border-zinc-800 hover:bg-zinc-900/30"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={melody?.image}
                          alt={melody?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        // id={melody?._id}
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 flex-shrink-0 rounded-full ${
                          currentPlayingMelody?.id === melody._id
                            ? "bg-emerald-500 text-black hover:bg-emerald-600"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        }`}
                        onClick={() => handlePlayClick(melody)}
                      >
                        {currentPlayingMelody?.id === melody?._id ? (
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
                          <Link
                            href={`/producer/${melody?.producer
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="hover:text-emerald-500 transition-colors"
                          >
                            {melody?.producer}
                          </Link>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-red-500 ${
                            isMelodyFavorite(melody?._id) ? "text-red-500" : ""
                          }`}
                          onClick={() => toogleFavorite(melody?._id)}
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
        <div className="mt-6 mb-24">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
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
