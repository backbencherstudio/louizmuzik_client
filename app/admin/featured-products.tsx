'use client';

import { useState } from 'react';
import { Search, X, Star, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Product {
    id: string;
    title: string;
    producer: string;
    genre: string;
    price: number;
    image: string;
    isFeatured: boolean;
}

const MAX_FEATURED_PRODUCTS = 5;

export default function FeaturedProducts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            title: 'Summer Vibes Pack',
            producer: 'BeatMaster',
            genre: 'Hip Hop',
            price: 29.99,
            image: '/placeholder.png',
            isFeatured: true,
        },
        {
            id: '2',
            title: 'Trap Essentials',
            producer: 'TrapKing',
            genre: 'Trap',
            price: 24.99,
            image: '/placeholder.png',
            isFeatured: true,
        },
        {
            id: '3',
            title: 'Lo-Fi Collection',
            producer: 'ChillMaster',
            genre: 'Lo-Fi',
            price: 19.99,
            image: '/placeholder.png',
            isFeatured: false,
        },
    ]);

    const featuredProducts = products.filter((p) => p.isFeatured);
    const searchResults = products.filter((product) => {
        if (product.isFeatured) return false; // Don't show already featured products in search
        const query = searchQuery.toLowerCase();
        return (
            product.title.toLowerCase().includes(query) ||
            product.producer.toLowerCase().includes(query) ||
            product.genre.toLowerCase().includes(query)
        );
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setShowResults(value.length > 0);
    };

    const toggleFeatured = async (productId: string) => {
        if (
            featuredProducts.length >= MAX_FEATURED_PRODUCTS &&
            !products.find((p) => p.id === productId)?.isFeatured
        ) {
            alert(
                `You can only feature up to ${MAX_FEATURED_PRODUCTS} products.`
            );
            return;
        }

        try {
            // In a real application, make an API call to update the featured status
            // await fetch(`/api/admin/featured-products/${productId}`, {
            //     method: 'PATCH',
            //     body: JSON.stringify({
            //         isFeatured: !products.find(p => p.id === productId)?.isFeatured
            //     }),
            // });

            setProducts(
                products.map((product) =>
                    product.id === productId
                        ? { ...product, isFeatured: !product.isFeatured }
                        : product
                )
            );
            setSearchQuery('');
            setShowResults(false);
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    return (
        <div className="bg-zinc-900/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-emerald-500" />
                        Featured Products
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        {featuredProducts.length} of {MAX_FEATURED_PRODUCTS}{' '}
                        products featured in the marketplace banner
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <Input
                        type="text"
                        placeholder="Search for a sample pack to feature..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setShowResults(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute z-10 mt-2 w-full bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg">
                        {searchResults.map((product) => (
                            <div
                                key={product.id}
                                className="p-3 hover:bg-zinc-700 cursor-pointer flex items-center justify-between"
                                onClick={() => toggleFeatured(product.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Package className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {product.title}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            {product.producer}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-zinc-400">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-medium text-white truncate">
                                    {product.title}
                                </h4>
                                <p className="text-sm text-zinc-400 truncate">
                                    {product.producer}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-zinc-400">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">
                                    {product.genre}
                                </span>
                            </div>
                            <button
                                onClick={() => toggleFeatured(product.id)}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {featuredProducts.length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                    No featured products yet. Use the search bar to add some!
                </div>
            )}
        </div>
    );
}
