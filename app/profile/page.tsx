'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Instagram,
    Youtube,
    Music2,
    Users,
    MapPin,
    ExternalLink,
    Play,
    Pause,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AudioPlayer } from '@/components/audio-player';
import Layout from '@/components/layout';

// Sample data for Recent Releases
const premiumPacks = [
    {
        id: 1,
        title: 'Thunder Sample Pack',
        producer: 'Thunder Beatz',
        price: 29.0,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png',
        audioUrl: '/audio/sample1.mp3',
    },
    {
        id: 2,
        title: 'Galactic Music',
        producer: 'Thunder Beatz',
        price: 6.0,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CleanShot%202025-02-23%20at%2016.11.02@2x.png-uMzA2yeNJF4OgzSMCF1RP8uwEaGZuK.jpeg',
        audioUrl: '/audio/sample2.mp3',
    },
    {
        id: 3,
        title: 'Phonk Sample Pack',
        producer: 'Thunder Beatz',
        price: 37.0,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bannerslider%201-kA6rfkEQT1gk8DeTUrNWjTVB14yhbZ.png',
        audioUrl: '/audio/sample3.mp3',
    },
    {
        id: 4,
        title: 'True Tech House',
        producer: 'Thunder Beatz',
        price: 25.0,
        image: '/true-tech-house.jpg',
        audioUrl: '/audio/sample4.mp3',
    },
];

export default function ProfilePage() {
    const [currentPlayingMelody, setCurrentPlayingMelody] = useState<any>(null);
    const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<'packs' | 'discography'>(
        'packs'
    );
    const [playingPackId, setPlayingPackId] = useState<number | null>(null);

    const handlePlayPause = (pack: any, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation when clicking play/pause

        if (playingPackId === pack.id) {
            // If this pack is currently playing, stop it
            setPlayingPackId(null);
            setCurrentPlayingMelody(null);
            setIsAudioPlayerVisible(false);
        } else {
            // Start playing this pack
            setPlayingPackId(pack.id);
            setCurrentPlayingMelody({
                title: pack.title,
                producer: pack.producer,
                audioUrl: pack.audioUrl,
            });
            setIsAudioPlayerVisible(true);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900/50">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full overflow-hidden">
                    {/* Banner Image */}
                    <Image
                        src="/images/profiles/banner-profile.jpg"
                        alt="Profile Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

                    {/* Profile Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                                {/* Profile Image and Follow Button */}
                                <div className="flex flex-col items-center gap-3 md:gap-4">
                                    <div className="relative w-28 h-28 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-black shadow-[0_0_40px_rgba(0,0,0,0.3)] -mt-8 md:-mt-24">
                                        <Image
                                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1729819215.jpg-uoM6NdN5hMe9otOwiONDKGITdU1L3H.jpeg"
                                            alt="Thunder Beatz"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button className="bg-emerald-500 text-black hover:bg-emerald-600 w-full px-8 h-10 md:h-11 min-w-[180px] md:min-w-[200px]">
                                        Follow
                                    </Button>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4 mb-3 md:mb-4">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <h1 className="text-2xl md:text-5xl font-bold text-white">
                                                Thunder Beatz
                                            </h1>
                                            <div className="relative w-5 h-5 md:w-7 md:h-7 mt-0.5 md:mt-1">
                                                <Image
                                                    src="/verified-badge.png"
                                                    alt="Verified Producer"
                                                    width={28}
                                                    height={28}
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs md:text-sm font-medium">
                                                Verified Producer
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-sm md:text-base text-zinc-300">
                                        <div className="hidden md:flex items-center gap-2">
                                            <Music2 className="w-4 h-4 text-emerald-500" />
                                            <span>247 Melodies</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-emerald-500" />
                                            <span>14.5K Followers</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            <span>United States</span>
                                        </div>
                                    </div>

                                    {/* Social Media Links */}
                                    <div className="hidden md:flex justify-center md:justify-start gap-2 mt-6">
                                        <Link
                                            href="https://instagram.com"
                                            target="_blank"
                                            className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </Link>
                                        <Link
                                            href="https://youtube.com"
                                            target="_blank"
                                            className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                        >
                                            <Youtube className="w-5 h-5" />
                                        </Link>
                                        <Link
                                            href="https://beatstars.com"
                                            target="_blank"
                                            className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-12">
                    {/* Bio Section */}
                    <div className="mb-16">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                About
                            </h2>
                            <p className="text-lg text-zinc-300 leading-relaxed">
                                Multi-platinum music producer based in Los
                                Angeles. Known for crafting unique melodies and
                                innovative sound design. Credits include
                                collaborations with Drake, The Weeknd, Bad
                                Bunny, Anuel AA, and Maluma. Specialized in
                                Trap, Hip-Hop, and Latin genres.
                            </p>
                            <div className="mt-6">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                >
                                    <Link
                                        href="/profile/discography"
                                        className="flex items-center gap-2"
                                    >
                                        View Discography
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Premium Packs Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Thunder Beatz Premium Packs
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {premiumPacks.map((pack) => (
                                <Link
                                    key={pack.id}
                                    href={`/marketplace/${pack.id}`}
                                    className="group relative block overflow-hidden rounded-xl bg-zinc-800/30 transition-all hover:bg-zinc-800/50"
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={pack.image}
                                            alt={pack.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Play/Pause Button */}
                                        <button
                                            onClick={(e) =>
                                                handlePlayPause(pack, e)
                                            }
                                            className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500 text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform translate-y-1 group-hover:translate-y-0"
                                        >
                                            {playingPackId === pack.id ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5 translate-x-0.5" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-white group-hover:text-emerald-500 line-clamp-1">
                                            {pack.title}
                                        </h3>
                                        <p className="mt-1 text-sm font-bold text-emerald-500">
                                            ${pack.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Audio Player */}
                <AudioPlayer
                    isVisible={isAudioPlayerVisible}
                    melody={currentPlayingMelody}
                    onClose={() => setIsAudioPlayerVisible(false)}
                />
            </div>
        </Layout>
    );
}
