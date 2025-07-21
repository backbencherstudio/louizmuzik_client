"use client";

import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { Card } from "@/components/ui/card";
import { MelodiesTable } from "@/components/melodies-table";
import { SamplePackCard } from "@/components/sample-pack-card";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import {
  useFavoritePackMutation,
  useGetFavoritePackQuery,
} from "../store/api/packApis/packApis";

export default function FavoritesPage() {
  const { data: user, refetch: refetchUser } = useLoggedInUser();
  const userId = user?.data?._id;
  const { data: favoritePack, refetch: refetchFavorites } = useGetFavoritePackQuery(
    { id: userId },
    { skip: !userId }
  );

  const [favorite, { isLoading: isFavoritePackLoading }] =
    useFavoritePackMutation();

  const favouritePacks = favoritePack?.data?.packs || [];

  const handleFavoriteClick = async (packId: string) => {
    try {
      await favorite({ id: packId, userId: userId });
      // Refetch both user data and favorites to ensure consistency
      await Promise.all([refetchUser(), refetchFavorites()]);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  const isPackFavorite = (packId: string) => {
    return user?.data?.favourite_packs?.includes(packId) || false;
  };
  
  // Refetch data when user changes
  useEffect(() => {
    if (userId) {
      refetchFavorites();
    }
  }, [userId, refetchFavorites]);

  // Mock data for melodies - Replace with real data later
  const melodies = [
    {
      id: 1,
      title: "Summer Vibes",
      producer: "Thunder Beatz",
      bpm: 140,
      key: "C minor",
      genre: "Trap",
      instrument: "Piano",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Night Sky",
      producer: "Chill Master",
      bpm: 95,
      key: "G major",
      genre: "Lo-Fi",
      instrument: "Guitar",
      isFavorite: true,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
            <p className="mt-2 text-zinc-400">
              Your favorite melodies and sample packs in one place.
            </p>
          </div>

          {/* Favorite Sample Packs Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Favorite Sample Packs
            </h2>
            {favouritePacks.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">
                No favorite sample packs yet. Start exploring to add some!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favouritePacks.map((pack: any) => (
                  <SamplePackCard
                    key={pack._id}
                    title={pack.title}
                    producer={pack.producer}
                    price={pack.price}
                    imageUrl={pack.thumbnail_image}
                    isFavorite={isPackFavorite(pack._id)}
                    id={pack._id}
                    handleFavoriteClick={() => handleFavoriteClick(pack._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Favorite Melodies Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Favorite Melodies
            </h2>
            <Card className="border-0 bg-[#0F0F0F] overflow-hidden">
              <MelodiesTable melodies={melodies} />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
