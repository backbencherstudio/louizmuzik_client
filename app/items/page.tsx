'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Play,
    Pause,
    Download,
    Heart,
    Search,
    ArrowUpDown,
    ArrowLeft,
    Pencil,
    Share2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AudioPlayer } from '@/components/audio-player';
import { WaveformDisplay } from '@/components/waveform-display';
import Layout from '@/components/layout';

// Sample data for producer's packs
const producerPacks = [
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

// Sample data for producer's melodies
const producerMelodies = [
    {
        id: 1,
        name: 'Summer Vibes',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        audioUrl: '/audio/melody-1.mp3',
        bpm: 128,
        key: 'C Maj',
        genre: 'Pop',
        artistType: 'Producer',
    },
    {
        id: 2,
        name: 'Urban Flow',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        audioUrl: '/audio/melody-2.mp3',
        bpm: 140,
        key: 'G Min',
        genre: 'Hip Hop',
        artistType: 'Beatmaker',
    },
    {
        id: 3,
        name: 'Midnight Jazz',
        producer: 'Thunder Beatz',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        audioUrl: '/audio/melody-3.mp3',
        bpm: 95,
        key: 'D Min',
        genre: 'Jazz',
        artistType: 'Composer',
    },
];

export default function ItemsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
    const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
    const [currentPlayingPack, setCurrentPlayingPack] = useState<any>(null);
    const [favoriteMelodies, setFavoriteMelodies] = useState<number[]>([]);
    const [shareTooltip, setShareTooltip] = useState('');

    const handlePlayClick = (melody: any) => {
        if (currentPlayingMelody?.id === melody.id) {
            setCurrentPlayingMelody(null);
            setIsAudioPlayerVisible(false);
        } else {
            setCurrentPlayingMelody(melody);
            setIsAudioPlayerVisible(true);
        }
    };

    const handlePackPlayClick = (pack: any) => {
        if (currentPlayingPack?.id === pack.id) {
            setCurrentPlayingPack(null);
            setIsAudioPlayerVisible(false);
        } else {
            setCurrentPlayingPack({
                id: pack.id,
                name: pack.title,
                producer: pack.producer,
                image: pack.image,
                waveform: '▂▃▅▂▇▂▅▃▂',
                bpm: 120,
                key: 'C Maj',
                artistType: 'Producer',
            });
            setIsAudioPlayerVisible(true);
        }
    };

    const handleFavoriteClick = (melodyId: number) => {
        setFavoriteMelodies((prev) => {
            if (prev.includes(melodyId)) {
                return prev.filter((id) => id !== melodyId);
            }
            return [...prev, melodyId];
        });
    };

    const handleShare = async (melody: any) => {
        const url = `${window.location.origin}/melody/${melody.id}`;
        try {
            await navigator.clipboard.writeText(url);
            setShareTooltip('Link copied!');
            setTimeout(() => setShareTooltip(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setShareTooltip('Failed to copy link');
            setTimeout(() => setShareTooltip(''), 2000);
        }
    };

    const filteredMelodies = producerMelodies.filter((melody) =>
        melody.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900/50">
                {/* Back Button */}
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-white"
                        asChild
                    >
                        <Link
                            href="/profile"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Profile
                        </Link>
                    </Button>
                </div>

                {/* Sample Packs Section */}
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Sample Packs
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {producerPacks.map((pack) => (
                            <div
                                key={pack.id}
                                className="group relative overflow-hidden rounded-xl bg-zinc-800/30 transition-all hover:bg-zinc-800/50"
                            >
                                <Link
                                    href={`/product/${pack.id}`}
                                    className="block"
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={
                                                pack.image || '/placeholder.svg'
                                            }
                                            alt={pack.title}
                                            fill
                                            className="object-cover transition-all group-hover:scale-105 group-hover:opacity-75"
                                        />
                                        {/* Play button on hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePackPlayClick(pack);
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
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-sm sm:text-base font-bold text-white">
                                                ${pack.price.toFixed(2)}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.location.href = `/new-pack?edit=${pack.id}`;
                                                    }}
                                                    className="text-xs sm:text-sm bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors"
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Melodies Section */}
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Melodies
                    </h2>

                    {/* Search Input */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                type="text"
                                placeholder="Search melodies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    {/* Melodies Table */}
                    <div className="overflow-x-auto rounded-lg border border-zinc-800">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400"></th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400"></th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        Name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        Producer
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        Waveform
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                        BPM
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                        Key
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                        Genre
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                        Artist Type
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMelodies.map((melody) => (
                                    <tr
                                        key={melody.id}
                                        className="border-b border-zinc-800 hover:bg-zinc-900/30"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`h-8 w-8 rounded-full ${
                                                    currentPlayingMelody?.id ===
                                                    melody.id
                                                        ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                                                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                                }`}
                                                onClick={() =>
                                                    handlePlayClick(melody)
                                                }
                                            >
                                                {currentPlayingMelody?.id ===
                                                melody.id ? (
                                                    <Pause className="h-4 w-4" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                                <Image
                                                    src={
                                                        melody.image ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt={melody.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                                            {melody.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                            <Link
                                                href={`/producer/${melody.producer
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}`}
                                                className="hover:text-emerald-500 transition-colors"
                                            >
                                                {melody.producer}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <WaveformDisplay
                                                audioUrl={melody.audioUrl}
                                                isPlaying={
                                                    currentPlayingMelody?.id ===
                                                    melody.id
                                                }
                                                onPlayPause={() =>
                                                    handlePlayClick(melody)
                                                }
                                                height={30}
                                                width="200px"
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                            {melody.bpm}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                            {melody.key}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                            {melody.genre}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                            {melody.artistType}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 text-zinc-400 hover:text-red-500 ${
                                                        favoriteMelodies.includes(
                                                            melody.id
                                                        )
                                                            ? 'text-red-500'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        handleFavoriteClick(
                                                            melody.id
                                                        )
                                                    }
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 ${
                                                            favoriteMelodies.includes(
                                                                melody.id
                                                            )
                                                                ? 'fill-current'
                                                                : ''
                                                        }`}
                                                    />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-400 hover:text-white"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <div className="relative">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-zinc-400 hover:text-emerald-500"
                                                        onClick={() =>
                                                            handleShare(melody)
                                                        }
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                    {shareTooltip && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded whitespace-nowrap">
                                                            {shareTooltip}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audio Player */}
                {isAudioPlayerVisible &&
                    (currentPlayingMelody || currentPlayingPack) && (
                        <AudioPlayer
                            melody={currentPlayingMelody || currentPlayingPack}
                            onClose={() => {
                                setCurrentPlayingMelody(null);
                                setCurrentPlayingPack(null);
                                setIsAudioPlayerVisible(false);
                            }}
                        />
                    )}
            </div>
        </Layout>
    );
}
