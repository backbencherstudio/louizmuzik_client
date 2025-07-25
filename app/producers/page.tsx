"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/layout";
import { useAllProducersDataWithTopProducersDataQuery } from "../store/api/userManagementApis/userManagementApis";
// Removed: import { Pagination } from "../components/admin/Pagination";

const countries = [
  "United States",
  "UK",
  "Canada",
  "India",
  "France",
  "Germany",
  "Spain",
];

export default function ProducersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("GLOBAL");
  // Removed: const [currentPage, setCurrentPage] = useState(1);
  // Removed: const producersPerPage = 20;

  const { data: producersData, isLoading: isProducersDataLoading } =
    useAllProducersDataWithTopProducersDataQuery(null);

  console.log("producersData", producersData);

  const topProducers = producersData?.data?.top5Producers || [];
  const allProducers = producersData?.data?.allProducers || [];

  // Filter producers based on search query and country
  const filteredProducers = allProducers.filter((producer:any) => {
    const name = producer.name || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "GLOBAL" || producer.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  // Calculate pagination
  // Removed: const totalPages = Math.ceil(filteredProducers.length / producersPerPage);
  // Removed: const currentProducers = filteredProducers.slice((currentPage - 1) * producersPerPage, currentPage * producersPerPage);

  const handleSearch = () => {
    // Removed: setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSelectedCountry("GLOBAL");
    setSearchQuery("");
    // Removed: setCurrentPage(1);
  };

  // Loading state
  if (isProducersDataLoading) {
    return (
      <Layout>
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-8 lg:mt-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-white text-lg">Loading producers...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-8 lg:mt-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              All Producers
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Search producers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 border-zinc-800 bg-zinc-900/90 text-white placeholder:text-zinc-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-11 px-6 bg-emerald-500 text-black hover:bg-emerald-600"
              >
                Search Now
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <div className="flex overflow-hidden rounded-lg border border-emerald-500/20">
              <Button
                variant="ghost"
                className={`px-6 py-2 text-sm transition-colors ${
                  selectedCountry === "GLOBAL"
                    ? "bg-emerald-500 text-black hover:bg-emerald-600"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                onClick={() => setSelectedCountry("GLOBAL")}
              >
                GLOBAL
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`px-6 py-2 text-sm transition-colors flex items-center gap-2 ${
                      selectedCountry !== "GLOBAL"
                        ? "bg-emerald-500 text-black hover:bg-emerald-600"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {selectedCountry === "GLOBAL"
                      ? "BY COUNTRY"
                      : selectedCountry}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[200px] bg-zinc-900 border-zinc-800"
                >
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                      className="text-white hover:bg-zinc-800 hover:text-emerald-500"
                    >
                      {country}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={handleClearFilter}
              variant="link"
              className="text-white hover:text-emerald-500 hover:no-underline"
            >
              Clear Filter
            </Button>
          </div>

          {/* Top Producers */}
          {topProducers.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-emerald-500">
                Top Producers
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {topProducers.map((producer:any) => (
                  <Link
                    key={producer._id}
                    href={`/producers/${producer._id}`}
                    className="group block overflow-hidden rounded-lg bg-[#0f0f0f] p-4 transition-colors hover:bg-[#0f0f0f]/80"
                  >
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-zinc-800">
                      <Image
                        src={
                          producer.profile_image ||
                          "/images/profiles/banner-profile.jpg"
                        }
                        alt={producer.name || "Producer"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="text-center text-sm font-medium text-white group-hover:text-emerald-500">
                        {producer.name || "Unknown Producer"}
                      </h3>
                      {producer.isPro && (
                        <Image
                          src="/verified-badge.png"
                          alt="Verified"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Producers */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-emerald-500">
              All Producers
            </h2>

            {filteredProducers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-lg">
                  {allProducers.length === 0
                    ? "No producers found."
                    : "No producers match your search criteria."}
                </p>
                {filteredProducers.length === 0 && allProducers.length > 0 && (
                  <Button
                    onClick={handleClearFilter}
                    className="mt-4 bg-emerald-500 text-black hover:bg-emerald-600"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {filteredProducers.map((producer:any) => (
                    <Link
                      key={producer._id}
                      href={`/producers/${producer._id}`}
                      className="group block overflow-hidden rounded-lg bg-[#0f0f0f] p-4 transition-colors hover:bg-[#0f0f0f]/80"
                    >
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-zinc-800">
                        <Image
                          src={
                            producer.profile_image ||
                            "/images/profiles/banner-profile.jpg"
                          }
                          alt={producer.name || "Producer"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <h3 className="text-center text-sm font-medium text-white group-hover:text-emerald-500">
                          {producer.name || "Unknown Producer"}
                        </h3>
                        {producer.isPro && (
                          <Image
                            src="/verified-badge.png"
                            alt="Verified"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
