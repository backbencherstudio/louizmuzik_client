"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Music2, Search, Play, Download, Trash2 } from "lucide-react";
import { ClientPagination } from "@/components/admin/ClientPagination";
import {
  useDeleteMelodyMutation,
  useGetMelodiesQuery,
} from "@/app/store/api/adminApis/adminApis";
import { toast } from "sonner";

type Melody = {
  _id: string;
  name: string;
  producer: string;
  bpm: number;
  key: string;
  genre: string[];
  artistType: string[];
  audioUrl: string;
  image: string;
  splitPercentage: number;
  plays: number;
  downloads: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  userId: {
    email: string;
    _id: string;
  };
};

type LoadingState = {
  [key: string]: boolean;
};

export default function MelodiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<LoadingState>({});
  const [searchTerm, setSearchTerm] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = 20;

  const { data: melodiesData, isLoading, error } = useGetMelodiesQuery(null);

  const allMelodies = melodiesData?.data || [];
  console.log(allMelodies);

  const [deleteMelody, { isLoading: isDeleting }] = useDeleteMelodyMutation();

  // Filter melodies based on search term
  const filteredMelodies = allMelodies.filter(
    (melody: Melody) =>
      melody.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      melody.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      melody.genre.some((g) =>
        g.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Calculate pagination
  const totalMelodies = filteredMelodies.length;
  const totalPages = Math.ceil(totalMelodies / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMelodies = filteredMelodies.slice(startIndex, endIndex);

  const handleDeleteMelody = async (melodyId: string, userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this melody? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [`delete-${melodyId}`]: true }));
      const res = await deleteMelody({ melodyId, userId });
      if (res) {
        toast.success("Melody deleted successfully");
      } else {
        toast.error("Failed to delete melody. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting melody:", error);
      toast.error("Failed to delete melody. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [`delete-${melodyId}`]: false }));
    }
  };

  const handleDownloadMelody = async (melody: Melody) => {
    try {
      setLoading((prev) => ({ ...prev, [`download-${melody._id}`]: true }));
      const response = await fetch(melody.audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${melody.name}.mp3`;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading melody:", error);
      alert("Failed to download melody. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [`download-${melody._id}`]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-zinc-400">Loading melodies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-400">Error loading melodies</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Melody Management</h2>
      </div>

      {/* Search */}
      <div className="bg-zinc-900 p-4 rounded-lg mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search melodies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Melodies Table */}
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Melody
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Producer
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Details
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Stats
                </th>
                <th className="text-left p-4 text-zinc-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMelodies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-zinc-400">
                    No melodies found
                  </td>
                </tr>
              ) : (
                paginatedMelodies.map((melody: Melody) => (
                  <tr
                    key={melody._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <Music2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {melody.name}
                          </div>
                          <div className="text-sm text-zinc-400">
                            Uploaded:{" "}
                            {new Date(melody.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-white">{melody.producer}</div>
                        <div className="text-sm text-zinc-400">
                          {melody?.userId?.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-white">
                          {melody.bpm} BPM · {melody.key}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {melody.genre.join(", ")} ·{" "}
                          {melody.artistType.join(", ")}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Play className="w-4 h-4" />
                          <span>{melody.plays}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Download className="w-4 h-4" />
                          <span>{melody.downloads}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadMelody(melody)}
                          disabled={loading[`download-${melody._id}`]}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-zinc-700 transition-colors"
                          title="Download Melody"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMelody(melody._id, melody.userId._id)
                          }
                          disabled={loading[`delete-${melody._id}`]}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-700 transition-colors"
                          title="Delete Melody"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <ClientPagination total={totalMelodies} limit={limit} />
    </div>
  );
}
