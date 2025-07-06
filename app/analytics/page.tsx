'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductAnalytics from '@/components/analytics/product-analytics';
import MelodyAnalytics from '@/components/analytics/melody-analytics';
import Layout from '@/components/layout';

export default function AnalyticsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(
        searchParams.get('tab') || 'products'
    );

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && (tab === 'products' || tab === 'melodies')) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`/analytics?tab=${value}`);
    };

    return (
        <Layout>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Analytics Dashboard
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        Track the performance of your content
                    </p>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-2 gap-4 rounded-lg bg-zinc-900/50 p-1">
                        <TabsTrigger
                            value="products"
                            className="rounded-md px-6 py-3 text-sm font-medium transition-all
                                     data-[state=inactive]:bg-zinc-800 data-[state=inactive]:text-zinc-400
                                     data-[state=active]:bg-emerald-500 data-[state=active]:text-white
                                     hover:data-[state=inactive]:bg-zinc-700 hover:data-[state=inactive]:text-white"
                        >
                            Product Analytics
                        </TabsTrigger>
                        <TabsTrigger
                            value="melodies"
                            className="rounded-md px-6 py-3 text-sm font-medium transition-all
                                     data-[state=inactive]:bg-zinc-800 data-[state=inactive]:text-zinc-400
                                     data-[state=active]:bg-emerald-500 data-[state=active]:text-white
                                     hover:data-[state=inactive]:bg-zinc-700 hover:data-[state=inactive]:text-white"
                        >
                            Melody Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="mt-6">
                        <ProductAnalytics />
                    </TabsContent>

                    <TabsContent value="melodies" className="mt-6">
                        <MelodyAnalytics />
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
