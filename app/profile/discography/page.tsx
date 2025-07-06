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
    ArrowLeft,
    Plus,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout';

// Función para extraer el ID de la pista de Spotify de una URL
function getSpotifyTrackId(url: string) {
    // Acepta tanto el formato completo como el formato corto
    const regex = /(?:spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export default function DiscographyPage() {
    const [tracks, setTracks] = useState<string[]>([]);
    const [newTrackUrl, setNewTrackUrl] = useState('');
    const [error, setError] = useState('');

    const handleAddTrack = () => {
        const trackId = getSpotifyTrackId(newTrackUrl);
        if (trackId) {
            setTracks([...tracks, trackId]);
            setNewTrackUrl('');
            setError('');
        } else {
            setError('Por favor, ingresa un enlace válido de Spotify');
        }
    };

    const handleRemoveTrack = (index: number) => {
        const newTracks = tracks.filter((_, i) => i !== index);
        setTracks(newTracks);
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
                                {/* Profile Image */}
                                <div className="flex flex-col items-center gap-3 md:gap-4">
                                    <div className="relative w-28 h-28 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-black shadow-[0_0_40px_rgba(0,0,0,0.3)] -mt-8 md:-mt-24">
                                        <Image
                                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1729819215.jpg-uoM6NdN5hMe9otOwiONDKGITdU1L3H.jpeg"
                                            alt="Thunder Beatz"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
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
                    {/* Back Button */}
                    <div className="mb-8">
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
                        </div>
                    </div>

                    {/* Discography Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Thunder Beatz Discography
                        </h2>

                        {/* Add Track Input */}
                        <div className="mb-8">
                            <div className="flex gap-4 max-w-2xl">
                                <Input
                                    type="text"
                                    placeholder="Paste your Spotify track link here"
                                    value={newTrackUrl}
                                    onChange={(e) =>
                                        setNewTrackUrl(e.target.value)
                                    }
                                    className="flex-1 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                                />
                                <Button
                                    onClick={handleAddTrack}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                    Add
                                </Button>
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-500">
                                    Please enter a valid Spotify link
                                </p>
                            )}
                        </div>

                        {/* Tracks Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tracks.map((trackId, index) => (
                                <div key={index} className="relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-2 -right-2 z-10 bg-red-500/10 text-red-500 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveTrack(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <iframe
                                        style={{ borderRadius: '12px' }}
                                        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
