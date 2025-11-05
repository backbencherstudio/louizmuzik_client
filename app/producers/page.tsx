"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import Layout from "@/components/layout";
import { useAllProducersDataWithTopProducersDataQuery } from "../store/api/userManagementApis/userManagementApis";
import countries from "@/components/Data/country";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProducersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("GLOBAL");
  const [currentPage, setCurrentPage] = useState(1);
  const producersPerPage = 60;

  const { data: producersData, isLoading: isProducersDataLoading } =
    useAllProducersDataWithTopProducersDataQuery(null);

  const topProducers = producersData?.data?.top5Producers || [];
  const allProducers = producersData?.data?.allProducers || [];

  // Filter producers based on search query and country
  const filteredProducers = allProducers.filter((producer: any) => {
    const name = producer.name || producer.producer_name || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "GLOBAL" || producer.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  // Calculate pagination
  const totalItems = filteredProducers.length;
  const totalPages = Math.ceil(totalItems / producersPerPage);
  const startIndex = (currentPage - 1) * producersPerPage;
  const endIndex = startIndex + producersPerPage;
  const currentProducers = filteredProducers.slice(startIndex, endIndex);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSelectedCountry("GLOBAL");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setCurrentPage(1);
  };

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
            <div className="flex items-center">
              <Button
                variant="ghost"
                className={`px-6 py-2 text-sm transition-colors ${
                  selectedCountry === "GLOBAL"
                    ? "bg-emerald-500 text-black hover:bg-emerald-600"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-100"
                }`}
                onClick={() => handleCountrySelect("GLOBAL")}
              >
                GLOBAL
              </Button>
              <div>
                <Select
                  value={selectedCountry === "GLOBAL" ? "" : selectedCountry}
                  onValueChange={handleCountrySelect}
                >
                  <SelectTrigger className="w-48  text-white">
                    <SelectValue
                      placeholder="Select Country"
                      className="text-white"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 h-96">
                    {countries.map((country) => (
                      <SelectItem
                        key={country}
                        value={country}
                        className="text-white hover:bg-zinc-800 hover:text-emerald-500 focus:bg-zinc-800 focus:text-emerald-500"
                      >
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          {isProducersDataLoading ? (
            <div className="flex justify-center items-center">
              <Loader className="text-2xl text-emerald-500 animate-spin" />
            </div>
          ) : (
            <>
              {topProducers.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-emerald-500">
                    Top Producers
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {topProducers.map((producer: any) => (
                      <Link
                        key={producer._id}
                        href={`/producers/${producer._id}`}
                        className="group block overflow-hidden rounded-lg bg-[#0f0f0f] p-4 transition-colors hover:bg-[#0f0f0f]/80"
                      >
                        <div className="bg-gradient-to-bl to-[#181818] from-[#504b4f] p-4 mb-4 rounded-xl group-hover:scale-105 transition-transform duration-300">
                          <div className="relative  aspect-square overflow-hidden rounded  shadow-[-5px_10px_8px_0px] shadow-black/50  group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={
                                producer.profile_image ||
                                "/images/profiles/banner-profile.jpg"
                              }
                              alt={producer.producer_name || "Producer"}
                              fill
                              className="object-cover transition-transform duration-300  shadow-lg  shadow-black/20  "
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <h3 className="text-center text-sm font-medium text-white group-hover:text-emerald-500">
                            {producer?.producer_name ||
                              producer?.name ||
                              "Unknown Producer"}
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
            </>
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
                  {isProducersDataLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader className="text-2xl text-emerald-500 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {currentProducers.map((producer: any) => (
                        <Link
                          key={producer._id}
                          href={`/producers/${producer._id}`}
                          className="group block overflow-hidden rounded-lg bg-[#0f0f0f] p-4 transition-colors hover:bg-[#0f0f0f]/80"
                        >
                          <div className="bg-gradient-to-bl to-[#181818] from-[#504b4f] p-4 mb-4 rounded-xl group-hover:scale-105 transition-transform duration-300">
                            <div className="relative  aspect-square overflow-hidden rounded  shadow-[-5px_10px_8px_0px] shadow-black/50  group-hover:scale-105 transition-transform duration-300">
                              <Image
                                src={
                                  producer.profile_image ||
                                  "/images/profiles/banner-profile.jpg"
                                }
                                alt={
                                  producer?.producer_name ||
                                  producer?.name ||
                                  "Producer"
                                }
                                fill
                                className="object-cover transition-transform duration-300 "
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <h3 className="text-center text-sm font-medium text-white group-hover:text-emerald-500">
                              {producer.producer_name || "Unknown Producer"}
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
                    </>
                  )}
                </div>

                {/* Pagination */}
                <div className="mt-6 mb-24">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalItems}
                    itemsPerPage={producersPerPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
