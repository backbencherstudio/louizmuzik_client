"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

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
} from "../store/api/melodyApis/melodyApis";
import { WaveformDisplay } from "@/components/waveform-display";

const formatedFollowers = (followers: number) => {
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`;
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  } else {
    return followers;
  }
};

const formatedPlays = (plays: number) => {
  if (plays >= 1000000) {
    return `${(plays / 1000000).toFixed(1)}M`;
  } else if (plays >= 1000) {
    return `${(plays / 1000).toFixed(1)}K`;
  } else {
    return plays;
  }
};

// Helper function to process download chart data
const processDownloadData = (rawData: any[]) => {
  if (!rawData || !Array.isArray(rawData)) {
    return [];
  }

  return rawData.map((item) => ({
    day: item.day,
    downloads: item.downloads,
    date: item.date,
  }));
};

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7days");

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
  const melodies = melodiesData?.data;
  console.log("melodies", melodies);

  const { data: downloadChartData, isLoading: isLoadingDownloadChart } =
    useDownloadChartMelodyQuery(userId);
  const downloadData = processDownloadData(downloadChartData?.data || []);
  console.log("download data", downloadData);

  // Calculate totals from melodies data
  const calculateTotals = () => {
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

  // Sample data for sales chart (keep this for now)
  const salesData = [
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 50 },
    { day: "Wed", sales: 30 },
    { day: "Thu", sales: 80 },
    { day: "Fri", sales: 20 },
    { day: "Sat", sales: 40 },
    { day: "Sun", sales: 60 },
  ];

  if (isLoadingUser || isLoadingDownloadChart) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-zinc-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  <div className="mt-2 text-3xl font-bold text-white">$0</div>
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
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Download Graph
                </h3>
                <Tabs
                  value={selectedTimeRange}
                  onValueChange={setSelectedTimeRange}
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
                        formatter={(value, name) => [
                          `${value} downloads`,
                          "Downloads",
                        ]}
                        labelFormatter={(label) => `Day: ${label}`}
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
                <Tabs defaultValue="7days" className="space-y-4">
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
              </div>
            </div>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Melodies */}
          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Top Melodies
                </h2>
                <Link
                  href="/analytics?tab=melodies"
                  className="text-sm text-emerald-500 hover:text-emerald-400"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {melodies?.map((melody:any) => (
                  <div
                    key={melody._id}
                    className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-zinc-800/50"
                  >
                    {/* <div className="flex-1 text-sm font-medium text-zinc-400 w-1/3 h-10">
                      <Image
                        src={melody.image}
                        alt={melody.name}
                        width={200}
                        height={200}
                        className="w-10 h-10 object-cover"
                      />
                    </div> */}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-zinc-800/50 hover:bg-emerald-500/20 hover:text-emerald-500 transition-all"
                    >
                      <Play className="h-5 w-5 text-white" />
                    </Button>
                    <div className="flex-1 text-sm font-medium text-zinc-400 w-1/4">
                      <WaveformDisplay
                        // waveform={melody.waveform}
                        audioUrl={melody.audioUrl}
                      />
                    </div>
                    <div className="flex-1 text-sm font-medium text-zinc-400">
                      {melody.name}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {melody.thumbnail_image}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Latest Packs */}
          <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Latest Packs
                </h2>
                <Link
                  href="/analytics?tab=products"
                  className="text-sm text-emerald-500 hover:text-emerald-400"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    title: "Bumper Pack Vol.1",
                    artist: "Thunder Beatz",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png",
                  },
                  {
                    title: "Radio Lotto Pack",
                    artist: "Thunder Beatz",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png",
                  },
                  {
                    title: "Old School Pack",
                    artist: "Thunder Beatz",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png",
                  },
                ].map((pack, i) => (
                  <Link key={i} href="#" className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800/50">
                      <Image
                        src={pack.image || "/placeholder.svg"}
                        alt={pack.title}
                        width={200}
                        height={200}
                        className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium text-white group-hover:text-emerald-500 transition-colors">
                        {pack.title}
                      </div>
                      <div className="text-xs text-emerald-500">
                        {pack.artist}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
