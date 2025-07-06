'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Play,
    Pause,
    Download,
    Share2,
    Heart,
    ChevronRight,
    Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AudioPlayer } from '@/components/audio-player';
import Layout from '@/components/layout';

// Sample product data (in a real app, this would come from an API)
const product = {
    id: 1,
    title: 'Bumper Pack Vol.1',
    producer: 'Thunder Beatz',
    description:
        'A cutting-edge collection of futuristic sounds, designed for modern music producers. This pack includes over 300 unique samples, from deep bass hits to ethereal atmospheres.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bannerslider%201-kA6rfkEQT1gk8DeTUrNWjTVB14yhbZ.png',
    price: 35.0,
    rating: 4.8,
    reviews: 124,
    videoUrl: 'https://www.youtube.com/embed/your-video-id',
    features: [
        '300+ High-Quality Samples',
        'Deep Bass & Synth Collection',
        'Atmospheric Textures',
        'Modern Drum Kits',
        'Royalty-Free License',
        'Instant Download',
    ],
    specifications: {
        format: 'WAV 24-bit',
        size: '1.2 GB',
        bpm: '120-150',
        genre: 'Electronic, Hip Hop, Trap',
        compatibility: 'All DAWs',
    },
    relatedPacks: [
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
    ],
};

export default function ProductAltPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(!isPlaying);
        setIsAudioPlayerVisible(!isAudioPlayerVisible);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
                {/* Hero Section */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

                    {/* Floating Stats Card */}
                    <div className="absolute top-8 right-8 backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="font-bold">{product.rating}</span>
                            <span className="text-zinc-400">
                                ({product.reviews} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                <div>
                                    <h1 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
                                        {product.title}
                                    </h1>
                                    <p className="mb-4 text-lg text-zinc-300">
                                        by{' '}
                                        <span className="text-emerald-500">
                                            {product.producer}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <Button
                                        size="lg"
                                        className="gap-2 bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
                                        onClick={handlePlayClick}
                                    >
                                        {isPlaying ? (
                                            <>
                                                <Pause className="h-5 w-5" />
                                                Pause Demo
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-5 w-5" />
                                                Play Demo
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="gap-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Download className="h-5 w-5" />
                                        Buy Now ${product.price}
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className={`border-zinc-700 transition-all duration-300 ${
                                            isFavorite
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                                        }`}
                                        onClick={() =>
                                            setIsFavorite(!isFavorite)
                                        }
                                    >
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-all duration-300"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Description & Features */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                                <h2 className="mb-4 text-2xl font-bold text-white">
                                    Description
                                </h2>
                                <p className="text-zinc-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                                <h2 className="mb-4 text-2xl font-bold text-white">
                                    Features
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-zinc-300 hover:text-emerald-500 transition-colors duration-300"
                                        >
                                            <ChevronRight className="h-5 w-5 text-emerald-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Video Preview */}
                            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                                <h2 className="mb-4 text-2xl font-bold text-white">
                                    Video Preview
                                </h2>
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                    <iframe
                                        src={product.videoUrl}
                                        className="absolute inset-0 h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Specifications & Related */}
                        <div className="space-y-8">
                            {/* Specifications */}
                            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                                <h2 className="mb-4 text-2xl font-bold text-white">
                                    Specifications
                                </h2>
                                <div className="space-y-3">
                                    {Object.entries(product.specifications).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between py-2 border-b border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                                            >
                                                <span className="text-zinc-400 capitalize">
                                                    {key}
                                                </span>
                                                <span className="text-zinc-300">
                                                    {value}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Related Packs */}
                            <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                                <h2 className="mb-4 text-2xl font-bold text-white">
                                    Related Packs
                                </h2>
                                <div className="space-y-4">
                                    {product.relatedPacks.map((pack) => (
                                        <Link
                                            key={pack.id}
                                            href={`/marketplace/product-alt/${pack.id}`}
                                            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                                        >
                                            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 group-hover:border-emerald-500/30 transition-all duration-300">
                                                <Image
                                                    src={pack.image}
                                                    alt={pack.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white group-hover:text-emerald-500 transition-colors duration-300">
                                                    {pack.title}
                                                </h3>
                                                <p className="text-sm text-emerald-500">
                                                    ${pack.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audio Player */}
            <AudioPlayer
                isVisible={isAudioPlayerVisible}
                melody={{
                    id: product.id,
                    name: product.title,
                    producer: product.producer,
                    image: product.image,
                    waveform: '▂▃▅▂▇▂▅▃▂',
                    bpm: 120,
                    key: 'C Maj',
                    artistType: 'Producer',
                }}
                onClose={() => {
                    setIsAudioPlayerVisible(false);
                    setIsPlaying(false);
                }}
            />
        </Layout>
    );
}
