'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import Layout from '@/components/layout';
import { useLoggedInUserQuery } from '../store/api/authApis/authApi';

// Temporary mock user data
const mockUser = {
    id: '1',
    email: 'user@example.com',
    role: 'user',
};
const formatedFollowers = (followers: number) => {
    if(followers>=1000000){
        return `${(followers/1000000).toFixed(1)}M`
    }else if (followers>=1000){
        return `${(followers/1000).toFixed(1)}K`
    }else{
        return followers;
    }
}
export default function DashboardPage() {
    const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(mockUser);
    const { data: userData, error, isLoading: isLoadingUser } = useLoggedInUserQuery(null);
    console.log("user data dashboard", userData);
    const followers = userData?.data?.followersCounter;
    const totalFollowers = formatedFollowers(followers || 0);
    

    useEffect(() => {
        // Simulate loading dashboard data
        const loadDashboard = async () => {
            try {
                // Here you would typically fetch user data and dashboard stats
                // For now, we'll just simulate a loading delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setUser(mockUser);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading dashboard:', error);
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // Sample data for the charts
    const downloadData = [
        { day: 'Mon', downloads: 12 },
        { day: 'Tue', downloads: 8 },
        { day: 'Wed', downloads: 15 },
        { day: 'Thu', downloads: 10 },
        { day: 'Fri', downloads: 20 },
        { day: 'Sat', downloads: 18 },
        { day: 'Sun', downloads: 15 },
    ];

    const salesData = [
        { day: 'Mon', sales: 0 },
        { day: 'Tue', sales: 50 },
        { day: 'Wed', sales: 30 },
        { day: 'Thu', sales: 80 },
        { day: 'Fri', sales: 20 },
        { day: 'Sat', sales: 40 },
        { day: 'Sun', sales: 60 },
    ];

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-zinc-400">Loading...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto space-y-8 px-4 py-8">
                {/* Stats Overview */}
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="text-sm font-medium text-zinc-400">
                                Total Followers
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                {totalFollowers}
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>
                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="text-sm font-medium text-zinc-400">
                                Total Plays
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                188
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>
                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="text-sm font-medium text-zinc-400">
                                Total Downloads
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                66
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>
                    <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]">
                        <div className="relative z-10 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-emerald-500">
                                        Sales Revenue
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-white">
                                        $0
                                    </div>
                                </div>
                                <Link
                                    href="/sales"
                                    className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                                >
                                    All Sales
                                </Link>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </Card>
                </div>

                {/* Charts */}
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                    <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">
                                    Download Graph
                                </h3>
                                <Tabs
                                    defaultValue="7days"
                                    className="space-y-4"
                                >
                                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
                                        <TabsTrigger
                                            value="7days"
                                            className="data-[state=active]:bg-emerald-500"
                                        >
                                            <span className="hidden md:inline">
                                                Last 7 Days
                                            </span>
                                            <span className="md:hidden">
                                                7D
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="month"
                                            className="data-[state=active]:bg-emerald-500"
                                        >
                                            <span className="hidden md:inline">
                                                This Month
                                            </span>
                                            <span className="md:hidden">
                                                1M
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="ytd"
                                            className="data-[state=active]:bg-emerald-500"
                                        >
                                            <span className="hidden md:inline">
                                                YTD
                                            </span>
                                            <span className="md:hidden">
                                                YTD
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={downloadData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#333"
                                        />
                                        <XAxis dataKey="day" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#18181b',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow:
                                                    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="downloads"
                                            stroke="#10b981"
                                            fill="url(#downloadGradient)"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="downloadGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>

                    <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">
                                    Sales Overview
                                </h3>
                                <Tabs
                                    defaultValue="7days"
                                    className="space-y-4"
                                >
                                    <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
                                        <TabsTrigger
                                            value="7days"
                                            className="data-[state=active]:bg-emerald-500"
                                        >
                                            <span className="hidden md:inline">
                                                Last 7 Days
                                            </span>
                                            <span className="md:hidden">
                                                7D
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="month"
                                            className="data-[state=active]:bg-emerald-500"
                                        >
                                            <span className="hidden md:inline">
                                                This Month
                                            </span>
                                            <span className="md:hidden">
                                                1M
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="ytd"
                                            className="data-[state=active]:bg-emerald-500"
                                        >
                                            <span className="hidden md:inline">
                                                YTD
                                            </span>
                                            <span className="md:hidden">
                                                YTD
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#333"
                                        />
                                        <XAxis dataKey="day" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#18181b',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow:
                                                    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#10b981"
                                            fill="url(#salesGradient)"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="salesGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content Sections */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Top Melodies */}
                    <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">
                                    Top Melodies
                                </h2>
                                <Link
                                    href="/analytics?tab=melodies"
                                    className="text-sm text-emerald-500 hover:text-emerald-400"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {[
                                    {
                                        duration: '2:34',
                                        waveform: ' ▂▃▅▂▇▂▅▃▂ ',
                                    },
                                    {
                                        duration: '0:10',
                                        waveform: ' ▃▂▅▂▂▇▃▂ ',
                                    },
                                    {
                                        duration: '0:20',
                                        waveform: ' ▅▂▂▃▇▂▂▃ ',
                                    },
                                ].map((track, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-zinc-800/50"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-full bg-zinc-800/50 hover:bg-emerald-500/20 hover:text-emerald-500 transition-all"
                                        >
                                            <Play className="h-5 w-5 text-white" />
                                        </Button>
                                        <div className="flex-1 text-sm font-medium text-zinc-400">
                                            {track.waveform}
                                        </div>
                                        <div className="text-sm text-zinc-500">
                                            {track.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Latest Packs */}
                    <Card className="overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">
                                    Latest Packs
                                </h2>
                                <Link
                                    href="/analytics?tab=products"
                                    className="text-sm text-emerald-500 hover:text-emerald-400"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    {
                                        title: 'Bumper Pack Vol.1',
                                        artist: 'Thunder Beatz',
                                        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
                                    },
                                    {
                                        title: 'Radio Lotto Pack',
                                        artist: 'Thunder Beatz',
                                        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
                                    },
                                    {
                                        title: 'Old School Pack',
                                        artist: 'Thunder Beatz',
                                        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
                                    },
                                ].map((pack, i) => (
                                    <Link
                                        key={i}
                                        href="#"
                                        className="group block"
                                    >
                                        <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800/50">
                                            <Image
                                                src={
                                                    pack.image ||
                                                    '/placeholder.svg'
                                                }
                                                alt={pack.title}
                                                width={200}
                                                height={200}
                                                className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-75"
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-sm font-medium text-white group-hover:text-emerald-500 transition-colors">
                                                {pack.title}
                                            </div>
                                            <div className="text-xs text-emerald-500">
                                                {pack.artist}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
