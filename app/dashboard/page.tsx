"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Download, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "@/components/layout";
import { useLoggedInUserQuery } from "../store/api/authApis/authApi";
import {
  useDownloadChartMelodyQuery,
  useGetMelodyByUserIdQuery,
  useMelodyPlayMutation,
  useMelodyDownloadMutation,
  useFavoriteMelodyMutation,
} from "../store/api/melodyApis/melodyApis";
import { WaveformDisplay } from "@/components/waveform-display";
import { useGetProducerPackQuery } from "../store/api/packApis/packApis";
import { usePackSalesHistoryQuery } from "../store/api/paymentApis/paymentApis";
import { AudioPlayer } from "@/components/audio-player";
import { useAudioContext } from "@/components/audio-context";
import { CollabModal } from "@/components/collab-modal";

// TypeScript interfaces
interface Melody {
  _id: string;
  name: string;
  producer: string;
  image?: string;
  audio_path?: string;
  audio?: string;
  audioUrl?: string;
  bpm?: number;
  key?: string;
  genre?: string | string[];
  artistType?: string;
  plays?: number;
  downloads?: number;
}

interface Pack {
  _id: string;
  title?: string;
  name?: string;
  thumbnail_image?: string;
  price?: number;
  sales?: number;
}

interface DownloadData {
  day: string;
  downloads: number;
}

interface SalesData {
  day: string;
  sales: number;
}

interface UserData {
  _id: string;
  followersCounter?: number;
  favourite_melodies?: string[];
}

interface PlayingMelody {
  _id: string;
  name: string;
  producer: string;
  image: string;
  audio: string;
  audioUrl: string;
  bpm: number;
  key: string;
  genre: string;
  artistType: string;
}

type TimeRange = "7days" | "month" | "ytd";

const formatedFollowers = (followers: number): string => {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`;
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  } else {
    return followers.toString();
  }
};

const formatedPlays = (plays: number): string => {
  if (plays >= 1000000) {
    return `${(plays / 1000000).toFixed(1)}M`;
  } else if (plays >= 1000) {
    return `${(plays / 1000).toFixed(1)}K`;
  } else {
    return plays.toString();
  }
};

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const processDownloadData = (rawData: any[], selectedTimeRange: TimeRange): DownloadData[] => {
  if (!rawData || !Array.isArray(rawData)) {
    return [];
  }

  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const downloadsByDay = new Map<string, number>();

  if (selectedTimeRange === '7days') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dayName = dayNames[date.getDay()];
      downloadsByDay.set(dayName, 0);
    }
  } else if (selectedTimeRange === 'month') {
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dayKey = date.getDate().toString();
      downloadsByDay.set(dayKey, 0);
    }
  } else if (selectedTimeRange === 'ytd') {
    for (let i = 0; i <= now.getMonth(); i++) {
      downloadsByDay.set(monthNames[i], 0);
    }
  }

  rawData.forEach(item => {
    if (item.date) {
      const downloadDate = new Date(item.date);
      let dayKey: string | undefined;

      if (selectedTimeRange === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        if (downloadDate >= sevenDaysAgo) {
          dayKey = dayNames[downloadDate.getDay()];
        }
      } else if (selectedTimeRange === 'month') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        if (downloadDate >= thirtyDaysAgo) {
          dayKey = downloadDate.getDate().toString();
        }
      } else if (selectedTimeRange === 'ytd') {
        if (downloadDate.getFullYear() === now.getFullYear()) {
          dayKey = monthNames[downloadDate.getMonth()];
        }
      }

      if (dayKey && downloadsByDay.has(dayKey)) {
        downloadsByDay.set(dayKey, downloadsByDay.get(dayKey)! + (item.downloads || 0));
      }
    }
  });

  return Array.from(downloadsByDay.entries()).map(([day, downloads]) => ({
    day,
    downloads
  }));
};

const processSalesHistoryData = (salesHistoryData: any[], selectedTimeRange: TimeRange): SalesData[] => {
  if (!salesHistoryData || !Array.isArray(salesHistoryData)) {
    return [];
  }

  const now = new Date();
  const startDate = new Date();
  
  switch (selectedTimeRange) {
    case '7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'ytd':
      startDate.setMonth(0, 1); 
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }

  const salesByDay = new Map<string, number>();
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (selectedTimeRange === '7days') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dayName = dayNames[date.getDay()];
      salesByDay.set(dayName, 0);
    }
  } else if (selectedTimeRange === 'month') {
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dayKey = date.getDate().toString();
      salesByDay.set(dayKey, 0);
    }
  } else if (selectedTimeRange === 'ytd') {
    for (let i = 0; i <= now.getMonth(); i++) {
      salesByDay.set(monthNames[i], 0);
    }
  }

  salesHistoryData.forEach(salesEntry => {
    if (salesEntry.salesCount && salesEntry.createdAt) {
      const saleDate = new Date(salesEntry.createdAt);
      
      if (saleDate >= startDate && saleDate <= now) {
        const salesCount = salesEntry.salesCount;
        
        let dayKey: string | undefined;
        if (selectedTimeRange === '7days') {
          dayKey = dayNames[saleDate.getDay()];
        } else if (selectedTimeRange === 'month') {
          dayKey = saleDate.getDate().toString();
        } else if (selectedTimeRange === 'ytd') {
          dayKey = monthNames[saleDate.getMonth()];
        }
        
        if (dayKey && salesByDay.has(dayKey)) {
          salesByDay.set(dayKey, salesByDay.get(dayKey)! + salesCount);
        }
      }
    }
  });

  return Array.from(salesByDay.entries()).map(([day, sales]) => ({
    day,
    sales: sales 
  }));
};

const calculateTotalRevenue = (packsData: Pack[]): number => {
  if (!packsData || !Array.isArray(packsData)) {
    return 0;
  }

  return packsData.reduce((total, pack) => {
    const sales = pack.sales || 0;
    const price = pack.price || 0;
    return total + (sales * price);
  }, 0);
};

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("7days");
  const [selectedSalesTimeRange, setSelectedSalesTimeRange] = useState<TimeRange>("7days");
  const [currentPlayingMelody, setCurrentPlayingMelody] = useState<PlayingMelody | null>(null);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [selectedMelody, setSelectedMelody] = useState<Melody | null>(null);

  const {
    data: userData,
    error,
    isLoading: isLoadingUser,
  } = useLoggedInUserQuery(null);
  const userId = userData?.data?._id;
  const followers = userData?.data?.followersCounter;
  const totalFollowers = formatedFollowers(followers || 0);

  const { data: melodiesData, refetch: refetchMelodies } =
    useGetMelodyByUserIdQuery(userId);
  const melodies = melodiesData?.data as Melody[] | undefined;
  

  const { data: packsData, refetch: refetchPacks } = useGetProducerPackQuery(userId);
  const packs = packsData?.data as Pack[] | undefined;
 

  const { data: downloadChartData, isLoading: isLoadingDownloadChart } =
    useDownloadChartMelodyQuery(userId);
  const downloadData = processDownloadData(downloadChartData?.data || [], selectedTimeRange);

  const { data: packSalesHistory, isLoading: isLoadingPackSalesHistory } =
    usePackSalesHistoryQuery(userId);
  const packSalesHistoryData = packSalesHistory?.data;
  
  const salesData = processSalesHistoryData(packSalesHistoryData || [], selectedSalesTimeRange);

  const totalRevenue = calculateTotalRevenue(packs || []);

  const [melodyPlayCounter] = useMelodyPlayMutation();
  const [melodyDownloadCounter] = useMelodyDownloadMutation();
  const [favoriteMelody] = useFavoriteMelodyMutation();

  const { currentTime, duration, currentMelodyId } = useAudioContext();

  const isMelodyFavorite = (melodyId: string): boolean => {
    return userData?.data?.favourite_melodies?.includes(melodyId) || false;
  };

  
  const toggleFavorite = async (melodyId: string): Promise<void> => {
    if (melodyId && userId) {
      await favoriteMelody({ id: melodyId, userId: userId }).unwrap();
      refetchMelodies();
    }
  };

  const handlePlayClick = async (melody: Melody): Promise<void> => {
    if (currentPlayingMelody?._id === melody._id) {
      setCurrentPlayingMelody(null);
      setIsAudioPlayerVisible(false);
      setShouldAutoPlay(false);
    } else {
      try {
        const response = await melodyPlayCounter(melody._id).unwrap();
        // console.log("melodyPlayCounter", response);
      } catch (error) {
        console.log("error", error);
      }
      
      const melodyToPlay: PlayingMelody = {
        _id: melody._id, 
        name: melody.name,
        producer: melody.producer,
        image: melody.image || "",
        audio: melody.audio_path || melody.audio || melody.audioUrl || "",
        audioUrl: melody.audio_path || melody.audio || melody.audioUrl || "",
        bpm: melody.bpm || 120,
        key: melody.key || 'C Maj',
        genre: Array.isArray(melody.genre) ? melody.genre.join(', ') : melody.genre || 'Unknown',
        artistType: melody.artistType || 'Producer',
      };
      
      setCurrentPlayingMelody(melodyToPlay);
      setIsAudioPlayerVisible(true);
      setShouldAutoPlay(true);
    }
  };

  const handleDownloadClick = async (melody: Melody): Promise<void> => {
    setSelectedMelody(melody);
    setIsCollabModalOpen(true);
  };

  const calculateTotals = (): { totalPlays: number; totalDownloads: number } => {
    if (!melodies || !Array.isArray(melodies)) {
      return { totalPlays: 0, totalDownloads: 0 };
    }

    const totals = melodies.reduce(
      (acc, melody) => {
        acc.totalPlays += melody.plays || 0;
        acc.totalDownloads += melody.downloads || 0;
        return acc;
      },
      { totalPlays: 0, totalDownloads: 0 }
    );

    return totals;
  };

  const { totalPlays, totalDownloads } = calculateTotals();

 

  return (
    <Layout>
      <div className={`${isAudioPlayerVisible ? 'mb-10' : ''} container mx-auto space-y-8 px-4 py-8`}>
        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
            <div className="relative z-10 p-6">
              <div className="text-sm font-medium text-zinc-400">
                Total Followers
              </div>
              <div className="mt-2 text-3xl font-bold text-white">
                {totalFollowers}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
          </Card>
          <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
            <div className="relative z-10 p-6">
              <div className="text-sm font-medium text-zinc-400">
                Total Plays
              </div>
              <div className="mt-2 text-3xl font-bold text-white">
                {formatedPlays(totalPlays)}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
          </Card>
          <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
            <div className="relative z-10 p-6">
              <div className="text-sm font-medium text-zinc-400">
                Total Downloads
              </div>
              <div className="mt-2 text-3xl font-bold text-white">
                {formatedPlays(totalDownloads)}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
          </Card>
          <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-emerald-500">
                    Sales Revenue
                  </div>
                  <div className="mt-2 text-3xl font-bold text-white">
                    {formatCurrency(totalRevenue)}
                  </div>
                </div>
                <Link
                  href="/sales"
                  className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  All Sales
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-4 xl:grid-cols-2">
          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Download Graph
                </h3>
                <Tabs
                  value={selectedTimeRange}
                  onValueChange={(value: string) => setSelectedTimeRange(value as TimeRange)}
                  className="space-y-4"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
                    <TabsTrigger
                      value="7days"
                      className="data-[state=active]:bg-emerald-500"
                    >
                      <span className="hidden md:inline">Last 7 Days</span>
                      <span className="md:hidden">7D</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="month"
                      className="data-[state=active]:bg-emerald-500"
                    >
                      <span className="hidden md:inline">This Month</span>
                      <span className="md:hidden">1M</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="ytd"
                      className="data-[state=active]:bg-emerald-500"
                    >
                      <span className="hidden md:inline">YTD</span>
                      <span className="md:hidden">YTD</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="h-[300px]">
                {downloadData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={downloadData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: number, name: string) => [
                          `${value} downloads`,
                          "Downloads",
                        ]}
                        labelFormatter={(label: string) => `Day: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="downloads"
                        stroke="#10b981"
                        fill="url(#downloadGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="downloadGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-zinc-400 text-center">
                      <div className="text-lg font-medium mb-2">
                        No Download Data
                      </div>
                      <div className="text-sm">
                        Start uploading melodies to see your download statistics
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Sales Overview
                </h3>
                <Tabs 
                  value={selectedSalesTimeRange} 
                  onValueChange={(value: string) => setSelectedSalesTimeRange(value as TimeRange)}
                  className="space-y-4"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
                    <TabsTrigger
                      value="7days"
                      className="data-[state=active]:bg-emerald-500"
                    >
                      <span className="hidden md:inline">Last 7 Days</span>
                      <span className="md:hidden">7D</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="month"
                      className="data-[state=active]:bg-emerald-500"
                    >
                      <span className="hidden md:inline">This Month</span>
                      <span className="md:hidden">1M</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="ytd"
                      className="data-[state=active]:bg-emerald-500"
                    >
                      <span className="hidden md:inline">YTD</span>
                      <span className="md:hidden">YTD</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="h-[300px]">
                {salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: number, name: string) => [
                          Number(value),
                          "Total Sales",
                        ]}
                        labelFormatter={(label: string) => `Day: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#10b981"
                        fill="url(#salesGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="salesGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-zinc-400 text-center">
                      <div className="text-lg font-medium mb-2">
                        No Sales Data
                      </div>
                      <div className="text-sm">
                        Start selling packs to see your sales statistics
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid gap-4 xl:grid-cols-2">
          {/* Top Melodies */}
          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Top Melodies
                </h2>
                {
                  (melodies?.length || 0) > 0 ? <Link
                  href="/analytics?tab=melodies"
                  className="text-sm text-emerald-500 hover:text-emerald-400"
                >
                  View All
                </Link> : ""
                }
              </div>
              {
                (melodies?.length || 0) > 0 ? <div className="space-y-4">
                {melodies?.slice(0, 3).map((melody: Melody) => (
                  <div
                    key={melody._id}
                    className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-zinc-800/50"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-12 w-12 rounded-full transition-all ${
                        currentPlayingMelody?._id === melody._id
                          ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                          : 'bg-zinc-800/50 hover:bg-emerald-500/20 hover:text-emerald-500'
                      }`}
                      onClick={() => handlePlayClick(melody)}
                    >
                      {currentPlayingMelody?._id === melody._id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 text-white" />
                      )}
                    </Button>
                    <div className="flex-1 text-sm font-medium text-zinc-400 w-1/4">
                      <WaveformDisplay
                        audioUrl={melody.audioUrl || melody.audio_path || melody.audio || ""}
                        isPlaying={currentPlayingMelody?._id === melody._id}
                        onPlayPause={() => handlePlayClick(melody)}
                        height={30}
                        width=""
                        isControlled={true}
                        currentTime={currentMelodyId === melody._id ? currentTime : 0}
                        duration={currentMelodyId === melody._id ? duration : 0}
                      />
                    </div>
                    <div className="flex-1 text-sm font-medium text-zinc-400">
                      {melody.name}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {melody.plays || 0} plays
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 text-zinc-400 hover:text-red-500 ${
                          isMelodyFavorite(melody._id)
                            ? 'text-red-500'
                            : ''
                        }`}
                        onClick={() => toggleFavorite(melody._id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isMelodyFavorite(melody._id)
                              ? 'fill-current'
                              : ''
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
                  </div>
                ))}
              </div> : <div className="text-white text-center">No melodies found</div>
              }
            </div>
          </Card>

          {/* Latest Packs */}
          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Latest Packs
                </h2>
                {
                  (packs?.length || 0) > 0 ? <Link
                  href="/analytics?tab=products"
                  className="text-sm text-emerald-500 hover:text-emerald-400"
                >
                  View All
                </Link> : ""
                }
              </div>
              {
                (packs?.length || 0) > 0 ? <div className="grid grid-cols-3 gap-4">
                {packs?.slice(0, 3).map((pack: Pack) => (
                  <Link key={pack._id} href={`/product/${pack._id}`} className="group block">
                    <div className="relative flex items-center justify-center aspect-square overflow-hidden rounded-lg bg-zinc-800/50">
                      <Image
                        src={pack.thumbnail_image || "/placeholder.svg"}
                        alt={pack.title || pack.name || "Pack"}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105 group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium text-white group-hover:text-emerald-500 transition-colors truncate">
                        {pack.title || pack.name}
                      </div>
                      <div className="text-xs text-emerald-500">
                        {formatCurrency(pack.price || 0)}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {pack.sales || 0} sales
                      </div>
                    </div>
                  </Link>
                ))}
              </div> : <div className="text-white text-center">No Latest Packs found</div>
              }
            </div>
          </Card>
        </div>

        {/* Audio Player */}
        {isAudioPlayerVisible && currentPlayingMelody && (
          <AudioPlayer
            key={currentPlayingMelody?.audioUrl || currentPlayingMelody?._id}
            isVisible={isAudioPlayerVisible}
            melody={currentPlayingMelody}
            shouldAutoPlay={shouldAutoPlay}
            onClose={() => {
              setCurrentPlayingMelody(null);
              setIsAudioPlayerVisible(false);
              setShouldAutoPlay(false);
            }}
            isFavorite={isMelodyFavorite(currentPlayingMelody._id)}
            onFavoriteClick={(melodyId: string) => toggleFavorite(melodyId)}
            playNextMelody={() => {}}
            playPreviousMelody={() => {}}
            onEnded={() => {
              setCurrentPlayingMelody(null);
              setIsAudioPlayerVisible(false);
              setShouldAutoPlay(false);
            }}
            handleDownloadClick={handleDownloadClick}
          />
        )}

        {/* Collaboration Modal */}
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