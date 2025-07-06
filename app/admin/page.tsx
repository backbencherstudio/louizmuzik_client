'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
    Users,
    Music2,
    Package,
    DollarSign,
    UserMinus,
    Star,
    Search,
    X,
    UserPlus,
    Download,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import FeaturedProducts from './featured-products';

interface Stats {
    activeUsers: number;
    proUsers: number;
    freeUsers: number;
    totalMelodies: number;
    totalDownloads: number;
    totalSamplePacks: number;
    totalRevenue: number;
    mrr: number;
    churnRate: number;
}

interface FeaturedProduct {
    id: string;
    title: string;
    producer: string;
    price: number;
    image: string;
    isFeatured: boolean;
    genre?: string;
}

export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<FeaturedProduct[]>([
        {
            id: '1',
            title: 'Summer Beats Pack',
            producer: 'Producer Name',
            price: 29.99,
            image: '/placeholder.png',
            isFeatured: true,
            genre: 'Hip Hop',
        },
        {
            id: '2',
            title: 'Urban Drums Vol. 1',
            producer: 'Another Producer',
            price: 19.99,
            image: '/placeholder.png',
            isFeatured: false,
            genre: 'Trap',
        },
        {
            id: '3',
            title: 'Melodic Samples 2024',
            producer: 'Top Producer',
            price: 24.99,
            image: '/placeholder.png',
            isFeatured: false,
            genre: 'R&B',
        },
        // Add more sample products as needed
    ]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/statistics');
            const data = await response.json();
            // Calculate freeUsers as activeUsers - proUsers
            const freeUsers = data.activeUsers - data.proUsers;
            setStats({ ...data, freeUsers });
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeaturedToggle = async (productId: string) => {
        try {
            // In a real application, make an API call to update the featured status
            // await fetch(`/api/admin/featured-products/${productId}`, {
            //     method: 'PATCH',
            //     body: JSON.stringify({ isFeatured: !products.find(p => p.id === productId)?.isFeatured }),
            // });

            setProducts(
                products.map((product) =>
                    product.id === productId
                        ? { ...product, isFeatured: !product.isFeatured }
                        : product
                )
            );
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    const filteredProducts = products.filter(
        (product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.producer
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            product.genre?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
            </div>
        );
    }

    const statCards = [
        // First Row: User Statistics
        {
            title: 'Active Users',
            value: stats?.activeUsers.toLocaleString() || '0',
            icon: Users,
            color: 'text-emerald-500',
        },
        {
            title: 'PRO Users',
            value: stats?.proUsers.toLocaleString() || '0',
            icon: Users,
            color: 'text-purple-500',
        },
        {
            title: 'Free Users',
            value: stats?.freeUsers.toLocaleString() || '0',
            icon: Users,
            color: 'text-blue-500',
        },
        // Second Row: Content Statistics
        {
            title: 'Uploaded Melodies',
            value: stats?.totalMelodies.toLocaleString() || '0',
            icon: Music2,
            color: 'text-indigo-500',
        },
        {
            title: 'Total Downloads',
            value: stats?.totalDownloads.toLocaleString() || '0',
            icon: Music2,
            color: 'text-orange-500',
        },
        {
            title: 'Sample Packs Sold',
            value: stats?.totalSamplePacks.toLocaleString() || '0',
            icon: Package,
            color: 'text-pink-500',
        },
        // Third Row: Revenue Statistics
        {
            title: 'MRR',
            value: `$${(stats?.mrr || 0).toLocaleString()}`,
            icon: Music2,
            color: 'text-green-500',
        },
        {
            title: 'Total Revenue',
            value: `$${stats?.totalRevenue.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: 'text-yellow-500',
        },
        {
            title: 'Churn Rate',
            value: `${((stats?.churnRate || 0) * 100).toFixed(2)}%`,
            icon: UserMinus,
            color: 'text-red-500',
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    Admin Overview
                </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className="relative overflow-hidden border-0 bg-[#0F0F0F] shadow-xl transition-all hover:translate-y-[-2px]"
                        >
                            <div className="relative z-10 p-6">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                    <span className="text-zinc-400">
                                        {stat.title}
                                    </span>
                                </div>
                                <div className="mt-2 text-3xl font-bold text-white">
                                    {stat.value}
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                        </Card>
                    );
                })}
            </div>

            {/* Featured Products Section */}
            <FeaturedProducts />
        </div>
    );
}
