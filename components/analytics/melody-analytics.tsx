'use client';

import { useState, useMemo } from 'react';
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
import { useGetMelodyByUserIdQuery } from '@/app/store/api/melodyApis/melodyApis';
import { useLoggedInUser } from '@/app/store/api/authApis/authApi';

type Melody = {
    _id: string;
    artistType: string[];
    audioUrl: string;
    bpm: number;
    createdAt: string;
    downloads: number;
    favorites: number;
    genre: string[];
    image: string;
    key: string;
    name: string;
    plays: number;
    producer: string;
    splitPercentage: number;
    updatedAt: string;
    userId: string;
    videoUrl: string;
};

type SortField = 'name' | 'plays' | 'downloads' | 'createdAt' | 'genre';
type SortDirection = 'asc' | 'desc';
type TimeRange = 'all' | 'today' | 'yesterday' | 'thisMonth' | 'lastMonth' | 'yearToDate';

export default function MelodyAnalytics() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('plays');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [timeRange, setTimeRange] = useState<TimeRange>('all');

    const { data: userData } = useLoggedInUser();
    const userId = userData?.data?._id;

    const { data: melodyData, isLoading: isLoadingMelodyData } = useGetMelodyByUserIdQuery(userId);
    const melodies = melodyData?.data;
    console.log(melodies);

    // Helper function to filter melodies by date range
    const filterByDateRange = (melodies: Melody[]) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const yearStart = new Date(now.getFullYear(), 0, 1);

        return melodies.filter((melody) => {
            const uploadDate = new Date(melody.createdAt);

            switch (timeRange) {
                case 'today':
                    return uploadDate >= today;
                case 'yesterday':
                    return uploadDate >= yesterday && uploadDate < today;
                case 'thisMonth':
                    return uploadDate >= thisMonthStart;
                case 'lastMonth':
                    return uploadDate >= lastMonthStart && uploadDate <= lastMonthEnd;
                case 'yearToDate':
                    return uploadDate >= yearStart;
                default:
                    return true;
            }
        });
    };

    // Comprehensive filtering and sorting using useMemo for performance
    const filteredAndSortedMelodies = useMemo(() => {
        if (!melodies || melodies.length === 0) return [];

        // First, filter by time range
        let filtered = filterByDateRange(melodies);

        // Then filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((melody: Melody) => {
                // Search in name
                if (melody.name.toLowerCase().includes(query)) return true;
                
                // Search in genre array
                if (melody.genre && Array.isArray(melody.genre)) {
                    if (melody.genre.some(g => g.toLowerCase().includes(query))) return true;
                }
                
                // Search in artist type array
                if (melody.artistType && Array.isArray(melody.artistType)) {
                    if (melody.artistType.some(at => at.toLowerCase().includes(query))) return true;
                }
                
                // Search in producer name
                if (melody.producer && melody.producer.toLowerCase().includes(query)) return true;
                
                // Search in key
                if (melody.key && melody.key.toLowerCase().includes(query)) return true;
                
                return false;
            });
        }

        // Sort the filtered results
        return filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'plays':
                    aValue = a.plays;
                    bValue = b.plays;
                    break;
                case 'downloads':
                    aValue = a.downloads;
                    bValue = b.downloads;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case 'genre':
                    aValue = Array.isArray(a.genre) ? a.genre.join(', ').toLowerCase() : '';
                    bValue = Array.isArray(b.genre) ? b.genre.join(', ').toLowerCase() : '';
                    break;
                default:
                    aValue = a[sortField];
                    bValue = b[sortField];
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    }, [melodies, searchQuery, sortField, sortDirection, timeRange]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Calculate total stats from filtered melodies
    const totalPlays = filteredAndSortedMelodies.reduce((sum: number, melody: Melody) => sum + melody.plays, 0);
    const totalDownloads = filteredAndSortedMelodies.reduce((sum: number, melody: Melody) => sum + melody.downloads, 0);
    const totalFavorites = filteredAndSortedMelodies.reduce((sum: number, melody: Melody) => sum + melody.favorites, 0);

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
                        <div className="mt-2 text-3xl font-bold text-white">{totalPlays.toLocaleString()}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                </Card>
                <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Download className="h-4 w-4 text-emerald-500" />
                            <span className="text-zinc-400">Total Downloads</span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">{totalDownloads.toLocaleString()}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                </Card>
                <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Heart className="h-4 w-4 text-emerald-500" />
                            <span className="text-zinc-400">Total Favorites</span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">{totalFavorites.toLocaleString()}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                </Card>
            </div>

            {/* Search and Time Range Filter */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                        placeholder="Search by melody name, genre, artist type, producer, or key..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                </div>
                <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                    <SelectTrigger className="w-[180px] border-zinc-800 bg-zinc-900 text-white">
                        <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="all" className="text-white focus:bg-zinc-800 focus:text-white">All Time</SelectItem>
                        <SelectItem value="today" className="text-white focus:bg-zinc-800 focus:text-white">Today</SelectItem>
                        <SelectItem value="yesterday" className="text-white focus:bg-zinc-800 focus:text-white">Yesterday</SelectItem>
                        <SelectItem value="thisMonth" className="text-white focus:bg-zinc-800 focus:text-white">This Month</SelectItem>
                        <SelectItem value="lastMonth" className="text-white focus:bg-zinc-800 focus:text-white">Last Month</SelectItem>
                        <SelectItem value="yearToDate" className="text-white focus:bg-zinc-800 focus:text-white">Year to Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-zinc-400">
                Showing {filteredAndSortedMelodies.length} of {melodies?.length || 0} melodies
            </div>

            {/* Melodies Table */}
            <Card className="border-0 bg-[#0F0F0F]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">Melody</th>
                                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                    <button className="flex items-center gap-1" onClick={() => handleSort('name')}>
                                        Name
                                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'name' ? 'text-emerald-500' : ''}`} />
                                    </button>
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button className="flex items-center justify-center gap-1" onClick={() => handleSort('genre')}>
                                        Genre
                                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'genre' ? 'text-emerald-500' : ''}`} />
                                    </button>
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button className="flex items-center justify-center gap-1" onClick={() => handleSort('plays')}>
                                        Plays
                                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'plays' ? 'text-emerald-500' : ''}`} />
                                    </button>
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button className="flex items-center justify-center gap-1" onClick={() => handleSort('downloads')}>
                                        Downloads
                                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'downloads' ? 'text-emerald-500' : ''}`} />
                                    </button>
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                    <button className="flex items-center justify-center gap-1" onClick={() => handleSort('createdAt')}>
                                        Upload Date
                                        <ArrowUpDown className={`h-3 w-3 ${sortField === 'createdAt' ? 'text-emerald-500' : ''}`} />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedMelodies.map((melody) => (
                                <tr key={melody._id} className="border-b border-zinc-800 hover:bg-zinc-900/30">
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                            <Image src={melody.image} alt={melody.name} fill className="object-cover" />
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="text-sm font-medium text-white">{melody.name}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-emerald-500">
                                        {Array.isArray(melody.genre) ? melody.genre.join(', ') : melody.genre}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                                        {melody.plays.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                                        {melody.downloads}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                                        {new Date(melody.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {filteredAndSortedMelodies.length === 0 && (
                <div className="mt-8 text-center">
                    <p className="text-zinc-400">
                        {melodies && melodies.length > 0 
                            ? "No melodies found matching your search criteria." 
                            : "No melodies uploaded yet."}
                    </p>
                </div>
            )}
        </div>
    );
}
