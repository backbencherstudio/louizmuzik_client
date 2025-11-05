'use client';

import { useState, useEffect } from 'react';
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
    Loader2,
    Loader,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout';
import { useLoggedInUserQuery } from '@/app/store/api/authApis/authApi';
import { useAddDiscographyMutation, useDeleteDiscographyMutation, useGetDiscographyQuery } from '@/app/store/api/discographyApis/discographyApis';
import { useGetUserProfileQuery, useFollowUnFollowProducerMutation } from '@/app/store/api/userManagementApis/userManagementApis';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaTiktok } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

// Función para extraer el ID de la pista de Spotify de una URL
function getSpotifyTrackId(url: string) {
    // Acepta tanto el formato completo como el formato corto
    const regex = /(?:spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export default function DiscographyPage() {
    const [newTrackUrl, setNewTrackUrl] = useState('');
    const [error, setError] = useState('');

    const params = useParams();
    const userId = params.id as string;

    const { data: currentUser, refetch: refetchUser } = useLoggedInUserQuery(null);
    const currentUserId = currentUser?.data?._id;
    const isOwner = currentUserId === userId;

    const {
        data: userProfile,
        isLoading: isUserProfileLoading,
        refetch: refetchUserProfile,
    } = useGetUserProfileQuery(userId as string);

    const [followUnFollowProducer, { isLoading: isFollowingLoading }] =
        useFollowUnFollowProducerMutation();

    const isFollowing = currentUser?.data?.following.includes(userId as string);

    const [addDiscography, { isLoading: isAddingDiscography }] = useAddDiscographyMutation();

    const { data: discography, refetch: refetchDiscography, isLoading: isLoadingDiscography } = useGetDiscographyQuery(userId, {
        skip: !userId
    });
    const discographyData = discography?.data || [];

    const [deleteDiscography, { isLoading: isDeletingDiscography }] = useDeleteDiscographyMutation();

    const userData = userProfile?.data?.userData;

    const handleAddTrack = () => {
        if (!userId) {
            toast.error('User not found');
            return;
        }

        if (!isOwner) {
            toast.error('You can only add tracks to your own discography');
            return;
        }

        const trackId = getSpotifyTrackId(newTrackUrl);
        if (!trackId) {
            setError('Please enter a valid Spotify link');
            return;
        }

        const existingTrack = discographyData.find((track: any) =>
            track.trackId === trackId || track.discographyUrl === newTrackUrl
        );

        if (existingTrack) {
            setError('This track is already in your discography');
            return;
        }

        addDiscography({
            userId,
            discographyUrl: newTrackUrl
        }).unwrap().then((res) => {
            if (res.success) {
                toast.success('Track added successfully');
                setNewTrackUrl('');
                setError('');
                refetchDiscography(); 
            } else {
                toast.error(res.message || 'Failed to add track');
            }
        }).catch((error) => {
            toast.error('Failed to add track');
            console.error('Error adding track:', error);
        });
    };

    const handleRemoveTrack = (trackId: string) => {
        if (!trackId) {
            toast.error('Track ID not found');
            return;
        }

        if (!isOwner) {
            toast.error('You can only remove tracks from your own discography');
            return;
        }

        deleteDiscography(trackId).unwrap().then((res) => {
            if (res.success) {
                toast.success('Track removed successfully');
                refetchDiscography(); 
            } else {
                toast.error(res.message || 'Failed to remove track');
            }
        }).catch((error) => {
            toast.error('Failed to remove track');
            console.error('Error removing track:', error);
        });
    };

    // Follow/Unfollow handler 
    const handleFollowUnFollowProducer = async () => {
        await followUnFollowProducer({ userId: currentUserId, producerId: userId as string });
        refetchUser();
        refetchUserProfile();
    };

    // Loading state
    if (isLoadingDiscography || isUserProfileLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-emerald-500 animate-spin">
                        <AiOutlineLoading3Quarters size={32} />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900/50">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full overflow-hidden">
                    {isUserProfileLoading && (
                        <Skeleton
                            height={400}
                            width="100%"
                            highlightColor="#27272a"
                            className="mb-4"
                        />
                    )}
                    {!isUserProfileLoading && (
                        <>
                            {/* Banner Image */}
                            <Image
                                src={userData?.profile_image || "/images/profiles/banner-profile.jpg"}
                                alt="Profile Banner"
                                fill
                                className="object-cover"
                                priority
                            />
                        </>
                    )}
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
                                            src={
                                                userData?.profile_image ||
                                                "/images/profiles/banner-profile.jpg"
                                            }
                                            alt={userData?.producer_name || "Producer"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Follow Button - Only show if user is not the owner */}
                                    {currentUserId !== userId && (
                                        <Button
                                            className={`bg-emerald-500 text-black hover:bg-emerald-600 w-full px-8 h-10 md:h-11 min-w-[180px] md:min-w-[200px] ${
                                                isFollowing
                                                    ? "bg-emerald-500 hover:bg-emerald-600 font-bold"
                                                    : "bg-emerald-500 hover:bg-emerald-600"
                                            }`}
                                            onClick={() => handleFollowUnFollowProducer()}
                                        >
                                            {isFollowingLoading && (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            )}
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </Button>
                                    )}
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4 mb-3 md:mb-4">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <h1 className="text-2xl md:text-5xl font-bold text-white capitalize">
                                                {userData?.producer_name || "John Doe"}
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
                                            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/20 text-emerald-500 rounded-full text-xs md:text-sm font-medium md:-mt-11">
                                                Verified Producer
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-sm md:text-base text-zinc-300">
                                        <div className="hidden md:flex items-center gap-2">
                                            <Music2 className="w-4 h-4 text-emerald-500" />
                                            <span>{userData?.melodiesCounter || "0"} Melodies</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-emerald-500" />
                                            <span>
                                                {userData?.followersCounter || "0"} Followers
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            <span>{userData?.country || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Social Media Links */}
                                    <div className="hidden md:flex justify-center md:justify-start gap-2 mt-6">
                                        {userData?.instagramUsername && (
                                            <Link
                                                href={`https://instagram.com/${userData?.instagramUsername}`}
                                                target="_blank"
                                                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                            >
                                                <Instagram className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {userData?.youtubeUsername && (
                                            <Link
                                                href={`https://youtube.com/@${userData?.youtubeUsername}`}
                                                target="_blank"
                                                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                            >
                                                <Youtube className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {userData?.tiktokUsername && (
                                            <Link
                                                href={`https://tiktok.com/@${userData?.tiktokUsername}`}
                                                target="_blank"
                                                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                            >
                                                <FaTiktok className="w-5 h-5" />
                                            </Link>
                                        )}
                                        {userData?.beatstarsUsername && (
                                            <Link
                                                href={`https://beatstars.com/${userData?.beatstarsUsername}`}
                                                target="_blank"
                                                className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        )}
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
                                href={`/producers/${userId}`}
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
                                {userData?.about || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Discography Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            <span className="capitalize">{userData?.producer_name}</span> Discography
                        </h2>

                        {/* Add Track Input - Only show if user is the owner */}
                        {isOwner && (
                            <div className="mb-8">
                                <div className="flex gap-4 max-w-2xl">
                                    <Input
                                        type="text"
                                        placeholder="Paste your Spotify track link here"
                                        value={newTrackUrl}
                                        onChange={(e) => {
                                            setNewTrackUrl(e.target.value);
                                            setError(''); // Clear error when user types
                                        }}
                                        className="flex-1 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                                        disabled={isAddingDiscography}
                                    />
                                    <Button
                                        onClick={handleAddTrack}
                                        disabled={isAddingDiscography || !newTrackUrl.trim()}
                                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                                    >
                                        {isAddingDiscography ? 'Adding...' : 'Add'}
                                    </Button>
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tracks Grid */}
                        {discographyData.length === 0 ? (
                            <div className="text-center py-12">
                                <Music2 className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                                    No tracks in discography yet
                                </h3>
                                <p className="text-zinc-500">
                                    {isOwner ? 'Add your first track by pasting a Spotify link above' : 'This user hasn\'t added any tracks yet'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {discographyData.map((track: any, index: number) => {
                                    const trackId = track.trackId || getSpotifyTrackId(track.discographyUrl);
                                    return (
                                        <div key={track._id || index} className="relative group">
                                            {/* Delete button - Only show if user is the owner */}
                                            {isOwner && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 z-10 bg-red-500/10 text-red-500 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleRemoveTrack(track._id)}
                                                    disabled={isDeletingDiscography}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {trackId ? (
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
                                            ) : (
                                                <div className="bg-zinc-800 rounded-lg p-4 h-[152px] flex items-center justify-center">
                                                    <p className="text-zinc-400 text-sm">Invalid track URL</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
