'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Crown } from 'lucide-react';

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

// Temporary mock user data
const mockUser = {
    id: '1',
    email: 'user@example.com',
    role: 'user',
};

export default function DashboardPreviewPage() {
    const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(mockUser);

    useEffect(() => {
        // Simulate loading dashboard data
        const loadDashboard = async () => {
            try {
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
            <div className="relative min-h-screen">
                {/* Blurred Dashboard Content */}
                <div className="blur-sm pointer-events-none">
                    <div className="container mx-auto space-y-8 px-4 py-8">
                        {/* Stats Overview */}
                        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
                                <div className="relative z-10 p-6">
                                    <div className="text-sm font-medium text-zinc-400">
                                        Total Followers
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-white">
                                        4
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                            </Card>
                            <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
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
                            <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
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
                            <Card className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl">
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
                                                <TabsTrigger value="7days">
                                                    7D
                                                </TabsTrigger>
                                                <TabsTrigger value="month">
                                                    1M
                                                </TabsTrigger>
                                                <TabsTrigger value="ytd">
                                                    YTD
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={downloadData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#333"
                                                />
                                                <XAxis
                                                    dataKey="day"
                                                    stroke="#666"
                                                />
                                                <YAxis stroke="#666" />
                                                <Tooltip />
                                                <Area
                                                    type="monotone"
                                                    dataKey="downloads"
                                                    stroke="#10b981"
                                                    fill="url(#downloadGradient)"
                                                />
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
                                                <TabsTrigger value="7days">
                                                    7D
                                                </TabsTrigger>
                                                <TabsTrigger value="month">
                                                    1M
                                                </TabsTrigger>
                                                <TabsTrigger value="ytd">
                                                    YTD
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={salesData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#333"
                                                />
                                                <XAxis
                                                    dataKey="day"
                                                    stroke="#666"
                                                />
                                                <YAxis stroke="#666" />
                                                <Tooltip />
                                                <Area
                                                    type="monotone"
                                                    dataKey="sales"
                                                    stroke="#10b981"
                                                    fill="url(#salesGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* PRO Upgrade Modal */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="max-w-md w-full mx-4 p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Image
                                    src="/isotype.png"
                                    alt="Melody Collab Isotype"
                                    width={32}
                                    height={32}
                                    className="text-emerald-500"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-500 mb-2">
                                BECOME A PRO TO ACCESS
                            </h2>
                            <h3 className="text-xl font-bold text-emerald-500 mb-4">
                                TO ALL ANALYTICS AND...
                            </h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-5 h-5 text-emerald-500">
                                    ✓
                                </div>
                                <span>Upload Unlimited Melodies</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-5 h-5 text-emerald-500">
                                    ✓
                                </div>
                                <span>Sell Sample Packs</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-5 h-5 text-emerald-500">
                                    ✓
                                </div>
                                <span>Custom Sample Pack Store</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-5 h-5 text-emerald-500">
                                    ✓
                                </div>
                                <span>Sell On Producers Marketplace</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-5 h-5 text-emerald-500">
                                    ✓
                                </div>
                                <span>Sell Digital Products</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-5 h-5 text-emerald-500">
                                    ✓
                                </div>
                                <span>Pro Analytics Dashboard</span>
                            </div>
                        </div>

                        <Button
                            asChild
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-medium py-6 text-lg rounded-lg"
                        >
                            <Link href="/checkout-membership">
                                Upgrade to Pro
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
