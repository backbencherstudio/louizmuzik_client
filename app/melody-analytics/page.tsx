'use client';

import { useState } from 'react';
import { Download, Heart, Play, Search, ArrowUpDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/layout';

// Sample data for melodies analytics
const melodiesData = [
    {
        id: 1,
        name: 'ZionBaby Emin 94bpm',
        genre: 'Trap',
        plays: 1245,
        downloads: 87,
        favorites: 32,
        uploadDate: '2024-02-15',
    },
    {
        id: 2,
        name: 'Big Call 100bpm A#Min',
        genre: 'Hip Hop',
        plays: 876,
        downloads: 54,
        favorites: 21,
        uploadDate: '2024-02-10',
    },
    {
        id: 3,
        name: 'FREE SITAR TRAP 120 F MINOR',
        genre: 'Trap',
        plays: 2345,
        downloads: 156,
        favorites: 78,
        uploadDate: '2024-01-25',
    },
    {
        id: 4,
        name: 'Vuelve C# Minor 96bpm',
        genre: 'Reggaeton',
        plays: 3421,
        downloads: 210,
        favorites: 98,
        uploadDate: '2024-01-15',
    },
    {
        id: 5,
        name: 'Antes 91bpm C#Min',
        genre: 'Latin',
        plays: 1876,
        downloads: 132,
        favorites: 65,
        uploadDate: '2024-01-05',
    },
    {
        id: 6,
        name: 'Summer Vibes 120bpm',
        genre: 'Pop',
        plays: 987,
        downloads: 76,
        favorites: 43,
        uploadDate: '2023-12-20',
    },
    {
        id: 7,
        name: 'Midnight Dreams G Min',
        genre: 'R&B',
        plays: 1543,
        downloads: 98,
        favorites: 54,
        uploadDate: '2023-12-10',
    },
    {
        id: 8,
        name: 'Urban Flow 140bpm',
        genre: 'Hip Hop',
        plays: 2156,
        downloads: 143,
        favorites: 87,
        uploadDate: '2023-11-30',
    },
];

type SortField =
    | 'name'
    | 'genre'
    | 'plays'
    | 'downloads'
    | 'favorites'
    | 'uploadDate';
type SortDirection = 'asc' | 'desc';

export default function AnalyticsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [timeRange, setTimeRange] = useState('all');
    const [sortField, setSortField] = useState<SortField>('plays');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // Calculate total stats
    const totalPlays = melodiesData.reduce(
        (sum, melody) => sum + melody.plays,
        0
    );
    const totalDownloads = melodiesData.reduce(
        (sum, melody) => sum + melody.downloads,
        0
    );
    const totalFavorites = melodiesData.reduce(
        (sum, melody) => sum + melody.favorites,
        0
    );

    // Filter melodies based on search query and time range
    const filteredMelodies = melodiesData.filter((melody) => {
        const matchesSearch =
            melody.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            melody.genre.toLowerCase().includes(searchQuery.toLowerCase());

        if (timeRange === 'all') return matchesSearch;

        const today = new Date();
        const uploadDate = new Date(melody.uploadDate);
        const diffTime = Math.abs(today.getTime() - uploadDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeRange === 'week') return matchesSearch && diffDays <= 7;
        if (timeRange === 'month') return matchesSearch && diffDays <= 30;
        if (timeRange === 'year') return matchesSearch && diffDays <= 365;

        return matchesSearch;
    });

    // Sort melodies
    const sortedMelodies = [...filteredMelodies].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
        } else {
            return a[sortField] < b[sortField] ? 1 : -1;
        }
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    return (
        <Layout>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Melody Analytics
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        Track the performance of your uploaded melodies
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-2">
                                <Play className="h-5 w-5 text-emerald-500" />
                                <div className="text-sm font-medium text-zinc-400">
                                    Total Plays
                                </div>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                {totalPlays.toLocaleString()}
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-2">
                                <Download className="h-5 w-5 text-emerald-500" />
                                <div className="text-sm font-medium text-zinc-400">
                                    Total Downloads
                                </div>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                {totalDownloads.toLocaleString()}
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-emerald-500" />
                                <div className="text-sm font-medium text-zinc-400">
                                    Total Favorites
                                </div>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                {totalFavorites.toLocaleString()}
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                placeholder="Search by melody name or genre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px] border-zinc-800 bg-zinc-900 text-white">
                            <SelectValue placeholder="Time range" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Melodies Table */}
                <Card className="border-0 bg-[#0F0F0F]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        <button
                                            className="flex items-center gap-1"
                                            onClick={() => handleSort('name')}
                                        >
                                            Melody Name
                                            <ArrowUpDown
                                                className={`h-3 w-3 ${
                                                    sortField === 'name'
                                                        ? 'text-emerald-500'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        <button
                                            className="flex items-center gap-1"
                                            onClick={() => handleSort('genre')}
                                        >
                                            Genre
                                            <ArrowUpDown
                                                className={`h-3 w-3 ${
                                                    sortField === 'genre'
                                                        ? 'text-emerald-500'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-zinc-400">
                                        <button
                                            className="flex items-center justify-end gap-1"
                                            onClick={() => handleSort('plays')}
                                        >
                                            Plays
                                            <ArrowUpDown
                                                className={`h-3 w-3 ${
                                                    sortField === 'plays'
                                                        ? 'text-emerald-500'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-zinc-400">
                                        <button
                                            className="flex items-center justify-end gap-1"
                                            onClick={() =>
                                                handleSort('downloads')
                                            }
                                        >
                                            Downloads
                                            <ArrowUpDown
                                                className={`h-3 w-3 ${
                                                    sortField === 'downloads'
                                                        ? 'text-emerald-500'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-zinc-400">
                                        <button
                                            className="flex items-center justify-end gap-1"
                                            onClick={() =>
                                                handleSort('favorites')
                                            }
                                        >
                                            Favorites
                                            <ArrowUpDown
                                                className={`h-3 w-3 ${
                                                    sortField === 'favorites'
                                                        ? 'text-emerald-500'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-zinc-400">
                                        <button
                                            className="flex items-center justify-end gap-1"
                                            onClick={() =>
                                                handleSort('uploadDate')
                                            }
                                        >
                                            Upload Date
                                            <ArrowUpDown
                                                className={`h-3 w-3 ${
                                                    sortField === 'uploadDate'
                                                        ? 'text-emerald-500'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMelodies.map((melody) => (
                                    <tr
                                        key={melody.id}
                                        className="border-b border-zinc-800 hover:bg-zinc-900/30"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                                            {melody.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                            {melody.genre}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-white">
                                            <div className="flex items-center justify-end gap-1">
                                                <Play className="h-3.5 w-3.5 text-emerald-500" />
                                                {melody.plays.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-white">
                                            <div className="flex items-center justify-end gap-1">
                                                <Download className="h-3.5 w-3.5 text-emerald-500" />
                                                {melody.downloads.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-white">
                                            <div className="flex items-center justify-end gap-1">
                                                <Heart className="h-3.5 w-3.5 text-emerald-500" />
                                                {melody.favorites.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-zinc-400">
                                            {new Date(
                                                melody.uploadDate
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Empty State */}
                {sortedMelodies.length === 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-zinc-400">
                            No melodies found matching your search criteria.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
