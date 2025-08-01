'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Heart,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { WaveformDisplay } from './waveform-display';

interface AudioPlayerProps {
    isVisible: boolean;
    melody: {
        _id: string;
        name: string;
        producer: string;
        image: string;
        audioUrl: string;
        bpm: number;
        key: string;
        artistType: string;
    } | null;
    onClose: () => void;
    isFavorite?: boolean;
    onFavoriteClick?: (melodyId: string) => void;
    shouldAutoPlay?: boolean; 
    playNextMelody?: () => void;
    playPreviousMelody?: () => void;
    onEnded?: () => void;
    handleDownloadClick?: (melody: any) => void;
}

export function AudioPlayer({
    isVisible,
    melody,
    onClose,
    isFavorite = false,
    onFavoriteClick,
    shouldAutoPlay = false,
    playNextMelody,
    playPreviousMelody,
    onEnded,
    handleDownloadClick,
}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Reset player state when melody changes
        if (melody) {
            setCurrentTime(0);
            setIsPlaying(false);
            setIsLoading(true);
            
            // Set the audio source
            if (audioRef.current) {
                audioRef.current.src = melody.audioUrl || '';
                audioRef.current.load();
            }
        }
    }, [melody]);

    useEffect(() => {
        // When melody or shouldAutoPlay changes, set isPlaying accordingly
        if (shouldAutoPlay && melody) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [melody, shouldAutoPlay]);

    useEffect(() => {
        // Handle play/pause
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        // Handle volume changes
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume / 100;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (!melody?.audioUrl) {
            console.error('No audio URL provided');
            return;
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            const newTime = value[0];
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleAudioLoaded = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoading(false);
        }
    };

    const handleAudioError = (error: any) => {
        console.error('Audio loading error:', error);
        setIsLoading(false);
        setIsPlaying(false);
    };

    if (!isVisible || !melody) return null;

    return (
        <div className="fixed bottom-0 right-0 bg-black z-50 lg:left-64 left-0">
            <div className="w-full px-4 py-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        {/* Track Info */}
                        <div className="flex items-center gap-3 w-[200px] flex-shrink-0">
                            <div className="relative h-12 w-12 flex-shrink-0">
                                <Image
                                    src={
                                        melody.image ||
                                        '/placeholder.svg?height=48&width=48'
                                    }
                                    alt={melody.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-white font-medium truncate">
                                    {melody.name}
                                </h4>
                                <p className="text-emerald-500 text-sm truncate">
                                    {melody.producer}
                                </p>
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-zinc-800 h-9 w-9"
                                onClick={playPreviousMelody}
                                disabled={!playPreviousMelody}
                            >
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-zinc-800 h-10 w-10"
                                onClick={togglePlay}
                                disabled={!melody.audioUrl || isLoading}
                            >
                                {isLoading ? (
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                ) : (
                                    <Play className="h-6 w-6" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-zinc-800 h-9 w-9"
                                onClick={playNextMelody}
                                disabled={!playNextMelody}
                            >
                                <SkipForward className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 flex items-center gap-2 overflow-hidden">
                            <span className="text-xs text-zinc-400 min-w-[40px] flex-shrink-0">
                                {formatTime(currentTime)}
                            </span>
                            <div className="flex-1 relative px-2">
                                <Slider
                                    value={[currentTime]}
                                    min={0}
                                    max={duration || 100}
                                    step={0.1}
                                    onValueChange={handleSeek}
                                    className="cursor-pointer"
                                    disabled={!melody.audioUrl}
                                />
                            </div>
                            <span className="text-xs text-zinc-400 min-w-[40px] flex-shrink-0">
                                {formatTime(duration)}
                            </span>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center gap-2 w-[140px] flex-shrink-0 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-zinc-800 h-9 w-9"
                                onClick={toggleMute}
                            >
                                {isMuted ? (
                                    <VolumeX className="h-5 w-5" />
                                ) : (
                                    <Volume2 className="h-5 w-5" />
                                )}
                            </Button>
                            <div className="w-20">
                                <Slider
                                    value={[isMuted ? 0 : volume]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={handleVolumeChange}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`text-zinc-400 hover:bg-zinc-800 h-9 w-9 ${
                                    isFavorite ? 'text-red-500' : ''
                                }`}
                                onClick={() =>
                                    melody && onFavoriteClick?.(melody._id)
                                }
                            >
                                <Heart
                                    className={`h-5 w-5 ${
                                        isFavorite ? 'fill-current' : ''
                                    }`}
                                />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-zinc-800 h-9 w-9"
                                onClick={() => handleDownloadClick?.(melody)}
                            >
                                <Download className="h-5 w-5" />
                            </Button>
                        </div>

                    </div>
                </div>

                {/* Audio element */}
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={onEnded}
                    onLoadedMetadata={handleAudioLoaded}
                    onError={handleAudioError}
                    onCanPlay={() => setIsLoading(false)}
                >
                    <source src={melody.audioUrl} type="audio/mpeg" />
                    <source src={melody.audioUrl} type="audio/wav" />
                    <source src={melody.audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
}

export default AudioPlayer;

