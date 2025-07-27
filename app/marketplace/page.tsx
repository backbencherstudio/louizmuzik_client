/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AudioPlayer } from '@/components/audio-player';
import Layout from '@/components/layout';
import { useAllPacksQuery } from '../store/api/packApis/packApis';
import { Pagination } from '@/components/ui/pagination';

// Sample featured packs data
const featuredPacks = [
    {
        id: 1,
        title: 'Bumper Pack Vol.1',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bannerslider%201-kA6rfkEQT1gk8DeTUrNWjTVB14yhbZ.png',
        price: 35.0,
    },
    {
        id: 2,
        title: 'Radio Lotto Pack',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        price: 20.0,
    },
    {
        id: 3,
        title: 'Old School Pack',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        price: 19.0,
    },
];

export default function MarketplacePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);
    const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
    const { data: allPacksData } = useAllPacksQuery(null);
    const packs = allPacksData?.data || [];
    console.log('Packs data:', packs);

    // Filter packs based on search query
    const filteredPacks = useMemo(() => {
        if (!searchQuery.trim()) {
            return packs;
        }
        
        const query = searchQuery.toLowerCase();
        return packs.filter((pack: any) => 
            pack.title?.toLowerCase().includes(query) ||
            pack.producer?.toLowerCase().includes(query) ||
            pack.description?.toLowerCase().includes(query)
        );
    }, [packs, searchQuery]);

    // Calculate pagination
    const totalItems = filteredPacks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPacks = filteredPacks.slice(startIndex, endIndex);

    // Reset to first page when search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of packs section
        const packsSection = document.querySelector('.packs-section') as HTMLElement;
        if (packsSection) {
            window.scrollTo({
                top: packsSection.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredPacks.length);
    };

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + featuredPacks.length) % featuredPacks.length
        );
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handlePlayClick = (pack: any) => {
        if (currentPlayingPack?.id === pack?.id) {
            // Si el pack actual está sonando, lo pausamos
            setCurrentPlayingPack(null);
            setIsAudioPlayerVisible(false);
        } else {
            // Si es un nuevo pack o está pausado, lo reproducimos
            setCurrentPlayingPack({
                id: pack?.id || pack?._id,
                name: pack?.title || 'Untitled Pack',
                producer: pack?.producer || 'Unknown Producer',
                image: pack?.thumbnail_image || pack?.image || '/placeholder.svg?height=300&width=300',
                waveform: '▂▃▅▂▇▂▅▃▂', // Waveform de ejemplo
                bpm: 120, // BPM de ejemplo
                key: 'C Maj', // Key de ejemplo
                artistType: 'Producer', // Artist type de ejemplo
            });
            setIsAudioPlayerVisible(true);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen">
                {/* Hero Slider */}
                <div className="px-2 py-4 sm:px-4 sm:py-6">
                    <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-[98%] sm:w-[95%] mx-auto overflow-hidden rounded-xl sm:rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * 100
                                }%)`,
                            }}
                        >
                            {featuredPacks.map((pack, index) => (
                                <div
                                    key={pack.id}
                                    className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full flex-shrink-0"
                                >
                                    <Image
                                        src={pack.image || '/placeholder.svg'}
                                        alt={pack.title}
                                        fill
                                        className="object-cover brightness-50"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 right-0 left-0 p-4 sm:p-6 md:p-8">
                                        <h1 className="mb-1 sm:mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                            {pack.title}
                                        </h1>
                                        <p className="mb-4 sm:mb-6 text-base sm:text-lg text-emerald-500">
                                            {pack.producer}
                                        </p>
                                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                className="gap-2 bg-emerald-500 hover:bg-emerald-600 sm:size-default"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePlayClick(pack);
                                                }}
                                            >
                                                {currentPlayingPack?.id ===
                                                pack.id ? (
                                                    <>
                                                        <Pause className="h-4 w-4" />
                                                        <span className="hidden sm:inline">
                                                            Pause Demo
                                                        </span>
                                                        <span className="sm:hidden">
                                                            Pause
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="h-4 w-4" />
                                                        <span className="hidden sm:inline">
                                                            Play Demo
                                                        </span>
                                                        <span className="sm:hidden">
                                                            Play
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-white bg-white text-black hover:bg-white/90 hover:text-black sm:size-default"
                                                asChild
                                            >
                                                <Link
                                                    href={`/product/${pack.id}`}
                                                >
                                                    <span className="hidden sm:inline">
                                                        View Pack
                                                    </span>
                                                    <span className="sm:hidden">
                                                        View
                                                    </span>
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Slider Controls */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-transparent p-1.5 sm:p-2 text-white hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-transparent p-1.5 sm:p-2 text-white hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                        </button>

                        {/* Slider Pagination */}
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:gap-2">
                            {featuredPacks.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full transition-all ${
                                        currentSlide === index
                                            ? 'w-3 sm:w-4 bg-emerald-500'
                                            : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
                    <div className="text-center">
                        <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-white">
                            Search Sample Packs
                        </h2>
                        <div className="mx-auto flex flex-col sm:flex-row max-w-xl gap-3 sm:gap-4 px-4">
                            <Input
                                type="text"
                                placeholder="Search Sample Packs"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="h-12 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-400"
                            />
                            <Button className="h-12 bg-emerald-500 px-8 hover:bg-emerald-600 whitespace-nowrap">
                                Search Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Browse All Packs */}
                <div className="packs-section mx-auto max-w-7xl px-4 py-8 sm:py-12">
                    <div className="mb-6 sm:mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                Browse All Packs
                            </h2>
                            {searchQuery && (
                                <p className="mt-2 text-sm text-zinc-400">
                                    Showing {totalItems} result{totalItems !== 1 ? 's' : ''} for "{searchQuery}"
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-zinc-400">
                                {totalItems} pack{totalItems !== 1 ? 's' : ''} total
                            </p>
                        </div>
                    </div>

                    {currentPacks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-zinc-400 text-lg">
                                {searchQuery ? `No packs found for "${searchQuery}"` : 'No packs available'}
                            </p>
                            {searchQuery && (
                                <Button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 bg-emerald-500 hover:bg-emerald-600"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {currentPacks.map((pack: any) => (
                                    <div
                                        key={pack._id}
                                        className="group relative overflow-hidden rounded-xl bg-zinc-800/30 transition-all hover:bg-zinc-800/50"
                                    >
                                        <Link
                                            href={`/product/${pack._id}`}
                                            className="block"
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={
                                                        pack?.thumbnail_image}
                                                    alt={pack.title}
                                                    fill
                                                    className="object-cover transition-all group-hover:scale-105 group-hover:opacity-75"
                                                />
                                                {/* Botón de play que aparece al hacer hover */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePlayClick(pack);
                                                        }}
                                                        className="rounded-full bg-emerald-500/90 p-3 text-black hover:bg-emerald-500"
                                                    >
                                                        {currentPlayingPack?.id ===
                                                        pack.id ? (
                                                            <Pause className="h-6 w-6" />
                                                        ) : (
                                                            <Play className="h-6 w-6" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-3 sm:p-4">
                                                <h3 className="mb-1 text-sm sm:text-base font-medium text-white group-hover:text-emerald-500 line-clamp-1">
                                                    {pack.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-emerald-500">
                                                    {pack.producer}
                                                </p>
                                                <p className="mt-2 text-sm sm:text-base font-bold text-white">
                                                    ${pack.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination 
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {/* Audio Player */}
            <AudioPlayer
                isVisible={isAudioPlayerVisible}
                melody={currentPlayingPack}
                onClose={() => setIsAudioPlayerVisible(false)}
            />
        </Layout>
    );
}
