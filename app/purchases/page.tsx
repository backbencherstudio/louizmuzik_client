"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Download } from "lucide-react";
import Layout from "@/components/layout";
import { useGetPurchasedPacksQuery } from "../store/api/packApis/packApis";
import { useLoggedInUser } from "../store/api/authApis/authApi";

export default function PurchasesPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const { data: user, refetch } = useLoggedInUser();
  const userData = user?.data;
  const { data: purchasedPacks, isLoading: isPurchasedPacksLoading } =
    useGetPurchasedPacksQuery(userData?._id);
  const packs = purchasedPacks?.data;
  console.log(49, packs);

  const handleDownload = async (downloadUrl: string, fileName: string) => {
    if (!downloadUrl) {
      setDownloadError("Download URL not available");
      setTimeout(() => setDownloadError(""), 3000);
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadError("");
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      setDownloadError("Failed to download file");
      setTimeout(() => setDownloadError(""), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Show loading state
  if (isPurchasedPacksLoading) {
    return (
      <Layout>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">My Purchases</h1>
              <p className="mt-2 text-zinc-400">
                History of all your purchases and available downloads
              </p>
            </div>
            <div className="text-center py-12">
              <p className="text-zinc-400">Loading your purchases...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">My Purchases</h1>
            <p className="mt-2 text-zinc-400">
              History of all your purchases and available downloads
            </p>
          </div>

          {/* Desktop and Laptop View */}
          <div className="hidden md:block">
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800">
              <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-zinc-400 border-b border-zinc-800">
                <div className="col-span-2">Product</div>
                <div>Date</div>
                <div>Price</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-zinc-800">
                {packs?.map((pack: any) => (
                  <div
                    key={pack._id}
                    className="grid grid-cols-5 gap-4 p-4 items-center"
                  >
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
                        <img
                          src={pack.packId?.thumbnail_image || '/placeholder-image.jpg'}
                          alt={pack.packId?.title || 'Sample Pack'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {pack.packId?.title || 'Unknown Pack'}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          by {pack.selectedProducerId?.producer_name || 'Unknown Producer'}
                        </p>
                      </div>
                    </div>
                    <div className="text-zinc-400">
                      {formatDistanceToNow(new Date(pack.createdAt), {
                        addSuffix: true,
                        locale: enUS,
                      })}
                    </div>
                    <div className="text-white font-medium">
                      ${pack.price || '0.00'}
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          handleDownload(
                            pack.packId?.zip_path || pack.packId?.audio_path,
                            `${(pack.packId?.title || 'sample-pack')
                              .toLowerCase()
                              .replace(/\s+/g, "-")}.zip`
                          )
                        }
                        disabled={isDownloading || !pack.packId?.zip_path}
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-white rounded-lg transition-colors ${
                          isDownloading || !pack.packId?.zip_path
                            ? "bg-zinc-500/50 cursor-not-allowed"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        <Download size={16} />
                        <span className="hidden xl:inline">
                          {isDownloading ? "Downloading..." : "Download"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {packs?.map((pack: any) => (
              <div
                key={pack._id}
                className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                    <img
                      src={pack.packId?.thumbnail_image || '/placeholder-image.jpg'}
                      alt={pack.packId?.title || 'Sample Pack'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      {pack.packId?.title || 'Unknown Pack'}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      by {pack.selectedProducerId?.producer_name || 'Unknown Producer'}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {formatDistanceToNow(new Date(pack.createdAt), {
                        addSuffix: true,
                        locale: enUS,
                      })}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-zinc-400">Price</p>
                    <p className="text-white font-medium">
                      ${pack.price || '0.00'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() =>
                      handleDownload(
                        pack.packId?.zip_path || pack.packId?.audio_path,
                        `${(pack.packId?.title || 'sample-pack')
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.zip`
                      )
                    }
                    disabled={isDownloading || !pack.packId?.zip_path}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                      isDownloading || !pack.packId?.zip_path
                        ? "bg-zinc-500/50 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    <Download size={16} />
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(!packs || packs.length === 0) && !isPurchasedPacksLoading && (
            <div className="text-center py-12">
              <p className="text-zinc-400">
                You haven&apos;t made any purchases yet.
              </p>
            </div>
          )}

          {/* Error Toast */}
          {downloadError && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
              {downloadError}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}