'use client';

import { useState } from 'react';
import { WaveformDisplay } from './waveform-display';
import { PauseIcon, PlayIcon } from 'lucide-react';

interface TrackCardProps {
    title: string;
    audioUrl: string;
    imageUrl: string;
}

export function TrackCard({ title, audioUrl, imageUrl }: TrackCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-zinc-900/30 rounded-lg p-4 hover:bg-zinc-900/50 transition duration-300">
            <div className="flex items-center gap-4">
                <div className="relative group flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-16 h-16 rounded object-cover"
                    />
                    <button
                        onClick={handlePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition duration-300 rounded"
                    >
                        {isPlaying ? (
                            <PauseIcon className="w-8 h-8 text-emerald-500" />
                        ) : (
                            <PlayIcon className="w-8 h-8 text-emerald-500" />
                        )}
                    </button>
                </div>
                <div className="flex-grow">
                    <h3 className="text-white font-medium mb-2">{title}</h3>
                    <WaveformDisplay
                        audioUrl={audioUrl}
                        isPlaying={isPlaying}
                        onPlayPause={handlePlayPause}
                        height={40}
                    />
                </div>
            </div>
        </div>
    );
}
