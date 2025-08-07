'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Play,
    Pause,
    Heart,
    ShoppingCart,
    ArrowLeft,
    Star,
    PlaySquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Layout from '@/components/layout';

// Sample product data - In a real app, this would come from an API/database
const product = {
    id: 1,
    title: 'Thunder Sample Pack Vol. 1',
    producer: 'Thunder Beatz',
    price: 29.99,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
    description:
        'Premium collection of hand-crafted samples for modern music production. Perfect for Hip-Hop, Trap, and R&B producers looking for unique sounds.',
    audioDemo: {
        name: 'Audio Demo',
        duration: '1:30',
    },
    videoPreview: 'https://example.com/video-preview.mp4', // Optional video preview URL
    details: {
        format: '.zip File',
        size: '1.2 GB',
        category: 'Sample Pack',
        genre: 'Hip-Hop, Trap, R&B',
    },
};

// More from producer
const morePacks = [
    {
        id: 1,
        title: 'Galactic Music Pack',
        price: 24.99,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CleanShot%202025-02-23%20at%2016.11.02@2x.png-uMzA2yeNJF4OgzSMCF1RP8uwEaGZuK.jpeg',
    },
    {
        id: 2,
        title: 'Phonk Sample Pack',
        price: 19.99,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bannerslider%201-kA6rfkEQT1gk8DeTUrNWjTVB14yhbZ.png',
    },
    {
        id: 3,
        title: 'Urban Drums Kit',
        price: 29.99,
        image: '/placeholder.svg?height=300&width=300',
    },
    {
        id: 4,
        title: 'Melody Loops Vol. 1',
        price: 34.99,
        image: '/placeholder.svg?height=300&width=300',
    },
];

export default function ProductPage({ params }: { params: { id: string } }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/pack-demo.mp3');
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener(
            'loadedmetadata',
            handleLoadedMetadata
        );
        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener(
                    'timeupdate',
                    handleTimeUpdate
                );
                audioRef.current.removeEventListener(
                    'loadedmetadata',
                    handleLoadedMetadata
                );
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.pause();
            }
        };
    }, []);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black">
                {/* Back Button */}
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <Link
                        href="/marketplace"
                        className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Marketplace
                    </Link>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-6xl px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Column - Media */}
                        <div className="lg:w-1/2">
                            {/* Product Image or Video */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 mb-4">
                                {showVideo && product.videoPreview ? (
                                    <video
                                        src={product.videoPreview}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                )}
                            </div>

                            {/* Media Toggle */}
                            {product.videoPreview && (
                                <div className="flex gap-2">
                                    <Button
                                        variant={
                                            !showVideo ? 'default' : 'outline'
                                        }
                                        className={`flex-1 ${
                                            !showVideo
                                                ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                                                : 'border-zinc-800'
                                        }`}
                                        onClick={() => setShowVideo(false)}
                                    >
                                        {/* <Image className="w-4 h-4 mr-2" /> */}
                                        Cover
                                    </Button>
                                    <Button
                                        variant={
                                            showVideo ? 'default' : 'outline'
                                        }
                                        className={`flex-1 ${
                                            showVideo
                                                ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                                                : 'border-zinc-800'
                                        }`}
                                        onClick={() => setShowVideo(true)}
                                    >
                                        <PlaySquare className="w-4 h-4 mr-2" />
                                        Video Preview
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Info */}
                        <div className="lg:w-1/2">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {product.title}
                                    </h1>
                                    <Link
                                        href="/profile/thunder-beatz"
                                        className="text-emerald-500 hover:text-emerald-400 transition-colors text-lg"
                                    >
                                        {product.producer}
                                    </Link>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full ${
                                        isFavorite
                                            ? 'text-red-500 hover:text-red-600'
                                            : 'text-zinc-400 hover:text-white'
                                    } transition-colors`}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <Heart
                                        className={`w-5 h-5 ${
                                            isFavorite ? 'fill-current' : ''
                                        }`}
                                    />
                                </Button>
                            </div>

                            {/* Audio Demo */}
                            <div className="bg-zinc-900/50 rounded-xl p-4 mb-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-200"
                                            onClick={togglePlay}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-6 w-6" />
                                            ) : (
                                                <Play className="h-6 w-6" />
                                            )}
                                        </Button>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">
                                                {product.audioDemo.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                <span>
                                                    {formatTime(currentTime)}
                                                </span>
                                                <span>/</span>
                                                <span>
                                                    {formatTime(duration)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 100}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-1.5 rounded-full appearance-none bg-zinc-800 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 hover:[&::-webkit-slider-thumb]:bg-emerald-400 transition-colors"
                                            style={{
                                                background: `linear-gradient(to right, #10b981 ${
                                                    (currentTime /
                                                        (duration || 100)) *
                                                    100
                                                }%, rgb(39 39 42) ${
                                                    (currentTime /
                                                        (duration || 100)) *
                                                    100
                                                }%)`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price & Buy */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="text-3xl font-bold text-white">
                                    ${product.price.toFixed(2)}
                                </div>
                                <Button className="bg-emerald-500 text-black hover:bg-emerald-600 h-12 px-8 flex-1">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>

                            {/* Description */}
                            <p className="text-zinc-300 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-900/50">
                                {Object.entries(product.details).map(
                                    ([key, value]) => (
                                        <div key={key}>
                                            <p className="text-zinc-500 text-sm capitalize">
                                                {key
                                                    .replace(/([A-Z])/g, ' $1')
                                                    .trim()}
                                            </p>
                                            <p className="text-zinc-300">
                                                {value}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* More from Producer */}
                <div className="border-t border-zinc-800 mt-16">
                    <div className="mx-auto max-w-6xl px-4 py-12">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            More from {product.producer}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {morePacks.slice(0, 4).map((pack) => (
                                <Link
                                    key={pack.id}
                                    href={`/marketplace/${pack.id}`}
                                    className="group block overflow-hidden rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-all"
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={pack.image}
                                            alt={pack.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-xs font-medium text-white group-hover:text-emerald-500 line-clamp-1">
                                            {pack.title}
                                        </h3>
                                        <p className="mt-1 text-xs font-bold text-emerald-500">
                                            ${pack.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
