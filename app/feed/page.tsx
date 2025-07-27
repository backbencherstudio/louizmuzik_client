'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Heart,
    Download,
    Play,
    MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout';
import { CollabModal } from '@/components/collab-modal';
import BpmFilter from '@/components/bpm-filter';
import { AudioPlayer } from '@/components/audio-player';
import { KeySelector } from '@/components/key-selector';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useLoggedInUserQuery } from '../store/api/authApis/authApi';
import { useFollowingProducerContentQuery } from '../store/api/userManagementApis/userManagementApis';

interface AudioItem {
    id: number;
    name: string;
    producer: string;
    waveform: string;
    bpm: number;
    key: string;
    image: string;
    _id?: string;
    audioUrl?: string;
    artistType?: string;
}

interface Pack extends Omit<AudioItem, 'name'> {
    title: string;
    price: number;
    date: string;
    thumbnail_image: string;
}

interface Melody extends AudioItem {
    genre: string;
    artistType: string;
}

interface CollabModalData {
    name: string;
    splitPercentage: string;
    producerName: string;
    beatstarsUsername: string;
    soundeeUsername?: string;
    instagramUsername: string;
    youtubeChannel: string;
}

export default function FeedPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentMelodiesPage, setCurrentMelodiesPage] = useState(0);
    const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
    const [selectedMelody, setSelectedMelody] = useState<CollabModalData | null>(
        null
    );
    const [currentPlayingMelody, setCurrentPlayingMelody] =
        useState<AudioItem | Pack | null>(null);
    const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
    const [selectedKey, setSelectedKey] = useState('');
    const [favoriteMelodies, setFavoriteMelodies] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc',
    });

    const { data: user } = useLoggedInUserQuery(null);
    const userId = user?.data?._id;

    const { data: followingProducerContent, isLoading: isFollowingProducerContentLoading } = useFollowingProducerContentQuery({ userId });
    console.log("followingProducerContent", followingProducerContent);
    const melodies = followingProducerContent?.data?.melodies || [];
    const packs = followingProducerContent?.data?.packs || [];
    console.log("melodies", melodies);
    console.log("packs", packs);

    const itemsPerPage = 5;
    const melodiesPerPage = 10;

    const handlePrevious = () => {
        setCurrentPage(Math.max(0, currentPage - 1));
    };

    const handleNext = () => {
        const maxPage = Math.ceil(packs.length / itemsPerPage) - 1;
        setCurrentPage(Math.min(maxPage, currentPage + 1));
    };

    const handleMelodiesPrevious = () => {
        setCurrentMelodiesPage(Math.max(0, currentMelodiesPage - 1));
    };

    const handleMelodiesNext = () => {
        const maxPage = Math.ceil(sortedMelodies.length / melodiesPerPage) - 1;
        setCurrentMelodiesPage(Math.min(maxPage, currentMelodiesPage + 1));
    };

    const getCurrentItems = () => {
        const start = currentPage * itemsPerPage;
        return packs.slice(start, start + itemsPerPage);
    };

    const getCurrentMelodies = () => {
        const start = currentMelodiesPage * melodiesPerPage;
        return sortedMelodies.slice(start, start + melodiesPerPage);
    };

    const handleDownloadClick = (melody: AudioItem) => {
        setSelectedMelody({
            name: melody.name,
            splitPercentage: '50%',
            producerName: melody.producer,
            beatstarsUsername: 'gorillabeatz',
            soundeeUsername: '',
            instagramUsername: 'Ronaldo',
            youtubeChannel: 'veguzzi',
        });
        setIsCollabModalOpen(true);
    };

    const handlePlayClick = (melody: AudioItem | Pack) => {
        setCurrentPlayingMelody(melody);
        setIsAudioPlayerVisible(true);
    };

    const handleSort = (key: string) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    const handleFavoriteClick = (melodyId: number) => {
        setFavoriteMelodies((prev) => {
            if (prev.includes(melodyId)) {
                return prev.filter((id) => id !== melodyId);
            }
            return [...prev, melodyId];
        });
    };

    const sortedMelodies = [...melodies].sort((a, b) => {
        if (sortConfig.key === 'bpm') {
            return sortConfig.direction === 'asc'
                ? a.bpm - b.bpm
                : b.bpm - a.bpm;
        }

        const aValue =
            a[sortConfig.key as keyof typeof a]?.toString().toLowerCase() || '';
        const bValue =
            b[sortConfig.key as keyof typeof b]?.toString().toLowerCase() || '';

        if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
    });

    // Loading state
    if (isFollowingProducerContentLoading) {
        return (
            <Layout>
                <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-8 lg:mt-12">
                    <div className="mx-auto max-w-[1200px]">
                        <div className="text-center">
                            <p className="text-zinc-400">Loading...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-8 lg:mt-12">
                <div className="mx-auto max-w-[1200px]">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl font-bold mb-4">
                            What&apos;s new from your favorite producers
                        </h1>
                        <p className="text-zinc-400">
                            Here you will find all the new content from your
                            favorite producers. You can see the latest melodies
                            they've uploaded and the newest sample packs they've
                            released.
                        </p>
                    </div>

                    {/* Latest Products Title */}
                    <div className="flex items-center mb-6">
                        <h2 className="text-2xl font-bold text-emerald-500">
                            Latest Products
                        </h2>
                    </div>

                    {/* Packs Section */}
                    <div className="relative px-6 mb-24">
                        {/* Mobile Slider */}
                        <div className="block md:hidden relative">
                            <div className="grid grid-cols-2 gap-4">
                                {getCurrentItems()
                                    .slice(0, 2)
                                    .map((item: Pack) => (
                                        <div
                                            key={item.id}
                                            className="bg-zinc-950 rounded-xl overflow-hidden group cursor-pointer"
                                        >
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={item?.thumbnail_image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePlayClick(
                                                                item
                                                            );
                                                        }}
                                                    >
                                                        <Play className="h-6 w-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-base font-semibold text-white mb-1">
                                                    {item.title}
                                                </h3>
                                                <Link
                                                    href={`/profile/${item.producer
                                                        .toLowerCase()
                                                        .replace(' ', '-')}`}
                                                    className="text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-medium"
                                                >
                                                    {item.producer}
                                                </Link>
                                                <div className="mt-2">
                                                    <span className="text-xl font-bold text-white">
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Mobile Navigation Dots */}
                            <div className="flex justify-center items-center gap-2 mt-4">
                                {Array.from({
                                    length: Math.ceil(packs.length / 2),
                                }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index)}
                                        className={`h-2 rounded-full transition-all ${
                                            currentPage === index
                                                ? 'w-4 bg-emerald-500'
                                                : 'w-2 bg-zinc-700'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Mobile Navigation Buttons */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevious}
                                disabled={currentPage === 0}
                                className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                disabled={
                                    currentPage >=
                                    Math.ceil(packs.length / 2) - 1
                                }
                                className="absolute -right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {getCurrentItems().map((item: Pack) => (
                                <div
                                    key={item.id}
                                    className="bg-zinc-950 rounded-xl overflow-hidden group cursor-pointer"
                                >
                                    <div className="relative aspect-square">
                                        <Image
                                            src={item.thumbnail_image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePlayClick(item);
                                                }}
                                            >
                                                <Play className="h-6 w-6" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-white mb-1">
                                            {item.title}
                                        </h3>
                                        <Link
                                            href={`/profile/${item.producer
                                                .toLowerCase()
                                                .replace(' ', '-')}`}
                                            className="text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-medium"
                                        >
                                            {item.producer}
                                        </Link>
                                        <div className="mt-2">
                                            <span className="text-xl font-bold text-white">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Navigation Buttons */}
                        <div className="hidden md:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevious}
                                disabled={currentPage === 0}
                                className="absolute -left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                disabled={
                                    currentPage >=
                                    Math.ceil(packs.length / itemsPerPage) -
                                        1
                                }
                                className="absolute -right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Latest Melodies Title */}
                    <div className="flex items-center mb-6">
                        <h2 className="text-2xl font-bold text-emerald-500">
                            Latest Melodies
                        </h2>
                    </div>

                    {/* Melodies Section */}
                    <div className="mb-32">
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                            <Button
                                variant="outline"
                                className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                            >
                                POPULAR
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                            >
                                GENRES
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            <BpmFilter
                                onApply={(values) =>
                                    console.log('BPM filter applied:', values)
                                }
                                onClear={() =>
                                    console.log('BPM filter cleared')
                                }
                            />

                            <Button
                                variant="outline"
                                className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                            >
                                INSTRUMENT
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                                    >
                                        {selectedKey || 'KEY'}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="center">
                                    <KeySelector
                                        value={selectedKey}
                                        onChange={setSelectedKey}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Button
                                variant="outline"
                                className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                            >
                                ARTIST TYPE
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            <Button className="h-10 bg-emerald-500 text-black hover:bg-emerald-600">
                                Apply Filter
                            </Button>

                            <Button
                                variant="outline"
                                className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800"
                            >
                                Clear Filter
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#0F0F0F]">
                            <div className="overflow-x-auto">
                                {/* Desktop Table */}
                                <table className="w-full hidden md:table">
                                    <thead>
                                        <tr className="border-b border-zinc-800 bg-zinc-900/50">
                                            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400"></th>
                                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400"></th>
                                            <th
                                                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                                                onClick={() =>
                                                    handleSort('name')
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    NAME
                                                    <ChevronUp
                                                        className={`h-3 w-3 transition-transform ${
                                                            sortConfig.key ===
                                                            'name'
                                                                ? 'text-emerald-500'
                                                                : 'text-zinc-600'
                                                        } ${
                                                            sortConfig.key ===
                                                                'name' &&
                                                            sortConfig.direction ===
                                                                'desc'
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </th>
                                            <th
                                                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                                                onClick={() =>
                                                    handleSort('producer')
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    PRODUCER
                                                    <ChevronUp
                                                        className={`h-3 w-3 transition-transform ${
                                                            sortConfig.key ===
                                                            'producer'
                                                                ? 'text-emerald-500'
                                                                : 'text-zinc-600'
                                                        } ${
                                                            sortConfig.key ===
                                                                'producer' &&
                                                            sortConfig.direction ===
                                                                'desc'
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                                WAVEFORM
                                            </th>
                                            <th
                                                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                                                onClick={() =>
                                                    handleSort('bpm')
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    BPM
                                                    <ChevronUp
                                                        className={`h-3 w-3 transition-transform ${
                                                            sortConfig.key ===
                                                            'bpm'
                                                                ? 'text-emerald-500'
                                                                : 'text-zinc-600'
                                                        } ${
                                                            sortConfig.key ===
                                                                'bpm' &&
                                                            sortConfig.direction ===
                                                                'desc'
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </th>
                                            <th
                                                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                                                onClick={() =>
                                                    handleSort('key')
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    KEY
                                                    <ChevronUp
                                                        className={`h-3 w-3 transition-transform ${
                                                            sortConfig.key ===
                                                            'key'
                                                                ? 'text-emerald-500'
                                                                : 'text-zinc-600'
                                                        } ${
                                                            sortConfig.key ===
                                                                'key' &&
                                                            sortConfig.direction ===
                                                                'desc'
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </th>
                                            <th
                                                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                                                onClick={() =>
                                                    handleSort('genre')
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    GENRE
                                                    <ChevronUp
                                                        className={`h-3 w-3 transition-transform ${
                                                            sortConfig.key ===
                                                            'genre'
                                                                ? 'text-emerald-500'
                                                                : 'text-zinc-600'
                                                        } ${
                                                            sortConfig.key ===
                                                                'genre' &&
                                                            sortConfig.direction ===
                                                                'desc'
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </th>
                                            <th
                                                className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400 cursor-pointer hover:text-white"
                                                onClick={() =>
                                                    handleSort('artistType')
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    ARTIST TYPE
                                                    <ChevronUp
                                                        className={`h-3 w-3 transition-transform ${
                                                            sortConfig.key ===
                                                            'artistType'
                                                                ? 'text-emerald-500'
                                                                : 'text-zinc-600'
                                                        } ${
                                                            sortConfig.key ===
                                                                'artistType' &&
                                                            sortConfig.direction ===
                                                                'desc'
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-zinc-400">
                                                ACTIONS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getCurrentMelodies().map((melody) => (
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
                                                            handlePlayClick(
                                                                melody
                                                            )
                                                        }
                                                    >
                                                        <Play className="h-4 w-4" />
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
                                                    {melody.producer}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="font-mono text-sm text-emerald-500">
                                                        {melody.waveform}
                                                    </div>
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
                                                            onClick={() =>
                                                                handleDownloadClick(
                                                                    melody
                                                                )
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Mobile Table */}
                                <table className="w-full md:hidden">
                                    <tbody>
                                        {getCurrentMelodies().map((melody) => (
                                            <tr
                                                key={melody.id}
                                                className="border-b border-zinc-800 hover:bg-zinc-900/30"
                                            >
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`h-8 w-8 flex-shrink-0 rounded-full ${
                                                            currentPlayingMelody?.id ===
                                                            melody.id
                                                                ? 'bg-emerald-500 text-black hover:bg-emerald-600'
                                                                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                                        }`}
                                                        onClick={() =>
                                                            handlePlayClick(
                                                                melody
                                                            )
                                                        }
                                                    >
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {melody.name}
                                                        </p>
                                                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                                                            {melody.producer}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-red-500 ${
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
                                                            className="h-8 w-8 flex-shrink-0 text-zinc-400 hover:text-white"
                                                            onClick={() =>
                                                                handleDownloadClick(
                                                                    melody
                                                                )
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Melodies Pagination */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMelodiesPrevious}
                                disabled={currentMelodiesPage === 0}
                                className="h-10 w-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <span className="text-sm text-zinc-400">
                                Page {currentMelodiesPage + 1} of{' '}
                                {Math.ceil(
                                    sortedMelodies.length / melodiesPerPage
                                )}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMelodiesNext}
                                disabled={
                                    currentMelodiesPage >=
                                    Math.ceil(
                                        sortedMelodies.length / melodiesPerPage
                                    ) -
                                        1
                                }
                                className="h-10 w-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>

                <AudioPlayer
                    isVisible={isAudioPlayerVisible}
                    melody={currentPlayingMelody ? {
                        _id: currentPlayingMelody._id || currentPlayingMelody.id.toString(),
                        name: 'title' in currentPlayingMelody ? currentPlayingMelody.title : currentPlayingMelody.name,
                        producer: currentPlayingMelody.producer,
                        image: currentPlayingMelody.image,
                        audioUrl: currentPlayingMelody.audioUrl || '',
                        bpm: currentPlayingMelody.bpm,
                        key: currentPlayingMelody.key,
                        artistType: currentPlayingMelody.artistType || ''
                    } : null}
                    onClose={() => setIsAudioPlayerVisible(false)}
                />
                {selectedMelody && (
                    <CollabModal
                        isOpen={isCollabModalOpen}
                        onClose={() => setIsCollabModalOpen(false)}
                        melodyData={selectedMelody}
                    />
                )}
            </div>
        </Layout>
    );
}
