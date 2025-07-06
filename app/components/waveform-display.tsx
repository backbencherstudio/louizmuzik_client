'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
    audioUrl: string;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    height?: number;
    width?: string;
}

export function WaveformDisplay({
    audioUrl,
    isPlaying = false,
    onPlayPause,
    height = 40,
    width = '100%',
}: WaveformDisplayProps) {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (waveformRef.current && !wavesurferRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#374151', // Zinc-700
                progressColor: '#10b981', // Emerald-500
                cursorColor: '#10b981', // Emerald-500
                barWidth: 2,
                barGap: 1,
                barRadius: 2,
                height: height,
                normalize: true,
                responsive: true,
                interact: false, // Disable user interaction if needed
            });

            wavesurfer.load(audioUrl);
            wavesurferRef.current = wavesurfer;

            return () => {
                wavesurfer.destroy();
            };
        }
    }, [audioUrl, height]);

    useEffect(() => {
        const wavesurfer = wavesurferRef.current;
        if (wavesurfer) {
            if (isPlaying) {
                wavesurfer.play();
            } else {
                wavesurfer.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div
            ref={waveformRef}
            style={{ width }}
            className="rounded bg-zinc-900/50"
            onClick={onPlayPause}
        />
    );
}
