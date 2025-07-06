'use client';

import React from 'react';
import Layout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { MelodiesTable } from '@/components/melodies-table';
import { SamplePackCard } from '@/components/sample-pack-card';

export default function FavoritesPage() {
    // Mock data for sample packs - Replace with real data later
    const samplePacks = [
        {
            id: 1,
            title: 'Trap Essentials Vol. 1',
            producer: 'Thunder Beatz',
            price: 29.99,
            imageUrl: '/sample-packs/trap-essentials.jpg',
            isFavorite: true,
        },
        {
            id: 2,
            title: 'Lo-Fi Dreams',
            producer: 'Chill Master',
            price: 19.99,
            imageUrl: '/sample-packs/lofi-dreams.jpg',
            isFavorite: true,
        },
    ];

    // Mock data for melodies - Replace with real data later
    const melodies = [
        {
            id: 1,
            title: 'Summer Vibes',
            producer: 'Thunder Beatz',
            bpm: 140,
            key: 'C minor',
            genre: 'Trap',
            instrument: 'Piano',
            isFavorite: true,
        },
        {
            id: 2,
            title: 'Night Sky',
            producer: 'Chill Master',
            bpm: 95,
            key: 'G major',
            genre: 'Lo-Fi',
            instrument: 'Guitar',
            isFavorite: true,
        },
    ];

    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Page Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            My Favorites
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            Your favorite melodies and sample packs in one
                            place.
                        </p>
                    </div>

                    {/* Favorite Sample Packs Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Favorite Sample Packs
                        </h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {samplePacks.map((pack) => (
                                <SamplePackCard
                                    key={pack.id}
                                    title={pack.title}
                                    producer={pack.producer}
                                    price={pack.price}
                                    imageUrl={pack.imageUrl}
                                    isFavorite={pack.isFavorite}
                                />
                            ))}
                        </div>
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
