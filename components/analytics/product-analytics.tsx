"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpDown, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoggedInUser } from "@/app/store/api/authApis/authApi";
import { useGetProducerPackQuery } from "@/app/store/api/packApis/packApis";

type SortField = "name" | "sales" | "profit" | "releaseDate";
type SortDirection = "asc" | "desc";
type TimeRange =
  | "all"
  | "today"
  | "yesterday"
  | "thisMonth"
  | "lastMonth"
  | "yearToDate";

type Pack = {
  _id: string;
  title: string;
  artist: string;
  image: string;
  sales: number;
  profit: number;
  releaseDate: string;
  genre: string[];
  producer: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  audioPath: string;
};

export default function ProductAnalytics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("sales");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const { data: userData } = useLoggedInUser();
  const userId = userData?.data?._id;

  const { data: packsData, isLoading: isLoadingPacksData } =
    useGetProducerPackQuery(userId);
  const packs = packsData?.data;

  // Helper function to filter products by date range
  const filterByDateRange = (packs: Pack[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    return packs.filter((pack) => {
      const releaseDate = new Date(pack.releaseDate);

      switch (timeRange) {
        case "today":
          return releaseDate >= today;
        case "yesterday":
          return releaseDate >= yesterday && releaseDate < today;
        case "thisMonth":
          return releaseDate >= thisMonthStart;
        case "lastMonth":
          return releaseDate >= lastMonthStart && releaseDate <= lastMonthEnd;
        case "yearToDate":
          return releaseDate >= yearStart;
        default:
          return true;
      }
    });
  };

  // Filter packs based on search query and time range
  const filteredPacks = packs
    ? packs.filter(
        (pack: Pack) =>
          pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pack.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredAndSortedPacks = [...filteredPacks].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Calculate total stats with validation to ensure the data is valid
  const totalSales = packs
    ? packs.reduce((sum: number, pack: Pack) => sum + (Number(pack.sales) || 0), 0)
    : 0;
  const totalRevenue = packs
    ? packs.reduce((sum: number, pack: Pack) => sum + (Number(pack.profit) || 0), 0)
    : 0;
  const averageRevenuePerSale =
    totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : "0.00";

  return (
    <div>
      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
          <div className="relative z-10 p-6">
            <div className="text-sm font-medium text-zinc-400">Total Sales</div>
            <div className="mt-2 text-3xl font-bold text-white">
              {totalSales.toLocaleString()}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
        </Card>
        <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
          <div className="relative z-10 p-6">
            <div className="text-sm font-medium text-emerald-500">
              Total Revenue
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              ${totalRevenue.toLocaleString()}.00
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
        </Card>
        <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
          <div className="relative z-10 p-6">
            <div className="text-sm font-medium text-zinc-400">
              Average Revenue Per Sale
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              ${averageRevenuePerSale}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
        </Card>
      </div>

      {/* Search and Time Range Filter */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
          />
        </div>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px] border-zinc-800 bg-zinc-900 text-white">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
            <SelectItem
              value="all"
              className="text-white focus:bg-zinc-800 focus:text-white"
            >
              All Time
            </SelectItem>
            <SelectItem
              value="today"
              className="text-white focus:bg-zinc-800 focus:text-white"
            >
              Today
            </SelectItem>
            <SelectItem
              value="yesterday"
              className="text-white focus:bg-zinc-800 focus:text-white"
            >
              Yesterday
            </SelectItem>
            <SelectItem
              value="thisMonth"
              className="text-white focus:bg-zinc-800 focus:text-white"
            >
              This Month
            </SelectItem>
            <SelectItem
              value="lastMonth"
              className="text-white focus:bg-zinc-800 focus:text-white"
            >
              Last Month
            </SelectItem>
            <SelectItem
              value="yearToDate"
              className="text-white focus:bg-zinc-800 focus:text-white"
            >
              Year to Date
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card className="border-0 bg-[#0F0F0F]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Product
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    <ArrowUpDown
                      className={`h-3 w-3 ${
                        sortField === "name" ? "text-emerald-500" : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                  <button
                    className="flex items-center justify-center gap-1"
                    onClick={() => handleSort("sales")}
                  >
                    Sales
                    <ArrowUpDown
                      className={`h-3 w-3 ${
                        sortField === "sales" ? "text-emerald-500" : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                  <button
                    className="flex items-center justify-center gap-1"
                    onClick={() => handleSort("profit")}
                  >
                    Profit
                    <ArrowUpDown
                      className={`h-3 w-3 ${
                        sortField === "profit" ? "text-emerald-500" : ""
                      }`}
                    />
                  </button>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                  <button
                    className="flex items-center justify-center gap-1"
                    onClick={() => handleSort("releaseDate")}
                  >
                    Release Date
                    <ArrowUpDown
                      className={`h-3 w-3 ${
                        sortField === "releaseDate" ? "text-emerald-500" : ""
                      }`}
                    />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPacks.map((pack) => (
                <tr
                  key={pack._id}
                  className="border-b border-zinc-800 hover:bg-zinc-900/30"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={pack.image}
                        alt={pack.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="text-sm font-medium text-white">
                      {pack.title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-white">
                    {pack.sales}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-emerald-500">
                    ${pack.profit}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-white">
                    {new Date(pack.releaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredAndSortedPacks.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-zinc-400">
            No products found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
