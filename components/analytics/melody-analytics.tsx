'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpDown, Search, Play, Download, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Sample data for melody analytics
const melodiesData = [
    {
        id: 1,
        name: 'Summer Vibes',
        genre: 'Pop',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        plays: 1250,
        downloads: 45,
        uploadDate: '2024-02-15',
        favorites: 120,
    },
    {
        id: 2,
        name: 'Urban Flow',
        genre: 'Hip Hop',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        plays: 980,
        downloads: 32,
        uploadDate: '2024-02-10',
        favorites: 98,
    },
    {
        id: 3,
        name: 'Midnight Jazz',
        genre: 'Jazz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        plays: 750,
        downloads: 28,
        uploadDate: '2024-01-25',
        favorites: 85,
    },
    {
        id: 4,
        name: 'Electronic Dreams',
        genre: 'Electronic',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        plays: 620,
        downloads: 25,
        uploadDate: '2024-01-15',
        favorites: 95,
    },
    {
        id: 5,
        name: 'Acoustic Sunset',
        genre: 'Acoustic',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        plays: 480,
        downloads: 20,
        uploadDate: '2024-01-05',
        favorites: 80,
    },
];

type SortField = 'name' | 'plays' | 'downloads' | 'uploadDate' | 'genre';
type SortDirection = 'asc' | 'desc';
type TimeRange =
    | 'all'
    | 'today'
    | 'yesterday'
    | 'thisMonth'
    | 'lastMonth'
    | 'yearToDate';

export default function MelodyAnalytics() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('plays');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [timeRange, setTimeRange] = useState<TimeRange>('all');

    // Helper function to filter melodies by date range
    const filterByDateRange = (melodies: typeof melodiesData) => {
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const yearStart = new Date(now.getFullYear(), 0, 1);

        return melodies.filter((melody) => {
            const uploadDate = new Date(melody.uploadDate);

            switch (timeRange) {
                case 'today':
                    return uploadDate >= today;
                case 'yesterday':
                    return uploadDate >= yesterday && uploadDate < today;
                case 'thisMonth':
                    return uploadDate >= thisMonthStart;
                case 'lastMonth':
                    return (
                        uploadDate >= lastMonthStart &&
                        uploadDate <= lastMonthEnd
                    );
                case 'yearToDate':
                    return uploadDate >= yearStart;
                default:
                    return true;
            }
        });
    };

    // Filter melodies based on search query and time range
    const filteredMelodies = melodiesData
        .filter(
            (melody) =>
                melody.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                melody.genre.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((melody) => filterByDateRange([melody]).length > 0);

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
    const averagePlaysPerDownload =
        totalDownloads > 0 ? (totalPlays / totalDownloads).toFixed(2) : '0.00';

    return (
        <div>
            {/* Stats Overview */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Play className="h-4 w-4 text-emerald-500" />
                            <span className="text-zinc-400">Total Plays</span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {totalPlays.toLocaleString()}
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                </Card>
                <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Download className="h-4 w-4 text-emerald-500" />
                            <span className="text-zinc-400">
                                Total Downloads
                            </span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {totalDownloads.toLocaleString()}
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                </Card>
                <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Heart className="h-4 w-4 text-emerald-500" />
                            <span className="text-zinc-400">
                                Total Favorites
                            </span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {totalFavorites.toLocaleString()}
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
                        placeholder="Search by melody name or genre..."
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

            {/* Melodies Table */}
            <Card className="border-0 bg-[#0F0F0F]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                    Melody
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                    <button
                                        className="flex items-center gap-1"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                        <ArrowUpDown
                                            className={`h-3 w-3 ${
                                                sortField === 'name'
                                                    ? 'text-emerald-500'
                                                    : ''
                                            }`}
                                        />
                                    </button>
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button
                                        className="flex items-center justify-center gap-1"
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
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button
                                        className="flex items-center justify-center gap-1"
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
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button
                                        className="flex items-center justify-center gap-1"
                                        onClick={() => handleSort('downloads')}
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
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button
                                        className="flex items-center justify-center gap-1"
                                        onClick={() => handleSort('uploadDate')}
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
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                            <Image
                                                src={melody.image}
                                                alt={melody.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="text-sm font-medium text-white">
                                            {melody.name}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-emerald-500">
                                        {melody.genre}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-white">
                                        {melody.plays.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-white">
                                        {melody.downloads}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-white">
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
    );
}
