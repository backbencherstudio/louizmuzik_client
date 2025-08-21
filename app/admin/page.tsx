"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Music2,
  Package,
  DollarSign,
  UserMinus,
  Star,
  Search,
  X,
  UserPlus,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import FeaturedProducts from "./featured-products";
import {
  useAddHighlightMutation,
  useGetAdminOverviewQuery,
  useGetPacksQuery,
  useGetUsersQuery,
} from "../store/api/adminApis/adminApis";
import { toast } from "sonner";

interface Stats {
  activeUsers: number;
  proUsers: number;
  freeUsers: number;
  totalMelodies: number;
  totalDownloads: number;
  totalSamplePacks: number;
  totalRevenue: number;
  mrr: number;
  churnRate: number;
}

interface FeaturedProduct {
  id: string;
  title: string;
  producer: string;
  price: number;
  image: string;
  isFeatured: boolean;
  genre?: string;
}

interface User {
  cancelRequest: boolean;
  paymentMethod:string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: adminOverview, isLoading: isAdminOverviewLoading } =
    useGetAdminOverviewQuery(null);
  const overviewData = adminOverview?.data;

  const {
    data: packsData,
    isLoading: isPacksLoading,
    error,
    refetch: refreshPacks,
  } = useGetPacksQuery(null);

  const allPacks = packsData?.data || [];
  console.log(allPacks);

  const highlightedPacks = allPacks.filter((pack: any) => pack?.highlight === true);
  const totalHighlights = highlightedPacks.length;

  const [addHighlightPack, { isLoading: isHighlighting }] =
    useAddHighlightMutation();

    const removeHighlightPack = async (packId: string) => {
      try {
        await addHighlightPack(packId).unwrap();
        toast.success("Sample pack removed from highlight successfully");
        refreshPacks();
      } catch (error) {
        console.error("Error removing highlight:", error);
        toast.error("Failed to remove highlight. Please try again.");
      }
    }

  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery(null);
  console.log(users?.data);
  const totalSubscriber = users?.data.filter(
    (user: User) => user?.paymentMethod && user.paymentMethod !== "free"
  ).length;

  const canceledUsers = users?.data.filter(
    (user: User) => user.cancelRequest === true
  ).length;
  const churnRate = (canceledUsers / totalSubscriber) * 100;

  const [products, setProducts] = useState<FeaturedProduct[]>([
    {
      id: "1",
      title: "Summer Beats Pack",
      producer: "Producer Name",
      price: 29.99,
      image: "/placeholder.png",
      isFeatured: true,
      genre: "Hip Hop",
    },
    {
      id: "2",
      title: "Urban Drums Vol. 1",
      producer: "Another Producer",
      price: 19.99,
      image: "/placeholder.png",
      isFeatured: false,
      genre: "Trap",
    },
    {
      id: "3",
      title: "Melodic Samples 2024",
      producer: "Top Producer",
      price: 24.99,
      image: "/placeholder.png",
      isFeatured: false,
      genre: "R&B",
    },
  ]);

  useEffect(() => {
    if (overviewData) {
      setStats({
        activeUsers: overviewData.activeUserCount,
        proUsers: overviewData.isPro,
        freeUsers: overviewData.freeUser,
        totalMelodies: overviewData.uploadedMelody,
        totalDownloads: overviewData.downloadsCount,
        totalSamplePacks: overviewData.samplePacksSold,
        totalRevenue: overviewData.totalRevenue,
        mrr: overviewData.totalRevenueForThisMonth,
        churnRate: churnRate,
      });
      setIsLoading(false);
    }
  }, [overviewData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  const statCards = [
    // First Row: User Statistics
    {
      title: "Active Users",
      value: stats?.activeUsers.toLocaleString() || "0",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "PRO Users",
      value: stats?.proUsers.toLocaleString() || "0",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Free Users",
      value: stats?.freeUsers.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-500",
    },
    // Second Row: Content Statistics
    {
      title: "Uploaded Melodies",
      value: stats?.totalMelodies.toLocaleString() || "0",
      icon: Music2,
      color: "text-indigo-500",
    },
    {
      title: "Total Downloads",
      value: stats?.totalDownloads.toLocaleString() || "0",
      icon: Music2,
      color: "text-orange-500",
    },
    {
      title: "Sample Packs Sold",
      value: stats?.totalSamplePacks.toLocaleString() || "0",
      icon: Package,
      color: "text-pink-500",
    },
    // Third Row: Revenue Statistics
    {
      title: "MRR",
      value: `$${(stats?.mrr || 0).toLocaleString()}`,
      icon: Music2,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Churn Rate",
      value: `${(stats?.churnRate || 0).toFixed(2)}%`,
      icon: UserMinus,
      color: "text-red-500",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Admin Overview</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]"
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-zinc-400">{stat.title}</span>
                </div>
                <div className="mt-2 text-3xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
            </Card>
          );
        })}
      </div>

      {/* Featured Products Section */}
      <FeaturedProducts 
        highlightedPacks={highlightedPacks}
        allPacks={allPacks}
        onToggleHighlight={removeHighlightPack}
      />
    </div>
  );
}
