'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Download } from 'lucide-react';
import Layout from '@/components/layout';

// Sample data - replace with actual data from your backend
const samplePurchases = [
    {
        id: 'ORD-001',
        date: new Date('2024-03-15'),
        product: {
            name: 'Summer Vibes Sample Pack',
            producer: 'BeatsLab',
            price: 29.99,
            image: '/sample-packs/summer-vibes.jpg',
            downloadUrl: '/sample-audio/sampleaudio.mp3',
        },
        status: 'Completado',
        paymentMethod: 'PayPal',
    },
    {
        id: 'ORD-002',
        date: new Date('2024-03-10'),
        product: {
            name: 'Trap Essentials Vol. 1',
            producer: 'TrapMaster',
            price: 19.99,
            image: '/sample-packs/trap-essentials.jpg',
            downloadUrl: '/sample-audio/sampleaudio.mp3',
        },
        status: 'Completado',
        paymentMethod: 'PayPal',
    },
];

export default function PurchasesPage() {
    const [purchases] = useState(samplePurchases);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');

    const handleDownload = async (downloadUrl: string, fileName: string) => {
        try {
            setIsDownloading(true);
            const response = await fetch(downloadUrl);

            if (!response.ok) {
                throw new Error('Error downloading file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            setDownloadError('Error downloading file. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Layout>
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            My Purchases
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            History of all your purchases and available
                            downloads
                        </p>
                    </div>

                    {/* Desktop and Laptop View */}
                    <div className="hidden md:block">
                        <div className="bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-zinc-400 border-b border-zinc-800">
                                <div className="col-span-2">Product</div>
                                <div>Date</div>
                                <div>Price</div>
                                <div>Actions</div>
                            </div>
                            <div className="divide-y divide-zinc-800">
                                {purchases.map((purchase) => (
                                    <div
                                        key={purchase.id}
                                        className="grid grid-cols-5 gap-4 p-4 items-center"
                                    >
                                        <div className="col-span-2 flex items-center gap-4">
                                            <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
                                                <img
                                                    src={purchase.product.image}
                                                    alt={purchase.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white">
                                                    {purchase.product.name}
                                                </h3>
                                                <p className="text-sm text-zinc-400">
                                                    by{' '}
                                                    {purchase.product.producer}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-zinc-400">
                                            {formatDistanceToNow(
                                                purchase.date,
                                                {
                                                    addSuffix: true,
                                                    locale: enUS,
                                                }
                                            )}
                                        </div>
                                        <div className="text-white font-medium">
                                            ${purchase.product.price}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() =>
                                                    handleDownload(
                                                        purchase.product
                                                            .downloadUrl,
                                                        `${purchase.product.name
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                '-'
                                                            )}.mp3`
                                                    )
                                                }
                                                disabled={isDownloading}
                                                className={`flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-white rounded-lg transition-colors ${
                                                    isDownloading
                                                        ? 'bg-emerald-500/50 cursor-not-allowed'
                                                        : 'bg-emerald-500 hover:bg-emerald-600'
                                                }`}
                                            >
                                                <Download size={16} />
                                                <span className="hidden xl:inline">
                                                    {isDownloading
                                                        ? 'Downloading...'
                                                        : 'Download'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {purchases.map((purchase) => (
                            <div
                                key={purchase.id}
                                className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                                        <img
                                            src={purchase.product.image}
                                            alt={purchase.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">
                                            {purchase.product.name}
                                        </h3>
                                        <p className="text-sm text-zinc-400">
                                            by {purchase.product.producer}
                                        </p>
                                        <p className="text-sm text-zinc-400 mt-1">
                                            {formatDistanceToNow(
                                                purchase.date,
                                                {
                                                    addSuffix: true,
                                                    locale: enUS,
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            Price
                                        </p>
                                        <p className="text-white font-medium">
                                            ${purchase.product.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() =>
                                            handleDownload(
                                                purchase.product.downloadUrl,
                                                `${purchase.product.name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}.mp3`
                                            )
                                        }
                                        disabled={isDownloading}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                                            isDownloading
                                                ? 'bg-emerald-500/50 cursor-not-allowed'
                                                : 'bg-emerald-500 hover:bg-emerald-600'
                                        }`}
                                    >
                                        <Download size={16} />
                                        {isDownloading
                                            ? 'Downloading...'
                                            : 'Download'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {purchases.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-zinc-400">
                                You haven&apos;t made any purchases yet.
                            </p>
                        </div>
                    )}

                    {downloadError && (
                        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                            {downloadError}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
